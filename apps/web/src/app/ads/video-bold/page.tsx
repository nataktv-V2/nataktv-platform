"use client";

import { NatakLogo } from "@/components/ads/NatakLogo";

// Bold positioning — targets Male 18-35
// Structure: 5s hook → 1.5s promo → 5s CTA (15s total, loops)
const show = { id: "-Jts8lNYLJo", title: "Ghat Ghat Ka Paani" };

export default function VideoBold() {
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
      <style>{`
        /* HOOK: 0-33% — shake zoom, high contrast */
        @keyframes boldZoom {
          0% { transform: scale(1.15) rotate(-1deg); filter: brightness(0.7) contrast(1.2); }
          3% { transform: scale(1.1) rotate(0.5deg); filter: brightness(1.1) contrast(1.2); }
          5% { transform: scale(1.1) rotate(0deg); filter: brightness(1) contrast(1.1); }
          33% { transform: scale(1.02); filter: brightness(1) contrast(1.1); }
          43% { transform: scale(1); filter: brightness(0.4); }
          100% { transform: scale(1.15) rotate(-1deg); filter: brightness(0.4); }
        }
        /* Bold hook text */
        @keyframes boldHook {
          0% { opacity: 0; transform: scale(1.4); }
          4% { opacity: 1; transform: scale(1); }
          28% { opacity: 1; }
          33% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 0; }
        }
        /* Red accent bar */
        @keyframes redBar {
          0% { width: 0; }
          5% { width: 200px; }
          28% { width: 200px; }
          33% { width: 0; }
          100% { width: 0; }
        }
        /* PROMO: 33-43% — title slam */
        @keyframes titleSlam {
          0%, 30% { opacity: 0; transform: translateY(-80px) scale(1.2); }
          33% { opacity: 1; transform: translateY(4px) scale(1); }
          35% { transform: translateY(0) scale(1); }
          43% { opacity: 1; }
          46% { opacity: 0; }
          100% { opacity: 0; }
        }
        /* CTA: 43%+ */
        @keyframes boldCta {
          0%, 40% { opacity: 0; }
          43% { opacity: 1; }
          93% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes boldBtn {
          0%, 43% { opacity: 0; transform: scale(0.5); }
          48% { opacity: 1; transform: scale(1.05); }
          50% { transform: scale(1); }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes boldCoin {
          0%, 43% { opacity: 0; transform: translateX(80px); }
          50% { opacity: 1; transform: translateX(0); }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes logoIn {
          0% { opacity: 0; }
          3%, 93% { opacity: 1; }
          100% { opacity: 0; }
        }
        .b-bg { animation: boldZoom 15s ease-in-out infinite; }
        .b-hook { animation: boldHook 15s ease-out infinite; }
        .b-bar { animation: redBar 15s ease-out infinite; }
        .b-title { animation: titleSlam 15s ease-out infinite; }
        .b-cta { animation: boldCta 15s ease-out infinite; }
        .b-btn { animation: boldBtn 15s ease-out infinite; }
        .b-coin { animation: boldCoin 15s ease-out infinite; }
        .b-logo { animation: logoIn 15s ease-out infinite; }
      `}</style>

      {/* Background */}
      <div
        className="b-bg absolute inset-0"
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${show.id}/maxresdefault.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(10,10,12,0.9) 8%, transparent 50%, rgba(10,10,12,0.4) 100%)" }}
      />

      {/* Logo */}
      <div className="b-logo absolute top-8 left-8 z-10">
        <NatakLogo size="md" />
      </div>

      {/* HOOK TEXT (0-5s) */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-28 px-10">
        <div className="b-bar mb-5" style={{ height: 6, backgroundColor: "#ef4444", borderRadius: 3 }} />
        <h3
          className="b-hook font-black text-center"
          style={{ fontSize: 52, color: "#f4f4f5", textTransform: "uppercase", letterSpacing: 3 }}
        >
          Aap Satisfied Nahi Ho?
        </h3>
      </div>

      {/* PROMO TITLE (5-6.5s) */}
      <div className="b-title absolute inset-0 z-10 flex items-center justify-center">
        <h2
          className="font-black text-center px-10"
          style={{ fontSize: 68, color: "#f4f4f5", textShadow: "0 4px 40px rgba(0,0,0,0.9)" }}
        >
          {show.title}
        </h2>
      </div>

      {/* CTA (6.5s+) */}
      <div
        className="b-cta absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{ background: "radial-gradient(ellipse at center, rgba(10,10,12,0.93), rgba(10,10,12,0.98))" }}
      >
        <div className="mb-6">
          <NatakLogo size="lg" />
        </div>
        <div className="flex items-center gap-6 mb-6">
          <div
            className="b-coin flex items-center justify-center rounded-full font-black"
            style={{ width: 120, height: 120, backgroundColor: "#f97316", color: "#fff", fontSize: 48, boxShadow: "0 4px 30px rgba(249,115,22,0.6)" }}
          >
            ₹2
          </div>
          <div>
            <p style={{ fontSize: 36, color: "#f4f4f5", fontWeight: 700 }}>Sirf ₹2 mein dekho</p>
            <p style={{ fontSize: 24, color: "#a1a1aa" }}>Wo sab jo aapne nahi dekha</p>
          </div>
        </div>
        <button
          className="b-btn rounded-full font-bold"
          style={{ fontSize: 36, padding: "24px 80px", backgroundColor: "#ef4444", color: "#fff", boxShadow: "0 4px 40px rgba(239,68,68,0.5)" }}
        >
          Watch Now
        </button>
      </div>
    </div>
  );
}
