import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function DramaStory() {
  const thumbnailShows = [
    { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
    { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
    { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
    { img: "/thumbnails/ads/love-guru.jpg", title: "Love Guru" },
  ];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1080,
        height: 1920,
        fontFamily: "var(--font-poppins), Inter, sans-serif",
      }}
    >
      {/* Full-bleed background — Ghat Ghat Ka Paani */}
      <Image
        src="/thumbnails/ads/ghat-ghat-ka-paani.jpg"
        alt="Ghat Ghat Ka Paani"
        fill
        style={{ objectFit: "cover" }}
        unoptimized
      />

      {/* Heavy bottom gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.88) 72%, #000 88%)",
        }}
      />

      {/* Content layer */}
      <div className="absolute inset-0 flex flex-col" style={{ padding: "60px 48px" }}>
        {/* Top: Logo */}
        <div>
          <NatakLogo size="xl" />
        </div>

        {/* Spacer to push content to center-bottom */}
        <div className="flex-1" />

        {/* Center: Headline */}
        <h1
          className="text-center"
          style={{
            fontSize: 72,
            color: "#fff",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 60,
            textShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}
        >
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

        {/* 4 show thumbnails with titles */}
        <div className="flex justify-center" style={{ gap: 24, marginBottom: 48 }}>
          {thumbnailShows.map((show) => (
            <div key={show.title} className="flex flex-col items-center" style={{ gap: 10 }}>
              <div
                className="relative overflow-hidden rounded-xl"
                style={{
                  width: 220,
                  height: 124,
                  border: "2px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src={show.img}
                  alt={show.title}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <p
                className="font-semibold text-center"
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.85)",
                  maxWidth: 220,
                }}
              >
                {show.title}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center" style={{ marginBottom: 48 }}>
          <button
            className="rounded-full font-bold"
            style={{
              fontSize: 36,
              padding: "22px 72px",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
              color: "#fff",
              letterSpacing: "0.5px",
            }}
          >
            Binge Now — ₹2 Only
          </button>
        </div>

        {/* Swipe up hint */}
        <div className="flex flex-col items-center" style={{ gap: 8, marginBottom: 20 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
            <path d="M12 4l-6 6h4v8h4v-8h4l-6-6z" fill="#fff" />
          </svg>
          <p style={{ fontSize: 22, color: "rgba(255,255,255,0.45)", letterSpacing: "2px", textTransform: "uppercase" as const }}>
            Swipe up to start watching
          </p>
        </div>
      </div>
    </div>
  );
}
