"use client";

import { NatakLogo } from "@/components/ads/NatakLogo";

// Single-show dramatic teaser — Gaon Ki Biwi
const show = { id: "eZkwCc4KpGc", title: "Gaon Ki Biwi" };

export default function VideoTeaser() {
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
      <style>{`
        @keyframes dramaticZoom {
          0% { transform: scale(1.3); filter: blur(8px) brightness(0.5); }
          12% { transform: scale(1.15); filter: blur(0px) brightness(1); }
          75% { transform: scale(1.05); filter: blur(0px) brightness(1); }
          90% { transform: scale(1); filter: blur(4px) brightness(0.5); }
          100% { transform: scale(1.3); filter: blur(8px) brightness(0.5); }
        }
        @keyframes titleDrop {
          0%, 12% { opacity: 0; transform: translateY(-80px) scale(0.8); }
          22% { opacity: 1; transform: translateY(0) scale(1); }
          75% { opacity: 1; transform: translateY(0) scale(1); }
          90%, 100% { opacity: 0; transform: translateY(40px); }
        }
        @keyframes taglineUp {
          0%, 18% { opacity: 0; transform: translateY(60px); }
          28% { opacity: 1; transform: translateY(0); }
          70% { opacity: 1; transform: translateY(0); }
          85%, 100% { opacity: 0; }
        }
        @keyframes coinBounce {
          0%, 10% { opacity: 0; transform: scale(0) rotate(-180deg); }
          20% { opacity: 1; transform: scale(1.15) rotate(10deg); }
          25% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.08) rotate(0deg); }
          55% { opacity: 1; transform: scale(1) rotate(0deg); }
          80% { opacity: 1; }
          90%, 100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes ctaSlideUp {
          0%, 70% { opacity: 0; transform: translateY(100px); }
          80% { opacity: 1; transform: translateY(0); }
          95% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(100px); }
        }
        @keyframes glowPulse {
          0%, 70% { box-shadow: 0 0 0 rgba(249,115,22,0); }
          80% { box-shadow: 0 0 60px rgba(249,115,22,0.8); }
          90% { box-shadow: 0 0 30px rgba(249,115,22,0.4); }
          100% { box-shadow: 0 0 0 rgba(249,115,22,0); }
        }
        @keyframes overlayDarken {
          0% { background: linear-gradient(to top, rgba(10,10,12,0.5) 5%, transparent 40%); }
          75% { background: linear-gradient(to top, rgba(10,10,12,0.7) 5%, transparent 40%); }
          90% { background: linear-gradient(to top, rgba(10,10,12,0.85) 25%, rgba(10,10,12,0.4) 100%); }
          100% { background: linear-gradient(to top, rgba(10,10,12,0.5) 5%, transparent 40%); }
        }
        .teaser-bg {
          animation: dramaticZoom 8s ease-in-out infinite;
        }
        .teaser-title {
          animation: titleDrop 8s ease-out infinite;
        }
        .teaser-tagline {
          animation: taglineUp 8s ease-out infinite;
        }
        .teaser-coin {
          animation: coinBounce 8s ease-out infinite;
        }
        .teaser-cta {
          animation: ctaSlideUp 8s ease-out infinite;
        }
        .teaser-glow {
          animation: glowPulse 8s ease-out infinite;
        }
        .teaser-logo {
          opacity: 1;
        }
        .teaser-overlay {
          animation: overlayDarken 8s ease-out infinite;
        }
      `}</style>

      {/* Background thumbnail with dramatic zoom */}
      <div
        className="teaser-bg absolute inset-0"
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${show.id}/maxresdefault.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      {/* Dynamic gradient overlay */}
      <div className="teaser-overlay absolute inset-0" />

      {/* Logo top-left */}
      <div className="teaser-logo absolute top-10 left-10 z-10">
        <NatakLogo size="lg" />
      </div>

      {/* ₹2 coin — bounces in */}
      <div
        className="teaser-coin absolute z-10 flex items-center justify-center rounded-full font-black"
        style={{
          top: 750,
          left: "50%",
          marginLeft: -80,
          width: 160,
          height: 160,
          backgroundColor: "#f97316",
          color: "#fff",
          fontSize: 64,
          boxShadow: "0 4px 40px rgba(249,115,22,0.6)",
        }}
      >
        ₹2
      </div>

      {/* Title — drops in from top */}
      <div className="teaser-title absolute left-0 right-0 z-10 flex justify-center" style={{ top: 960 }}>
        <h2
          className="font-bold text-center px-12"
          style={{
            fontSize: 80,
            color: "#f4f4f5",
            textShadow: "0 4px 40px rgba(0,0,0,0.9)",
          }}
        >
          {show.title}
        </h2>
      </div>

      {/* Tagline */}
      <div className="teaser-tagline absolute left-0 right-0 z-10 flex justify-center" style={{ top: 1100 }}>
        <p style={{ fontSize: 36, color: "#a1a1aa" }}>
          Only on Natak TV
        </p>
      </div>

      {/* CTA — slides up at end */}
      <div className="teaser-cta absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center pb-20">
        <button
          className="teaser-glow rounded-full font-bold"
          style={{
            fontSize: 40,
            padding: "28px 90px",
            backgroundColor: "#f97316",
            color: "#fff",
            boxShadow: "0 4px 40px rgba(249,115,22,0.5)",
          }}
        >
          Watch Now
        </button>
      </div>
    </div>
  );
}
