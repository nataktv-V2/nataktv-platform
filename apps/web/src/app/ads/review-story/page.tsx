import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function ReviewStory() {
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
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/thumbnails/ads/gaon-ki-biwi.jpg"
          alt="Gaon Ki Biwi"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>

      {/* Dark overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center h-full"
        style={{ padding: "48px 40px" }}
      >
        {/* Top row: Logo + Verified badge */}
        <div className="flex items-start justify-between w-full">
          <NatakLogo size="lg" />
          <span
            className="rounded-full font-semibold"
            style={{
              backgroundColor: "rgba(22,163,74,0.2)",
              border: "1px solid #16a34a",
              color: "#4ade80",
              fontSize: 22,
              padding: "8px 24px",
            }}
          >
            ✓ Verified Review
          </span>
        </div>

        {/* Spacer to push review card to middle */}
        <div style={{ flex: 1 }} />

        {/* Big review card */}
        <div
          className="rounded-3xl flex flex-col items-center"
          style={{
            width: 900,
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: 48,
            gap: 16,
          }}
        >
          {/* Avatar */}
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #FF6D00, #FFC107)",
            }}
          >
            <span style={{ fontSize: 36, color: "#fff", fontWeight: 700 }}>
              P
            </span>
          </div>

          {/* Name */}
          <span style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>
            Priya S.
          </span>

          {/* Stars */}
          <span style={{ fontSize: 28, color: "#FBBF24" }}>★★★★★</span>

          {/* Review text */}
          <p
            className="text-center"
            style={{
              fontSize: 36,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.5,
              marginTop: 8,
            }}
          >
            Raat ko ek episode shuru kiya... subah tak 10 dekh liye! Meri
            favourite app. Netflix bhool jao, yeh sab se best hai!
          </p>

          {/* Time */}
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.3)" }}>
            2 hours ago
          </span>
        </div>

        {/* Stats below card */}
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.5)",
            marginTop: 32,
          }}
        >
          4.8★ rating • 50,000+ downloads
        </p>

        {/* CTA */}
        <button
          className="rounded-2xl font-bold"
          style={{
            background: "linear-gradient(135deg, #FF6D00, #E91E63)",
            color: "#fff",
            fontSize: 40,
            padding: "26px 90px",
            marginTop: 28,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try Now — ₹2
        </button>

        {/* Swipe up hint */}
        <p
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.3)",
            marginTop: 24,
          }}
        >
          ↑ Swipe up
        </p>

        <div style={{ flex: 0.3 }} />
      </div>
    </div>
  );
}
