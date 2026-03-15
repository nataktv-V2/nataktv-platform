import Image from "next/image";
import Link from "next/link";

type VideoCardProps = {
  id: string;
  title: string;
  thumbnailUrl: string;
  generatedThumbnailUrl?: string | null;
  duration: number;
  language?: string;
  category?: string;
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoCard({ id, title, thumbnailUrl, generatedThumbnailUrl, duration, language }: VideoCardProps) {
  return (
    <Link href={`/video/${id}`} className="group block flex-shrink-0 w-36 sm:w-44">
      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-bg-surface">
        <Image
          src={generatedThumbnailUrl || thumbnailUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 144px, 176px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-xs font-medium line-clamp-2 leading-tight">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            {language && (
              <span className="text-[10px] bg-white/20 text-white/80 px-1.5 py-0.5 rounded">{language}</span>
            )}
            <span className="text-[10px] text-white/60">{formatDuration(duration)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
