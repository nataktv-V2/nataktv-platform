"use client";

import { useEffect, useState, useRef } from "react";
import { useSubscription } from "@/components/subscription/SubscriptionGate";
import Link from "next/link";

type ReelItem = {
  id: string;
  youtubeId: string;
  title: string;
  startTime: number;
  endTime: number | null;
  language: { name: string };
  category: { name: string };
  thumbnailUrl: string;
  isClip: boolean;
  videoId: string;
};

export default function ReelsPage() {
  const [videos, setVideos] = useState<ReelItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isSubscribed, loading: subLoading } = useSubscription();

  useEffect(() => {
    fetch("/api/reels?limit=20")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.reels || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      { root: container, threshold: 0.7 }
    );

    container.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [videos]);

  if (!loaded || subLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-text-muted text-lg mb-2">No reels available yet</p>
        <p className="text-text-muted text-sm">Content will appear here once videos are added.</p>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-accent">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Subscribe to watch Reels</h2>
        <p className="text-text-muted mb-6">Start with a ₹2 trial for 2 days</p>
        <Link
          href="/subscribe"
          className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          Subscribe Now — ₹199/mo
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-7.5rem)] overflow-y-auto snap-y snap-mandatory"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {videos.map((video, i) => (
        <div
          key={video.id}
          data-index={i}
          className="h-[calc(100vh-7.5rem)] snap-start relative bg-black flex items-center justify-center"
          style={{ scrollSnapAlign: "start" }}
        >
          {/* Blurred thumbnail background for vertical viewing */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-2xl brightness-[0.3] scale-110"
          />

          {Math.abs(i - activeIndex) <= 1 ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=${i === activeIndex ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&mute=${i === activeIndex ? 0 : 1}${video.startTime ? `&start=${video.startTime}` : ""}${video.endTime ? `&end=${video.endTime}` : ""}`}
              className="relative w-full aspect-video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="w-full aspect-video bg-bg-surface flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div className="absolute bottom-8 left-4 right-4 pointer-events-none">
            <h3 className="text-white font-semibold text-base mb-1 drop-shadow-lg">
              {video.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/20 text-white/90 px-2 py-0.5 rounded backdrop-blur-sm">
                {video.language.name}
              </span>
              <span className="text-xs bg-white/20 text-white/90 px-2 py-0.5 rounded backdrop-blur-sm">
                {video.category.name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
