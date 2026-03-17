import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function EmotionStory() {
  const moods = [
    {
      feeling: "Pyaar",
      img: "/thumbnails/ads/hey-leela.jpg",
      color: "#E91E63",
      tint: "rgba(233,30,99,0.45)",
    },
    {
      feeling: "Hassi",
      img: "/thumbnails/ads/love-guru.jpg",
      color: "#FFC107",
      tint: "rgba(255,193,7,0.4)",
    },
    {
      feeling: "Darr",
      img: "/thumbnails/ads/ghat-ghat-ka-paani.jpg",
      color: "#7B1FA2",
      tint: "rgba(123,31,162,0.45)",
    },
    {
      feeling: "Josh",
      img: "/thumbnails/ads/gaon-ki-biwi.jpg",
      color: "#FF6D00",
      tint: "rgba(255,109,0,0.4)",
    },
    {
      feeling: "Dard",
      img: "/thumbnails/ads/love-shadi-dhokha.jpg",
      color: "#10b981",
      tint: "rgba(16,185,129,0.4)",
    },
  ];

  const stripWidth = 1080 / 5; // 216px each

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* 5 vertical thumbnail strips — full bleed */}
      <div className="absolute inset-0 flex">
        {moods.map((mood) => (
          <div
            key={mood.feeling}
            className="relative"
            style={{ width: stripWidth, height: "100%" }}
          >
            {/* Show thumbnail */}
            <Image
              src={mood.img}
              alt={mood.feeling}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
            {/* Colored tint overlay */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: mood.tint }}
            />
            {/* Subtle dark overlay for depth */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.3) 100%)",
              }}
            />
            {/* Mood label at bottom of each strip */}
            <div
              className="absolute bottom-32 left-0 right-0 flex justify-center"
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#fff",
                  textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                  fontFamily: "var(--font-poppins), Inter, sans-serif",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                }}
              >
                {mood.feeling}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dark center band gradient for headline readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 18%, transparent 35%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.85) 55%, transparent 65%, transparent 82%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Top: Logo */}
      <div className="absolute top-16 left-0 right-0 flex justify-center">
        <NatakLogo size="xl" />
      </div>

      {/* Center content: Headline */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1
          className="text-center"
          style={{
            fontSize: 72,
            color: "#f4f4f5",
            fontFamily: "var(--font-poppins), Inter, sans-serif",
            fontWeight: 800,
            lineHeight: 1.15,
            textShadow: "0 4px 24px rgba(0,0,0,0.7)",
            padding: "0 60px",
          }}
        >
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

        {/* CTA */}
        <button
          className="rounded-full font-bold mt-8"
          style={{
            fontSize: 34,
            padding: "22px 72px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            color: "#fff",
            textShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          Pick Your Mood
        </button>
      </div>

      {/* Swipe up hint */}
      <p
        className="absolute bottom-12 left-0 right-0 text-center"
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.7)",
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          letterSpacing: 1,
        }}
      >
        ↑ Swipe up to watch now
      </p>
    </div>
  );
}
