"use client";

import { useState, useEffect, useCallback } from "react";
import { VideoCard } from "@/components/video/VideoCard";

type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  generatedThumbnailUrl?: string | null;
  duration: number;
  language: { name: string };
  category: { name: string };
};

type FilterOption = { name: string; code?: string; slug?: string };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<FilterOption[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [selectedLang, setSelectedLang] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  // Load all videos + filters on mount
  useEffect(() => {
    fetch("/api/videos?limit=50")
      .then((res) => res.json())
      .then((data) => {
        const vids = data.videos || [];
        setAllVideos(vids);
        // Extract unique languages and categories
        const langMap = new Map<string, FilterOption>();
        const catMap = new Map<string, FilterOption>();
        for (const v of vids) {
          if (v.language?.name) langMap.set(v.language.name, v.language);
          if (v.category?.name) catMap.set(v.category.name, v.category);
        }
        setLanguages(Array.from(langMap.values()));
        setCategories(Array.from(catMap.values()));
      })
      .catch(() => {});
  }, []);

  // Server-side search with debounce
  const doSearch = useCallback(
    (q: string, lang: string, cat: string) => {
      if (!q.trim() && !lang && !cat) {
        setVideos([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (lang) params.set("language", lang);
      if (cat) params.set("category", cat);

      // Use search API for text queries, videos API for filter-only
      const url = q.trim()
        ? `/api/search?${params}`
        : `/api/videos?${params}&limit=50`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setVideos(data.videos || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    },
    []
  );

  // Debounced search on query/filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch(query, selectedLang, selectedCat);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedLang, selectedCat, doSearch]);

  const hasActiveSearch = query.trim() || selectedLang || selectedCat;
  const displayVideos = hasActiveSearch ? videos : allVideos;

  return (
    <div className="px-4 py-4">
      {/* Search Input */}
      <div className="relative mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shows, movies..."
          className="w-full bg-bg-surface border border-border-subtle rounded-full pl-10 pr-10 py-2 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
        {/* Language chips */}
        {languages.map((lang) => (
          <button
            key={lang.code || lang.name}
            onClick={() =>
              setSelectedLang(
                selectedLang === (lang.code || "") ? "" : lang.code || ""
              )
            }
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedLang === lang.code
                ? "bg-[#f97316] text-white"
                : "bg-white/5 text-zinc-400 hover:bg-white/10"
            }`}
          >
            {lang.name}
          </button>
        ))}
        {/* Category chips */}
        {categories.map((cat) => (
          <button
            key={cat.slug || cat.name}
            onClick={() =>
              setSelectedCat(
                selectedCat === (cat.slug || "") ? "" : cat.slug || ""
              )
            }
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCat === cat.slug
                ? "bg-[#f97316] text-white"
                : "bg-white/5 text-zinc-400 hover:bg-white/10"
            }`}
          >
            {cat.name}
          </button>
        ))}
        {/* Clear filters */}
        {(selectedLang || selectedCat) && (
          <button
            onClick={() => {
              setSelectedLang("");
              setSelectedCat("");
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Results */}
      {!loading && displayVideos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {displayVideos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              thumbnailUrl={video.thumbnailUrl}
              generatedThumbnailUrl={video.generatedThumbnailUrl}
              duration={video.duration}
              language={video.language?.name}
              fullWidth
            />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && hasActiveSearch && videos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-zinc-500">
            No results{query.trim() ? ` for "${query}"` : ""}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasActiveSearch && allVideos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-zinc-500">No videos available</p>
        </div>
      )}
    </div>
  );
}
