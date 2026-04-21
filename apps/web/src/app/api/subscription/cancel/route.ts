import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cancelSubscription } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();
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

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ["TRIAL", "ACTIVE"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 404 }
      );
    }

    // Cancel on Razorpay — use IMMEDIATE cancel (cancel_at_cycle_end=false).
    // Important: cancel_at_cycle_end=true silently fails on some subscription
    // states (Razorpay returns success but doesn't actually schedule the
    // cancel), which would cause ghost charges + chargebacks. Immediate
    // cancel works reliably.
    if (subscription.razorpaySubscriptionId) {
      try {
        await cancelSubscription(subscription.razorpaySubscriptionId);
      } catch (rzpError: unknown) {
        // Razorpay rejects cancel if no billing cycle has started (edge case).
        // In that case we still cancel locally so the user sees the right state.
        const msg = rzpError instanceof Error ? rzpError.message : String(rzpError);
        if (!msg.includes("no billing cycle")) {
          throw rzpError; // Re-throw if it's a different error
        }
        console.log("Razorpay cancel skipped (no billing cycle yet), cancelling locally");
      }
    }

    // Update local DB
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription cancel error:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
