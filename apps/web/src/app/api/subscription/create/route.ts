import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSubscription } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();
    if (!uid) {
      return NextResponse.json({ error: "uid required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      include: {
        subscriptions: {
          where: { status: { in: ["TRIAL", "ACTIVE"] } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has an active subscription
    if (user.subscriptions.length > 0) {
      return NextResponse.json(
        { error: "Already subscribed", subscription: user.subscriptions[0] },
        { status: 409 }
      );
    }

    const planId = process.env.RAZORPAY_PLAN_ID;
    if (!planId || planId === "placeholder") {
      return NextResponse.json(
        { error: "Razorpay not configured yet" },
        { status: 503 }
      );
    }

    // Create Razorpay subscription
    const rzpSubscription = await createSubscription(
      planId,
      user.email,
      user.displayName
    );

    // Store in database
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        razorpaySubscriptionId: rzpSubscription.id,
        razorpayPlanId: planId,
        status: "TRIAL",
        trialStart: new Date(),
        trialEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        amountPaise: 19900,
      },
    });

    return NextResponse.json({
      subscriptionId: rzpSubscription.id,
      dbSubscriptionId: subscription.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Subscription create error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
