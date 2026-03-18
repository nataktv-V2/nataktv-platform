"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface WatchHistoryEntry {
  id: string;
  progress: number;
  duration: number;
  watchedAt: string;
  video: {
    id: string;
    youtubeId: string;
    title: string;
    thumbnailUrl: string;
    generatedThumbnailUrl: string | null;
    duration: number;
    category: { name: string };
    language: { name: string };
  };
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function WatchHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<WatchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchHistory() {
      try {
        const res = await fetch(
          `/api/watch-history?uid=${encodeURIComponent(user!.uid)}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch watch history");
        }
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-zinc-400 mb-4">Please sign in to view watch history.</p>
        <Link
          href="/profile"
          className="text-[#f97316] font-medium hover:underline"
        >
          Go to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/profile"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="text-xl font-bold">Watch History</h1>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!error && history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#121216] border border-white/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-7 h-7 text-zinc-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <p className="text-zinc-400 text-sm mb-1">No watch history yet</p>
          <p className="text-zinc-600 text-xs mb-4">
            Videos you watch will appear here.
          </p>
          <Link
            href="/home"
            className="text-[#f97316] text-sm font-medium hover:underline"
          >
            Browse Videos
          </Link>
        </div>
      )}

      {/* History Cards */}
      {history.length > 0 && (
        <div className="space-y-3">
          {history.map((entry) => {
            const thumb =
              entry.video.generatedThumbnailUrl ||
              entry.video.thumbnailUrl ||
              `https://img.youtube.com/vi/${entry.video.youtubeId}/mqdefault.jpg`;
            const progressPct =
              entry.duration > 0
                ? Math.min(100, Math.round((entry.progress / entry.duration) * 100))
                : 0;

            return (
              <Link
                key={entry.id}
                href={`/video/${entry.video.id}`}
                className="flex gap-3 bg-[#121216] border border-white/10 rounded-xl p-3 hover:border-[#f97316]/30 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-28 flex-shrink-0 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={thumb}
                    alt={entry.video.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                  {/* Progress bar */}
                  {progressPct > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-[#f97316]"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  )}
                  {/* Duration badge */}
                  {entry.video.duration > 0 && (
                    <span className="absolute bottom-1.5 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">
                      {formatDuration(entry.video.duration)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white line-clamp-2 leading-tight">
                      {entry.video.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {entry.video.category.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-zinc-500">
                      {formatTimeAgo(entry.watchedAt)}
                    </span>
                    {progressPct > 0 && (
                      <span className="text-[10px] text-[#f97316] font-medium">
                        {progressPct}% watched
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
