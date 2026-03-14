import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { VideoRow } from "@/components/video/VideoRow";
import { ContinueWatching } from "@/components/video/ContinueWatching";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Browse",
  description: "Browse trending dramas, short films, and web series on Natak TV. Filter by language and category.",
  alternates: { canonical: "/home" },
};

type VideoWithRelations = {
  id: string;
  title: string;
  thumbnailUrl: string;
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
      {/* Search bar */}
      <div className="px-4 mb-6 sm:hidden">
        <Link
          href="/search"
          className="flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-full px-4 py-2.5 text-sm text-text-muted"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
          Search shows, movies, series...
        </Link>
      </div>

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
