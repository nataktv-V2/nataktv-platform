import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchSubscription } from "@/lib/razorpay";

/**
 * Recovery endpoint for stuck PENDING subscriptions.
 *
 * When beatai's callback to /payment-done fails or sends incomplete params,
 * our DB subscription stays in PENDING even though Razorpay has actually
 * authenticated the payment. This endpoint reconciles the two by asking
 * Razorpay directly for the subscription status.
 *
 * STEALTH: Only OUR server talks to Razorpay API. No webhook, no Razorpay
 * posting to our URL. Razorpay doesn't learn app.nataktv.com exists.
 *
 * Called by:
 *   - /payment-done page when callback params are missing
 *   - Profile page "refresh subscription" button
 *   - App on resume (background check)
 */
export async function POST(req: NextRequest) {
  try {
    const { uid, subscriptionId } = await req.json();
    if (!uid) {
      return NextResponse.json({ error: "uid required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the subscription to check. Prefer the one passed in
    // (from sessionStorage); fall back to the most recent PENDING.
    const pendingSub = subscriptionId
      ? await prisma.subscription.findFirst({
          where: {
            userId: user.id,
            razorpaySubscriptionId: subscriptionId,
            status: "PENDING",
          },
        })
      : await prisma.subscription.findFirst({
          where: { userId: user.id, status: "PENDING" },
          orderBy: { createdAt: "desc" },
        });

    if (!pendingSub || !pendingSub.razorpaySubscriptionId) {
      // Already resolved — check current active status
      const active = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          status: { in: ["TRIAL", "ACTIVE"] },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({
        refreshed: false,
        activated: !!active,
        status: active?.status ?? null,
      });
    }

    const rzpSubId: string = pendingSub.razorpaySubscriptionId;

    // Ask Razorpay what the actual state is
    let razorpayData;
    try {
      razorpayData = await fetchSubscription(rzpSubId);
    } catch (err) {
      console.error("Razorpay fetch failed:", err);
      return NextResponse.json(
        { error: "Could not reach payment provider" },
        { status: 502 }
      );
    }

    // Razorpay statuses:
    //   created          — not paid yet
    //   authenticated    — payment done, subscription mandate active (first charge made)
    //   active           — subscription running (ongoing charges)
    //   pending          — payment attempted but not confirmed
    //   halted           — payment failures, subscription paused
    //   cancelled        — cancelled
    //   completed        — reached total_count
    //   expired          — expired before activation
    const activated = ["authenticated", "active"].includes(razorpayData.status);

    if (!activated) {
      return NextResponse.json({
        refreshed: true,
        activated: false,
        razorpayStatus: razorpayData.status,
      });
    }

    // Update our DB to reflect Razorpay's truth
    const hasTrial = !!pendingSub.trialEnd;
    const updated = await prisma.subscription.update({
      where: { id: pendingSub.id },
      data: {
        status: hasTrial ? "TRIAL" : "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: hasTrial
          ? pendingSub.trialEnd
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Record a payment if we haven't already
    const existingPayment = await prisma.payment.findFirst({
      where: { subscriptionId: updated.id },
    });
    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          subscriptionId: updated.id,
          // We don't have the payment_id from Razorpay directly here,
          // but we can record the subscription activation
          razorpayPaymentId: `recovered_${razorpayData.id}_${Date.now()}`,
          razorpaySignature: "recovered_via_poll",
          amountPaise: hasTrial ? 200 : 19900,
          status: "captured",
          paidAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      refreshed: true,
      activated: true,
      status: updated.status,
      razorpayStatus: razorpayData.status,
    });
  } catch (error) {
    console.error("Subscription refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh subscription" },
      { status: 500 }
    );
  }
}
