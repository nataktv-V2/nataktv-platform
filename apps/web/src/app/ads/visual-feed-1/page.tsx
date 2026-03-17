import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function VisualFeed1() {
  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Full bleed thumbnail */}
      <div className="relative" style={{ height: 700 }}>
        <Image
          src="/thumbnails/ads/gaon-ki-biwi.jpg"
          alt="Gaon Ki Biwi"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
        {/* Gradient overlay bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 350,
            background: "linear-gradient(to top, #0a0a0c, transparent)",
          }}
        />
        {/* Logo top-left */}
        <div className="absolute top-6 left-6">
          <NatakLogo size="sm" />
        </div>
        {/* ₹2 coin badge top-right */}
        <div
          className="absolute top-6 right-6 flex items-center justify-center rounded-full font-black"
          style={{
            width: 100,
            height: 100,
            backgroundColor: "#f97316",
            color: "#fff",
            fontSize: 36,
            boxShadow: "0 4px 24px rgba(249,115,22,0.5)",
          }}
        >
          ₹2
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex-1 flex flex-col items-center justify-center px-10">
        <h2 className="font-bold text-center mb-3" style={{ fontSize: 48, color: "#f4f4f5", fontFamily: "var(--font-poppins), Inter, sans-serif", fontWeight: 800, textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 1px 6px rgba(0,0,0,0.9)" }}>
          Gaon Ki Biwi
        </h2>
        <button
          className="rounded-full font-bold"
          style={{
            fontSize: 26,
            padding: "16px 56px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            color: "#fff",
          }}
        >
          Play Gaon Ki Biwi — ₹2
        </button>
      </div>
    </div>
  );
}
