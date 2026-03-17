"use client";

import { NatakLogo } from "@/components/ads/NatakLogo";

const shows = [
  { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
  { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
  { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
  { img: "/thumbnails/ads/ghat-ghat-ka-paani.jpg", title: "Ghat Ghat Ka Paani" },
  { img: "/thumbnails/ads/love-shadi-dhokha.jpg", title: "Love Shadi Dhokha" },
];

export default function VideoFeed() {
  const totalDuration = 15; // seconds
  const perShow = totalDuration / shows.length; // 3s each

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
        @keyframes showSlide {
          0%, 2% { opacity: 0; transform: scale(1.1); }
          5%, 85% { opacity: 1; transform: scale(1); }
          95%, 100% { opacity: 0; transform: scale(0.98); }
        }
        @keyframes titleSlide {
          0%, 5% { opacity: 0; transform: translateY(30px); }
          15%, 75% { opacity: 1; transform: translateY(0); }
          90%, 100% { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes coinPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes ctaReveal {
          0%, 80% { opacity: 0; transform: scale(0.8) translateY(40px); }
          85%, 100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes logoFade {
          0%, 3% { opacity: 0; }
          5%, 100% { opacity: 1; }
        }
        @keyframes bgKen {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .show-frame {
          position: absolute;
          inset: 0;
          opacity: 0;
        }
        ${shows.map((_, i) => `
          .show-frame-${i} {
            animation: showSlide ${perShow}s ease-in-out ${i * perShow}s forwards;
          }
          .show-frame-${i} .show-bg {
            animation: bgKen ${perShow}s ease-out ${i * perShow}s forwards;
          }
          .show-frame-${i} .show-title {
            animation: titleSlide ${perShow}s ease-out ${i * perShow}s forwards;
          }
        `).join("")}
        .coin-badge {
          animation: coinPulse 1s ease-in-out infinite;
        }
        .cta-final {
          animation: ctaReveal ${totalDuration}s ease-out forwards;
        }
        .logo-anim {
          animation: logoFade ${totalDuration}s ease-out forwards;
        }
      `}</style>

      {/* Each show frame */}
      {shows.map((show, i) => (
        <div key={show.title} className={`show-frame show-frame-${i}`}>
          {/* Background image with Ken Burns */}
          <div
            className="show-bg absolute inset-0"
            style={{
              backgroundImage: `url(${show.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              willChange: "transform, filter",
              backfaceVisibility: "hidden",
            }}
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(10,10,12,0.95) 15%, rgba(10,10,12,0.3) 50%, rgba(10,10,12,0.5) 100%)",
            }}
          />
          {/* Title */}
          <div className="show-title absolute bottom-0 left-0 right-0 flex flex-col items-center pb-32">
            <h2
              className="font-bold text-center"
              style={{ fontSize: 56, color: "#f4f4f5", textShadow: "0 2px 20px rgba(0,0,0,0.8)", fontFamily: "var(--font-poppins), Inter, sans-serif" }}
            >
              {show.title}
            </h2>
          </div>
        </div>
      ))}

      {/* Persistent Logo - top left */}
      <div className="logo-anim absolute top-6 left-6 z-10">
        <NatakLogo size="sm" />
      </div>

      {/* Persistent ₹2 coin badge - top right */}
      <div
        className="coin-badge absolute top-6 right-6 z-10 flex items-center justify-center rounded-full font-black"
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

      {/* Final CTA overlay */}
      <div className="cta-final absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{ background: "radial-gradient(ellipse at center, rgba(10,10,12,0.92), rgba(10,10,12,0.98))" }}
      >
        <div className="mb-8">
          <NatakLogo size="xl" />
        </div>
        <p className="mb-6" style={{ fontSize: 36, color: "#a1a1aa" }}>
          100+ Shows
        </p>
        <button
          className="rounded-full font-bold"
          style={{
            fontSize: 34,
            padding: "22px 72px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            fontFamily: "var(--font-poppins), Inter, sans-serif",
          }}
        >
          Watch Now — ₹2
        </button>
      </div>
    </div>
  );
}
