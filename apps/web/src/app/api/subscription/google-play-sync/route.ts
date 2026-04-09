import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Syncs Google Play subscription state to our DB.
 * Called from the client after RevenueCat purchase or entitlement check.
 * This ensures our Prisma DB knows about Google Play subscriptions
 * (which otherwise only exist in RevenueCat/Google Play).
 */
export async function POST(req: NextRequest) {
  try {
    const { uid, active, productId, expirationDate } = await req.json();

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

    // Find existing Google Play subscription (no razorpaySubscriptionId)
    const existing = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        razorpaySubscriptionId: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (active) {
      // User has active Google Play entitlement — create or update DB record
      const expDate = expirationDate ? new Date(expirationDate) : null;

      if (existing) {
        await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            status: "ACTIVE",
            currentPeriodEnd: expDate,
            cancelledAt: null,
          },
        });
      } else {
        await prisma.subscription.create({
          data: {
            userId: user.id,
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: expDate,
            amountPaise: 19900,
          },
        });
      }

      return NextResponse.json({ synced: true, status: "ACTIVE" });
    } else {
      // User's Google Play entitlement is inactive
      if (existing && ["TRIAL", "ACTIVE"].includes(existing.status)) {
        await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            status: "CANCELLED",
            cancelledAt: new Date(),
          },
        });
      }

      return NextResponse.json({ synced: true, status: "CANCELLED" });
    }
  } catch (error) {
    console.error("Google Play sync error:", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
