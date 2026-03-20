"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { GatedVideoPlayer } from "./GatedVideoPlayer";

type NextVideoInfo = {
  id: string;
  title: string;
  thumbnailUrl: string;
  generatedThumbnailUrl?: string | null;
};

type Props = {
  youtubeId: string;
  title: string;
  videoId: string;
  creditStart?: number | null;
  reelStart?: number;
  startAt?: number;
  nextVideo: NextVideoInfo | null;
};

export function VideoPageClient({
  youtubeId,
  title,
  videoId,
  creditStart,
  reelStart,
  startAt: startAtProp,
  nextVideo,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState<number | null>(null);

  // Resume from ?t=<seconds> or ?startAt=<seconds> query param, or prop
  const startAt = startAtProp
    ?? (searchParams.get("startAt") ? parseInt(searchParams.get("startAt")!, 10) : undefined)
    ?? (searchParams.get("t") ? parseInt(searchParams.get("t")!, 10) : undefined);

  const handleEnded = () => {
    if (nextVideo) setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      router.push(`/video/${nextVideo!.id}`);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, nextVideo, router]);

  return (
    <div className="relative">
      <GatedVideoPlayer
        youtubeId={youtubeId}
        title={title}
        videoId={videoId}
        creditStart={creditStart}
        reelStart={reelStart}
        startAt={startAt}
        onEnded={handleEnded}
      />

      {/* Auto-play countdown overlay */}
      {countdown !== null && nextVideo && (
        <div className="absolute inset-0 bg-black/90 z-10 flex flex-col items-center justify-center gap-4 rounded-t-xl">
          <p className="text-white/60 text-xs uppercase tracking-wide">
            Up next in {countdown}s
          </p>
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 max-w-[280px]">
            <div className="relative w-14 aspect-[9/16] rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={
                  nextVideo.generatedThumbnailUrl || nextVideo.thumbnailUrl
                }
                alt={nextVideo.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <p className="text-white text-sm font-medium line-clamp-2">
              {nextVideo.title}
            </p>
          </div>
          <div className="flex gap-3 mt-1">
            <button
              onClick={() => setCountdown(null)}
              className="text-zinc-400 text-xs hover:text-white px-4 py-2 border border-white/20 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => router.push(`/video/${nextVideo.id}`)}
              className="text-white text-xs bg-[#f97316] hover:bg-[#ea580c] px-4 py-2 rounded-full font-medium transition-colors"
            >
              Play now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
