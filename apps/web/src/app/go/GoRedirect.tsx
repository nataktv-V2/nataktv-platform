"use client";

import { useEffect, useState } from "react";

type Props = {
  playStoreUrl: string;
};

export function GoRedirect({ playStoreUrl }: Props) {
  const [countdown, setCountdown] = useState(3);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect Android
    const ua = navigator.userAgent || "";
    const android = /android/i.test(ua);
    setIsAndroid(android);

    if (android) {
      // Instant redirect on Android — try Android intent first, fallback to Play Store web
      const intentUrl =
        "intent://play.google.com/store/apps/details?id=com.nataktv.app#Intent;scheme=https;package=com.android.vending;end";

      // Try intent first
      try {
        window.location.href = intentUrl;
      } catch {
        // Fallback immediately
        window.location.replace(playStoreUrl);
      }

      // Fallback after 500ms if intent didn't work
      setTimeout(() => {
        window.location.replace(playStoreUrl);
      }, 500);
    } else {
      // For non-Android (desktop, iOS), redirect after 3s countdown
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            window.location.replace(playStoreUrl);
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [playStoreUrl]);

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        color: "#f4f4f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Hot Bollywood background image */}
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
      {/* Dark overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.5) 0%, rgba(10,10,12,0.85) 40%, rgba(10,10,12,0.95) 100%)",
          zIndex: 1,
        }}
      />
      {/* Orange glow behind content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 400,
          background: "radial-gradient(circle, rgba(249,115,22,0.3), transparent 70%)",
          filter: "blur(100px)",
          zIndex: 1,
        }}
      />
      {/* Content wrapper */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
      {/* Natak TV Logo */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          marginBottom: 16,
          background:
            "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Natak
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            backgroundColor: "#7c3aed",
            borderRadius: 6,
            padding: "4px 10px",
            marginLeft: 8,
            WebkitTextFillColor: "#fff",
          }}
        >
          TV
        </span>
      </div>

      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 12,
        }}
      >
        {isAndroid
          ? "Opening Play Store..."
          : "Get Natak TV on Android"}
      </h1>

      <p
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.7)",
          marginBottom: 32,
          maxWidth: 400,
        }}
      >
        100+ Indian dramas & web series. Sirf ₹2 mein shuru karo.
      </p>

      {!isAndroid && (
        <p style={{ fontSize: 16, color: "#f97316", marginBottom: 24 }}>
          Redirecting in {countdown}s...
        </p>
      )}

      {/* Manual fallback button */}
      <a
        href={playStoreUrl}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 32px",
          backgroundColor: "#f97316",
          color: "#fff",
          fontSize: 18,
          fontWeight: 700,
          borderRadius: 999,
          textDecoration: "none",
          boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
        }}
      >
        Download on Google Play
      </a>

      {/* Loading spinner for Android */}
      {isAndroid && (
        <div
          style={{
            marginTop: 32,
            width: 40,
            height: 40,
            border: "4px solid rgba(255,255,255,0.1)",
            borderTop: "4px solid #f97316",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      </div>
    </div>
  );
}
