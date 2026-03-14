import { NatakLogo } from "@/components/ads/NatakLogo";

export default function ContentFeed() {
  const languages = [
    { name: "Hindi", color: "#FFC107" },
    { name: "Tamil", color: "#E91E63" },
    { name: "Telugu", color: "#7B1FA2" },
    { name: "Kannada", color: "#FF6D00" },
    { name: "Bengali", color: "#f97316" },
  ];

  const categories = ["Short Films", "Web Series", "Drama", "Comedy", "Romance", "Thriller"];

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
      {/* Multi-color glow */}
      <div
        className="absolute top-0 left-0 rounded-full blur-[120px] opacity-15"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, #FFC107, transparent)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 rounded-full blur-[120px] opacity-15"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, #7B1FA2, transparent)",
        }}
      />

      {/* Logo */}
      <div className="mb-8">
        <NatakLogo size="lg" />
      </div>

      {/* Headline */}
      <h1
        className="text-center font-bold mb-4"
        style={{ fontSize: 56, color: "#f4f4f5" }}
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
        className="text-center mb-8"
        style={{ fontSize: 26, color: "#a1a1aa", maxWidth: 700 }}
      >
        Hindi, Tamil, Telugu — short films se web series tak
      </p>

      {/* Language badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {languages.map((lang) => (
          <span
            key={lang.name}
            className="rounded-full font-semibold"
            style={{
              fontSize: 22,
              padding: "8px 24px",
              backgroundColor: `${lang.color}20`,
              border: `1px solid ${lang.color}40`,
              color: lang.color,
            }}
          >
            {lang.name}
          </span>
        ))}
      </div>

      {/* Video thumbnail grid */}
      <div
        className="grid grid-cols-3 gap-3 mb-8"
        style={{ width: 700 }}
      >
        {categories.map((cat, i) => (
          <div
            key={cat}
            className="rounded-xl flex items-end p-3"
            style={{
              height: 120,
              background: `linear-gradient(135deg, ${
                ["#FFC107", "#FF6D00", "#E91E63", "#7B1FA2", "#f97316", "#10b981"][i]
              }15, ${
                ["#FFC107", "#FF6D00", "#E91E63", "#7B1FA2", "#f97316", "#10b981"][i]
              }05)`,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ color: "#f4f4f5", fontSize: 18, fontWeight: 600 }}>
              {cat}
            </span>
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
        Abhi Dekho
      </button>
    </div>
  );
}
