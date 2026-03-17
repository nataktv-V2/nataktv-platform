import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function LaunchFeed() {
  const shows = [
    { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
    { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
    { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
    { img: "/thumbnails/ads/ghat-ghat-ka-paani.jpg", title: "Ghat Ghat Ka Paani" },
  ];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0a0a0c",
      }}
    >
      {/* 2x2 Thumbnail Collage Background */}
      <div
        className="absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
        }}
      >
        {shows.map((show) => (
          <div key={show.title} className="relative overflow-hidden">
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
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Content layer */}
      <div
        className="relative flex flex-col items-center justify-end"
        style={{ width: 1080, height: 1080, paddingBottom: 80 }}
      >
        {/* Logo - top left */}
        <div className="absolute" style={{ top: 40, left: 48 }}>
          <NatakLogo size="lg" />
        </div>

        {/* Headline */}
        <h1
          className="text-center leading-none"
          style={{
            fontSize: 82,
            color: "#ffffff",
            fontFamily: "var(--font-poppins), Inter, sans-serif",
            fontWeight: 800,
            marginBottom: 28,
            textShadow: "0 4px 30px rgba(0,0,0,0.6)",
          }}
        >
          Indian Drama,
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

        {/* Rating badge */}
        <div
          className="rounded-full font-semibold"
          style={{
            fontSize: 24,
            padding: "10px 30px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(249, 115, 22, 0.6)",
            color: "#f97316",
            backdropFilter: "blur(8px)",
            marginBottom: 32,
          }}
        >
          Rated 4.8 ★
        </div>

        {/* CTA */}
        <button
          className="rounded-full font-bold"
          style={{
            fontSize: 32,
            padding: "20px 64px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            color: "#fff",
            border: "none",
            letterSpacing: "0.5px",
          }}
        >
          Join 50K+ Viewers
        </button>
      </div>
    </div>
  );
}
