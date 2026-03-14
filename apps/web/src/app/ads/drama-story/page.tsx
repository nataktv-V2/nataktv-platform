import { NatakLogo } from "@/components/ads/NatakLogo";

export default function DramaStory() {
  const shows = [
    { title: "Gaon Ki Biwi", genre: "Drama", emotion: "😍", mood: "#E91E63", tagline: "Gaon ki kahani, dil ki zubaani" },
    { title: "Kalyanam to Kadhal", genre: "Tamil Romance", emotion: "💕", mood: "#FFC107", tagline: "Shaadi se mohabbat tak" },
    { title: "Hey Leela", genre: "Romantic Series", emotion: "🔥", mood: "#FF6D00", tagline: "Pyaar ka naya andaaz" },
    { title: "Love Out for Delivery", genre: "Rom-Com", emotion: "😂", mood: "#f97316", tagline: "Pyaar ki delivery, har roz" },
    { title: "Shikari Rikshawala", genre: "Crime Thriller", emotion: "😱", mood: "#7B1FA2", tagline: "Sawari nahi, shikaar" },
    { title: "Sweet & Salt", genre: "Drama", emotion: "🥹", mood: "#10b981", tagline: "Rishton ka asli swaad" },
    { title: "Hurry Burry", genre: "Comedy", emotion: "🤣", mood: "#3b82f6", tagline: "Hassi rok nahi paoge" },
    { title: "Dohra", genre: "Mystery", emotion: "🤯", mood: "#ef4444", tagline: "Sach ya dhoka?" },
  ];

  return (
    <div
      className="relative overflow-hidden flex flex-col items-center"
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
        paddingTop: 80,
      }}
    >
      {/* Glow effects */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 rounded-full blur-[160px] opacity-20"
        style={{ width: 600, height: 600, background: "radial-gradient(circle, #E91E63, transparent)" }}
      />
      <div
        className="absolute bottom-0 right-0 rounded-full blur-[140px] opacity-15"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, #FFC107, transparent)" }}
      />

      {/* Logo */}
      <div className="mb-10">
        <NatakLogo size="xl" />
      </div>

      {/* Expressive faces row */}
      <div className="flex gap-3 mb-6">
        {["😍", "😂", "😱", "🔥", "🥹", "🤯"].map((e, i) => (
          <div
            key={i}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 80,
              height: 80,
              fontSize: 48,
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {e}
          </div>
        ))}
      </div>

      {/* Headline */}
      <h1 className="text-center font-bold mb-3" style={{ fontSize: 64, color: "#f4f4f5", padding: "0 60px" }}>
        Har emotion,{" "}
        <span
          style={{
            background: "linear-gradient(to right, #FFC107, #FF6D00, #E91E63)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ek app mein
        </span>
      </h1>

      <p className="text-center mb-10" style={{ fontSize: 30, color: "#a1a1aa", padding: "0 80px" }}>
        Romance se thriller tak — real shows, real emotions
      </p>

      {/* Show list with emotions */}
      <div className="flex flex-col gap-4 mb-10" style={{ width: 900 }}>
        {shows.map((show) => (
          <div
            key={show.title}
            className="rounded-2xl p-5 flex items-center gap-5"
            style={{
              background: `linear-gradient(135deg, ${show.mood}15, ${show.mood}05)`,
              border: `1px solid ${show.mood}25`,
            }}
          >
            <span style={{ fontSize: 52 }}>{show.emotion}</span>
            <div className="flex-1">
              <p className="font-bold" style={{ fontSize: 26, color: "#f4f4f5" }}>
                {show.title}
              </p>
              <p style={{ fontSize: 18, color: "#a1a1aa" }}>{show.tagline}</p>
            </div>
            <span
              className="rounded-full font-medium"
              style={{
                fontSize: 16,
                padding: "6px 16px",
                backgroundColor: `${show.mood}20`,
                color: show.mood,
              }}
            >
              {show.genre}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="rounded-full font-bold"
        style={{
          fontSize: 34,
          padding: "22px 72px",
          backgroundColor: "#f97316",
          color: "#fff",
        }}
      >
        Abhi Dekho — ₹2 Trial
      </button>

      {/* Swipe hint */}
      <p
        className="absolute bottom-16 text-center"
        style={{ fontSize: 24, color: "#a1a1aa" }}
      >
        Swipe up to start watching
      </p>
    </div>
  );
}
