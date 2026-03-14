import { NatakLogo } from "@/components/ads/NatakLogo";

export default function ContentStory() {
  const languages = [
    { name: "Hindi", color: "#FFC107" },
    { name: "Tamil", color: "#E91E63" },
    { name: "Telugu", color: "#7B1FA2" },
    { name: "Kannada", color: "#FF6D00" },
    { name: "Bengali", color: "#f97316" },
  ];

  const categories = [
    "Short Films", "Web Series", "Drama",
    "Comedy", "Romance", "Thriller",
    "Family", "Action", "Originals",
  ];

  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Glow effects */}
      <div
        className="absolute top-0 left-0 rounded-full blur-[160px] opacity-15"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, #FFC107, transparent)" }}
      />
      <div
        className="absolute bottom-0 right-0 rounded-full blur-[160px] opacity-15"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, #7B1FA2, transparent)" }}
      />

      {/* Logo */}
      <div className="mb-14">
        <NatakLogo size="xl" />
      </div>

      {/* Headline */}
      <h1
        className="text-center font-bold mb-6"
        style={{ fontSize: 68, color: "#f4f4f5", padding: "0 60px" }}
      >
        Natak pasand hai?
        <br />
        <span
          style={{
            background: "linear-gradient(to right, #FFC107, #FF6D00, #E91E63)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Yahan sab milega
        </span>
      </h1>

      {/* Subtext */}
      <p
        className="text-center mb-10"
        style={{ fontSize: 32, color: "#a1a1aa", maxWidth: 800, padding: "0 40px" }}
      >
        Hindi, Tamil, Telugu — short films se web series tak
      </p>

      {/* Language badges */}
      <div className="flex flex-wrap justify-center gap-4 mb-10" style={{ maxWidth: 800 }}>
        {languages.map((lang) => (
          <span
            key={lang.name}
            className="rounded-full font-semibold"
            style={{
              fontSize: 26,
              padding: "10px 30px",
              backgroundColor: `${lang.color}20`,
              border: `1px solid ${lang.color}40`,
              color: lang.color,
            }}
          >
            {lang.name}
          </span>
        ))}
      </div>

      {/* Category grid */}
      <div
        className="grid grid-cols-3 gap-4 mb-12"
        style={{ width: 860 }}
      >
        {categories.map((cat, i) => (
          <div
            key={cat}
            className="rounded-xl flex items-end p-4"
            style={{
              height: 130,
              background: `linear-gradient(135deg, ${
                ["#FFC107","#FF6D00","#E91E63","#7B1FA2","#f97316","#10b981","#3b82f6","#ef4444","#8b5cf6"][i]
              }18, ${
                ["#FFC107","#FF6D00","#E91E63","#7B1FA2","#f97316","#10b981","#3b82f6","#ef4444","#8b5cf6"][i]
              }05)`,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ color: "#f4f4f5", fontSize: 22, fontWeight: 600 }}>
              {cat}
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
        Abhi Dekho
      </button>

      {/* Swipe hint */}
      <p
        className="absolute bottom-16 text-center"
        style={{ fontSize: 24, color: "#a1a1aa" }}
      >
        Swipe up to explore
      </p>
    </div>
  );
}
