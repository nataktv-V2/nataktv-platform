"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

type Status = "verifying" | "success" | "error";

function PaymentVerifier() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Extract any callback params beatai might have sent.
    // Razorpay subscription callbacks return razorpay_subscription_id,
    // one-time payments return razorpay_order_id. beatai sometimes sends
    // these unprefixed (payment_id / order_id / signature).
    const paymentId =
      searchParams.get("razorpay_payment_id") ||
      searchParams.get("payment_id");
    const urlSubscriptionId =
      searchParams.get("razorpay_subscription_id") ||
      searchParams.get("subscription_id") ||
      searchParams.get("razorpay_order_id") ||
      searchParams.get("order_id");
    const signature =
      searchParams.get("razorpay_signature") ||
      searchParams.get("signature");

    // Always log for diagnosis
    const allParams: Record<string, string> = {};
    searchParams.forEach((v, k) => { allParams[k] = v; });
    console.log("[payment-done] URL params:", JSON.stringify(allParams));

    let cancelled = false;

    async function activate() {
      // Path 1: Full callback params → verify via /api/subscription/verify
      if (paymentId && urlSubscriptionId && signature) {
        console.log("[payment-done] Path 1: signature verify");
        const res = await fetch("/api/subscription/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: paymentId,
            razorpay_subscription_id: urlSubscriptionId,
            razorpay_signature: signature,
          }),
        });
        if (cancelled) return;
        if (res.ok) {
          setStatus("success");
          setTimeout(() => router.push("/home"), 2000);
          return;
        }
        console.warn("[payment-done] verify failed, falling back to refresh");
      }

      // Path 2: beatai didn't send proper params. Recover via API polling.
      // Try sessionStorage first (exact subscription_id), then fall back
      // to user's latest PENDING subscription.
      if (!user?.uid) {
        // Wait for user to load (AuthProvider still resolving)
        return;
      }

      let storedSubId: string | undefined;
      try {
        const raw = sessionStorage.getItem("nataktv_pending_sub");
        if (raw) {
          const parsed = JSON.parse(raw) as {
            subscriptionId?: string;
            uid?: string;
            ts?: number;
          };
          // Only trust if same user and < 30 min old
          if (
            parsed?.uid === user.uid &&
            parsed?.ts &&
            Date.now() - parsed.ts < 30 * 60 * 1000
          ) {
            storedSubId = parsed.subscriptionId;
          }
        }
      } catch {
        // ignore
      }
      console.log("[payment-done] Path 2: refresh poll, subId=", storedSubId);

      // Try multiple times — Razorpay can take a few seconds to mark
      // the subscription as authenticated after user pays.
      const maxAttempts = 6;
      const delayMs = 2500;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (cancelled) return;
        try {
          const res = await fetch("/api/subscription/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.uid,
              subscriptionId: storedSubId,
            }),
          });
          if (res.ok) {
            const json = (await res.json()) as {
              activated?: boolean;
              status?: string;
            };
            if (json.activated) {
              try { sessionStorage.removeItem("nataktv_pending_sub"); } catch {}
              setStatus("success");
              setTimeout(() => router.push("/home"), 2000);
              return;
            }
          }
        } catch {
          // network blip — retry
        }
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }

      if (cancelled) return;
      setStatus("error");
      setErrorMsg(
        "We couldn't confirm your payment yet. If the amount was deducted, it will activate automatically — tap Refresh on your profile in a minute."
      );
    }

    activate();
    return () => { cancelled = true; };
  }, [searchParams, router, user?.uid]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      {status === "verifying" && (
        <>
          <div className="w-12 h-12 border-3 border-[#f97316] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Verifying payment...</h1>
          <p className="text-zinc-400 text-sm">Please wait while we confirm your payment.</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment successful!</h1>
          <p className="text-zinc-400 text-sm">Redirecting to home...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Payment check pending</h1>
          <p className="text-zinc-400 text-sm mb-6">{errorMsg}</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/profile")}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Go to Profile
            </button>
            <button
              onClick={() => router.push("/subscribe")}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function PaymentDonePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 border-3 border-[#f97316] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Verifying payment...</h1>
        </div>
      }
    >
      <PaymentVerifier />
    </Suspense>
  );
}
