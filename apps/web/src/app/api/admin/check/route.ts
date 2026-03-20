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
      select: { role: true, email: true },
    });

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    const isAdmin = user?.role === "ADMIN" || adminEmails.includes(user?.email?.toLowerCase() || "");

    return NextResponse.json({ isAdmin });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
