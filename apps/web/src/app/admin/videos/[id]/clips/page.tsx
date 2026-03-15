"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Clip = {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  sortOrder: number;
};

type Video = {
  id: string;
  youtubeId: string;
  title: string;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ClipsPage() {
  const params = useParams();
  const videoId = params.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New clip form
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState(0);
  const [newEnd, setNewEnd] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/videos/${videoId}/clips`).then((r) => r.json()),
      fetch(`/api/videos?limit=50`).then((r) => r.json()),
    ]).then(([clipsData, videosData]) => {
      setClips(clipsData.clips || []);
      const v = (videosData.videos || []).find(
        (v: { id: string }) => v.id === videoId
      );
      if (v) setVideo(v);
      setLoading(false);
    });
  }, [videoId]);

  const addClip = async () => {
    if (newEnd <= newStart) return;
    setSaving(true);
    const res = await fetch(`/api/admin/videos/${videoId}/clips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle || `Part ${clips.length + 1}`,
        startTime: newStart,
        endTime: newEnd,
        sortOrder: clips.length,
      }),
    });
    if (res.ok) {
      const clip = await res.json();
      setClips([...clips, clip]);
      setNewTitle("");
      setNewStart(newEnd);
      setNewEnd(newEnd + 60);
    }
    setSaving(false);
  };

  const deleteClip = async (clipId: string) => {
    const res = await fetch(`/api/admin/videos/${videoId}/clips`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clipId }),
    });
    if (res.ok) {
      setClips(clips.filter((c) => c.id !== clipId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/videos"
            className="text-zinc-500 text-sm hover:text-zinc-300 mb-1 inline-block"
          >
            &larr; Back to videos
          </Link>
          <h1 className="text-xl font-bold text-white">
            Clips: {video?.title || "Video"}
          </h1>
        </div>
      </div>

      {/* YouTube Preview */}
      {video?.youtubeId && (
        <div className="mb-6 rounded-lg overflow-hidden border border-white/10">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?controls=1`}
            className="w-full aspect-video"
            allow="encrypted-media"
          />
        </div>
      )}

      {/* Existing Clips */}
      <div className="space-y-2 mb-6">
        <h2 className="text-sm font-medium text-zinc-400 mb-2">
          {clips.length} clip{clips.length !== 1 ? "s" : ""}
        </h2>
        {clips.map((clip, i) => (
          <div
            key={clip.id}
            className="flex items-center justify-between bg-[#1a1a20] border border-white/10 rounded-lg px-4 py-3"
          >
            <div>
              <span className="text-white text-sm font-medium">
                {clip.title || `Part ${i + 1}`}
              </span>
              <span className="text-zinc-500 text-xs ml-3">
                {formatTime(clip.startTime)} — {formatTime(clip.endTime)}
              </span>
            </div>
            <button
              onClick={() => deleteClip(clip.id)}
              className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add New Clip */}
      <div className="bg-[#1a1a20] border border-white/10 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-zinc-300">Add Clip</h3>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={`Part ${clips.length + 1}`}
          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">
              Start (seconds)
            </label>
            <input
              type="number"
              value={newStart}
              onChange={(e) => setNewStart(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">
              End (seconds)
            </label>
            <input
              type="number"
              value={newEnd}
              onChange={(e) => setNewEnd(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#f97316]"
            />
          </div>
        </div>
        <button
          onClick={addClip}
          disabled={saving || newEnd <= newStart}
          className="w-full py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add Clip"}
        </button>
      </div>
    </div>
  );
}
