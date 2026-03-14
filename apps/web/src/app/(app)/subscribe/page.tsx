"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { RazorpayCheckout } from "@/components/subscription/RazorpayCheckout";
import { useSubscription } from "@/components/subscription/SubscriptionGate";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SubscribePage() {
  const { user, signInWithGoogle } = useAuth();
  const { isSubscribed, status, loading } = useSubscription();
  const router = useRouter();
  const [error, setError] = useState("");

  // Already subscribed
  if (!loading && isSubscribed) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">You&apos;re subscribed!</h1>
        <p className="text-zinc-400 mb-1">
          {status?.status === "TRIAL"
            ? "Your trial is active"
            : "Your subscription is active"}
        </p>
        {status?.trialEnd && status.status === "TRIAL" && (
          <p className="text-sm text-zinc-500 mb-6">
            Trial ends: {new Date(status.trialEnd).toLocaleDateString()}
          </p>
        )}
        <button
          onClick={() => router.push("/home")}
          className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Start Watching
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-2">
        Unlimited entertainment
      </h1>
      <p className="text-zinc-400 text-center mb-8">
        One plan. All content. No ads.
      </p>

      {/* Plan Card */}
      <div className="bg-[#121216] border-2 border-[#f97316] rounded-2xl p-6 mb-6">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-bold">₹199</span>
          <span className="text-zinc-400">/month</span>
        </div>
        <p className="text-[#f97316] text-sm font-medium mb-4">
          Start with a ₹2 trial for 2 days
        </p>
        <ul className="space-y-3 mb-6">
          {[
            "Unlimited access to all content",
            "Stream in HD quality",
            "Watch on any device",
            "New shows added regularly",
            "No ads, ever",
            "Cancel anytime",
          ].map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        {user ? (
          <RazorpayCheckout
            onSuccess={() => router.push("/home")}
            onError={(err) => setError(err)}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Start ₹2 Trial
          </RazorpayCheckout>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Sign in & Subscribe
          </button>
        )}
      </div>

      {/* Fine print */}
      <p className="text-zinc-500 text-xs text-center">
        ₹2 for 2-day trial, then ₹199/month. Auto-renews via Razorpay.
        Cancel anytime from your profile.
      </p>
    </div>
  );
}
