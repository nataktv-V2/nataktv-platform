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
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-zinc-600 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <p className="text-text-muted text-lg mb-2">Sign in to see your favourites</p>
        <p className="text-text-muted text-sm mb-6">Log in to save videos and access them here.</p>
        <button
          onClick={() => signInWithGoogle()}
          className="flex items-center justify-center gap-3 bg-white text-gray-800 mx-auto px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
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
