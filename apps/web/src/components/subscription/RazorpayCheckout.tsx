"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { isCapacitorApp } from "@/lib/revenuecat";

// Payment is routed through beatai.indidino.com/nataktv since nataktv.com
// doesn't have Razorpay payment permission yet.
// In Capacitor, we show an iframe overlay so the user stays inside the app.
const BEATAI_PAYMENT_URL = "https://beatai.indidino.com/nataktv";
const PAYMENT_CALLBACK_URL = `${typeof window !== "undefined" ? window.location.origin : ""}/payment-done`;

// UPI config for auto-detecting installed payment apps
const UPI_CONFIG = {
  display: {
    blocks: {
      recommended: {
        name: "Pay using UPI App",
        instruments: [
          {
            method: "upi",
            flows: ["intent"],
            apps: ["phonepe", "google_pay", "paytm", "bhim", "cred"],
          },
        ],
      },
    },
    sequence: ["block.recommended"],
    preferences: {
      show_default_blocks: true,
    },
  },
};

type RazorpayCheckoutProps = {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function RazorpayCheckout({
  onSuccess,
  onError,
  children,
  className,
  style,
}: RazorpayCheckoutProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  // Listen for postMessage from payment-done page inside the iframe
  useEffect(() => {
    if (!showIframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;

      if (event.data.type === "razorpay-success") {
        setShowIframe(false);
        setIframeSrc("");
        setLoading(false);
        onSuccess?.();
      } else if (event.data.type === "razorpay-error") {
        setShowIframe(false);
        setIframeSrc("");
        setLoading(false);
        onError?.(event.data.error || "Payment failed");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [showIframe, onSuccess, onError]);

  const handleClose = useCallback(() => {
    setShowIframe(false);
    setIframeSrc("");
    setLoading(false);
  }, []);

  const handleClick = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Create subscription on our server
      const res = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });

      const data = await res.json();
      if (!res.ok) {
        onError?.(data.error || "Failed to create subscription");
        setLoading(false);
        return;
      }

      // Build Razorpay options
      const paymentData = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Natak TV",
        description: data.hadTrialBefore
          ? "Monthly Subscription - ₹199/month"
          : "Monthly Subscription - Free Trial",
        image: "https://app.nataktv.com/logo.png",
        prefill: {
          email: user.email || "",
          name: user.displayName || "",
          method: "upi",
        },
        theme: { color: "#f97316" },
        notes: { _source: "nataktv" },
        config: UPI_CONFIG,
      };

      // Build the beatai URL
      const beataiUrl =
        BEATAI_PAYMENT_URL +
        "?data=" + encodeURIComponent(JSON.stringify(paymentData)) +
        "&callback=" + encodeURIComponent(PAYMENT_CALLBACK_URL);

      // --- CAPACITOR: Show iframe overlay (stays inside the app) ---
      if (isCapacitorApp()) {
        setIframeSrc(beataiUrl);
        setShowIframe(true);
        return;
      }

      // --- WEB: Redirect to beatai proxy ---
      window.location.href = beataiUrl;
    } catch {
      onError?.("Something went wrong");
      setLoading(false);
    }
  }, [user, onSuccess, onError]);

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading || !user}
        className={className}
        style={style}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          children
        )}
      </button>

      {/* Full-screen iframe overlay for Capacitor in-app payment */}
      {showIframe && (
        <div
          ref={overlayRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "#000",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top bar with back button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              backgroundColor: "#0a0a0c",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0,
            }}
          >
            <button
              onClick={handleClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#fff",
                background: "none",
                border: "none",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              Back
            </button>
            <span
              style={{
                marginLeft: "auto",
                color: "#71717a",
                fontSize: "12px",
              }}
            >
              Secure Payment
            </span>
          </div>

          {/* Iframe loading the beatai payment page */}
          <iframe
            src={iframeSrc}
            style={{
              flex: 1,
              width: "100%",
              border: "none",
              backgroundColor: "#fff",
            }}
            allow="payment"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
          />
        </div>
      )}
    </>
  );
}
