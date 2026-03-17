import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function TrialFeed() {
  const shows = [
    { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
    { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
    { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
    { img: "/thumbnails/ads/love-guru.jpg", title: "Love Guru" },
  ];

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
      {/* 2x2 show thumbnail grid — fills entire background */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        {shows.map((show) => (
          <div key={show.title} className="relative overflow-hidden">
            <Image
              src={show.img}
              alt={show.title}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Heavy dark overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0.7) 40%, rgba(10,10,12,0.92) 70%, rgba(10,10,12,0.98) 100%)",
        }}
      />

      {/* Radial orange glow behind price */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full blur-[120px] opacity-30"
        style={{
          top: 340,
          width: 500,
          height: 400,
          background: "radial-gradient(circle, #f97316, transparent)",
        }}
      />

      {/* Content overlay */}
      <div className="relative flex flex-col items-center justify-between h-full" style={{ padding: "40px 60px 60px" }}>
        {/* Top row: Logo + ₹2 badge */}
        <div className="flex items-start justify-between w-full">
          <NatakLogo size="md" />
          <div
            className="flex items-center justify-center rounded-full font-black"
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

        {/* Center: Price hero — BIG and dramatic */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-4 mb-3">
            <span
              className="line-through"
              style={{ fontSize: 52, color: "rgba(255,255,255,0.4)" }}
            >
              ₹199
            </span>
            <span
              className="font-black"
              style={{
                fontSize: 180,
                color: "#f97316",
                lineHeight: 1,
                textShadow: "0 0 60px rgba(249,115,22,0.5)",
              }}
            >
              ₹2
            </span>
          </div>
          <h1
            style={{
              fontSize: 52,
              color: "#f4f4f5",
              fontFamily: "var(--font-poppins), Inter, sans-serif",
              fontWeight: 800,
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              textAlign: "center",
            }}
          >
            Sirf ₹2 mein shuru karo
          </h1>
          <p style={{ fontSize: 26, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
            100+ Indian dramas • 2 din free trial
          </p>
        </div>

        {/* Bottom: CTA + urgency */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="rounded-full font-semibold"
            style={{
              fontSize: 20,
              padding: "6px 24px",
              backgroundColor: "rgba(249, 115, 22, 0.15)",
              border: "1px solid rgba(249,115,22,0.5)",
              color: "#f97316",
            }}
          >
            Limited time offer
          </div>
          <button
            className="rounded-full font-bold"
            style={{
              fontSize: 32,
              padding: "20px 72px",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "0 4px 30px rgba(249,115,22,0.5)",
              color: "#fff",
            }}
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}
