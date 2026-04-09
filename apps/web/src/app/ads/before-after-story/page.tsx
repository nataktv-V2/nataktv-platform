import Image from "next/image";
import { NatakLogo } from "@/components/ads/NatakLogo";

export default function BeforeAfterStory() {
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
      {/* NatakLogo top-left */}
      <div className="absolute" style={{ top: 40, left: 40, zIndex: 30 }}>
        <NatakLogo />
      </div>

      {/* TOP HALF — Boring / Desaturated */}
      <div
        className="absolute"
        style={{ top: 0, left: 0, width: 1080, height: 960 }}
      >
        {/* Background image with grayscale */}
        <div
          className="absolute inset-0"
          style={{ filter: "grayscale(100%)" }}
        >
          <Image
            src="/thumbnails/ads/love-shadi-dhokha.jpg"
            alt="Pehle boring tha"
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.5)" }}
        />
        {/* Text */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: 60 }}
        >
          <p
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 52,
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: "0 3px 16px rgba(0,0,0,0.7)",
            }}
          >
            Pehle: Boring tha sab
          </p>
        </div>
      </div>

      {/* BOTTOM HALF — Vibrant / Colorful */}
      <div
        className="absolute"
        style={{ top: 960, left: 0, width: 1080, height: 960 }}
      >
        {/* Background image full color */}
        <div className="absolute inset-0">
          <Image
            src="/thumbnails/ads/gaon-ki-biwi.jpg"
            alt="Ab ruk nahi paate"
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
        {/* Warm glow overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(249,115,22,0.2) 0%, rgba(234,88,12,0.08) 60%, transparent 100%)",
          }}
        />
        {/* Text */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: 60 }}
        >
          <p
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 52,
              fontWeight: 800,
              color: "#f97316",
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: "0 3px 20px rgba(249,115,22,0.5)",
            }}
          >
            Ab: Ruk hi nahi paate!
          </p>
        </div>
      </div>

      {/* CENTER DIVIDER — 4px orange horizontal line */}
      <div
        className="absolute"
        style={{
          top: 958,
          left: 0,
          width: 1080,
          height: 4,
          backgroundColor: "#f97316",
          zIndex: 10,
        }}
      />

      {/* BOTTOM CTA SECTION */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          bottom: 60,
          left: 0,
          width: 1080,
          zIndex: 20,
        }}
      >
        {/* Price text */}
        <p
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            marginBottom: 24,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          ₹2 mein shuru karo
        </p>

        {/* CTA Button */}
        <div
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            borderRadius: 16,
            padding: "20px 64px",
            boxShadow: "0 8px 32px rgba(249,115,22,0.4)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            Start Free Trial
          </p>
        </div>

        {/* Swipe up hint */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            marginTop: 20,
            letterSpacing: 1,
          }}
        >
          Swipe up
        </p>
      </div>
    </div>
  );
}
