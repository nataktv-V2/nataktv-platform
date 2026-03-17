import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function EmotionFeed() {
  const emotions = [
    {
      label: "Romance",
      img: "/thumbnails/ads/kalyanam-to-kadhal.jpg",
      color: "#E91E63",
      tint: "rgba(233,30,99,0.45)",
    },
    {
      label: "Comedy",
      img: "/thumbnails/ads/love-guru.jpg",
      color: "#FFC107",
      tint: "rgba(255,193,7,0.4)",
    },
    {
      label: "Thriller",
      img: "/thumbnails/ads/ghat-ghat-ka-paani.jpg",
      color: "#7B1FA2",
      tint: "rgba(123,31,162,0.45)",
    },
    {
      label: "Drama",
      img: "/thumbnails/ads/gaon-ki-biwi.jpg",
      color: "#FF6D00",
      tint: "rgba(255,109,0,0.4)",
    },
    {
      label: "Emotions",
      img: "/thumbnails/ads/love-shadi-dhokha.jpg",
      color: "#10b981",
      tint: "rgba(16,185,129,0.4)",
    },
    {
      label: "Mystery",
      img: "/thumbnails/ads/hey-leela.jpg",
      color: "#ef4444",
      tint: "rgba(239,68,68,0.45)",
    },
  ];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* 3x2 Thumbnail Grid — full bleed background */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
        }}
      >
        {emotions.map((e) => (
          <div key={e.label} className="relative overflow-hidden">
            {/* Show thumbnail */}
            <Image
              src={e.img}
              alt={e.label}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
            {/* Colored tint overlay */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: e.tint }}
            />
            {/* Dark vignette per cell */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)",
              }}
            />
            {/* Mood label */}
            <div className="absolute inset-0 flex items-end justify-center pb-4">
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#fff",
                  textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                  fontFamily: "var(--font-poppins), Inter, sans-serif",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {e.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dark center gradient for headline readability */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      />

      {/* Center content: Logo + Headline + CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-4">
          <NatakLogo size="lg" />
        </div>

        {/* Headline */}
        <h1
          className="text-center"
          style={{
            fontSize: 64,
            color: "#f4f4f5",
            fontFamily: "var(--font-poppins), Inter, sans-serif",
            fontWeight: 800,
            lineHeight: 1.1,
            textShadow: "0 4px 20px rgba(0,0,0,0.6)",
          }}
        >
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

        {/* CTA */}
        <button
          className="rounded-full font-bold mt-6"
          style={{
            fontSize: 28,
            padding: "16px 56px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            color: "#fff",
            textShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          Pick Your Mood
        </button>
      </div>
    </div>
  );
}
