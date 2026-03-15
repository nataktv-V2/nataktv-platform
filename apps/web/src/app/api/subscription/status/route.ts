import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "uid required" }, { status: 400 });
    }

    const user = await cached(`user:${uid}`, 300, () =>
      prisma.user.findUnique({
        where: { firebaseUid: uid },
        select: { id: true },
      })
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ["TRIAL", "ACTIVE"] },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        trialStart: true,
        trialEnd: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        amountPaise: true,
        cancelledAt: true,
      },
    });

    if (!subscription) {
      return NextResponse.json({ subscribed: false, status: null });
    }

    // Check if trial has expired
    if (
      subscription.status === "TRIAL" &&
      subscription.trialEnd &&
      new Date() > subscription.trialEnd
    ) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ subscribed: false, status: "EXPIRED" });
    }

    return NextResponse.json({
      subscribed: true,
      status: subscription.status,
      trialEnd: subscription.trialEnd,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
