import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function UgcBrowse() {
  const popularShows = [
    "gaon-ki-biwi",
    "hey-leela",
    "ghat-ghat-ka-paani",
    "love-guru",
  ];
  const newReleases = [
    "kalyanam-to-kadhal",
    "love-shadi-dhokha",
    "hurry-burry",
    "gaon-ki-biwi",
  ];

  const showLabel = (slug: string) =>
    slug
      .split("-")
      .map((w) => (w[0]?.toUpperCase() ?? "") + w.slice(1))
      .join(" ");

  return (
    <div
      className="relative overflow-hidden flex flex-col items-center"
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Headline above phone */}
      <h1
        className="text-center"
        style={{
          fontFamily: "var(--font-poppins), Poppins, sans-serif",
          fontWeight: 800,
          fontSize: 48,
          color: "#fff",
          marginTop: 80,
          marginBottom: 40,
        }}
      >
        Yeh app viral ho rahi hai!
      </h1>

      {/* Phone mockup */}
      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          width: 380,
          height: 780,
          borderRadius: 40,
          border: "4px solid rgba(255,255,255,0.2)",
          backgroundColor: "#111",
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "8px 24px",
            backgroundColor: "#000",
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <span style={{ fontWeight: 600 }}>9:41</span>
          <div className="flex items-center" style={{ gap: 6 }}>
            <span>●●●●</span>
            <span>WiFi</span>
            <span>🔋</span>
          </div>
        </div>

        {/* App header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: "12px 16px" }}
        >
          <span style={{ fontSize: 24, color: "#FF6D00", fontWeight: 700 }}>
            Natak TV
          </span>
          <div className="flex" style={{ gap: 16 }}>
            <span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>
              🔍
            </span>
            <span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>
              👤
            </span>
          </div>
        </div>

        {/* Featured banner */}
        <div
          className="relative overflow-hidden"
          style={{
            margin: "0 12px",
            height: 180,
            borderRadius: 12,
          }}
        >
          <Image
            src="/thumbnails/ads/gaon-ki-biwi.jpg"
            alt="Gaon Ki Biwi"
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
          <span
            className="absolute font-bold"
            style={{
              top: 10,
              left: 10,
              backgroundColor: "#E91E63",
              color: "#fff",
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 6,
            }}
          >
            Trending Now
          </span>
        </div>

        {/* Popular Shows */}
        <div style={{ padding: "14px 16px 6px" }}>
          <span style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>
            Popular Shows
          </span>
        </div>
        <div
          className="flex"
          style={{ padding: "0 12px", gap: 8, overflow: "hidden" }}
        >
          {popularShows.map((slug, i) => (
            <div
              key={i}
              className="relative overflow-hidden flex-shrink-0"
              style={{ width: 100, height: 140, borderRadius: 8 }}
            >
              <Image
                src={`/thumbnails/ads/${slug}.jpg`}
                alt={showLabel(slug)}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* New Releases */}
        <div style={{ padding: "14px 16px 6px" }}>
          <span style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>
            New Releases
          </span>
        </div>
        <div
          className="flex"
          style={{ padding: "0 12px", gap: 8, overflow: "hidden" }}
        >
          {newReleases.map((slug, i) => (
            <div
              key={i}
              className="relative overflow-hidden flex-shrink-0"
              style={{ width: 100, height: 140, borderRadius: 8 }}
            >
              <Image
                src={`/thumbnails/ads/${slug}.jpg`}
                alt={showLabel(slug)}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div style={{ flex: 1 }} />
        <div
          className="flex items-center justify-around"
          style={{
            padding: "12px 0",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span style={{ fontSize: 14, color: "#FF6D00", fontWeight: 600 }}>
            Home
          </span>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            Search
          </span>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            Downloads
          </span>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            Profile
          </span>
        </div>
      </div>

      {/* Finger cursor at bottom of phone */}
      <div
        style={{
          fontSize: 40,
          marginTop: -30,
          position: "relative",
          zIndex: 10,
        }}
      >
        👆
      </div>

      {/* CTA below phone */}
      <button
        className="rounded-2xl font-bold"
        style={{
          background: "linear-gradient(135deg, #FF6D00, #E91E63)",
          color: "#fff",
          fontSize: 36,
          padding: "22px 80px",
          marginTop: 32,
          border: "none",
          cursor: "pointer",
        }}
      >
        Download — ₹2
      </button>
    </div>
  );
}
