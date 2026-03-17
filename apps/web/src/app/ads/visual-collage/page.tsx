import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function VisualCollage() {
  const shows = [
    { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
    { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
    { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
    { img: "/thumbnails/ads/hurry-burry.jpg", title: "Hurry Burry" },
  ];

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0a0a0c",
        fontFamily: "var(--font-poppins), Inter, sans-serif",
        fontWeight: 800,
      }}
    >
      {/* Top: Logo + ₹2 badge */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4">
        <NatakLogo size="md" />
        <div
          className="flex items-center justify-center rounded-full font-black"
          style={{
            width: 90,
            height: 90,
            backgroundColor: "#f97316",
            color: "#fff",
            fontSize: 34,
            boxShadow: "0 4px 24px rgba(249,115,22,0.5)",
          }}
        >
          ₹2
        </div>
      </div>

      {/* 2x2 Thumbnail grid */}
      <div className="grid grid-cols-2 gap-3 px-6 flex-1" style={{ paddingBottom: 8 }}>
        {shows.map((show) => (
          <div key={show.title} className="relative rounded-2xl overflow-hidden">
            <Image
              src={show.img}
              alt={show.title}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
            {/* Title overlay at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}
            >
              <p className="font-bold" style={{ fontSize: 22, color: "#f4f4f5", textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 1px 6px rgba(0,0,0,0.9)" }}>
                {show.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center pb-6 pt-2">
        <span
          className="rounded-full font-semibold"
          style={{
            fontSize: 22,
            padding: "8px 28px",
            backgroundColor: "rgba(249,115,22,0.15)",
            border: "1px solid #f97316",
            color: "#f97316",
            marginBottom: 12,
          }}
        >
          Trending this week
        </span>
        <button
          className="rounded-full font-bold"
          style={{
            fontSize: 26,
            padding: "16px 56px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            color: "#fff",
          }}
        >
          Pick a Show — ₹2 Trial
        </button>
      </div>
    </div>
  );
}
