import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function ContentFeed() {
  const shows = [
    { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
    { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
    { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
    { img: "/thumbnails/ads/ghat-ghat-ka-paani.jpg", title: "Ghat Ghat Ka Paani" },
    { img: "/thumbnails/ads/love-shadi-dhokha.jpg", title: "Love Shadi Dhokha" },
    { img: "/thumbnails/ads/love-guru.jpg", title: "Love Guru" },
  ];

  const languages = [
    { name: "Hindi", color: "#FFC107" },
    { name: "Tamil", color: "#E91E63" },
    { name: "Telugu", color: "#7B1FA2" },
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
      {/* 3x2 Thumbnail Grid Background */}
      <div
        className="absolute inset-0 grid grid-cols-3 grid-rows-2"
        style={{ width: 1080, height: 1080 }}
      >
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

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-end h-full" style={{ paddingBottom: 80 }}>
        {/* Logo - top */}
        <div className="absolute" style={{ top: 40 }}>
          <NatakLogo size="lg" />
        </div>

        {/* Big number headline */}
        <h1
          className="text-center"
          style={{
            fontSize: 120,
            fontFamily: "var(--font-poppins), Inter, sans-serif",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          100+
        </h1>
        <p
          className="text-center"
          style={{
            fontSize: 48,
            fontFamily: "var(--font-poppins), Inter, sans-serif",
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: 28,
          }}
        >
          Shows Streaming Now
        </p>

        {/* Language pills */}
        <div className="flex gap-3" style={{ marginBottom: 36 }}>
          {languages.map((lang) => (
            <span
              key={lang.name}
              className="rounded-full font-semibold"
              style={{
                fontSize: 20,
                padding: "8px 24px",
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: `1.5px solid ${lang.color}80`,
                color: "#ffffff",
              }}
            >
              {lang.name}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          className="rounded-full font-bold"
          style={{
            fontSize: 28,
            padding: "18px 64px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            color: "#fff",
            border: "none",
          }}
        >
          Browse All Shows
        </button>
      </div>
    </div>
  );
}
