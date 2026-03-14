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

    // Update subscription in DB
    const subscription = await prisma.subscription.update({
      where: { razorpaySubscriptionId: razorpay_subscription_id },
      data: {
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // ~30 days
      },
    });

    // Record payment
    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amountPaise: 200, // ₹2 trial payment
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
