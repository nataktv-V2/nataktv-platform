"use client";

import { useEffect, useState, useRef } from "react";

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  language: { name: string };
  category: { name: string };
};

export default function ReelsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/videos?limit=20")
      .then((res) => res.json())
      .then((data) => setVideos(data.videos || []))
      .catch(() => {});
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

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
          {/* Only render iframe for active and adjacent slides */}
          {Math.abs(i - activeIndex) <= 1 ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=${i === activeIndex ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&mute=${i === activeIndex ? 0 : 1}`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-bg-surface flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Overlay info */}
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
