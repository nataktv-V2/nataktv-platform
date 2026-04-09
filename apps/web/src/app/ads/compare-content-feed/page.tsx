import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function CompareContentFeed() {
  const shows = [
    { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
    { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
    { img: "/thumbnails/ads/love-shadi-dhokha.jpg", title: "Love Shadi Dhokha" },
    { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
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
      {/* Split layout */}
      <div className="flex h-full" style={{ paddingBottom: 120 }}>
        {/* LEFT side — Natak TV */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: "50%",
            height: "100%",
            padding: "48px 32px",
            background:
              "linear-gradient(180deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.03) 100%)",
          }}
        >
          <NatakLogo size="md" />

          <span
            className="font-bold text-center"
            style={{
              fontSize: 32,
              color: "#fff",
              marginTop: 40,
              lineHeight: 1.3,
            }}
          >
            100+ Indian Dramas
          </span>

          {/* 2x2 show grid */}
          <div
            className="grid grid-cols-2 gap-3"
            style={{ marginTop: 32 }}
          >
            {shows.map((show) => (
              <div
                key={show.title}
                className="relative overflow-hidden rounded-xl"
                style={{ width: 200, height: 120 }}
              >
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

          <span
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: 28,
            }}
          >
            Hindi &bull; Tamil &bull; Telugu
          </span>

          <span
            className="font-black"
            style={{
              fontSize: 48,
              color: "#f97316",
              marginTop: 20,
            }}
          >
            ₹2/month
          </span>
        </div>

        {/* Center divider with VS badge */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 0 }}
        >
          {/* Orange vertical line */}
          <div
            className="absolute"
            style={{
              width: 3,
              height: "80%",
              backgroundColor: "rgba(249, 115, 22, 0.4)",
              top: "10%",
            }}
          />
          {/* VS circle */}
          <div
            className="relative flex items-center justify-center rounded-full font-bold z-10"
            style={{
              width: 80,
              height: 80,
              backgroundColor: "#f97316",
              color: "#fff",
              fontSize: 32,
              boxShadow: "0 0 30px rgba(249, 115, 22, 0.5)",
            }}
          >
            VS
          </div>
        </div>

        {/* RIGHT side — Others */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: "50%",
            height: "100%",
            padding: "48px 32px",
          }}
        >
          <span
            className="font-bold"
            style={{
              fontSize: 40,
              color: "rgba(255, 255, 255, 0.35)",
            }}
          >
            Others
          </span>

          <span
            className="text-center"
            style={{
              fontSize: 28,
              color: "rgba(255, 255, 255, 0.25)",
              marginTop: 48,
              lineHeight: 1.4,
            }}
          >
            Limited Hindi
          </span>

          {/* Gray placeholder boxes */}
          <div
            className="grid grid-cols-2 gap-3"
            style={{ marginTop: 32 }}
          >
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-xl"
                style={{
                  width: 200,
                  height: 120,
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                }}
              />
            ))}
          </div>

          <span
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.2)",
              marginTop: 28,
            }}
          >
            Mostly English
          </span>

          <span
            className="font-bold"
            style={{
              fontSize: 36,
              color: "rgba(255, 255, 255, 0.3)",
              marginTop: 20,
            }}
          >
            ₹149–₹199/month
          </span>
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-8"
        style={{
          height: 120,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "0 48px",
        }}
      >
        <span
          className="font-bold"
          style={{
            fontSize: 32,
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
          }}
        >
          Clear winner.
        </span>
        <button
          className="rounded-2xl font-bold"
          style={{
            fontSize: 28,
            padding: "16px 48px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff",
            border: "none",
          }}
        >
          Download Natak TV
        </button>
      </div>
    </div>
  );
}
