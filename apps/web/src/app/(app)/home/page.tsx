import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/redis";
import { VideoRow } from "@/components/video/VideoRow";
import { VideoCard } from "@/components/video/VideoCard";
import { ContinueWatching } from "@/components/video/ContinueWatching";
import { HomeTags } from "@/components/layout/HomeTags";

export const metadata: Metadata = {
  title: "Browse",
  description: "Browse trending dramas, short films, and web series on Natak TV. Filter by language and category.",
  alternates: { canonical: "/home" },
};

type VideoWithRelations = {
  id: string;
  title: string;
  thumbnailUrl: string;
  generatedThumbnailUrl?: string | null;
  duration: number;
  createdAt: Date;
  language: { name: string };
  category: { name: string };
};

type LanguageWithVideos = { id: string; name: string; videos: VideoWithRelations[] };
type CategoryWithVideos = { id: string; name: string; videos: VideoWithRelations[] };

async function getHomeData(tag?: string) {
  const cacheKey = `home:${tag || "all"}`;
  return cached(cacheKey, 300, () => getHomeDataFresh(tag));
}

async function getHomeDataFresh(tag?: string) {
  try {
    // Build filter based on tag
    const tagFilter = tag
      ? {
          OR: [
            { category: { slug: { equals: tag, mode: "insensitive" as const } } },
            { category: { name: { equals: tag, mode: "insensitive" as const } } },
            { language: { code: { equals: tag, mode: "insensitive" as const } } },
            { language: { name: { equals: tag, mode: "insensitive" as const } } },
          ],
        }
      : {};

    const [trendingRaw, featured, mostWatched, languages, categories, allFiltered] = await Promise.all([
      // Algorithmic trending: get top videos, will score by views * recency
      prisma.video.findMany({
        where: tagFilter,
        include: { language: true, category: true },
        orderBy: { views: "desc" },
        take: 30,
      }),
      prisma.video.findMany({
        where: { isFeatured: true, ...tagFilter },
        include: { language: true, category: true },
        orderBy: { sortOrder: "asc" },
        take: 10,
      }),
      // Most Watched — purely by total view count
      prisma.video.findMany({
        where: tagFilter,
        include: { language: true, category: true },
        orderBy: { views: "desc" },
        take: 10,
      }),
      prisma.language.findMany({
        include: {
          videos: {
            where: tag ? { OR: [{ category: { slug: { equals: tag, mode: "insensitive" } } }, { category: { name: { equals: tag, mode: "insensitive" } } }] } : {},
            include: { language: true, category: true },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      }),
      prisma.category.findMany({
        include: {
          videos: {
            where: tag ? { OR: [{ language: { code: { equals: tag, mode: "insensitive" } } }, { language: { name: { equals: tag, mode: "insensitive" } } }] } : {},
            include: { language: true, category: true },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      }),
      // If tag is active, also get a flat list of all matching videos for grid view
      tag
        ? prisma.video.findMany({
            where: tagFilter,
            include: { language: true, category: true },
            orderBy: { createdAt: "desc" },
            take: 50,
          })
        : Promise.resolve([]),
    ]);
    // Score trending by views * recency
    const now = Date.now();
    const trending = trendingRaw
      .map((video) => {
        const ageDays = (now - new Date(video.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        const recency = ageDays < 3 ? 3 : ageDays < 7 ? 2 : ageDays < 30 ? 1.5 : 1;
        return { ...video, _score: (video.views + 1) * recency };
      })
      .sort((a, b) => b._score - a._score)
      .slice(0, 10);

    return { trending, featured, mostWatched, languages, categories, allFiltered, error: false };
  } catch {
    return {
      trending: [] as (VideoWithRelations & { _score: number })[],
      featured: [] as VideoWithRelations[],
      mostWatched: [] as VideoWithRelations[],
      languages: [] as LanguageWithVideos[],
      categories: [] as CategoryWithVideos[],
      allFiltered: [] as VideoWithRelations[],
      error: true,
    };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const { trending, featured, mostWatched, languages, categories, allFiltered, error } = await getHomeData(tag);

  return (
    <div className="py-2">
      {/* Tag Filters */}
      <Suspense fallback={null}>
        <HomeTags />
      </Suspense>

      {/* If tag is active, show filtered grid */}
      {tag && allFiltered.length > 0 ? (
        <div className="px-4 pb-4">
          <h2 className="text-lg font-semibold mb-3 capitalize">{tag}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {allFiltered.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnailUrl={video.thumbnailUrl}
                generatedThumbnailUrl={video.generatedThumbnailUrl}
                duration={video.duration}
                language={video.language?.name}
                createdAt={video.createdAt instanceof Date ? video.createdAt.toISOString() : String(video.createdAt)}
                fullWidth
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Continue Watching — client component, fetches per user */}
          <ContinueWatching />

          {/* Trending */}
          <VideoRow title="🔥 Hot & Trending" videos={trending} />

          {/* Featured */}
          <VideoRow title="⭐ Featured Picks" videos={featured} />

          {/* Most Watched */}
          {mostWatched.length > 0 && (
            <VideoRow title="👀 Most Watched" videos={mostWatched} />
          )}

          {/* By Category — show as 3-col grid rows, sorted by video count */}
          {categories
            .filter((cat) => cat.videos.length > 0)
            .sort((a, b) => b.videos.length - a.videos.length)
            .map((cat) => (
              <section key={cat.id} className="mb-6">
                <h2 className="text-lg font-semibold mb-3 px-4">{cat.name}</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 px-4">
                  {cat.videos.slice(0, 6).map((video) => (
                    <VideoCard
                      key={video.id}
                      id={video.id}
                      title={video.title}
                      thumbnailUrl={video.thumbnailUrl}
                      generatedThumbnailUrl={video.generatedThumbnailUrl}
                      duration={video.duration}
                      language={video.language?.name}
                      createdAt={video.createdAt instanceof Date ? video.createdAt.toISOString() : String(video.createdAt)}
                      fullWidth
                    />
                  ))}
                </div>
              </section>
            ))}

          {/* By Language — show as 3-col grid rows */}
          {languages
            .filter((lang) => lang.videos.length > 0)
            .map((lang) => (
              <section key={lang.id} className="mb-6">
                <h2 className="text-lg font-semibold mb-3 px-4">{lang.name} Shows</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 px-4">
                  {lang.videos.slice(0, 6).map((video) => (
                    <VideoCard
                      key={video.id}
                      id={video.id}
                      title={video.title}
                      thumbnailUrl={video.thumbnailUrl}
                      generatedThumbnailUrl={video.generatedThumbnailUrl}
                      duration={video.duration}
                      language={video.language?.name}
                      createdAt={video.createdAt instanceof Date ? video.createdAt.toISOString() : String(video.createdAt)}
                      fullWidth
                    />
                  ))}
                </div>
              </section>
            ))}
        </>
      )}

      {/* Empty state */}
      {trending.length === 0 && featured.length === 0 && !tag && (
        <div className="text-center py-20 px-4">
          <p className="text-text-muted text-lg mb-2">
            {error ? "Database not connected" : "No videos yet"}
          </p>
          <p className="text-text-muted text-sm">
            {error
              ? "Set up PostgreSQL and run 'pnpm db:migrate && pnpm db:seed' to get started."
              : "Content will appear here once videos are added."}
          </p>
        </div>
      )}

      {/* Tag empty state */}
      {tag && allFiltered.length === 0 && (
        <div className="text-center py-16 px-4">
          <p className="text-zinc-500">No videos found for &ldquo;{tag}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
