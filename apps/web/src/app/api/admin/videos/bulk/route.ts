import { prisma } from "@/lib/prisma";
import { invalidateCache } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

type BulkVideoInput = {
  youtubeId: string;
  title: string;
  languageId: string;
  categoryId: string;
  isFeatured: boolean;
  isTrending: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videos } = body as { videos: BulkVideoInput[] };

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { error: "Videos array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Validate all entries have required fields
    for (let i = 0; i < videos.length; i++) {
      const v = videos[i]!;
      if (!v.youtubeId || !v.title || !v.languageId || !v.categoryId) {
        return NextResponse.json(
          { error: `Video at index ${i} is missing required fields (youtubeId, title, languageId, categoryId)` },
          { status: 400 }
        );
      }
    }

    // Check for duplicate youtubeIds in the request
    const ids = videos.map((v) => v.youtubeId);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      return NextResponse.json(
        { error: "Duplicate YouTube IDs found in the request" },
        { status: 400 }
      );
    }

    // Check for existing videos with these youtubeIds
    const existing = await prisma.video.findMany({
      where: { youtubeId: { in: ids } },
      select: { youtubeId: true },
    });
    if (existing.length > 0) {
      const dupes = existing.map((e) => e.youtubeId).join(", ");
      return NextResponse.json(
        { error: `These YouTube IDs already exist: ${dupes}` },
        { status: 409 }
      );
    }

    const data = videos.map((v) => ({
      youtubeId: v.youtubeId,
      title: v.title,
      description: "",
      thumbnailUrl: `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`,
      duration: 0,
      languageId: v.languageId,
      categoryId: v.categoryId,
      isFeatured: v.isFeatured || false,
      isTrending: v.isTrending || false,
      reelStart: 0,
      creditStart: null,
    }));

    const result = await prisma.video.createMany({ data });

    await invalidateCache("videos:*");

    return NextResponse.json(
      { count: result.count, message: `${result.count} videos created successfully` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk create videos error:", error);
    return NextResponse.json(
      { error: "Failed to create videos in bulk" },
      { status: 500 }
    );
  }
}
