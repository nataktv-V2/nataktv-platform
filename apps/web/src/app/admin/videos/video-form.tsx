"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";

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
  reelStart: number;
  creditStart: number | null;
};

// YT types are declared in VideoPlayer.tsx — we just reference window.YT here
type HiddenYTPlayer = {
  getDuration: () => number;
  destroy: () => void;
};

// Convert seconds to mm:ss or h:mm:ss display
function secondsToTime(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "0:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Parse time string (mm:ss, h:mm:ss, or raw seconds) to total seconds
function timeToSeconds(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return 0;
  // If it's just a number, treat as seconds
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed);
  // Split by colon
  const parts = trimmed.split(":").map((p) => parseInt(p) || 0);
  if (parts.length === 3) return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0); // h:mm:ss
  if (parts.length === 2) return (parts[0] ?? 0) * 60 + (parts[1] ?? 0); // mm:ss
  return 0;
}

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
  const [autoFilling, setAutoFilling] = useState(false);
  const [autoFillStatus, setAutoFillStatus] = useState("");
  const [generatingThumb, setGeneratingThumb] = useState(false);
  const [thumbResult, setThumbResult] = useState<string | null>(null);
  const [youtubeInput, setYoutubeInput] = useState(
    initialData?.youtubeId || ""
  );
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    thumbnailUrl: initialData?.thumbnailUrl || "",
    duration: initialData?.duration || 0,
    reelStart: initialData?.reelStart || 0,
    creditStart: initialData?.creditStart ?? null,
    languageId: initialData?.languageId || languages[0]?.id || "",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    isFeatured: initialData?.isFeatured || false,
    isTrending: initialData?.isTrending || false,
  });
  const hiddenPlayerRef = useRef<HTMLDivElement>(null);

  const youtubeId = extractYouTubeId(youtubeInput);
  const previewUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : "";

  // Load YouTube IFrame API script
  const ensureYTAPI = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }
      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existing) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
    });
  }, []);

  // Get video duration via hidden YouTube player
  const getYouTubeDuration = useCallback(async (vid: string): Promise<number> => {
    await ensureYTAPI();
    return new Promise((resolve) => {
      if (!hiddenPlayerRef.current) { resolve(0); return; }
      // Clear previous content
      hiddenPlayerRef.current.innerHTML = "";
      const el = document.createElement("div");
      hiddenPlayerRef.current.appendChild(el);

      const timeout = setTimeout(() => { resolve(0); }, 15000); // 15s timeout

      const player = new window.YT.Player(el, {
        videoId: vid,
        playerVars: { controls: 0, autoplay: 0, mute: 1 },
        events: {
          onReady: () => {
            const p = player as unknown as HiddenYTPlayer;
            // Duration might need a moment to be available
            const checkDuration = () => {
              const dur = p.getDuration();
              if (dur > 0) {
                clearTimeout(timeout);
                p.destroy();
                resolve(Math.floor(dur));
              } else {
                setTimeout(checkDuration, 500);
              }
            };
            setTimeout(checkDuration, 1000);
          },
        },
      } as Record<string, unknown>);
    });
  }, [ensureYTAPI]);

  // Calculate smart creditStart based on duration
  const calculateCreditStart = (duration: number): number | null => {
    if (duration <= 0) return null;
    // Short videos (<5 min): credits ~15s
    if (duration < 300) return Math.max(0, duration - 15);
    // Medium videos (5-30 min): credits ~30-45s
    if (duration < 1800) return Math.max(0, duration - 40);
    // Long videos (30+ min): credits ~60-90s
    return Math.max(0, duration - 75);
  };

  const handleAutoFill = async () => {
    if (!youtubeId) return;
    setAutoFilling(true);
    setAutoFillStatus("Fetching video info...");

    // Auto-fill thumbnail
    setForm((f) => ({
      ...f,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    }));

    // Fetch title via oEmbed
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${youtubeId}&format=json`
      );
      if (res.ok) {
        const data = await res.json();
        setForm((f) => ({ ...f, title: data.title || f.title }));
      }
    } catch {
      // oEmbed failed
    }

    // Get duration via YouTube player
    setAutoFillStatus("Detecting duration (loading player)...");
    try {
      const dur = await getYouTubeDuration(youtubeId);
      if (dur > 0) {
        const credit = calculateCreditStart(dur);
        setForm((f) => ({
          ...f,
          duration: dur,
          reelStart: 0,
          creditStart: credit,
        }));
        const mins = Math.floor(dur / 60);
        const secs = dur % 60;
        setAutoFillStatus(
          `✅ Duration: ${mins}m ${secs}s | Credits skip at ${credit ? `${Math.floor(credit / 60)}m ${credit % 60}s` : "none"}`
        );
      } else {
        setAutoFillStatus("⚠️ Could not detect duration — fill manually");
      }
    } catch {
      setAutoFillStatus("⚠️ Duration detection failed — fill manually");
    }
    setAutoFilling(false);
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
      {/* Hidden YouTube player for duration detection */}
      <div ref={hiddenPlayerRef} className="absolute -left-[9999px] w-1 h-1 overflow-hidden" />

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
            disabled={autoFilling}
            className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {autoFilling ? "Detecting..." : "Auto-fill"}
          </button>
        </div>
        {youtubeId && (
          <p className="text-xs text-zinc-500 mt-1">ID: {youtubeId}</p>
        )}
        {autoFillStatus && (
          <p className={`text-xs mt-1 ${autoFillStatus.startsWith("✅") ? "text-green-400" : autoFillStatus.startsWith("⚠️") ? "text-yellow-400" : "text-zinc-400"}`}>
            {autoFillStatus}
          </p>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="rounded-lg overflow-hidden border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Generate Branded Thumbnail */}
      {initialData?.id && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={generatingThumb}
            onClick={async () => {
              setGeneratingThumb(true);
              setThumbResult(null);
              try {
                const res = await fetch(
                  `/api/admin/videos/${initialData.id}/generate-thumbnail`,
                  { method: "POST" }
                );
                const data = await res.json();
                if (res.ok) {
                  setThumbResult(data.generatedThumbnailUrl);
                } else {
                  setThumbResult("Error: " + (data.error || "Failed"));
                }
              } catch {
                setThumbResult("Error: Network failure");
              } finally {
                setGeneratingThumb(false);
              }
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {generatingThumb ? "Generating..." : "Generate 9:16 Thumbnail"}
          </button>
          {thumbResult && !thumbResult.startsWith("Error") && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbResult}
              alt="Generated"
              className="h-20 rounded border border-white/10"
            />
          )}
          {thumbResult?.startsWith("Error") && (
            <span className="text-red-400 text-xs">{thumbResult}</span>
          )}
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
          Duration <span className="text-zinc-600">— auto-detected</span>
        </label>
        <input
          type="text"
          value={secondsToTime(form.duration)}
          onChange={(e) =>
            setForm({ ...form, duration: timeToSeconds(e.target.value) })
          }
          placeholder="16:44 or 1:23:45"
          className="w-full px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
        />
        <p className="text-xs text-zinc-600 mt-1">Format: mm:ss or h:mm:ss ({form.duration}s)</p>
      </div>

      {/* Reel Start & Credit Start */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Reel Start <span className="text-zinc-600">— auto: 0:00</span>
          </label>
          <input
            type="text"
            value={secondsToTime(form.reelStart)}
            onChange={(e) =>
              setForm({ ...form, reelStart: timeToSeconds(e.target.value) })
            }
            placeholder="0:00"
            className="w-full px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
          />
          <p className="text-xs text-zinc-600 mt-1">Where reels start ({form.reelStart}s)</p>
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Credits Start <span className="text-zinc-600">— auto-detected</span>
          </label>
          <input
            type="text"
            value={form.creditStart != null ? secondsToTime(form.creditStart) : ""}
            onChange={(e) =>
              setForm({
                ...form,
                creditStart: e.target.value.trim() ? timeToSeconds(e.target.value) : null,
              })
            }
            placeholder="Leave empty if none"
            className="w-full px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
          />
          <p className="text-xs text-zinc-600 mt-1">Auto-stop before credits {form.creditStart != null ? `(${form.creditStart}s)` : ""}</p>
        </div>
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
