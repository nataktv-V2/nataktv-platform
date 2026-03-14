import { NatakLogo } from "@/components/ads/NatakLogo";

export default function ContentLandscape() {
  const languages = [
    { name: "Hindi", color: "#FFC107" },
    { name: "Tamil", color: "#E91E63" },
    { name: "Telugu", color: "#7B1FA2" },
  ];

  const categories = ["Short Films", "Web Series", "Drama", "Comedy", "Romance", "Originals"];

  return (
    <div
      className="relative overflow-hidden flex items-center"
      style={{
        width: 1200,
        height: 628,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Glow */}
      <div
        className="absolute top-0 left-0 rounded-full blur-[100px] opacity-12"
        style={{ width: 300, height: 300, background: "radial-gradient(circle, #FFC107, transparent)" }}
      />

      {/* Left content */}
      <div className="flex flex-col pl-14" style={{ maxWidth: 580 }}>
        <div className="mb-4">
          <NatakLogo size="md" />
        </div>

        <h1 className="font-bold leading-tight mb-3" style={{ fontSize: 40, color: "#f4f4f5" }}>
          Natak pasand hai?{" "}
          <span
            style={{
              background: "linear-gradient(to right, #FFC107, #E91E63)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Yahan sab milega
          </span>
        </h1>

        <p className="mb-4" style={{ fontSize: 18, color: "#a1a1aa" }}>
          Hindi, Tamil, Telugu — short films se web series tak
        </p>

        {/* Language badges */}
        <div className="flex gap-2 mb-5">
          {languages.map((lang) => (
            <span
              key={lang.name}
              className="rounded-full font-semibold"
              style={{
                fontSize: 14,
                padding: "5px 16px",
                backgroundColor: `${lang.color}20`,
                border: `1px solid ${lang.color}40`,
                color: lang.color,
              }}
            >
              {lang.name}
            </span>
          ))}
        </div>

        <div>
          <button
            className="rounded-full font-bold"
            style={{
              fontSize: 18,
              padding: "12px 44px",
              backgroundColor: "#f97316",
              color: "#fff",
            }}
          >
            Abhi Dekho
          </button>
        </div>
      </div>

      {/* Right - category grid */}
      <div
        className="absolute right-10 top-1/2 -translate-y-1/2 grid grid-cols-2 gap-3"
        style={{ width: 440 }}
      >
        {categories.map((cat, i) => (
          <div
            key={cat}
            className="rounded-xl flex items-end p-3"
            style={{
              height: 85,
              background: `linear-gradient(135deg, ${
                ["#FFC107","#FF6D00","#E91E63","#7B1FA2","#f97316","#10b981"][i]
              }15, ${
                ["#FFC107","#FF6D00","#E91E63","#7B1FA2","#f97316","#10b981"][i]
              }05)`,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ color: "#f4f4f5", fontSize: 15, fontWeight: 600 }}>
              {cat}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
