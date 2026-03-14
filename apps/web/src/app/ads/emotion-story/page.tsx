import { NatakLogo } from "@/components/ads/NatakLogo";

export default function EmotionStory() {
  const moods = [
    {
      face: "😍",
      feeling: "Pyaar",
      show: "Hey Leela",
      desc: "Tamil romantic web series that will make your heart skip",
      color: "#E91E63",
    },
    {
      face: "🤣",
      feeling: "Hassi",
      show: "Hurry Burry",
      desc: "Malayalam rom-com — entertainment guaranteed",
      color: "#FFC107",
    },
    {
      face: "😱",
      feeling: "Darr",
      show: "Shikari Rikshawala",
      desc: "Crime thriller that will keep you on the edge",
      color: "#7B1FA2",
    },
    {
      face: "🔥",
      feeling: "Josh",
      show: "Gaon Ki Biwi",
      desc: "Hindi web series with bold storytelling",
      color: "#FF6D00",
    },
    {
      face: "🥹",
      feeling: "Dard",
      show: "Love Out for Delivery",
      desc: "A love story delivered with every episode",
      color: "#10b981",
    },
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
      {/* Glows */}
      <div
        className="absolute top-0 left-0 rounded-full blur-[160px] opacity-20"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, #E91E63, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-0 rounded-full blur-[140px] opacity-15"
        style={{ width: 400, height: 400, background: "radial-gradient(circle, #7B1FA2, transparent)" }}
      />

      {/* Logo */}
      <div className="mb-8">
        <NatakLogo size="xl" />
      </div>

      {/* Giant emotion */}
      <div className="mb-4" style={{ fontSize: 120 }}>🎭</div>

      {/* Headline */}
      <h1 className="text-center font-bold mb-3" style={{ fontSize: 60, color: "#f4f4f5", padding: "0 60px" }}>
        Aaj kaisa{" "}
        <span
          style={{
            background: "linear-gradient(to right, #FFC107, #E91E63, #7B1FA2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          feel hai?
        </span>
      </h1>

      <p className="text-center mb-10" style={{ fontSize: 28, color: "#a1a1aa", padding: "0 80px" }}>
        Har emotion ke liye ek show hai Natak TV pe
      </p>

      {/* Mood cards */}
      <div className="flex flex-col gap-5 mb-10" style={{ width: 900 }}>
        {moods.map((mood) => (
          <div
            key={mood.show}
            className="rounded-2xl p-6 flex items-start gap-5"
            style={{
              background: `linear-gradient(135deg, ${mood.color}12, ${mood.color}04)`,
              border: `1px solid ${mood.color}20`,
            }}
          >
            <div
              className="flex items-center justify-center rounded-2xl shrink-0"
              style={{
                width: 90,
                height: 90,
                fontSize: 52,
                backgroundColor: `${mood.color}15`,
                border: `2px solid ${mood.color}30`,
              }}
            >
              {mood.face}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-black" style={{ fontSize: 28, color: mood.color }}>
                  {mood.feeling}
                </span>
              </div>
              <p className="font-bold" style={{ fontSize: 24, color: "#f4f4f5" }}>
                {mood.show}
              </p>
              <p style={{ fontSize: 18, color: "#a1a1aa", marginTop: 4 }}>
                {mood.desc}
              </p>
            </div>
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
        Start Feeling — ₹2
      </button>

      {/* Swipe hint */}
      <p className="absolute bottom-16" style={{ fontSize: 24, color: "#a1a1aa" }}>
        Swipe up to watch now
      </p>
    </div>
  );
}
