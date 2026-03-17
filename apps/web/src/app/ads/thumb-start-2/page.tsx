import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

// Thumb-start ad — Story format (1080x1920)
// Looks like a paused video reel with play button
export default function ThumbStart2() {
  const show = { img: "/thumbnails/ads/love-guru.jpg", title: "Love Guru" };

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
      {/* Thumbnail */}
      <Image
        src={show.img}
        alt={show.title}
        fill
        style={{ objectFit: "cover" }}
        unoptimized
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.2)" }}
      />

      {/* Top gradient for logo */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 250, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}
      />

      {/* Logo */}
      <div className="absolute top-10 left-10 z-10">
        <NatakLogo size="lg" />
      </div>

      {/* ₹2 badge */}
      <div
        className="absolute top-10 right-10 z-10 flex items-center justify-center rounded-full font-black"
        style={{
          width: 120,
          height: 120,
          backgroundColor: "#f97316",
          color: "#fff",
          fontSize: 48,
          boxShadow: "0 4px 30px rgba(249,115,22,0.6)",
        }}
      >
        ₹2
      </div>

      {/* Play button — centered */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 180,
            height: 180,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            border: "3px solid rgba(255,255,255,0.3)",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "45px solid transparent",
              borderBottom: "45px solid transparent",
              borderLeft: "72px solid #fff",
              marginLeft: 14,
            }}
          />
        </div>
      </div>

      {/* Fake reel UI — progress dots at top */}
      <div className="absolute top-44 left-6 right-6 z-10 flex gap-2">
        <div style={{ flex: 1, height: 3, backgroundColor: "#fff", borderRadius: 2 }} />
        <div style={{ flex: 1, height: 3, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 2 }} />
        <div style={{ flex: 1, height: 3, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 2 }} />
      </div>

      {/* Bottom gradient + title + CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center px-10 pb-16 pt-32"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 40%, transparent)" }}
      >
        <h2 className="font-bold text-center mb-4" style={{ fontSize: 64, color: "#fff", fontFamily: "var(--font-poppins), Inter, sans-serif", fontWeight: 800, textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 1px 6px rgba(0,0,0,0.9)" }}>
          {show.title}
        </h2>
        <p className="text-center mb-8" style={{ fontSize: 30, color: "#a1a1aa" }}>
          Natak TV pe abhi dekho
        </p>
        <button
          className="rounded-full font-bold"
          style={{
            fontSize: 34,
            padding: "22px 72px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
          }}
        >
          Watch Now
        </button>
      </div>
    </div>
  );
}
