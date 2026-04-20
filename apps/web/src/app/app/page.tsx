import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Download Natak TV — Indian Dramas & Web Series on Android",
  description:
    "Watch 100+ Indian dramas and web series on Natak TV. Hindi, Tamil, Telugu content. Start with ₹2.",
  alternates: { canonical: "/app" },
  robots: { index: false, follow: false },
};

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.nataktv.app";

export default function AppLanding() {
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        color: "#f4f4f5",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/thumbnails/ads/love-shadi-dhokha.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.4) 0%, rgba(10,10,12,0.9) 40%, rgba(10,10,12,0.98) 100%)",
          zIndex: 1,
        }}
      />
      {/* Orange glow */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 500,
          background:
            "radial-gradient(circle, rgba(249,115,22,0.3), transparent 70%)",
          filter: "blur(120px)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            marginBottom: 20,
            display: "inline-flex",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              background:
                "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Natak
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              backgroundColor: "#7c3aed",
              borderRadius: 8,
              padding: "6px 12px",
              marginLeft: 10,
            }}
          >
            TV
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 12,
            maxWidth: 500,
            lineHeight: 1.2,
          }}
        >
          100+ Indian Dramas & Web Series
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.75)",
            marginBottom: 32,
            maxWidth: 450,
            lineHeight: 1.5,
          }}
        >
          Hindi • Tamil • Telugu<br />
          Start watching for ₹2
        </p>

        {/* Google Play Button - MASSIVE */}
        <a
          href={PLAY_STORE_URL}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "20px 40px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff",
            fontSize: 22,
            fontWeight: 800,
            borderRadius: 999,
            textDecoration: "none",
            boxShadow: "0 8px 40px rgba(249,115,22,0.5)",
            marginBottom: 20,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 20.5V3.5c0-.59.34-1.11.84-1.36L13.69 12 3.84 21.85c-.5-.25-.84-.77-.84-1.35zM16.81 15.12L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.56.69.56 1.16s-.22.89-.55 1.16l-2.29 1.34-2.5-2.5 2.5-2.5 2.28 1.34zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
          </svg>
          <span>Download on Google Play</span>
        </a>

        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            marginBottom: 40,
          }}
        >
          Free download • No credit card required
        </p>

        {/* Show thumbnails row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 32,
            maxWidth: 500,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            "gaon-ki-biwi",
            "hey-leela",
            "kalyanam-to-kadhal",
            "love-guru",
          ].map((show) => (
            <div
              key={show}
              style={{
                width: 100,
                height: 140,
                borderRadius: 12,
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.1)",
                position: "relative",
              }}
            >
              <Image
                src={`/thumbnails/ads/${show}.jpg`}
                alt={show}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <span>📱 100+ Shows</span>
          <span>🎬 New episodes weekly</span>
          <span>💸 From ₹2</span>
          <span>🇮🇳 Made in India</span>
        </div>
      </div>
    </div>
  );
}
