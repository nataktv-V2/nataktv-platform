import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function BeforeAfterSwipe() {
  const thumbnails = [
    { src: "/thumbnails/ads/gaon-ki-biwi.jpg", alt: "Gaon Ki Biwi", rotate: -3 },
    { src: "/thumbnails/ads/hey-leela.jpg", alt: "Hey Leela", rotate: 0 },
    { src: "/thumbnails/ads/love-guru.jpg", alt: "Love Guru", rotate: 3 },
  ];

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
      {/* Full background image */}
      <div className="absolute inset-0">
        <Image
          src="/thumbnails/ads/ghat-ghat-ka-paani.jpg"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>
      {/* Overall dark overlay for depth */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.35)" }}
      />

      {/* TOP 30% — Heavy dark overlay + question text */}
      <div
        className="absolute"
        style={{ top: 0, left: 0, width: 1080, height: 576 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: "80px 60px 0" }}
        >
          <p
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 56,
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            }}
          >
            Sochte ho kya dekhein?
          </p>
        </div>
      </div>

      {/* NatakLogo top-left */}
      <div className="absolute" style={{ top: 40, left: 40, zIndex: 30 }}>
        <NatakLogo />
      </div>

      {/* "Limited Time" badge top-right */}
      <div
        className="absolute"
        style={{
          top: 44,
          right: 40,
          zIndex: 30,
          backgroundColor: "#f97316",
          borderRadius: 999,
          padding: "10px 28px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#ffffff",
            whiteSpace: "nowrap",
          }}
        >
          Limited Time
        </p>
      </div>

      {/* MIDDLE — Big orange arrow pointing down */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: 576,
          left: 0,
          width: 1080,
          height: 200,
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontSize: 80,
            color: "#f97316",
            textShadow: "0 4px 24px rgba(249,115,22,0.6)",
            lineHeight: 1,
          }}
        >
          ▼
        </p>
      </div>

      {/* BOTTOM 50% — Thumbnails + text + CTA */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          top: 776,
          left: 0,
          width: 1080,
          height: 1144,
          zIndex: 10,
        }}
      >
        {/* Subtle dark gradient for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* 3 show thumbnails in a row */}
        <div
          className="relative flex items-center justify-center"
          style={{
            gap: 28,
            marginTop: 80,
          }}
        >
          {thumbnails.map((thumb, i) => (
            <div
              key={i}
              className="relative overflow-hidden"
              style={{
                width: 300,
                height: 200,
                borderRadius: 20,
                transform: `rotate(${thumb.rotate}deg)`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                border: "3px solid rgba(255,255,255,0.15)",
                flexShrink: 0,
              }}
            >
              <Image
                src={thumb.src}
                alt={thumb.alt}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* "100+ Indian Dramas" text */}
        <p
          className="relative"
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontSize: 40,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            marginTop: 60,
            textShadow: "0 2px 12px rgba(0,0,0,0.7)",
          }}
        >
          100+ Indian Dramas
        </p>

        {/* CTA Button */}
        <div
          className="relative"
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            borderRadius: 20,
            padding: "24px 80px",
            marginTop: 60,
            boxShadow: "0 8px 40px rgba(249,115,22,0.45)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 36,
              fontWeight: 700,
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            Download — ₹2 Only
          </p>
        </div>
      </div>
    </div>
  );
}
