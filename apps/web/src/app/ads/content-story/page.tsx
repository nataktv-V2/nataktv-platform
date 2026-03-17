import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function ContentStory() {
  const shows = [
    { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
    { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
    { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
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
      {/* Vertical stack of 3 show thumbnails with slight overlap */}
      <div className="absolute inset-0">
        {shows.map((show, i) => (
          <div
            key={show.title}
            className="absolute overflow-hidden"
            style={{
              top: i * 580,
              left: 0,
              width: 1080,
              height: 640,
              zIndex: 3 - i,
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

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.95) 85%, rgba(0,0,0,1) 100%)",
          zIndex: 10,
        }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center h-full"
        style={{ zIndex: 20 }}
      >
        {/* Logo - top */}
        <div style={{ marginTop: 60 }}>
          <NatakLogo size="xl" />
        </div>

        {/* Spacer to push content to bottom */}
        <div className="flex-1" />

        {/* Headline */}
        <h1
          className="text-center"
          style={{
            fontSize: 72,
            fontFamily: "var(--font-poppins), Inter, sans-serif",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          Natak pasand hai?
        </h1>

        {/* Subtitle */}
        <p
          className="text-center"
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.8)",
            marginBottom: 48,
            padding: "0 80px",
          }}
        >
          100+ titles in Hindi, Tamil, Telugu
        </p>

        {/* CTA */}
        <button
          className="rounded-full font-bold"
          style={{
            fontSize: 34,
            padding: "22px 72px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            color: "#fff",
            border: "none",
            marginBottom: 40,
          }}
        >
          Browse All Shows
        </button>

        {/* Swipe up hint */}
        <div className="flex flex-col items-center" style={{ marginBottom: 60 }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginBottom: 8, opacity: 0.6 }}
          >
            <path
              d="M12 4L12 20M12 4L6 10M12 4L18 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p style={{ fontSize: 22, color: "rgba(255,255,255,0.5)" }}>
            Swipe up to explore
          </p>
        </div>
      </div>
    </div>
  );
}
