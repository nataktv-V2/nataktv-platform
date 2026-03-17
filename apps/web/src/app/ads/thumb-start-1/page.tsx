import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

// Thumb-start ad — looks like a paused video with play button
// Users instinctively click play → lands on app/website
// Feed format (1080x1080)
export default function ThumbStart1() {
  const show = { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" };

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
      {/* Thumbnail */}
      <Image
        src={show.img}
        alt={show.title}
        fill
        style={{ objectFit: "cover" }}
        unoptimized
      />

      {/* Slight dark overlay to make play button pop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.25)" }}
      />

      {/* Fake progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: 6, backgroundColor: "rgba(255,255,255,0.3)" }}>
        <div style={{ width: "15%", height: "100%", backgroundColor: "#ef4444", borderRadius: "0 3px 3px 0" }} />
      </div>

      {/* Fake timestamp */}
      <div
        className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded"
        style={{ backgroundColor: "rgba(0,0,0,0.7)", fontSize: 22, color: "#fff" }}
      >
        2:34
      </div>

      {/* Play button — large, centered */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 160,
            height: 160,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            border: "3px solid rgba(255,255,255,0.3)",
          }}
        >
          {/* Play triangle */}
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "40px solid transparent",
              borderBottom: "40px solid transparent",
              borderLeft: "65px solid #fff",
              marginLeft: 12,
            }}
          />
        </div>
      </div>

      {/* Logo top-left */}
      <div className="absolute top-6 left-6 z-10">
        <NatakLogo size="md" />
      </div>

      {/* ₹2 badge top-right */}
      <div
        className="absolute top-6 right-6 z-10 flex items-center justify-center rounded-full font-black"
        style={{
          width: 90,
          height: 90,
          backgroundColor: "#f97316",
          color: "#fff",
          fontSize: 34,
          boxShadow: "0 4px 24px rgba(249,115,22,0.5)",
        }}
      >
        ₹2
      </div>

      {/* Bottom gradient + title */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-8 pt-20"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 30%, transparent)" }}
      >
        <h2 className="font-bold" style={{ fontSize: 42, color: "#fff", fontFamily: "var(--font-poppins), Inter, sans-serif", fontWeight: 800, textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 1px 6px rgba(0,0,0,0.9)" }}>
          {show.title}
        </h2>
        <p style={{ fontSize: 24, color: "#a1a1aa", marginTop: 4 }}>
          Natak TV pe dekho — Sirf ₹2
        </p>
      </div>
    </div>
  );
}
