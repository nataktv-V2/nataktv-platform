import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function DramaFeed() {
  const bottomShows = [
    { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
    { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
    { img: "/thumbnails/ads/love-shadi-dhokha.jpg", title: "Love Shadi Dhokha" },
  ];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1080,
        height: 1080,
        fontFamily: "var(--font-poppins), Inter, sans-serif",
      }}
    >
      {/* Hero background — Gaon Ki Biwi */}
      <Image
        src="/thumbnails/ads/gaon-ki-biwi.jpg"
        alt="Gaon Ki Biwi"
        fill
        style={{ objectFit: "cover" }}
        unoptimized
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.92) 85%, #000 100%)",
        }}
      />

      {/* Content layer */}
      <div className="absolute inset-0 flex flex-col justify-between" style={{ padding: 48 }}>
        {/* Top: Logo + Badge */}
        <div className="flex items-center justify-between">
          <NatakLogo size="lg" />
          <span
            className="rounded-full font-semibold"
            style={{
              fontSize: 20,
              padding: "8px 24px",
              backgroundColor: "rgba(249,115,22,0.2)",
              border: "1px solid rgba(249,115,22,0.6)",
              color: "#f97316",
              backdropFilter: "blur(8px)",
            }}
          >
            New episodes weekly
          </span>
        </div>

        {/* Bottom: Headline + Thumbnails + CTA */}
        <div className="flex flex-col items-center" style={{ gap: 32 }}>
          {/* Headline */}
          <h1
            className="text-center"
            style={{
              fontSize: 56,
              color: "#fff",
              fontWeight: 800,
              lineHeight: 1.15,
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}
          >
            Emotions jo{" "}
            <span
              style={{
                background: "linear-gradient(to right, #FFC107, #E91E63)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              dil chhu jaayein
            </span>
          </h1>

          {/* 3 show thumbnails row */}
          <div className="flex justify-center" style={{ gap: 20 }}>
            {bottomShows.map((show) => (
              <div
                key={show.title}
                className="relative overflow-hidden rounded-xl"
                style={{
                  width: 280,
                  height: 158,
                  border: "2px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src={show.img}
                  alt={show.title}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
                {/* Title overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-end"
                  style={{
                    padding: "24px 12px 8px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
                  }}
                >
                  <p
                    className="font-semibold"
                    style={{ fontSize: 16, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                  >
                    {show.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="rounded-full font-bold"
            style={{
              fontSize: 30,
              padding: "18px 64px",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
              color: "#fff",
              letterSpacing: "0.5px",
            }}
          >
            Binge Now — ₹2 Only
          </button>
        </div>
      </div>
    </div>
  );
}
