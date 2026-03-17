import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token, uid } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing FCM token" }, { status: 400 });
    }

    // If uid is provided, associate token with user
    if (uid) {
      const user = await prisma.user.findUnique({
        where: { firebaseUid: uid },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { fcmToken: token },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FCM register error:", error);
    return NextResponse.json({ error: "Failed to register token" }, { status: 500 });
  }
}
