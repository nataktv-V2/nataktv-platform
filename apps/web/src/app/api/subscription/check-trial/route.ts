import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ hadTrial: false });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ hadTrial: false });
    }

    // Check if user has EVER had any subscription (any status except PENDING)
    const pastSub = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { not: "PENDING" },
      },
    });

    return NextResponse.json({ hadTrial: !!pastSub });
  } catch {
    return NextResponse.json({ hadTrial: false });
  }
}
