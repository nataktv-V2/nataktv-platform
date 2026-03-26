import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = await req.json();

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // Verify HMAC signature
    const isValid = verifyPaymentSignature(
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Find subscription to check if it has a trial
    const existingSub = await prisma.subscription.findUnique({
      where: { razorpaySubscriptionId: razorpay_subscription_id },
    });

    const hasTrial = !!existingSub?.trialEnd;

    // Update subscription in DB — TRIAL if has trial period, ACTIVE if direct payment
    const subscription = await prisma.subscription.update({
      where: { razorpaySubscriptionId: razorpay_subscription_id },
      data: {
        status: hasTrial ? "TRIAL" : "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: hasTrial
          ? existingSub.trialEnd // trial end = period end for trial subs
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // ~30 days for direct
      },
    });

    // Record payment
    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amountPaise: hasTrial ? 200 : 19900, // ₹2 trial or ₹199 direct
        status: "captured",
        paidAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, status: subscription.status });
  } catch (error) {
    console.error("Subscription verify error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
