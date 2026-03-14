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

    // Cancel on Razorpay (at end of current billing cycle)
    if (subscription.razorpaySubscriptionId) {
      await cancelSubscription(subscription.razorpaySubscriptionId, true);
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
