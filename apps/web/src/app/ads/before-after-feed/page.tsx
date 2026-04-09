import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function BeforeAfterFeed() {
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
      {/* LEFT HALF — Boring / Desaturated */}
      <div
        className="absolute"
        style={{ top: 0, left: 0, width: 540, height: 980 }}
      >
        {/* Background image with grayscale */}
        <div
          className="absolute inset-0"
          style={{ filter: "grayscale(100%)" }}
        >
          <Image
            src="/thumbnails/ads/hurry-burry.jpg"
            alt="Boring evening"
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.55)" }}
        />
        {/* Text */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: 40 }}
        >
          <p
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 44,
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            Boring evening?
          </p>
        </div>
      </div>

      {/* RIGHT HALF — Vibrant / Colorful */}
      <div
        className="absolute"
        style={{ top: 0, left: 540, width: 540, height: 980 }}
      >
        {/* Background image full color */}
        <div className="absolute inset-0">
          <Image
            src="/thumbnails/ads/hey-leela.jpg"
            alt="Ab nahi"
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
        {/* Orange glow overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0.08) 60%, transparent 100%)",
          }}
        />
        {/* Text */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: 40 }}
        >
          <p
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 44,
              fontWeight: 800,
              color: "#f97316",
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: "0 2px 16px rgba(249,115,22,0.5)",
            }}
          >
            Ab nahi!
          </p>
        </div>
      </div>

      {/* CENTER DIVIDER — 4px orange vertical line */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 538,
          width: 4,
          height: 980,
          backgroundColor: "#f97316",
          zIndex: 10,
        }}
      />

      {/* BOTTOM BAR */}
      <div
        className="absolute flex items-center justify-between"
        style={{
          bottom: 0,
          left: 0,
          width: 1080,
          height: 100,
          backgroundColor: "rgba(10,10,12,0.95)",
          padding: "0 40px",
          borderTop: "2px solid rgba(249,115,22,0.3)",
          zIndex: 20,
        }}
      >
        {/* Logo left */}
        <NatakLogo />

        {/* Center text */}
        <p
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 0.5,
          }}
        >
          ₹2 mein 100+ shows
        </p>

        {/* CTA button right */}
        <div
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            borderRadius: 12,
            padding: "14px 32px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            Download Natak TV
          </p>
        </div>
      </div>
    </div>
  );
}
