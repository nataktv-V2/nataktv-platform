import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/favourites?uid=xxx — get user's favourites with video details
export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ error: "uid required" }, { status: 400 });
  }

  try {
    // Find the user by Firebase UID
    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });
    if (!user) {
      return NextResponse.json({ favourites: [] });
    }

    const favourites = await prisma.favourite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        video: {
          include: {
            language: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ favourites });
  } catch (error) {
    console.error("Failed to fetch favourites:", error);
    return NextResponse.json({ error: "Failed to fetch favourites" }, { status: 500 });
  }
}

// POST /api/favourites — toggle favourite (add if not exists, remove if exists)
export async function POST(req: NextRequest) {
  try {
    const { uid, videoId } = await req.json();
    if (!uid || !videoId) {
      return NextResponse.json({ error: "uid and videoId required" }, { status: 400 });
    }

    // Find the user by Firebase UID
    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already favourited
    const existing = await prisma.favourite.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId,
        },
      },
    });

    if (existing) {
      // Remove favourite
      await prisma.favourite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favourited: false });
    } else {
      // Add favourite
      await prisma.favourite.create({
        data: {
          userId: user.id,
          videoId,
        },
      });
      return NextResponse.json({ favourited: true });
    }
  } catch (error) {
    console.error("Failed to toggle favourite:", error);
    return NextResponse.json({ error: "Failed to toggle favourite" }, { status: 500 });
  }
}
