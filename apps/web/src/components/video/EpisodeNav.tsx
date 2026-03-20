"use client";

import Link from "next/link";

type Episode = {
  id: string;
  episodeNumber: number;
  startTime: number;
  endTime: number;
};

type Props = {
  videoId: string;
  episodes: Episode[];
  currentEpisode?: number;
};

export function EpisodeNav({ videoId, episodes, currentEpisode }: Props) {
  if (episodes.length === 0) return null;

  const currentIdx = episodes.findIndex((ep) => ep.episodeNumber === currentEpisode);
  const prevEp = currentIdx > 0 ? episodes[currentIdx - 1] : null;
  const nextEp = currentIdx < episodes.length - 1 ? episodes[currentIdx + 1] : null;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-bg-surface rounded-xl">
      {/* Prev */}
      {prevEp ? (
        <Link
          href={`/video/${videoId}?startAt=${prevEp.startTime}&ep=${prevEp.episodeNumber}`}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Ep {prevEp.episodeNumber}
        </Link>
      ) : (
        <div />
      )}

      {/* Current episode indicator */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">Episode</span>
        <div className="flex gap-1">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/video/${videoId}?startAt=${ep.startTime}&ep=${ep.episodeNumber}`}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                ep.episodeNumber === currentEpisode
                  ? "bg-accent text-white"
                  : "bg-bg-elevated text-zinc-400 hover:text-white"
              }`}
            >
              {ep.episodeNumber}
            </Link>
          ))}
        </div>
      </div>

      {/* Next */}
      {nextEp ? (
        <Link
          href={`/video/${videoId}?startAt=${nextEp.startTime}&ep=${nextEp.episodeNumber}`}
          className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors font-semibold"
        >
          Ep {nextEp.episodeNumber}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
