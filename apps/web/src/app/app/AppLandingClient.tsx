"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { track } from "@/lib/mixpanel";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.nataktv.app";

// All 7 real show thumbnails available in /public/thumbnails/ads/
const SHOWS: { slug: string; title: string }[] = [
  { slug: "love-shadi-dhokha", title: "Love Shadi Dhokha" },
  { slug: "gaon-ki-biwi", title: "Gaon Ki Biwi" },
  { slug: "hey-leela", title: "Hey Leela" },
  { slug: "ghat-ghat-ka-paani", title: "Ghat Ghat Ka Paani" },
  { slug: "kalyanam-to-kadhal", title: "Kalyanam to Kadhal" },
  { slug: "love-guru", title: "Love Guru" },
  { slug: "hurry-burry", title: "Hurry Burry" },
];

function readSearchParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

export function AppLandingClient() {
  const paramsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    paramsRef.current = readSearchParams();
    track("app_landing_viewed", paramsRef.current);
  }, []);

  const handleCtaTap = (position: string) => {
    track("app_landing_cta_tapped", { ...paramsRef.current, position });
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#0a0a0c] text-white overflow-x-hidden pb-28">
      {/* Hero background */}
      <div
        className="absolute inset-x-0 top-0 h-[70vh] z-0"
        style={{
          backgroundImage: "url(/thumbnails/ads/love-shadi-dhokha.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[70vh] z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.35) 0%, rgba(10,10,12,0.75) 55%, rgba(10,10,12,1) 100%)",
        }}
      />
      <div
        className="absolute z-[1] pointer-events-none"
        style={{
          top: "45%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 520,
          height: 420,
          background: "radial-gradient(circle, rgba(249,115,22,0.35), transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Top bar: logo */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-1.5">
          <span
            className="text-2xl font-black leading-none"
            style={{
              background: "linear-gradient(135deg,#f59e0b 0%,#ef4444 50%,#ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Natak
          </span>
          <span className="text-sm font-extrabold bg-[#7c3aed] px-2 py-0.5 rounded-md leading-none">
            TV
          </span>
        </div>
        <span className="text-[11px] font-medium text-white/60">Made in India 🇮🇳</span>
      </header>

      {/* Hero: headline + price + CTA */}
      <section className="relative z-10 flex flex-col items-center text-center px-5 pt-14 pb-10">
        <p className="text-[#fbbf24] text-xs font-bold tracking-[0.25em] uppercase mb-3">
          10,000+ Indian Dramas
        </p>
        <h1
          className="text-[56px] sm:text-7xl font-black leading-[0.95] mb-3"
          style={{
            background: "linear-gradient(135deg,#fbbf24 0%,#f97316 50%,#ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
          }}
        >
          Start<br />Watching!
        </h1>
        <p className="text-white/85 text-base font-semibold mb-6">
          Hindi · Tamil · Telugu dramas, new episodes every week
        </p>

        {/* Price card */}
        <div className="shiny-border inline-block mb-5">
          <div className="bg-[#121216] rounded-[14px] px-6 py-3.5 flex items-center gap-3">
            <span className="text-[10px] font-semibold tracking-widest text-white/50 uppercase">Start</span>
            <span className="text-3xl font-black text-white leading-none">₹2</span>
            <span className="text-[11px] text-white/50 leading-tight text-left">
              for 2 days<br />
              <span className="text-white/40">then ₹199/mo</span>
            </span>
          </div>
        </div>

        {/* Main CTA: Play Store */}
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener"
          onClick={() => handleCtaTap("hero")}
          className="inline-flex items-center gap-3 bg-white text-[#0a0a0c] rounded-full font-extrabold px-7 py-4 text-lg shadow-[0_12px_48px_rgba(249,115,22,0.55)]"
          style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
        >
          <svg width="28" height="30" viewBox="0 0 512 555" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11C9 17 2 28 2 43v469c0 15 7 26 18 32l272-270L20 11z" fill="#2196f3" />
            <path d="M378 191L76 16l-56-5 272 266 86-86z" fill="#4caf50" />
            <path d="M482 235L378 191l-86 86 86 86 104-44c26-16 26-68 0-84z" fill="#ffc107" />
            <path d="M292 277L20 543c11 6 26 5 40-3l318-175-86-88z" fill="#f44336" />
          </svg>
          <span>Download on Play Store</span>
        </a>
        <p className="text-[11px] text-white/45 mt-3">
          Free download · No credit card to browse
        </p>
      </section>

      {/* Shows carousel */}
      <section className="relative z-10 mb-10">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-sm font-bold tracking-wide uppercase text-white/80">
            Now streaming
          </h2>
          <span className="text-[11px] text-[#fbbf24] font-semibold">new every week</span>
        </div>
        <div
          className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {SHOWS.map((s) => (
            <div
              key={s.slug}
              className="flex-shrink-0 w-[120px]"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative w-[120px] h-[168px] rounded-xl overflow-hidden border border-white/10">
                <Image
                  src={`/thumbnails/ads/${s.slug}.jpg`}
                  alt={s.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                  <p className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                    {s.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Natak TV — 3 short points */}
      <section className="relative z-10 px-5 mb-10">
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-5 space-y-3">
          {[
            { icon: "🎬", title: "10,000+ shows", sub: "Hindi, Tamil, Telugu dramas" },
            { icon: "💸", title: "Start at ₹2", sub: "2 days trial, cancel anytime" },
            { icon: "📱", title: "Mobile-first", sub: "HD stream, no ads inside" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="text-sm font-bold text-white leading-tight">{f.title}</p>
                <p className="text-xs text-white/55 leading-tight">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="relative z-10 px-5 mb-10 text-center">
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener"
          onClick={() => handleCtaTap("secondary")}
          className="inline-flex items-center gap-2 text-[#fbbf24] font-bold text-sm underline underline-offset-4"
        >
          Open in Google Play →
        </a>
      </section>

      {/* Sticky bottom bar — always visible download CTA */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-[#0a0a0c]/95 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener"
          onClick={() => handleCtaTap("sticky")}
          className="flex items-center justify-center gap-2 w-full bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl py-3 font-extrabold text-base shadow-lg"
          style={{
            background: "linear-gradient(110deg,#f97316 0%,#f97316 40%,#fbbf24 50%,#f97316 60%,#f97316 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        >
          <svg width="20" height="22" viewBox="0 0 512 555" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11C9 17 2 28 2 43v469c0 15 7 26 18 32l272-270L20 11z" fill="#2196f3" />
            <path d="M378 191L76 16l-56-5 272 266 86-86z" fill="#4caf50" />
            <path d="M482 235L378 191l-86 86 86 86 104-44c26-16 26-68 0-84z" fill="#ffc107" />
            <path d="M292 277L20 543c11 6 26 5 40-3l318-175-86-88z" fill="#f44336" />
          </svg>
          Download Natak TV — Start at ₹2
        </a>
      </div>
    </div>
  );
}
