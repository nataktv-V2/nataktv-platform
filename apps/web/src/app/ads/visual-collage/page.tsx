import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function VisualCollage() {
  const shows = [
    { id: "eZkwCc4KpGc", title: "Gaon Ki Biwi" },
    { id: "W4jdt5QVmFQ", title: "Kalyanam to Kadhal" },
    { id: "Ds1X74cvKtI", title: "Hey Leela" },
    { id: "FqS4gZyPCno", title: "Hurry Burry" },
  ];

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
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
          <div key={show.id} className="relative rounded-2xl overflow-hidden">
            <Image
              src={`https://img.youtube.com/vi/${show.id}/maxresdefault.jpg`}
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
              <p className="font-bold" style={{ fontSize: 22, color: "#f4f4f5" }}>
                {show.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center pb-6 pt-2">
        <button
          className="rounded-full font-bold"
          style={{
            fontSize: 26,
            padding: "16px 56px",
            backgroundColor: "#f97316",
            color: "#fff",
          }}
        >
          Watch Now — ₹2 Trial
        </button>
      </div>
    </div>
  );
}
