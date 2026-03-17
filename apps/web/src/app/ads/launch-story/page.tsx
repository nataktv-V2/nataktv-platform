import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function LaunchStory() {
  const heroShowImg = "/thumbnails/ads/love-shadi-dhokha.jpg";

  const thumbnailStrip = [
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
        backgroundColor: "#0a0a0c",
      }}
    >
      {/* Full-bleed hero background */}
      <div className="absolute inset-0">
        <Image
          src={heroShowImg}
          alt="Love Shadi Dhokha"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>

      {/* Heavy bottom gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.92) 75%, rgba(0,0,0,0.98) 100%)",
        }}
      />

      {/* Content layer */}
      <div
        className="relative flex flex-col"
        style={{ width: 1080, height: 1920 }}
      >
        {/* Logo - top left */}
        <div style={{ padding: "48px 0 0 48px" }}>
          <NatakLogo size="xl" />
        </div>

        {/* Spacer to push content to bottom */}
        <div className="flex-1" />

        {/* Bottom content block */}
        <div
          className="flex flex-col items-center"
          style={{ paddingBottom: 60 }}
        >
          {/* Headline */}
          <h1
            className="text-center leading-tight"
            style={{
              fontSize: 86,
              color: "#ffffff",
              fontFamily: "var(--font-poppins), Inter, sans-serif",
              fontWeight: 800,
              marginBottom: 48,
              padding: "0 60px",
              textShadow: "0 4px 30px rgba(0,0,0,0.7)",
            }}
          >
            Indian Drama.
            <br />
            <span
              style={{
                background: "linear-gradient(to right, #FF6D00, #E91E63)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              One Subscription.
            </span>
          </h1>

          {/* Show thumbnail strip */}
          <div
            className="flex justify-center"
            style={{
              gap: 16,
              marginBottom: 48,
              padding: "0 48px",
            }}
          >
            {thumbnailStrip.map((show) => (
              <div
                key={show.title}
                className="relative overflow-hidden"
                style={{
                  width: 220,
                  height: 124,
                  borderRadius: 12,
                  border: "2px solid rgba(255,255,255,0.15)",
                  flexShrink: 0,
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
            ))}
          </div>

          {/* CTA button */}
          <button
            className="rounded-full font-bold"
            style={{
              fontSize: 36,
              padding: "24px 80px",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
              color: "#fff",
              border: "none",
              letterSpacing: "0.5px",
              marginBottom: 36,
            }}
          >
            Explore Free for ₹2
          </button>

          {/* Swipe up hint */}
          <div className="flex flex-col items-center" style={{ gap: 8 }}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a1a1aa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <p style={{ fontSize: 24, color: "#a1a1aa", margin: 0 }}>
              Swipe up to explore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
