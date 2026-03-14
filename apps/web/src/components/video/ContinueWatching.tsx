"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type WatchHistoryEntry = {
  id: string;
  progress: number;
  duration: number;
  watchedAt: string;
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    language: { name: string };
    category: { name: string };
  };
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ContinueWatching() {
  const { user } = useAuth();
  const [history, setHistory] = useState<WatchHistoryEntry[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    fetch(`/api/watch-history?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Only show videos with some progress but not completed (< 95%)
          const inProgress = data.filter(
            (entry: WatchHistoryEntry) =>
              entry.progress > 0 &&
              entry.duration > 0 &&
              entry.progress / entry.duration < 0.95
          );
          setHistory(inProgress);
        }
      })
      .catch(() => {});
  }, [user?.uid]);

  if (history.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3 px-4">Continue Watching</h2>
      <div className="flex gap-3 overflow-x-auto px-4 hide-scrollbar">
        {history.map((entry) => {
          const percent =
            entry.duration > 0
              ? Math.min((entry.progress / entry.duration) * 100, 100)
              : 0;
          const remaining = entry.duration - entry.progress;

          return (
            <Link
              key={entry.id}
              href={`/video/${entry.video.id}`}
              className="group block flex-shrink-0 w-36 sm:w-44"
            >
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#121216]">
                <Image
                  src={entry.video.thumbnailUrl}
                  alt={entry.video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 144px, 176px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-5 h-5 ml-0.5"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                  {/* Progress bar */}
                  <div className="h-1 bg-white/20">
                    <div
                      className="h-full bg-[#f97316] transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="px-2 py-2">
                    <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
                      {entry.video.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-white/20 text-white/80 px-1.5 py-0.5 rounded">
                        {entry.video.language.name}
                      </span>
                      <span className="text-[10px] text-white/60">
                        {remaining > 0
                          ? `${formatDuration(Math.round(remaining))} left`
                          : formatDuration(entry.video.duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
