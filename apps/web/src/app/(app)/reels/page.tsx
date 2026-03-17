"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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

type YTReelPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
  mute: () => void;
  unMute: () => void;
};

export default function ReelsPage() {
  const [videos, setVideos] = useState<ReelItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ytReady, setYtReady] = useState(false);
  const [playingStates, setPlayingStates] = useState<Record<number, boolean>>({});
  const [bufferingStates, setBufferingStates] = useState<Record<number, boolean>>({});
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const [hasPlayedOnce, setHasPlayedOnce] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const playersRef = useRef<Record<number, YTReelPlayer>>({});
  const { isSubscribed, loading: subLoading } = useSubscription();

  // Load YouTube API
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) document.head.appendChild(tag);

    if (window.YT && window.YT.Player) {
      setYtReady(true);
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        setYtReady(true);
      };
    }
  }, []);

  useEffect(() => {
    fetch("/api/reels?limit=20")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.reels || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Create/destroy players when active index changes
  // Must also depend on loaded/subLoading/isSubscribed since DOM only exists when all are ready
  useEffect(() => {
    if (!ytReady || videos.length === 0 || !loaded || subLoading || !isSubscribed) return;

    // Create players for active ±1
    for (let i = Math.max(0, activeIndex - 1); i <= Math.min(videos.length - 1, activeIndex + 1); i++) {
      if (playersRef.current[i]) continue;
      const video = videos[i];
      if (!video) continue;
      const el = document.getElementById(`reel-player-${i}`);
      if (!el) continue;

      playersRef.current[i] = new window.YT.Player(el, {
        videoId: video.youtubeId,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
          disablekb: 1,
          cc_load_policy: 0,
          start: video.startTime || 0,
          end: video.endTime || undefined,
        },
        events: {
          onReady: () => {
            const player = playersRef.current[i];
            if (!player) return;
            if (i === activeIndex) {
              player.unMute();
              player.playVideo();
            } else {
              player.mute();
            }
          },
          onError: (event: { data: number }) => {
            // Error codes: 2=invalid param, 5=HTML5 error, 100=not found, 101/150=embed disabled
            console.warn(`Reel ${i} (${video.youtubeId}) playback error: ${event.data}`);
            setErrorIndices((prev) => new Set(prev).add(i));
          },
          onStateChange: (event: { data: number }) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setPlayingStates((prev) => ({ ...prev, [i]: true }));
              setHasPlayedOnce((prev) => ({ ...prev, [i]: true }));
              setBufferingStates((prev) => ({ ...prev, [i]: false }));
            } else {
              setPlayingStates((prev) => ({ ...prev, [i]: false }));
              // State 3 = BUFFERING
              if (event.data === 3) {
                setBufferingStates((prev) => ({ ...prev, [i]: true }));
              }
            }
            // Loop on end
            if (event.data === window.YT.PlayerState.ENDED) {
              const player = playersRef.current[i];
              const v = videos[i];
              if (player && v) {
                player.seekTo(v.startTime || 0, true);
                player.playVideo();
              }
            }
          },
        },
      });
    }

    // Destroy far-away players to save memory
    Object.keys(playersRef.current).forEach((key) => {
      const idx = Number(key);
      if (Math.abs(idx - activeIndex) > 2) {
        try {
          playersRef.current[idx]?.destroy();
        } catch { /* ignore */ }
        delete playersRef.current[idx];
        // Recreate the placeholder div (destroy() removes the original element)
        const container = document.querySelector(`[data-index="${idx}"] [data-player-slot]`);
        if (container) {
          container.innerHTML = "";
          const div = document.createElement("div");
          div.id = `reel-player-${idx}`;
          div.className = "w-full h-full";
          container.appendChild(div);
        }
      }
    });
  }, [ytReady, activeIndex, videos, loaded, subLoading, isSubscribed]);

  // Play/pause based on active index
  useEffect(() => {
    Object.entries(playersRef.current).forEach(([key, player]) => {
      const idx = Number(key);
      try {
        if (idx === activeIndex) {
          player.playVideo();
          player.unMute();
        } else {
          player.pauseVideo();
          player.mute();
        }
      } catch {
        // Player not ready yet
      }
    });
  }, [activeIndex]);

  // Intersection observer for snap scrolling
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

  // Toggle play/pause on tap
  const handleTap = useCallback(
    (index: number) => {
      const player = playersRef.current[index];
      if (!player) return;
      try {
        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      } catch {
        // ignore
      }
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(playersRef.current).forEach((p) => {
        try { p.destroy(); } catch { /* */ }
      });
      playersRef.current = {};
    };
  }, []);

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
      className="-mb-20 h-[calc(100dvh-3.5rem-4rem)] overflow-y-auto snap-y snap-mandatory bg-black"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {videos.map((video, i) => (
        <div
          key={video.id}
          data-index={i}
          className="h-[calc(100dvh-3.5rem-4rem)] snap-start relative bg-black overflow-hidden"
          style={{ scrollSnapAlign: "start" }}
          onClick={() => handleTap(i)}
        >
          {/* Blurred thumbnail background — fills entire screen */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-xl brightness-50 scale-110"
          />

          {/* YouTube player — hidden until playing to avoid YouTube branding */}
          <div className={`absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none transition-opacity duration-300 ${playingStates[i] ? "opacity-100" : "opacity-0"}`}>
            <div
              className="w-full"
              style={{ aspectRatio: "16/9" }}
              data-player-slot
            >
              <div
                id={`reel-player-${i}`}
                className="w-full h-full [&>iframe]:!w-full [&>iframe]:!h-full"
              />
            </div>
          </div>

          {/* Bottom gradient to keep Watch Now button readable */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-[1] pointer-events-none" />

          {/* Video info overlay — TOP */}
          <div className="absolute top-0 left-0 right-0 z-[2] pointer-events-none px-4 py-2.5 bg-black/50 backdrop-blur-md">
            <h3 className="text-white font-bold text-base leading-tight mb-1 line-clamp-1">
              {video.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-white/20 text-white/90 px-2 py-px rounded-full font-medium">
                {video.language.name}
              </span>
              <span className="text-[11px] bg-white/20 text-white/90 px-2 py-px rounded-full font-medium">
                {video.category.name}
              </span>
            </div>
          </div>

          {/* Embed disabled / error overlay */}
          {errorIndices.has(i) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-[2] pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-red-400 mx-auto mb-2">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
                <p className="text-white/80 text-sm">Video unavailable</p>
                <p className="text-white/50 text-xs mt-1">Playback disabled by owner</p>
              </div>
            </div>
          )}

          {/* Loading/Buffering spinner — show while video is loading or buffering */}
          {i === activeIndex && !errorIndices.has(i) && !playingStates[i] && !hasPlayedOnce[i] && (
            <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
              <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* Tap to pause indicator — only shows after video was playing and user tapped to pause */}
          {!errorIndices.has(i) && playingStates[i] === false && hasPlayedOnce[i] && i === activeIndex && (
            <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
              <div className="bg-black/40 rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}

          {/* Watch Now button — big rectangular bar at bottom */}
          <div className="absolute bottom-6 left-4 right-4 z-[2]">
            <Link
              href={`/video/${video.videoId}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-accent hover:bg-accent-hover rounded-xl font-semibold text-white text-base transition-colors shadow-lg shadow-black/40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
              Watch Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
