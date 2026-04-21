import type { Metadata } from "next";
import Image from "next/image";
import { AutoRedirect } from "./AutoRedirect";

export const metadata: Metadata = {
  title: "Natak TV — 10,000+ Indian Dramas & Web Series | Watch for ₹2",
  description:
    "Stream 10,000+ Indian dramas and web series on Natak TV. New episodes weekly. Start watching for just ₹2. Download the app on Google Play.",
  keywords: [
    "Natak TV",
    "Indian web series",
    "Indian dramas",
    "desi drama app",
    "Hindi web series",
    "OTT India",
    "Indian streaming app",
    "watch web series India",
    "cheap OTT subscription",
    "₹2 streaming",
  ],
  alternates: { canonical: "https://nataktv.com/app" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Natak TV — 10,000+ Indian Dramas & Web Series for ₹2",
    description:
      "Stream 10,000+ Indian dramas and web series. New episodes weekly. Start watching for ₹2. Download on Google Play.",
    url: "https://nataktv.com/app",
    siteName: "Natak TV",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://nataktv.com/thumbnails/ads/love-shadi-dhokha.jpg",
        width: 1200,
        height: 630,
        alt: "Natak TV — 10,000+ Indian Dramas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Natak TV — 10,000+ Indian Dramas & Web Series for ₹2",
    description:
      "Stream 10,000+ Indian dramas. Start watching for ₹2. Download on Google Play.",
    images: ["https://nataktv.com/thumbnails/ads/love-shadi-dhokha.jpg"],
  },
};

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.nataktv.app";

export default function AppLanding() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener"
      aria-label="Download Natak TV on Google Play"
      style={{
        minHeight: "100vh",
        position: "relative",
        color: "#f4f4f5",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        display: "block",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <AutoRedirect url={PLAY_STORE_URL} delayMs={3000} />
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
            alignItems: "center",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              background:
                "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
            }}
          >
            Natak
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#fff",
              backgroundColor: "#7c3aed",
              borderRadius: 10,
              padding: "8px 14px",
              marginLeft: 12,
              lineHeight: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            TV
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 88,
            fontWeight: 900,
            margin: 0,
            lineHeight: 1,
            background:
              "linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
          }}
        >
          10,000+
        </h1>

        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            marginTop: 8,
            marginBottom: 32,
            color: "#fff",
            lineHeight: 1.2,
            maxWidth: 560,
          }}
        >
          Indian Dramas and Series
          <br />
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#fbbf24",
              display: "inline-block",
              marginTop: 6,
              lineHeight: 1,
            }}
          >
            Just ₹2
          </span>
        </p>

        {/* Google Play Button - MASSIVE */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 18,
            padding: "24px 44px",
            background: "#fff",
            color: "#0a0a0c",
            fontSize: 34,
            fontWeight: 900,
            borderRadius: 999,
            textDecoration: "none",
            boxShadow: "0 16px 60px rgba(249,115,22,0.6)",
            marginBottom: 20,
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
            maxWidth: "92vw",
          }}
        >
          <svg
            width="48"
            height="52"
            viewBox="0 0 512 555"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 11C9 17 2 28 2 43v469c0 15 7 26 18 32l272-270L20 11z"
              fill="#2196f3"
            />
            <path
              d="M378 191L76 16l-56-5 272 266 86-86z"
              fill="#4caf50"
            />
            <path
              d="M482 235L378 191l-86 86 86 86 104-44c26-16 26-68 0-84z"
              fill="#ffc107"
            />
            <path
              d="M292 277L20 543c11 6 26 5 40-3l318-175-86-88z"
              fill="#f44336"
            />
          </svg>
          <span>PLAYSTORE</span>
        </span>

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
          <span>📱 10,000+ Shows</span>
          <span>🎬 New episodes weekly</span>
          <span>💸 From ₹2</span>
          <span>🇮🇳 Made in India</span>
        </div>
      </div>
    </a>
  );
}
