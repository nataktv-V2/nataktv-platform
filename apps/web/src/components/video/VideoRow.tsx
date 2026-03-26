import { memo } from "react";
import { VideoCard } from "./VideoCard";

type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  generatedThumbnailUrl?: string | null;
  duration: number;
  createdAt?: Date | string;
  language?: { name: string };
  category?: { name: string };
};

type VideoRowProps = {
  title: string;
  videos: Video[];
};

export const VideoRow = memo(function VideoRow({ title, videos }: VideoRowProps) {
  if (videos.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3 px-4">{title}</h2>
      <div className="flex gap-3 overflow-x-auto px-4 hide-scrollbar">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            thumbnailUrl={video.thumbnailUrl}
            generatedThumbnailUrl={video.generatedThumbnailUrl}
            duration={video.duration}
            language={video.language?.name}
            category={video.category?.name}
            createdAt={video.createdAt instanceof Date ? video.createdAt.toISOString() : video.createdAt}
          />
        ))}
      </div>
    </section>
  );
});
