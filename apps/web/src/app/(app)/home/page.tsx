import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { VideoRow } from "@/components/video/VideoRow";
import { ContinueWatching } from "@/components/video/ContinueWatching";

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
  language: { name: string };
  category: { name: string };
};

type LanguageWithVideos = { id: string; name: string; videos: VideoWithRelations[] };
type CategoryWithVideos = { id: string; name: string; videos: VideoWithRelations[] };

async function getHomeData() {
  try {
    const [trending, featured, languages, categories] = await Promise.all([
      prisma.video.findMany({
        where: { isTrending: true },
        include: { language: true, category: true },
        orderBy: { views: "desc" },
        take: 10,
      }),
      prisma.video.findMany({
        where: { isFeatured: true },
        include: { language: true, category: true },
        orderBy: { sortOrder: "asc" },
        take: 10,
      }),
      prisma.language.findMany({
        include: {
          videos: {
            include: { language: true, category: true },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      }),
      prisma.category.findMany({
        include: {
          videos: {
            include: { language: true, category: true },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      }),
    ]);
    return { trending, featured, languages, categories, error: false };
  } catch {
    return {
      trending: [] as VideoWithRelations[],
      featured: [] as VideoWithRelations[],
      languages: [] as LanguageWithVideos[],
      categories: [] as CategoryWithVideos[],
      error: true,
    };
  }
}

export default async function HomePage() {
  const { trending, featured, languages, categories, error } = await getHomeData();

  return (
    <div className="py-4">
      {/* Trending */}
      <VideoRow title="🔥 Hot & Trending" videos={trending} />

      {/* Featured */}
      <VideoRow title="⭐ Featured Picks" videos={featured} />

      {/* Continue Watching — client component, fetches per user */}
      <ContinueWatching />

      {/* By Category */}
      {categories
        .filter((cat) => cat.videos.length > 0)
        .map((cat) => (
          <VideoRow key={cat.id} title={cat.name} videos={cat.videos} />
        ))}

      {/* By Language */}
      {languages
        .filter((lang) => lang.videos.length > 0)
        .map((lang) => (
          <VideoRow key={lang.id} title={`${lang.name} Shows`} videos={lang.videos} />
        ))}

      {/* Empty state */}
      {trending.length === 0 && featured.length === 0 && (
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
    </div>
  );
}
