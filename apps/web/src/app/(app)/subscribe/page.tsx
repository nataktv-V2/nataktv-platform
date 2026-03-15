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
      {/* Unlock Visual — Blurred+Locked → ₹2 Arrow → Clear+Unlocked */}
      <div className="mb-6">
        <p className="text-center text-[#f97316] text-xs font-semibold tracking-widest uppercase mb-4">
          Unlock everything
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* LEFT — Blurred + Locked thumbnail */}
          <div className="relative w-[110px] sm:w-[130px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-black/40" style={{ aspectRatio: "2/3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/posters/1.png"
              alt="Locked content"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "blur(8px) brightness(0.4) grayscale(0.5)", transform: "scale(1.1)" }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50 z-[1]" />
            {/* Lock icon */}
            <div className="absolute inset-0 flex items-center justify-center z-[2]">
              <div className="w-12 h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-zinc-400">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3A5.25 5.25 0 0 0 12 1.5Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {/* "Locked" label */}
            <div className="absolute bottom-0 left-0 right-0 py-2 text-center z-[3] bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Locked</span>
            </div>
          </div>

          {/* CENTER — Arrow with ₹2 */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0 px-1">
            {/* ₹2 badge */}
            <div className="bg-[#f97316] text-white text-sm sm:text-base font-extrabold px-3 py-1.5 rounded-full shadow-lg shadow-[#f97316]/30 whitespace-nowrap">
              Just ₹2
            </div>
            {/* Arrow */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#f97316]">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            <span className="text-[10px] text-zinc-500 font-medium">2-day trial</span>
          </div>

          {/* RIGHT — Clear + Unlocked thumbnail */}
          <div className="relative w-[110px] sm:w-[130px] flex-shrink-0 rounded-2xl overflow-hidden border-2 border-[#f97316]/40 shadow-lg shadow-[#f97316]/10" style={{ aspectRatio: "2/3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/posters/1.png"
              alt="Unlocked content"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[1]" />
            {/* Play icon */}
            <div className="absolute inset-0 flex items-center justify-center z-[2]">
              <div className="w-12 h-12 rounded-full bg-[#f97316]/90 flex items-center justify-center shadow-lg shadow-[#f97316]/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white ml-0.5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {/* "Unlocked" label */}
            <div className="absolute bottom-0 left-0 right-0 py-2 text-center z-[3] bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Unlocked</span>
            </div>
          </div>
        </div>

        {/* Subtext under visual */}
        <p className="text-center text-zinc-500 text-xs mt-3">
          then ₹199/month · cancel anytime
        </p>
      </div>

      {/* CTA Button */}
      <div className="mb-5">
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        {user ? (
          <RazorpayCheckout
            onSuccess={() => router.push("/home")}
            onError={(err) => setError(err)}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-[#f97316]/25"
          >
            Start ₹2 Trial →
          </RazorpayCheckout>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-[#f97316]/25"
          >
            Sign in & Start Trial →
          </button>
        )}

        {/* Trust row under CTA */}
        <div className="flex justify-center gap-5 mt-3 text-zinc-500 text-[11px]">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-500">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
            </svg>
            Secure
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-500">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
            Razorpay
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-500">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
            Cancel anytime
          </div>
        </div>
      </div>

      {/* Benefits Card */}
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-5 mb-5">
        <h2 className="font-semibold text-sm text-zinc-300 uppercase tracking-wider mb-4">
          What you get
        </h2>
        <ul className="space-y-3">
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
      </div>

      {/* Fine print */}
      <p className="text-zinc-600 text-[10px] text-center leading-relaxed">
        ₹2 for 2-day trial, then ₹199/month. Auto-renews via Razorpay.
        Cancel anytime from your profile. No refund for partial months.
      </p>
    </div>
  );
}
