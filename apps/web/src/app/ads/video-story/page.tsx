"use client";

import { NatakLogo } from "@/components/ads/NatakLogo";

const shows = [
  { id: "-Jts8lNYLJo", title: "Ghat Ghat Ka Paani" },
  { id: "pCbuY1jnKbk", title: "Love Guru" },
  { id: "v-sD6hE-AKc", title: "Love Shadi Dhokha" },
  { id: "eZkwCc4KpGc", title: "Gaon Ki Biwi" },
  { id: "W4jdt5QVmFQ", title: "Kalyanam to Kadhal" },
];

export default function VideoStory() {
  const perShow = 2.5; // seconds each
  const total = shows.length * perShow + 3; // +3s for CTA

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
        @keyframes storyReveal {
          0% { clip-path: circle(0% at 50% 50%); opacity: 0; }
          10% { clip-path: circle(100% at 50% 50%); opacity: 1; }
          85% { clip-path: circle(100% at 50% 50%); opacity: 1; }
          100% { clip-path: circle(0% at 50% 100%); opacity: 0; }
        }
        @keyframes storyTitle {
          0%, 10% { opacity: 0; transform: translateY(40px); }
          20%, 70% { opacity: 1; transform: translateY(0); }
          85%, 100% { opacity: 0; }
        }
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.2); }
        }
        @keyframes pulseCoin {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 24px rgba(249,115,22,0.5); }
          50% { transform: scale(1.12); box-shadow: 0 4px 40px rgba(249,115,22,0.7); }
        }
        @keyframes finalCTA {
          0%, 85% { opacity: 0; transform: translateY(60px) scale(0.9); }
          90%, 100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInLogo {
          0%, 2% { opacity: 0; }
          5%, 100% { opacity: 1; }
        }
        .story-frame {
          position: absolute;
          inset: 0;
          opacity: 0;
        }
        ${shows.map((_, i) => `
          .story-${i} {
            animation: storyReveal ${perShow}s ease-in-out ${i * perShow}s forwards;
          }
          .story-${i} .story-bg {
            animation: slowZoom ${perShow}s ease-out ${i * perShow}s forwards;
          }
          .story-${i} .story-name {
            animation: storyTitle ${perShow}s ease-out ${i * perShow}s forwards;
          }
        `).join("")}
        .pulse-coin { animation: pulseCoin 1.2s ease-in-out infinite; }
        .final-cta { animation: finalCTA ${total}s ease-out forwards; }
        .logo-fade { animation: fadeInLogo ${total}s ease forwards; }
      `}</style>

      {/* Show frames */}
      {shows.map((show, i) => (
        <div key={show.id} className={`story-frame story-${i}`}>
          <div
            className="story-bg absolute inset-0"
            style={{
              backgroundImage: `url(https://img.youtube.com/vi/${show.id}/maxresdefault.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(10,10,12,0.95) 10%, transparent 45%, rgba(10,10,12,0.4) 100%)",
            }}
          />
          {/* Title */}
          <div className="story-name absolute bottom-0 left-0 right-0 flex flex-col items-center pb-40 px-12">
            <h2
              className="font-bold text-center"
              style={{ fontSize: 72, color: "#f4f4f5", textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}
            >
              {show.title}
            </h2>
          </div>
        </div>
      ))}

      {/* Logo */}
      <div className="logo-fade absolute top-10 left-10 z-10">
        <NatakLogo size="lg" />
      </div>

      {/* ₹2 coin */}
      <div
        className="pulse-coin absolute top-10 right-10 z-10 flex items-center justify-center rounded-full font-black"
        style={{
          width: 120,
          height: 120,
          backgroundColor: "#f97316",
          color: "#fff",
          fontSize: 48,
        }}
      >
        ₹2
      </div>

      {/* Final CTA overlay */}
      <div
        className="final-cta absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{ background: "radial-gradient(ellipse at center, rgba(10,10,12,0.9), rgba(10,10,12,0.98))" }}
      >
        <div className="mb-10">
          <NatakLogo size="xl" />
        </div>
        <p className="mb-4" style={{ fontSize: 40, color: "#f4f4f5", fontWeight: 700 }}>
          100+ Dramas
        </p>
        <p className="mb-10" style={{ fontSize: 30, color: "#a1a1aa" }}>
          Hindi, Tamil, Telugu & more
        </p>
        <button
          className="rounded-full font-bold"
          style={{
            fontSize: 40,
            padding: "28px 90px",
            backgroundColor: "#f97316",
            color: "#fff",
            boxShadow: "0 4px 40px rgba(249,115,22,0.5)",
          }}
        >
          Watch Now — ₹2
        </button>
      </div>
    </div>
  );
}
