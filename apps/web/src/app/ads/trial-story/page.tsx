import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function TrialStory() {
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
      {/* Full-bleed dramatic show image — top 60% */}
      <div className="absolute inset-0">
        <Image
          src="/thumbnails/ads/ghat-ghat-ka-paani.jpg"
          alt="Ghat Ghat Ka Paani"
          fill
          style={{ objectFit: "cover", objectPosition: "top center" }}
          unoptimized
        />
      </div>

      {/* Heavy gradient: transparent top → dark bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.1) 0%, rgba(10,10,12,0.3) 30%, rgba(10,10,12,0.85) 55%, rgba(10,10,12,0.98) 70%, #0a0a0c 100%)",
        }}
      />

      {/* Orange glow behind price */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full blur-[140px] opacity-30"
        style={{
          top: 1050,
          width: 600,
          height: 400,
          background: "radial-gradient(circle, #f97316, transparent)",
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center h-full" style={{ padding: "50px 60px 80px" }}>
        {/* Top: Logo + badge */}
        <div className="flex items-start justify-between w-full mb-auto">
          <NatakLogo size="lg" />
          <div
            className="rounded-full font-semibold"
            style={{
              fontSize: 22,
              padding: "8px 28px",
              backgroundColor: "rgba(249, 115, 22, 0.2)",
              border: "1px solid rgba(249,115,22,0.6)",
              color: "#f97316",
            }}
          >
            Limited Time
          </div>
        </div>

        {/* Middle spacer — lets the image breathe */}
        <div style={{ flex: 1 }} />

        {/* Price section */}
        <div className="flex flex-col items-center" style={{ marginBottom: 40 }}>
          <div className="flex items-baseline gap-5 mb-4">
            <span className="line-through" style={{ fontSize: 56, color: "rgba(255,255,255,0.35)" }}>
              ₹199
            </span>
            <span
              className="font-black"
              style={{
                fontSize: 200,
                color: "#f97316",
                lineHeight: 1,
                textShadow: "0 0 80px rgba(249,115,22,0.4)",
              }}
            >
              ₹2
            </span>
          </div>

          <h1
            style={{
              fontSize: 64,
              color: "#f4f4f5",
              fontFamily: "var(--font-poppins), Inter, sans-serif",
              fontWeight: 800,
              textAlign: "center",
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              marginBottom: 12,
            }}
          >
            2 din FREE trial
          </h1>

          <p style={{ fontSize: 30, color: "rgba(255,255,255,0.55)", textAlign: "center" }}>
            100+ web series • Hindi, Tamil, Telugu
          </p>
        </div>

        {/* Show thumbnail strip — proof of content */}
        <div className="flex gap-3 mb-10">
          {["/thumbnails/ads/gaon-ki-biwi.jpg", "/thumbnails/ads/kalyanam-to-kadhal.jpg", "/thumbnails/ads/hey-leela.jpg", "/thumbnails/ads/love-guru.jpg"].map((img) => (
            <div
              key={img}
              className="relative overflow-hidden rounded-xl"
              style={{ width: 180, height: 100, border: "2px solid rgba(255,255,255,0.1)" }}
            >
              <Image
                src={img}
                alt=""
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="rounded-full font-bold"
          style={{
            fontSize: 36,
            padding: "24px 90px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 30px rgba(249,115,22,0.5)",
            color: "#fff",
            marginBottom: 20,
          }}
        >
          Start Free Trial
        </button>

        <p style={{ fontSize: 24, color: "rgba(255,255,255,0.4)" }}>
          Swipe up to subscribe
        </p>
      </div>
    </div>
  );
}
