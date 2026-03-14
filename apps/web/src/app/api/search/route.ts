import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const { success } = rateLimit(`search:${ip}`, { limit: 30, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const q = req.nextUrl.searchParams.get("q")?.trim();
    const language = req.nextUrl.searchParams.get("language");
    const category = req.nextUrl.searchParams.get("category");
    const limit = Math.min(
      parseInt(req.nextUrl.searchParams.get("limit") || "20"),
      50
    );

    if (!q) {
      return NextResponse.json({ videos: [], total: 0 });
    }

    // Build WHERE conditions
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    // Full-text search on title+description, plus ILIKE fallback on title
    conditions.push(
      `(to_tsvector('english', v.title || ' ' || v.description) @@ plainto_tsquery('english', $${paramIndex})
       OR v.title ILIKE $${paramIndex + 1})`
    );
    params.push(q, `%${q}%`);
    paramIndex += 2;

    if (language) {
      conditions.push(`l.code = $${paramIndex}`);
      params.push(language);
      paramIndex++;
    }

    if (category) {
      conditions.push(`c.slug = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const videos = await prisma.$queryRawUnsafe(
      `SELECT v.id, v.title, v.thumbnail_url as "thumbnailUrl", v.duration, v.youtube_id as "youtubeId", v.views,
              json_build_object('name', l.name, 'code', l.code) as language,
              json_build_object('name', c.name, 'slug', c.slug) as category
       FROM videos v
       JOIN languages l ON v.language_id = l.id
       JOIN categories c ON v.category_id = c.id
       ${whereClause}
       ORDER BY ts_rank(to_tsvector('english', v.title || ' ' || v.description), plainto_tsquery('english', $1)) DESC,
                v.views DESC
       LIMIT $${paramIndex}`,
      ...params,
      limit
    );

    const countResult = (await prisma.$queryRawUnsafe(
      `SELECT COUNT(*)::int as total
       FROM videos v
       JOIN languages l ON v.language_id = l.id
       JOIN categories c ON v.category_id = c.id
       ${whereClause}`,
      ...params
    )) as { total: number }[];

    return NextResponse.json({
      videos,
      total: countResult[0]?.total || 0,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
