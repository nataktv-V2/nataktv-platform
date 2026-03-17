import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function TrialLandscape() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1200,
        height: 628,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Right side: full-bleed show image */}
      <div className="absolute right-0 top-0 bottom-0" style={{ width: 650 }}>
        <Image
          src="/thumbnails/ads/gaon-ki-biwi.jpg"
          alt="Gaon Ki Biwi"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
        {/* Left fade gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #0a0a0c 0%, rgba(10,10,12,0.7) 30%, transparent 70%)",
          }}
        />
      </div>

      {/* Orange glow */}
      <div
        className="absolute left-1/3 top-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-20"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, #f97316, transparent)",
        }}
      />

      {/* Left content */}
      <div className="relative flex flex-col justify-center h-full pl-16" style={{ maxWidth: 580 }}>
        <div className="mb-5">
          <NatakLogo size="md" />
        </div>

        <div className="flex items-baseline gap-3 mb-3">
          <span className="line-through" style={{ fontSize: 32, color: "rgba(255,255,255,0.35)" }}>₹199</span>
          <span className="font-black" style={{ fontSize: 100, color: "#f97316", lineHeight: 1, textShadow: "0 0 40px rgba(249,115,22,0.3)" }}>₹2</span>
        </div>

        <h1
          className="leading-tight mb-3"
          style={{ fontSize: 40, color: "#f4f4f5", fontFamily: "var(--font-poppins), Inter, sans-serif", fontWeight: 800 }}
        >
          2 din FREE trial
        </h1>

        <p className="mb-5" style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>
          100+ web series • Hindi, Tamil, Telugu
        </p>

        <button
          className="rounded-full font-bold self-start"
          style={{
            fontSize: 22,
            padding: "14px 52px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            color: "#fff",
          }}
        >
          Start Free Trial
        </button>
      </div>
    </div>
  );
}
