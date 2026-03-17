import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const payments = await prisma.payment.findMany({
      where: { subscription: { userId: user.id } },
      include: {
        subscription: {
          select: { status: true, razorpaySubscriptionId: true },
        },
      },
      orderBy: { paidAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Payment history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment history" },
      { status: 500 }
    );
  }
}
