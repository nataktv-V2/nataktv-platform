import { prisma } from "@/lib/prisma";
import { invalidateCache } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const video = await prisma.video.update({
      where: { id },
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

    await invalidateCache("videos:*");
    return NextResponse.json(video);
  } catch (error) {
    console.error("Update video error:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Delete watch history first (foreign key)
    await prisma.watchHistory.deleteMany({ where: { videoId: id } });
    await prisma.video.delete({ where: { id } });
    await invalidateCache("videos:*");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
