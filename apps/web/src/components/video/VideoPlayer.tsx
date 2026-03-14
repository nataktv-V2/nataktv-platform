"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type VideoPlayerProps = {
  youtubeId: string;
  title: string;
  videoId?: string;
};

declare global {
  interface Window {
    YT: {
      Player: new (
        el: string | HTMLElement,
        config: Record<string, unknown>
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ youtubeId, title, videoId }: VideoPlayerProps) {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideControlsAfterDelay = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (playerRef.current?.getPlayerState() === window.YT?.PlayerState?.PLAYING) {
        setShowControls(false);
      }
    }, 3000);
  }, []);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) document.head.appendChild(tag);

    const initPlayer = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: youtubeId,
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
        },
        events: {
          onReady: () => {
            setDuration(playerRef.current?.getDuration() || 0);
          },
          onStateChange: (event: { data: number }) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            if (event.data === window.YT.PlayerState.PLAYING) {
              hideControlsAfterDelay();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      playerRef.current?.destroy();
    };
  }, [youtubeId, hideControlsAfterDelay]);

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Save watch history every 30s
  useEffect(() => {
    if (!user?.uid || !videoId || !isPlaying) return;
    const interval = setInterval(() => {
      if (playerRef.current) {
        const progress = Math.floor(playerRef.current.getCurrentTime());
        const dur = Math.floor(playerRef.current.getDuration());
        fetch("/api/watch-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, videoId, progress, duration: dur }),
        }).catch(() => {});
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user?.uid, videoId, isPlaying]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setShowControls(true);
    hideControlsAfterDelay();
  };

  const seek = (seconds: number) => {
    if (!playerRef.current) return;
    const newTime = Math.max(0, Math.min(playerRef.current.getCurrentTime() + seconds, duration));
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
    setShowControls(true);
    hideControlsAfterDelay();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    const newTime = fraction * duration;
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const handleContainerClick = () => {
    setShowControls(true);
    hideControlsAfterDelay();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="relative w-full aspect-video bg-black overflow-hidden [&>iframe]:!w-full [&>iframe]:!h-full [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:pointer-events-none"
      onClick={handleContainerClick}
    >
      {/* YouTube iframe container — YT API replaces this div with an iframe */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Custom Controls Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-3">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>

        {/* Center controls */}
        <div className="absolute inset-0 flex items-center justify-center gap-12">
          {/* Skip back 10s */}
          <button
            onClick={(e) => { e.stopPropagation(); seek(-10); }}
            className="text-white/80 hover:text-white p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5H10.06l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="text-white bg-white/20 hover:bg-white/30 rounded-full p-4"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Skip forward 10s */}
          <button
            onClick={(e) => { e.stopPropagation(); seek(10); }}
            className="text-white/80 hover:text-white p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
          <div
            className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-2"
            onClick={(e) => { e.stopPropagation(); handleProgressClick(e); }}
          >
            <div
              className="h-full bg-accent rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full" />
            </div>
          </div>
          <div className="flex justify-between text-white/60 text-xs">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
