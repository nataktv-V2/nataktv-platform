"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useCallback, useState } from "react";
import { isCapacitorApp } from "@/lib/revenuecat";

// Payment is routed through beatai.indidino.com/nataktv since nataktv.com
// doesn't have Razorpay payment permission yet.
// In Capacitor WebView, we load Razorpay SDK inline to avoid opening Chrome.
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

/** Load Razorpay checkout.js script once */
function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(script);
  });
}

export function RazorpayCheckout({
  onSuccess,
  onError,
  children,
  className,
  style,
}: RazorpayCheckoutProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

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

      // --- CAPACITOR: Open Razorpay modal inline (no Chrome redirect) ---
      if (isCapacitorApp()) {
        await loadRazorpayScript();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Razorpay = (window as any).Razorpay;
        const rzp = new Razorpay({
          ...paymentData,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_subscription_id: string;
            razorpay_signature: string;
          }) => {
            // Verify payment on our server
            try {
              const verifyRes = await fetch("/api/subscription/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              if (verifyRes.ok) {
                onSuccess?.();
              } else {
                onError?.("Payment verification failed. Contact support if amount was deducted.");
              }
            } catch {
              onError?.("Network error during verification.");
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            },
            confirm_close: true,
          },
        });
        rzp.on("payment.failed", (resp: { error?: { description?: string } }) => {
          onError?.(resp?.error?.description || "Payment failed");
          setLoading(false);
        });
        rzp.open();
        return;
      }

      // --- WEB: Redirect to beatai proxy (existing flow) ---
      const url =
        BEATAI_PAYMENT_URL +
        "?data=" + encodeURIComponent(JSON.stringify(paymentData)) +
        "&callback=" + encodeURIComponent(PAYMENT_CALLBACK_URL);

      window.location.href = url;
    } catch {
      onError?.("Something went wrong");
      setLoading(false);
    }
  }, [user, onSuccess, onError]);

  return (
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
  );
}
