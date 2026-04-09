import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function FomoStory() {
  const shows = [
    { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
    { img: "/thumbnails/ads/ghat-ghat-ka-paani.jpg", title: "Ghat Ghat Ka Paani" },
    { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
  ];

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
      {/* Full background image */}
      <div className="absolute inset-0">
        <Image
          src="/thumbnails/ads/hey-leela.jpg"
          alt="Hey Leela"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>

      {/* Dark gradient bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0.6) 30%, rgba(10,10,12,0.92) 55%, rgba(10,10,12,0.98) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center h-full"
        style={{ padding: "48px 60px 80px" }}
      >
        {/* Top row: Logo + HURRY badge */}
        <div className="flex items-start justify-between w-full">
          <NatakLogo size="lg" />
          <span
            className="rounded-full font-bold uppercase tracking-wide animate-pulse"
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              fontSize: 24,
              padding: "8px 24px",
            }}
          >
            HURRY!
          </span>
        </div>

        {/* Spacer to push content to middle-bottom area */}
        <div style={{ flex: 1 }} />

        {/* Big offer text */}
        <div className="flex flex-col items-center" style={{ marginBottom: 48 }}>
          <span
            className="font-black"
            style={{
              fontSize: 160,
              color: "#f97316",
              lineHeight: 1,
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
            }}
          >
            ₹2 OFFER
          </span>
          <span
            style={{
              fontSize: 40,
              color: "rgba(255, 255, 255, 0.6)",
              marginTop: 12,
            }}
          >
            ends tonight
          </span>
        </div>

        {/* 3 show thumbnails row */}
        <div
          className="flex items-center justify-center gap-5"
          style={{ marginBottom: 32 }}
        >
          {shows.map((show) => (
            <div
              key={show.title}
              className="relative overflow-hidden rounded-xl"
              style={{ width: 280, height: 160 }}
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

        {/* Shows count */}
        <span
          style={{
            fontSize: 30,
            color: "rgba(255, 255, 255, 0.7)",
            marginBottom: 56,
          }}
        >
          100+ shows unlocked
        </span>

        {/* CTA Button */}
        <button
          className="rounded-2xl font-bold"
          style={{
            fontSize: 42,
            padding: "28px 100px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff",
            border: "none",
          }}
        >
          Start Free Trial — ₹2
        </button>

        {/* Swipe up hint */}
        <div
          className="flex flex-col items-center"
          style={{ marginTop: 40 }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <span
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: 4,
            }}
          >
            Swipe up
          </span>
        </div>
      </div>
    </div>
  );
}
