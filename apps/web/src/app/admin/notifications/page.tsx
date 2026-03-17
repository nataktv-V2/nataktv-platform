"use client";

import { useState } from "react";

const TARGETS = [
  { value: "all", label: "All Users", desc: "Everyone with notifications enabled" },
  { value: "subscribers", label: "Subscribers", desc: "Active & trial subscribers" },
  { value: "trial", label: "Trial Users", desc: "Users currently on trial" },
];

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [target, setTarget] = useState("all");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required");
      return;
    }

    setSending(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          image: image.trim() || undefined,
          url: url.trim() || undefined,
          target,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send");
      } else {
        setResult(data);
        // Clear form on success
        setTitle("");
        setBody("");
        setImage("");
        setUrl("");
      }
    } catch {
      setError("Network error");
    }

    setSending(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Push Notifications</h1>

      <div className="space-y-5">
        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Target Audience</label>
          <div className="grid grid-cols-3 gap-2">
            {TARGETS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTarget(t.value)}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  target === t.value
                    ? "border-[#f97316] bg-[#f97316]/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <span className="block text-sm font-medium">{t.label}</span>
                <span className="block text-xs text-zinc-500 mt-0.5">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="🎬 New Drama Alert!"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#f97316]/50"
            maxLength={100}
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Message *</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Watch the latest episode of Dil Se now!"
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#f97316]/50 resize-none"
            maxLength={300}
          />
        </div>

        {/* Image URL (optional) */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Image URL <span className="text-zinc-600">(optional)</span>
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://img.youtube.com/vi/.../maxresdefault.jpg"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#f97316]/50"
          />
        </div>

        {/* Deep Link URL (optional) */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Open URL <span className="text-zinc-600">(optional)</span>
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/video/clxyz123"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#f97316]/50"
          />
          <p className="text-xs text-zinc-600 mt-1">Where to take the user when they tap the notification</p>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={sending || !title.trim() || !body.trim()}
          className="w-full bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
        >
          {sending ? "Sending..." : "Send Notification"}
        </button>

        {/* Result */}
        {result && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-green-400 font-medium">
              ✅ Sent to {result.sent} of {result.total} users
            </p>
            {result.failed > 0 && (
              <p className="text-yellow-400 text-sm mt-1">
                ⚠️ {result.failed} failed (tokens cleaned up)
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400">❌ {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
