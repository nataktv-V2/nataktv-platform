import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token, uid } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing FCM token" }, { status: 400 });
    }

    // Ensure push_tokens table exists (idempotent)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS push_tokens (
        token TEXT PRIMARY KEY,
        user_id TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Upsert token — works for both anonymous and logged-in users
    if (uid) {
      // Link token to user in users table
      const user = await prisma.user.findUnique({
        where: { firebaseUid: uid },
      });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { fcmToken: token },
        });
      }
      // Also store in push_tokens with user reference
      await prisma.$executeRawUnsafe(
        `INSERT INTO push_tokens (token, user_id, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (token) DO UPDATE SET user_id = $2, updated_at = NOW()`,
        token, uid
      );
    } else {
      // Anonymous token — store without user
      await prisma.$executeRawUnsafe(
        `INSERT INTO push_tokens (token, updated_at) VALUES ($1, NOW())
         ON CONFLICT (token) DO UPDATE SET updated_at = NOW()`,
        token
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FCM register error:", error);
    return NextResponse.json({ error: "Failed to register token" }, { status: 500 });
  }
}
