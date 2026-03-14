import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const { success } = rateLimit(`auth-sync:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    const body = await req.json();
    const { uid, email, displayName, photoURL } = body;

    if (!uid || !email) {
      return NextResponse.json({ error: "Missing uid or email" }, { status: 400 });
    }

    // Verify Firebase token — reject spoofed requests
    if (token) {
      const decoded = await verifyFirebaseToken(token);
      if (!decoded || decoded.uid !== uid) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
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
