import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ isAdmin: false });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      select: { role: true },
    });

    return NextResponse.json({ isAdmin: user?.role === "ADMIN" });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
