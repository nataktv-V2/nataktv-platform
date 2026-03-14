import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      youtubeId,
      title,
      description,
      thumbnailUrl,
      duration,
      languageId,
      categoryId,
      isFeatured,
      isTrending,
    } = body;

    const video = await prisma.video.create({
      data: {
        youtubeId,
        title,
        description: description || "",
        thumbnailUrl:
          thumbnailUrl ||
          `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
        duration: duration || 0,
        languageId,
        categoryId,
        isFeatured: isFeatured || false,
        isTrending: isTrending || false,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Create video error:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
