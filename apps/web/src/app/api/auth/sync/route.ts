import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, email, displayName, photoURL } = body;

    if (!uid || !email) {
      return NextResponse.json({ error: "Missing uid or email" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: {
        email,
        displayName: displayName || "",
        photoUrl: photoURL || null,
      },
      create: {
        firebaseUid: uid,
        email,
        displayName: displayName || "",
        photoUrl: photoURL || null,
      },
    });

    return NextResponse.json({ user: { id: user.id, uniqueId: user.uniqueId } });
  } catch (error) {
    console.error("Auth sync error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
