"use client";

import { NatakLogo } from "@/components/ads/NatakLogo";

// Soft / Emotional positioning — targets Female 18-35
// Structure: 5s hook → 1.5s promo → 5s CTA (15s total, loops)
const show = { img: "/thumbnails/ads/love-shadi-dhokha.jpg", title: "Love Shadi Dhokha" };

export default function VideoSoft() {
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
        /* HOOK: 0-33% (5s) — slow zoom, image visible */
        @keyframes softZoom {
          0% { transform: scale(1); filter: brightness(0.8); }
          5% { filter: brightness(1); }
          33% { transform: scale(1.12); filter: brightness(1); }
          43% { transform: scale(1.15); filter: brightness(0.6); }
          100% { transform: scale(1.15); filter: brightness(0.3); }
        }
        /* Hook text: visible 0-33% */
        @keyframes hookText {
          0% { opacity: 0; transform: translateY(30px); }
          5% { opacity: 1; transform: translateY(0); }
          28% { opacity: 1; }
          33% { opacity: 0; }
          100% { opacity: 0; }
        }
        /* PROMO: 33-43% (1.5s) — title flash */
        @keyframes promoTitle {
          0%, 30% { opacity: 0; transform: scale(0.7); }
          33% { opacity: 1; transform: scale(1.05); }
          35% { transform: scale(1); }
          43% { opacity: 1; }
          46% { opacity: 0; }
          100% { opacity: 0; }
        }
        /* CTA: 43-93% (5s) */
        @keyframes ctaIn {
          0%, 40% { opacity: 0; }
          43% { opacity: 1; }
          93% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes ctaBtn {
          0%, 43% { opacity: 0; transform: translateY(40px); }
          50% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes coinPop {
          0%, 43% { opacity: 0; transform: scale(0) rotate(-90deg); }
          48% { opacity: 1; transform: scale(1.1) rotate(5deg); }
          50% { transform: scale(1) rotate(0); }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes logoShow {
          0% { opacity: 0; }
          3%, 93% { opacity: 1; }
          100% { opacity: 0; }
        }
        .s-bg { animation: softZoom 15s ease-in-out infinite; }
        .s-hook { animation: hookText 15s ease-out infinite; }
        .s-promo { animation: promoTitle 15s ease-out infinite; }
        .s-cta { animation: ctaIn 15s ease-out infinite; }
        .s-btn { animation: ctaBtn 15s ease-out infinite; }
        .s-coin { animation: coinPop 15s ease-out infinite; }
        .s-logo { animation: logoShow 15s ease-out infinite; }
      `}</style>

      {/* Background */}
      <div
        className="s-bg absolute inset-0"
        style={{
          backgroundImage: `url(${show.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          willChange: "transform, filter",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(10,10,12,0.85) 12%, transparent 50%, rgba(10,10,12,0.2) 100%)" }}
      />

      {/* Logo */}
      <div className="s-logo absolute top-10 left-10 z-10">
        <NatakLogo size="lg" />
      </div>

      {/* HOOK TEXT (0-5s) */}
      <div className="s-hook absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-48 px-12">
        <p className="text-center font-medium" style={{ fontSize: 46, color: "#fbbf24" }}>
          Kya pyaar mein sab maaf hai?
        </p>
        <p className="text-center mt-4" style={{ fontSize: 32, color: "#a1a1aa" }}>
          Dekhiye ek aisi kahaani...
        </p>
      </div>

      {/* PROMO TITLE (5-6.5s) */}
      <div className="s-promo absolute inset-0 z-10 flex items-center justify-center">
        <h2
          className="font-bold text-center px-12"
          style={{ fontSize: 88, color: "#f4f4f5", textShadow: "0 4px 40px rgba(0,0,0,0.9)", fontFamily: "var(--font-poppins), Inter, sans-serif", fontWeight: 800 }}
        >
          {show.title}
        </h2>
      </div>

      {/* CTA (6.5-11.5s) */}
      <div
        className="s-cta absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{ background: "radial-gradient(ellipse at center, rgba(10,10,12,0.92), rgba(10,10,12,0.98))" }}
      >
        <div className="mb-8">
          <NatakLogo size="xl" />
        </div>
        <div
          className="s-coin flex items-center justify-center rounded-full font-black mb-8"
          style={{ width: 160, height: 160, backgroundColor: "#f97316", color: "#fff", fontSize: 64, boxShadow: "0 4px 40px rgba(249,115,22,0.6)" }}
        >
          ₹2
        </div>
        <p className="mb-3" style={{ fontSize: 38, color: "#f4f4f5", fontWeight: 700, fontFamily: "var(--font-poppins), Inter, sans-serif" }}>
          Sirf ₹2 mein shuru karo
        </p>
        <p className="mb-10" style={{ fontSize: 28, color: "#a1a1aa" }}>
          100+ Dramas — Hindi, Tamil, Telugu
        </p>
        <button
          className="s-btn rounded-full font-bold"
          style={{ fontSize: 40, padding: "28px 90px", background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 4px 24px rgba(249,115,22,0.4)", color: "#fff" }}
        >
          Start Watching — ₹2
        </button>
      </div>
    </div>
  );
}
