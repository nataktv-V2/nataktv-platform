import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GatedVideoPlayer } from "@/components/video/GatedVideoPlayer";
import { VideoCard } from "@/components/video/VideoCard";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = await prisma.video.findUnique({
    where: { id },
    include: { language: true, category: true },
  });
  if (!video) return { title: "Video Not Found" };
  return {
    title: video.title,
    description: video.description || `Watch ${video.title} on Natak TV — ${video.language.name} ${video.category.name}`,
    openGraph: {
      title: video.title,
      description: video.description || `Watch ${video.title} on Natak TV`,
      type: "video.other",
      images: [{ url: video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg` }],
    },
    alternates: { canonical: `/video/${id}` },
  };
}

export default async function VideoPage({ params }: Props) {
  const { id } = await params;

  const video = await prisma.video.findUnique({
    where: { id },
    include: { language: true, category: true },
  });

  if (!video) notFound();

  // Get related videos (same category, exclude current)
  const related = await prisma.video.findMany({
    where: { categoryId: video.categoryId, id: { not: video.id } },
    include: { language: true, category: true },
    take: 10,
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Player */}
      <GatedVideoPlayer youtubeId={video.youtubeId} title={video.title} videoId={video.id} />

      {/* Video Info */}
      <div className="px-4 py-4">
        <h1 className="text-lg font-bold mb-1">{video.title}</h1>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
            {video.language.name}
          </span>
          <span className="text-xs bg-bg-elevated text-text-muted px-2 py-0.5 rounded-full">
            {video.category.name}
          </span>
        </div>
        {video.description && (
          <p className="text-text-muted text-sm">{video.description}</p>
        )}
      </div>

      {/* Related Videos */}
      {related.length > 0 && (
        <div className="px-4 pb-8">
          <h2 className="text-base font-semibold mb-3">More like this</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {related.map((v) => (
              <VideoCard
                key={v.id}
                id={v.id}
                title={v.title}
                thumbnailUrl={v.thumbnailUrl}
                duration={v.duration}
                language={v.language.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
