import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/redis";
import { NextResponse } from "next/server";

// GET /api/videos/trending — algorithmically ranked trending videos
export async function GET() {
  try {
    const trending = await cached("trending:home", 3600, async () => {
      // Get all videos with their view counts, ordered by views
      const videos = await prisma.video.findMany({
        include: { language: true, category: true },
        orderBy: { views: "desc" },
        take: 50,
      });

      // Score: views * recency multiplier
      const now = Date.now();
      const scored = videos.map((video) => {
        const ageMs = now - new Date(video.createdAt).getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);

        // Recency boost: <3 days = 3x, <7 days = 2x, <30 days = 1.5x, else 1x
        let recencyMultiplier = 1;
        if (ageDays < 3) recencyMultiplier = 3;
        else if (ageDays < 7) recencyMultiplier = 2;
        else if (ageDays < 30) recencyMultiplier = 1.5;

        const score = (video.views + 1) * recencyMultiplier;
        return { ...video, score };
      });

      // Sort by score descending, take top 10
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, 10);
    });

    return NextResponse.json(trending);
  } catch (error) {
    console.error("Trending error:", error);
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
  }
}
