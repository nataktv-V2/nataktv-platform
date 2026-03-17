"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { VideoCard } from "@/components/video/VideoCard";

type FavouriteVideo = {
  id: string;
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
    generatedThumbnailUrl?: string | null;
    duration: number;
    createdAt: string;
    language: { name: string };
    category: { name: string };
  };
};

export default function FavouritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favourites, setFavourites] = useState<FavouriteVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    fetch(`/api/favourites?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        setFavourites(data.favourites || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.uid, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-text-muted text-lg mb-2">Sign in to see your favourites</p>
        <p className="text-text-muted text-sm">
          Log in to save videos and access them here.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold mb-4">My Favourites</h1>

      {favourites.length === 0 ? (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mx-auto text-zinc-600 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <p className="text-text-muted text-sm">
            No favourites yet. Tap the heart icon on any video to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {favourites.map((fav) => (
            <VideoCard
              key={fav.id}
              id={fav.video.id}
              title={fav.video.title}
              thumbnailUrl={fav.video.thumbnailUrl}
              generatedThumbnailUrl={fav.video.generatedThumbnailUrl}
              duration={fav.video.duration}
              language={fav.video.language?.name}
              createdAt={fav.video.createdAt}
              fullWidth
            />
          ))}
        </div>
      )}
    </div>
  );
}
