import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/watch-history?uid=firebaseUid
export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ error: "uid required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const history = await prisma.watchHistory.findMany({
      where: { userId: user.id },
      orderBy: { watchedAt: "desc" },
      take: 20,
      include: {
        video: {
          include: { language: true, category: true },
        },
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Watch history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch watch history" },
      { status: 500 }
    );
  }
}

// POST /api/watch-history — upsert progress
export async function POST(req: NextRequest) {
  try {
    const { uid, videoId, progress, duration } = await req.json();
    if (!uid || !videoId) {
      return NextResponse.json(
        { error: "uid and videoId required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const entry = await prisma.watchHistory.upsert({
      where: {
        userId_videoId: { userId: user.id, videoId },
      },
      update: {
        progress: progress || 0,
        duration: duration || 0,
        watchedAt: new Date(),
      },
      create: {
        userId: user.id,
        videoId,
        progress: progress || 0,
        duration: duration || 0,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Watch history upsert error:", error);
    return NextResponse.json(
      { error: "Failed to update watch history" },
      { status: 500 }
    );
  }
}
