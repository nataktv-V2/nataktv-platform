"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useCallback, useState } from "react";

// Payment is routed through beatai.indidino.com/nataktv since nataktv.com
// doesn't have Razorpay payment permission yet.
const BEATAI_PAYMENT_URL = "https://beatai.indidino.com/nataktv";
const PAYMENT_CALLBACK_URL = `${typeof window !== "undefined" ? window.location.origin : ""}/payment-done`;

type RazorpayCheckoutProps = {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function RazorpayCheckout({
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
      // Create subscription on our server (uses beatai Razorpay keys)
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

      // Build Razorpay options to pass to beatai payment page
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
        // Auto-detect UPI apps (PhonePe, GPay, Paytm etc.) for one-tap payment
        config: {
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
              show_default_blocks: true, // keep other methods (card, netbanking) below
            },
          },
        },
      };

      // Redirect to beatai payment proxy page
      const url =
        BEATAI_PAYMENT_URL +
        "?data=" + encodeURIComponent(JSON.stringify(paymentData)) +
        "&callback=" + encodeURIComponent(PAYMENT_CALLBACK_URL);

      window.location.href = url;
    } catch {
      onError?.("Something went wrong");
      setLoading(false);
    }
  }, [user, onError]);

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
