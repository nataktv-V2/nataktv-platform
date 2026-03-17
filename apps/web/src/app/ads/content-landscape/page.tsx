import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function ContentLandscape() {
  const shows = [
    { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
    { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
    { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
  ];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1200,
        height: 628,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Right side: 3 show thumbnails stacked */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col" style={{ width: 550 }}>
        {shows.map((show) => (
          <div key={show.title} className="relative flex-1 overflow-hidden">
            <Image
              src={show.img}
              alt={show.title}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
            {/* Show title label at bottom */}
            <div className="absolute bottom-2 left-3 right-3">
              <span
                className="font-bold"
                style={{
                  fontSize: 14,
                  color: "#fff",
                  textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                }}
              >
                {show.title}
              </span>
            </div>
          </div>
        ))}
        {/* Left fade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #0a0a0c 0%, rgba(10,10,12,0.5) 35%, transparent 75%)",
          }}
        />
      </div>

      {/* Left content */}
      <div className="relative flex flex-col justify-center h-full pl-14" style={{ maxWidth: 600 }}>
        <div className="mb-4">
          <NatakLogo size="md" />
        </div>

        <h1
          className="leading-tight mb-3"
          style={{ fontSize: 42, color: "#f4f4f5", fontFamily: "var(--font-poppins), Inter, sans-serif", fontWeight: 800 }}
        >
          100+{" "}
          <span style={{ color: "#f97316" }}>Indian Shows</span>
        </h1>

        <p className="mb-4" style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>
          Hindi, Tamil, Telugu — web series & short films
        </p>

        {/* Language pills */}
        <div className="flex gap-2 mb-5">
          {[
            { name: "Hindi", color: "#FFC107" },
            { name: "Tamil", color: "#E91E63" },
            { name: "Telugu", color: "#7B1FA2" },
          ].map((lang) => (
            <span
              key={lang.name}
              className="rounded-full font-semibold"
              style={{
                fontSize: 13,
                padding: "4px 14px",
                backgroundColor: `${lang.color}20`,
                border: `1px solid ${lang.color}40`,
                color: lang.color,
              }}
            >
              {lang.name}
            </span>
          ))}
        </div>

        <button
          className="rounded-full font-bold self-start"
          style={{
            fontSize: 20,
            padding: "12px 48px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            color: "#fff",
          }}
        >
          Browse All Shows
        </button>
      </div>
    </div>
  );
}
