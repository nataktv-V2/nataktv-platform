"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useCallback, useState } from "react";
import { track as mpTrack } from "@/lib/mixpanel";

// Payment is routed through beatai.indidino.com/nataktv since nataktv.com
// doesn't have Razorpay payment permission yet.
// In Capacitor, allowNavigation keeps this inside the WebView (no Chrome).
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
    mpTrack("subscribe_tapped");
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
        mpTrack("subscribe_create_failed", { error: data.error });
        onError?.(data.error || "Failed to create subscription");
        setLoading(false);
        return;
      }
      mpTrack("subscribe_created", {
        subscription_id: data.subscriptionId,
        had_trial_before: data.hadTrialBefore,
      });

      // Build Razorpay options
      // Stealth mode: Razorpay checkout displays "Indidino" (beatai's business name)
      // instead of Natak TV, so merchant-level branding matches the registered
      // Razorpay account. No logo hosted on nataktv.com domain. No _source tag.
      const paymentData = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Indidino",
        description: data.hadTrialBefore
          ? "Monthly Subscription - ₹199/month"
          : "Monthly Subscription - Free Trial",
        prefill: {
          email: user.email || "",
          name: user.displayName || "",
          // Pre-select UPI as the payment method so the modal opens
          // directly on the UPI app picker (PhonePe / GPay / Paytm)
          // instead of the generic "Choose payment method" screen.
          method: "upi",
        },
        // Lock payment method to UPI — user can't switch to cards/wallets,
        // and the method-switcher UI is hidden.
        readonly: {
          method: true,
        },
        theme: { color: "#f97316" },
        config: {
          display: {
            blocks: {
              utib: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "upi",
                    // Order matters: intent first → app picker shows immediately
                    flows: ["intent", "collect", "qr"],
                  },
                ],
              },
            },
            sequence: ["block.utib"],
            // Hide cards/wallets/netbanking blocks — UPI only.
            preferences: {
              show_default_blocks: false,
            },
          },
        },
      };

      // Stash subscription_id and uid in sessionStorage so /payment-done
      // can recover even if beatai's callback doesn't forward them.
      // Known issue: beatai's handler was built for one-time payments and
      // sends order_id, not razorpay_subscription_id. This stash is the
      // stealth fallback (no Razorpay exposure needed).
      try {
        sessionStorage.setItem(
          "nataktv_pending_sub",
          JSON.stringify({
            subscriptionId: data.subscriptionId,
            uid: user.uid,
            ts: Date.now(),
          })
        );
      } catch {
        // sessionStorage may be unavailable in some contexts — non-fatal
      }

      mpTrack("subscribe_redirect_to_beatai");

      // Navigate to beatai payment proxy.
      // On web: opens in browser tab.
      // On Capacitor: stays inside WebView thanks to allowNavigation config.
      // Callback returns user to /payment-done on our domain.
      const url =
        BEATAI_PAYMENT_URL +
        "?data=" + encodeURIComponent(JSON.stringify(paymentData)) +
        "&callback=" + encodeURIComponent(PAYMENT_CALLBACK_URL);

      window.location.href = url;
    } catch (err) {
      mpTrack("subscribe_error", { error: String(err) });
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
