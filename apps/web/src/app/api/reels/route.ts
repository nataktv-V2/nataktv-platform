import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 20);
    const cursor = searchParams.get("cursor") || undefined; // last reel id

    const cacheKey = `reels:${limit}:${cursor || "start"}`;

    const result = await cached(cacheKey, 300, async () => {
      // Get clips with their parent video info
      const clips = await prisma.clip.findMany({
        include: {
          video: {
            include: { language: true, category: true },
          },
        },
        orderBy: { sortOrder: "asc" },
        // Fetch extra to know if there are more
        take: limit * 2,
      });

      // Get videos that have no clips (standalone reels)
      const videosWithClips = await prisma.clip.findMany({
        select: { videoId: true },
        distinct: ["videoId"],
      });
      const videoIdsWithClips = videosWithClips.map((c) => c.videoId);

      const standaloneVideos = await prisma.video.findMany({
        where: {
          id: { notIn: videoIdsWithClips.length > 0 ? videoIdsWithClips : undefined },
        },
        include: { language: true, category: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: limit * 2,
      });

      // Unified feed items
      type ReelItem = {
        id: string;
        youtubeId: string;
        title: string;
        startTime: number;
        endTime: number | null;
        language: { name: string };
        category: { name: string };
        thumbnailUrl: string;
        isClip: boolean;
        videoId: string;
      };

      const allReels: ReelItem[] = [];

      // Add clips
      for (const clip of clips) {
        allReels.push({
          id: clip.id,
          youtubeId: clip.video.youtubeId,
          title: clip.title || clip.video.title,
          startTime: clip.startTime,
          endTime: clip.endTime,
          language: clip.video.language,
          category: clip.video.category,
          thumbnailUrl: clip.video.generatedThumbnailUrl || clip.video.thumbnailUrl,
          isClip: true,
          videoId: clip.videoId,
        });
      }

      // Add standalone videos
      for (const video of standaloneVideos) {
        allReels.push({
          id: video.id,
          youtubeId: video.youtubeId,
          title: video.title,
          startTime: video.reelStart,
          endTime: video.creditStart,
          language: video.language,
          category: video.category,
          thumbnailUrl: video.generatedThumbnailUrl || video.thumbnailUrl,
          isClip: false,
          videoId: video.id,
        });
      }

      // Apply cursor-based pagination: skip past the cursor item
      let startIdx = 0;
      if (cursor) {
        const cursorIdx = allReels.findIndex((r) => r.id === cursor);
        if (cursorIdx !== -1) {
          startIdx = cursorIdx + 1;
        }
      }

      const page = allReels.slice(startIdx, startIdx + limit);
      const hasMore = startIdx + limit < allReels.length;
      const nextCursor = page.length > 0 ? page[page.length - 1]!.id : undefined;

      return { reels: page, hasMore, nextCursor };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Reels API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
