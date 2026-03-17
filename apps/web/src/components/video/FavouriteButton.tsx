"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type FavouriteButtonProps = {
  videoId: string;
};

export function FavouriteButton({ videoId }: FavouriteButtonProps) {
  const { user } = useAuth();
  const [favourited, setFavourited] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if video is already favourited on mount
  useEffect(() => {
    if (!user?.uid) return;

    fetch(`/api/favourites?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        const isFav = (data.favourites || []).some(
          (f: { videoId: string }) => f.videoId === videoId
        );
        setFavourited(isFav);
      })
      .catch(() => {});
  }, [user?.uid, videoId]);

  const handleToggle = async () => {
    if (!user?.uid || loading) return;

    setLoading(true);
    // Optimistic update
    setFavourited((prev) => !prev);

    try {
      const res = await fetch("/api/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, videoId }),
      });
      const data = await res.json();
      if (res.ok) {
        setFavourited(data.favourited);
      } else {
        // Revert on error
        setFavourited((prev) => !prev);
      }
    } catch {
      // Revert on error
      setFavourited((prev) => !prev);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
      aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
    >
      {favourited ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-red-500"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      )}
      <span className="text-white text-xs">
        {favourited ? "Saved" : "Save"}
      </span>
    </button>
  );
}
