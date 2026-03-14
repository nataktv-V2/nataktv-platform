"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Language = { id: string; name: string; code: string };
type Category = { id: string; name: string; slug: string };
type VideoData = {
  id?: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  languageId: string;
  categoryId: string;
  isFeatured: boolean;
  isTrending: boolean;
};

function extractYouTubeId(input: string): string {
  // Handle full URLs
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match?.[1]) return match[1];
  }
  // If already an ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  return input;
}

export function VideoForm({
  languages,
  categories,
  initialData,
}: {
  languages: Language[];
  categories: Category[];
  initialData?: VideoData;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [youtubeInput, setYoutubeInput] = useState(
    initialData?.youtubeId || ""
  );
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    thumbnailUrl: initialData?.thumbnailUrl || "",
    duration: initialData?.duration || 0,
    languageId: initialData?.languageId || languages[0]?.id || "",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    isFeatured: initialData?.isFeatured || false,
    isTrending: initialData?.isTrending || false,
  });

  const youtubeId = extractYouTubeId(youtubeInput);
  const previewUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : "";

  const handleAutoFill = async () => {
    if (!youtubeId) return;
    // Auto-fill thumbnail
    setForm((f) => ({
      ...f,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    }));
    // Try to fetch title via oEmbed
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${youtubeId}&format=json`
      );
      if (res.ok) {
        const data = await res.json();
        setForm((f) => ({ ...f, title: data.title || f.title }));
      }
    } catch {
      // oEmbed failed, user fills manually
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData?.id
        ? `/api/admin/videos/${initialData.id}`
        : "/api/admin/videos";
      const method = initialData?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeId, ...form }),
      });
      if (res.ok) {
        router.push("/admin/videos");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* YouTube URL/ID */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">
          YouTube URL or Video ID
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or video ID"
            className="flex-1 px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
            required
          />
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-sm font-medium transition-colors"
          >
            Auto-fill
          </button>
        </div>
        {youtubeId && (
          <p className="text-xs text-zinc-500 mt-1">ID: {youtubeId}</p>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="rounded-lg overflow-hidden border border-white/10">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316] resize-none"
        />
      </div>

      {/* Language & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Language</label>
          <select
            value={form.languageId}
            onChange={(e) => setForm({ ...form, languageId: e.target.value })}
            className="w-full px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">
          Duration (seconds)
        </label>
        <input
          type="number"
          value={form.duration}
          onChange={(e) =>
            setForm({ ...form, duration: parseInt(e.target.value) || 0 })
          }
          className="w-full px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) =>
              setForm({ ...form, isFeatured: e.target.checked })
            }
            className="accent-[#f97316]"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isTrending}
            onChange={(e) =>
              setForm({ ...form, isTrending: e.target.checked })
            }
            className="accent-[#f97316]"
          />
          Trending
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : initialData?.id
          ? "Update Video"
          : "Add Video"}
      </button>
    </form>
  );
}
