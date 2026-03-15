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
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Hero Price Section */}
      <div className="text-center mb-6">
        <p className="text-[#f97316] text-sm font-semibold tracking-wider uppercase mb-3">
          Start your trial today
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-6xl sm:text-7xl font-extrabold text-white">₹2</span>
        </div>
        <p className="text-zinc-300 text-lg mt-1">for 2 days of full access</p>
        <p className="text-zinc-500 text-sm mt-2">
          then ₹199/month · cancel anytime
        </p>
      </div>

      {/* Plan Card */}
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-5 mb-5">
        <h2 className="font-semibold text-sm text-zinc-300 uppercase tracking-wider mb-4">
          What you get
        </h2>
        <ul className="space-y-3 mb-6">
          {[
            { icon: "🎬", text: "Unlimited access to all content" },
            { icon: "📱", text: "Watch on any device" },
            { icon: "✨", text: "New shows added regularly" },
            { icon: "🚫", text: "No ads, ever" },
            { icon: "📺", text: "Stream in HD quality" },
            { icon: "🔓", text: "Cancel anytime, no questions" },
          ].map((feature) => (
            <li key={feature.text} className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="text-base">{feature.icon}</span>
              {feature.text}
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
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3.5 rounded-xl font-bold text-base transition-colors shadow-lg shadow-[#f97316]/20"
          >
            Start ₹2 Trial →
          </RazorpayCheckout>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3.5 rounded-xl font-bold text-base transition-colors shadow-lg shadow-[#f97316]/20"
          >
            Sign in & Start Trial →
          </button>
        )}
      </div>

      {/* Trust Signals */}
      <div className="flex justify-center gap-6 mb-5 text-zinc-500 text-xs">
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
          </svg>
          Secure payment
        </div>
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
          Powered by Razorpay
        </div>
      </div>

      {/* Fine print */}
      <p className="text-zinc-600 text-[10px] text-center leading-relaxed">
        ₹2 for 2-day trial, then ₹199/month. Auto-renews via Razorpay.
        Cancel anytime from your profile. No refund for partial months.
      </p>
    </div>
  );
}
