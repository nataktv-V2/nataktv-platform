import { NatakLogo } from "@/components/ads/NatakLogo";

export default function DramaFeed() {
  const shows = [
    { title: "Gaon Ki Biwi", genre: "Drama", emotion: "😍", mood: "#E91E63" },
    { title: "Kalyanam to Kadhal", genre: "Romance", emotion: "💕", mood: "#FFC107" },
    { title: "Hey Leela", genre: "Romantic", emotion: "🔥", mood: "#FF6D00" },
    { title: "Love Out for Delivery", genre: "Rom-Com", emotion: "😂", mood: "#f97316" },
    { title: "Hurry Burry", genre: "Comedy", emotion: "🤣", mood: "#10b981" },
    { title: "Shikari Rikshawala", genre: "Thriller", emotion: "😱", mood: "#7B1FA2" },
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
      {/* Emotional glow - warm tones */}
      <div
        className="absolute top-0 right-0 rounded-full blur-[140px] opacity-20"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, #E91E63, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 rounded-full blur-[140px] opacity-15"
        style={{ width: 400, height: 400, background: "radial-gradient(circle, #FFC107, transparent)" }}
      />

      {/* Logo */}
      <div className="mb-6">
        <NatakLogo size="lg" />
      </div>

      {/* Headline with emotion */}
      <h1 className="text-center font-bold mb-2" style={{ fontSize: 52, color: "#f4f4f5" }}>
        Emotions jo{" "}
        <span
          style={{
            background: "linear-gradient(to right, #FFC107, #E91E63)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          dil chhu jaayein
        </span>
      </h1>

      <p className="text-center mb-8" style={{ fontSize: 24, color: "#a1a1aa" }}>
        Romance, comedy, crime, thriller — sab kuch yahan hai
      </p>

      {/* Show cards with emotions */}
      <div className="grid grid-cols-2 gap-4 mb-8" style={{ width: 800 }}>
        {shows.map((show) => (
          <div
            key={show.title}
            className="rounded-xl p-5 flex items-center gap-4"
            style={{
              background: `linear-gradient(135deg, ${show.mood}18, ${show.mood}08)`,
              border: `1px solid ${show.mood}30`,
            }}
          >
            <span style={{ fontSize: 48 }}>{show.emotion}</span>
            <div>
              <p className="font-semibold" style={{ fontSize: 22, color: "#f4f4f5" }}>
                {show.title}
              </p>
              <p style={{ fontSize: 16, color: show.mood }}>{show.genre}</p>
            </div>
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
        Abhi Dekho — ₹2 Trial
      </button>
    </div>
  );
}
