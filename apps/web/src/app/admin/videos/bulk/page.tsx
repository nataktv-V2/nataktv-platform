"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Language = { id: string; name: string; code: string };
type Category = { id: string; name: string; slug: string };

type ParsedVideo = {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  valid: boolean;
};

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Already a plain ID (11 chars, alphanumeric + - _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  // youtube.com/watch?v=ID
  const urlMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (urlMatch?.[1]) return urlMatch[1];

  // youtu.be/ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch?.[1]) return shortMatch[1];

  // youtube.com/embed/ID
  const embedMatch = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch?.[1]) return embedMatch[1];

  return null;
}

export default function BulkUploadPage() {
  const [rawInput, setRawInput] = useState("");
  const [parsedVideos, setParsedVideos] = useState<ParsedVideo[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [languageId, setLanguageId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch languages and categories
  useEffect(() => {
    fetch("/api/admin/languages")
      .then((res) => res.json())
      .then((data) => {
        setLanguages(data);
        if (data.length > 0) setLanguageId(data[0].id);
      })
      .catch(() => {});

    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      })
      .catch(() => {});
  }, []);

  // Parse YouTube URLs whenever rawInput changes
  useEffect(() => {
    const lines = rawInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const parsed: ParsedVideo[] = lines.map((line, i) => {
      const id = extractYouTubeId(line);
      return {
        youtubeId: id || line,
        title: `Video ${i + 1}`,
        thumbnailUrl: id
          ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
          : "",
        valid: !!id,
      };
    });

    setParsedVideos(parsed);
  }, [rawInput]);

  const validCount = parsedVideos.filter((v) => v.valid).length;
  const invalidCount = parsedVideos.filter((v) => !v.valid).length;

  const updateTitle = (index: number, title: string) => {
    setParsedVideos((prev) =>
      prev.map((v, i) => (i === index ? { ...v, title } : v))
    );
  };

  const removeVideo = (index: number) => {
    setParsedVideos((prev) => prev.filter((_, i) => i !== index));
    // Also update the raw input to match
    const lines = rawInput.split("\n").filter((l) => l.trim().length > 0);
    lines.splice(index, 1);
    setRawInput(lines.join("\n"));
  };

  const handleSubmit = async () => {
    const validVideos = parsedVideos.filter((v) => v.valid);
    if (validVideos.length === 0) return;
    if (!languageId || !categoryId) {
      setResult({ type: "error", message: "Please select a language and category." });
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/videos/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videos: validVideos.map((v) => ({
            youtubeId: v.youtubeId,
            title: v.title,
            languageId,
            categoryId,
            isFeatured,
            isTrending,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({
          type: "success",
          message: `${data.count} videos created successfully!`,
        });
        setRawInput("");
        setParsedVideos([]);
      } else {
        setResult({ type: "error", message: data.error || "Failed to create videos." });
      }
    } catch {
      setResult({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bulk Upload Videos</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Add multiple YouTube videos at once
          </p>
        </div>
        <Link
          href="/admin/videos"
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
        >
          Back to Videos
        </Link>
      </div>

      {/* Result Banner */}
      {result && (
        <div
          className={`mb-6 p-4 rounded-xl border ${
            result.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {result.message}
          {result.type === "success" && (
            <Link
              href="/admin/videos"
              className="ml-3 underline hover:no-underline"
            >
              View all videos
            </Link>
          )}
        </div>
      )}

      {/* Input Section */}
      <div className="bg-[#121216] rounded-xl border border-white/10 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          1. Paste YouTube URLs
        </h2>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder={`Paste YouTube URLs, one per line...\n\nhttps://youtube.com/watch?v=dQw4w9WgXcQ\nhttps://youtu.be/abc123def45\nabc123def45`}
          rows={8}
          className="w-full px-4 py-3 bg-[#1a1a20] border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-[#f97316] resize-none placeholder:text-zinc-600"
        />
        {parsedVideos.length > 0 && (
          <div className="flex gap-4 mt-3 text-sm">
            <span className="text-green-400">{validCount} valid</span>
            {invalidCount > 0 && (
              <span className="text-red-400">{invalidCount} invalid</span>
            )}
          </div>
        )}
      </div>

      {/* Common Settings */}
      <div className="bg-[#121216] rounded-xl border border-white/10 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          2. Common Settings
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Language</label>
            <select
              value={languageId}
              onChange={(e) => setLanguageId(e.target.value)}
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
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
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
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-[#f97316]"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
              className="accent-[#f97316]"
            />
            Trending
          </label>
        </div>
      </div>

      {/* Preview Table */}
      {parsedVideos.length > 0 && (
        <div className="bg-[#121216] rounded-xl border border-white/10 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            3. Preview & Edit Titles
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-zinc-500 border-b border-white/5">
                  <th className="p-3 font-medium w-10">#</th>
                  <th className="p-3 font-medium w-20">Thumbnail</th>
                  <th className="p-3 font-medium">YouTube ID</th>
                  <th className="p-3 font-medium">Title</th>
                  <th className="p-3 font-medium w-20">Status</th>
                  <th className="p-3 font-medium w-16"></th>
                </tr>
              </thead>
              <tbody>
                {parsedVideos.map((video, index) => (
                  <tr
                    key={index}
                    className={`border-b border-white/5 last:border-0 ${
                      !video.valid ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-3 text-sm text-zinc-500">{index + 1}</td>
                    <td className="p-3">
                      {video.valid ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={video.thumbnailUrl}
                          alt=""
                          className="w-16 h-9 rounded object-cover bg-zinc-800"
                        />
                      ) : (
                        <div className="w-16 h-9 rounded bg-zinc-800 flex items-center justify-center">
                          <span className="text-xs text-zinc-600">?</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <code className="text-xs text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                        {video.youtubeId}
                      </code>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={video.title}
                        onChange={(e) => updateTitle(index, e.target.value)}
                        disabled={!video.valid}
                        className="w-full px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#f97316] disabled:opacity-40"
                      />
                    </td>
                    <td className="p-3">
                      {video.valid ? (
                        <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                          Valid
                        </span>
                      ) : (
                        <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
                          Invalid
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-zinc-600 hover:text-red-400 transition-colors text-sm"
                        title="Remove"
                      >
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submit */}
      {validCount > 0 && (
        <button
          onClick={handleSubmit}
          disabled={submitting || validCount === 0}
          className="w-full py-3 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl font-medium transition-colors disabled:opacity-50 text-lg"
        >
          {submitting
            ? "Creating Videos..."
            : `Upload ${validCount} Video${validCount !== 1 ? "s" : ""}`}
        </button>
      )}
    </div>
  );
}
