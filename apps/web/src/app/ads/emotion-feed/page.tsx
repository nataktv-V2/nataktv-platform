import { NatakLogo } from "@/components/ads/NatakLogo";

export default function EmotionFeed() {
  const emotions = [
    { face: "😍", label: "Romance", show: "Kalyanam to Kadhal", color: "#E91E63" },
    { face: "😂", label: "Comedy", show: "Hurry Burry", color: "#FFC107" },
    { face: "😱", label: "Suspense", show: "LSD - Love Shadi Dhokha", color: "#7B1FA2" },
    { face: "🔥", label: "Drama", show: "Gaon Ki Biwi", color: "#FF6D00" },
    { face: "🥹", label: "Emotions", show: "Sweet & Salt", color: "#10b981" },
    { face: "🤯", label: "Mystery", show: "Dohra", color: "#ef4444" },
  ];

  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Multi-glow background */}
      <div
        className="absolute top-1/4 left-1/4 rounded-full blur-[120px] opacity-15"
        style={{ width: 400, height: 400, background: "radial-gradient(circle, #E91E63, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 rounded-full blur-[120px] opacity-15"
        style={{ width: 400, height: 400, background: "radial-gradient(circle, #FFC107, transparent)" }}
      />

      {/* Logo */}
      <div className="mb-6">
        <NatakLogo size="lg" />
      </div>

      {/* Big emotion faces */}
      <div className="flex gap-2 mb-6">
        {emotions.map((e, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{
              width: 100,
              height: 100,
              fontSize: 64,
              borderRadius: 24,
              backgroundColor: `${e.color}12`,
              border: `2px solid ${e.color}30`,
            }}
          >
            {e.face}
          </div>
        ))}
      </div>

      {/* Headline */}
      <h1 className="text-center font-bold mb-3" style={{ fontSize: 56, color: "#f4f4f5" }}>
        Kya feel karoge{" "}
        <span
          style={{
            background: "linear-gradient(to right, #FFC107, #E91E63)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          aaj?
        </span>
      </h1>

      <p className="text-center mb-8" style={{ fontSize: 26, color: "#a1a1aa", maxWidth: 700 }}>
        Har mood ke liye ek show — choose your emotion
      </p>

      {/* Emotion → Show mapping */}
      <div className="grid grid-cols-3 gap-3 mb-8" style={{ width: 780 }}>
        {emotions.map((e) => (
          <div
            key={e.label}
            className="rounded-xl p-4 text-center"
            style={{
              background: `linear-gradient(135deg, ${e.color}15, ${e.color}05)`,
              border: `1px solid ${e.color}20`,
            }}
          >
            <span style={{ fontSize: 36 }}>{e.face}</span>
            <p className="font-semibold mt-2" style={{ fontSize: 18, color: e.color }}>
              {e.label}
            </p>
            <p style={{ fontSize: 14, color: "#a1a1aa", marginTop: 4 }}>
              {e.show}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="rounded-full font-bold"
        style={{
          fontSize: 28,
          padding: "16px 56px",
          backgroundColor: "#f97316",
          color: "#fff",
        }}
      >
        Pick Your Mood
      </button>
    </div>
  );
}
