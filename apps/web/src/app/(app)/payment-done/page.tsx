"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentDonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const paymentId = searchParams.get("razorpay_payment_id");
    const subscriptionId = searchParams.get("razorpay_subscription_id");
    const signature = searchParams.get("razorpay_signature");

    if (!paymentId || !subscriptionId || !signature) {
      setStatus("error");
      setErrorMsg("Payment details missing. Please try again.");
      return;
    }

    // Verify payment on our server
    fetch("/api/subscription/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_payment_id: paymentId,
        razorpay_subscription_id: subscriptionId,
        razorpay_signature: signature,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setStatus("success");
          setTimeout(() => router.push("/home"), 2000);
        } else {
          setStatus("error");
          setErrorMsg("Payment verification failed. Contact support if amount was deducted.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Network error. Please check your connection.");
      });
  }, [searchParams, router]);

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
          <h1 className="text-xl font-bold mb-2">Payment failed</h1>
          <p className="text-zinc-400 text-sm mb-6">{errorMsg}</p>
          <button
            onClick={() => router.push("/subscribe")}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
}
