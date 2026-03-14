import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const trending = searchParams.get("trending");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};
    if (language) where.language = { code: language };
    if (category) where.category = { slug: category };
    if (featured === "true") where.isFeatured = true;
    if (trending === "true") where.isTrending = true;

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: { language: true, category: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
      prisma.video.count({ where }),
    ]);

    return NextResponse.json({ videos, total, limit, offset });
  } catch (error) {
    console.error("Videos API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
