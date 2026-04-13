"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useCallback, useState } from "react";
import { isCapacitorApp } from "@/lib/revenuecat";

// Payment proxy for browser users (nataktv.com doesn't have Razorpay permission).
const BEATAI_PAYMENT_URL = "https://beatai.indidino.com/nataktv";
const PAYMENT_CALLBACK_URL = `${typeof window !== "undefined" ? window.location.origin : ""}/payment-done`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CapacitorWindow = Window & { Capacitor?: any };

/** Open Razorpay via native Android SDK (Capacitor plugin) */
function openNativeCheckout(
  paymentData: Record<string, unknown>,
  onSuccess: (data: { razorpay_payment_id: string; razorpay_subscription_id: string; razorpay_signature: string }) => void,
  onError: (error: string) => void,
) {
  const Checkout = (window as CapacitorWindow).Capacitor?.Plugins?.Checkout;
  if (!Checkout) {
    onError("Native checkout not available");
    return;
  }

  Checkout.open(paymentData)
    .then((result: Record<string, string>) => {
      onSuccess({
        razorpay_payment_id: result["razorpay_payment_id"] ?? "",
        razorpay_subscription_id: result["razorpay_subscription_id"] ?? "",
        razorpay_signature: result["razorpay_signature"] ?? "",
      });
    })
    .catch((err: { description?: string; code?: string }) => {
      // User cancelled or payment failed
      onError(err?.description || "Payment failed");
    });
}

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
          contact: "",
        },
        theme: { color: "#f97316" },
        notes: { _source: "nataktv" },
      };

      if (isCapacitorApp()) {
        // Native SDK — opens native Razorpay sheet with UPI Intent support
        openNativeCheckout(
          paymentData,
          (result) => {
            // Redirect to payment-done with Razorpay response params
            const params = new URLSearchParams({
              razorpay_payment_id: result.razorpay_payment_id,
              razorpay_subscription_id: result.razorpay_subscription_id,
              razorpay_signature: result.razorpay_signature,
            });
            window.location.href = `/payment-done?${params.toString()}`;
          },
          (error) => {
            onError?.(error);
            setLoading(false);
          },
        );
      } else {
        // Browser — redirect to beatai payment proxy
        const url =
          BEATAI_PAYMENT_URL +
          "?data=" + encodeURIComponent(JSON.stringify(paymentData)) +
          "&callback=" + encodeURIComponent(PAYMENT_CALLBACK_URL);

        window.location.href = url;
      }
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
