import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function FomoFeed() {
  const countdown = [
    { value: "23", label: "Hours" },
    { value: "59", label: "Min" },
    { value: "45", label: "Sec" },
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
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/thumbnails/ads/love-shadi-dhokha.jpg"
          alt="Love Shadi Dhokha"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>

      {/* Heavy dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(10, 10, 12, 0.85)" }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center h-full"
        style={{ padding: "48px 60px" }}
      >
        {/* Top row: Logo + LAST CHANCE badge */}
        <div className="flex items-start justify-between w-full">
          <NatakLogo size="lg" />
          <span
            className="rounded-full font-bold uppercase tracking-wide"
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              fontSize: 24,
              padding: "8px 24px",
            }}
          >
            LAST CHANCE
          </span>
        </div>

        {/* Countdown display */}
        <div
          className="flex items-center justify-center gap-6"
          style={{ marginTop: 100 }}
        >
          {countdown.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center rounded-2xl"
              style={{
                width: 180,
                height: 160,
                background: "rgba(255, 255, 255, 0.1)",
                border: "2px solid rgba(249, 115, 22, 0.5)",
              }}
            >
              <span
                className="font-black"
                style={{ fontSize: 72, color: "#f97316", lineHeight: 1 }}
              >
                {item.value}
              </span>
              <span
                style={{
                  fontSize: 20,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginTop: 8,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Price section */}
        <div
          className="flex items-center justify-center gap-6"
          style={{ marginTop: 64 }}
        >
          <span
            className="line-through"
            style={{
              fontSize: 48,
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            ₹199
          </span>
          <span
            className="font-black"
            style={{ fontSize: 120, color: "#f97316", lineHeight: 1 }}
          >
            ₹2
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-center"
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontWeight: 800,
            fontSize: 44,
            color: "#fff",
            marginTop: 40,
            lineHeight: 1.2,
          }}
        >
          Yeh offer khatam hone wala hai!
        </h1>

        {/* CTA Button */}
        <button
          className="rounded-2xl font-bold"
          style={{
            marginTop: 48,
            fontSize: 32,
            padding: "20px 64px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff",
            border: "none",
          }}
        >
          Abhi Subscribe Karo
        </button>
      </div>
    </div>
  );
}
