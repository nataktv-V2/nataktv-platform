"use client";

import { NatakLogo } from "@/components/ads/NatakLogo";

// Female-specific positioning — targets Female 18-35
// Structure: 5s hook → 1.5s promo → 5s CTA (15s total, loops)
const show = { id: "eZkwCc4KpGc", title: "Gaon Ki Biwi" };

export default function VideoFemale() {
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
        /* HOOK: 0-33% — gentle reveal with warmth */
        @keyframes femReveal {
          0% { transform: scale(1.08); filter: brightness(0.5) saturate(0.6); }
          6% { transform: scale(1.06); filter: brightness(1) saturate(1.2); }
          33% { transform: scale(1); filter: brightness(1) saturate(1.1); }
          43% { transform: scale(0.98); filter: brightness(0.4) saturate(0.7); }
          100% { transform: scale(1.08); filter: brightness(0.4); }
        }
        /* Warm glow overlay */
        @keyframes warmGlow {
          0%, 5% { opacity: 0.7; }
          33% { opacity: 0.4; }
          43%, 100% { opacity: 0; }
        }
        /* Hook text */
        @keyframes femHook {
          0%, 3% { opacity: 0; transform: translateY(30px); }
          7% { opacity: 1; transform: translateY(0); }
          28% { opacity: 1; }
          33% { opacity: 0; }
          100% { opacity: 0; }
        }
        /* PROMO: 33-43% — elegant letter-spacing */
        @keyframes femTitle {
          0%, 30% { opacity: 0; letter-spacing: 20px; }
          33% { opacity: 1; letter-spacing: 5px; }
          43% { opacity: 1; letter-spacing: 4px; }
          46% { opacity: 0; }
          100% { opacity: 0; }
        }
        /* CTA: 43%+ */
        @keyframes femCta {
          0%, 40% { opacity: 0; }
          43% { opacity: 1; }
          93% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes femBtn {
          0%, 43% { opacity: 0; transform: translateY(40px); }
          50% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes femCoin {
          0%, 43% { opacity: 0; transform: scale(0); }
          48% { opacity: 1; transform: scale(1.1); }
          50% { transform: scale(1); }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes femLogo {
          0% { opacity: 0; }
          4%, 93% { opacity: 1; }
          100% { opacity: 0; }
        }
        .f-bg { animation: femReveal 15s ease-in-out infinite; }
        .f-glow { animation: warmGlow 15s ease-in-out infinite; }
        .f-hook { animation: femHook 15s ease-out infinite; }
        .f-title { animation: femTitle 15s ease-out infinite; }
        .f-cta { animation: femCta 15s ease-out infinite; }
        .f-btn { animation: femBtn 15s ease-out infinite; }
        .f-coin { animation: femCoin 15s ease-out infinite; }
        .f-logo { animation: femLogo 15s ease-out infinite; }
      `}</style>

      {/* Background — female protagonist */}
      <div
        className="f-bg absolute inset-0"
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${show.id}/maxresdefault.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      {/* Warm glow */}
      <div
        className="f-glow absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.15), transparent 60%)" }}
      />

      {/* Gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(10,10,12,0.88) 12%, transparent 45%, rgba(10,10,12,0.2) 100%)" }}
      />

      {/* Logo */}
      <div className="f-logo absolute top-10 left-10 z-10">
        <NatakLogo size="lg" />
      </div>

      {/* HOOK TEXT (0-5s) */}
      <div className="f-hook absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-44 px-12">
        <p className="text-center" style={{ fontSize: 46, color: "#fbbf24", fontWeight: 600 }}>
          Har aurat ki ek kahaani hai
        </p>
        <p className="text-center mt-4" style={{ fontSize: 32, color: "#a1a1aa" }}>
          Jo kabhi kisine nahi suni...
        </p>
      </div>

      {/* PROMO TITLE (5-6.5s) */}
      <div className="f-title absolute inset-0 z-10 flex items-center justify-center">
        <h2
          className="font-bold text-center px-12"
          style={{ fontSize: 84, color: "#f4f4f5", textShadow: "0 4px 40px rgba(0,0,0,0.9)" }}
        >
          {show.title}
        </h2>
      </div>

      {/* CTA (6.5s+) */}
      <div
        className="f-cta absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{ background: "radial-gradient(ellipse at center, rgba(10,10,12,0.92), rgba(10,10,12,0.98))" }}
      >
        <div className="mb-8">
          <NatakLogo size="xl" />
        </div>
        <div
          className="f-coin flex items-center justify-center rounded-full font-black mb-6"
          style={{ width: 150, height: 150, backgroundColor: "#f97316", color: "#fff", fontSize: 60, boxShadow: "0 4px 40px rgba(249,115,22,0.6)" }}
        >
          ₹2
        </div>
        <p className="mb-2" style={{ fontSize: 40, color: "#f4f4f5", fontWeight: 700 }}>
          Apni kahaani dekho
        </p>
        <p className="mb-10" style={{ fontSize: 28, color: "#a1a1aa" }}>
          100+ Dramas — Hindi, Tamil, Telugu
        </p>
        <button
          className="f-btn rounded-full font-bold"
          style={{ fontSize: 40, padding: "28px 90px", backgroundColor: "#f97316", color: "#fff", boxShadow: "0 4px 40px rgba(249,115,22,0.5)" }}
        >
          Abhi Dekho
        </button>
      </div>
    </div>
  );
}
