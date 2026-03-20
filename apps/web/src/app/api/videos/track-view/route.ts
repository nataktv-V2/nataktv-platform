import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/videos/track-view — increment view count (deduplicated per user-video-day)
export async function POST(req: NextRequest) {
  try {
    const { videoId, uid } = await req.json();
    if (!videoId) {
      return NextResponse.json({ error: "videoId required" }, { status: 400 });
    }

    // If user is logged in, deduplicate by user-video-day
    if (uid) {
      const user = await prisma.user.findUnique({
        where: { firebaseUid: uid },
        select: { id: true },
      });

      if (user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if this user already viewed this video today using watch history
        const existing = await prisma.watchHistory.findUnique({
          where: { userId_videoId: { userId: user.id, videoId } },
          select: { watchedAt: true },
        });

        // If they watched today already, don't count again
        if (existing && existing.watchedAt >= today) {
          return NextResponse.json({ counted: false });
        }
      }
    }

    // Increment view count
    await prisma.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ counted: true });
  } catch (error) {
    console.error("Track view error:", error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
