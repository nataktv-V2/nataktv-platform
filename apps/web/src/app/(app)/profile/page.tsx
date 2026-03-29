"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useSubscription } from "@/components/subscription/SubscriptionGate";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RazorpayCheckout } from "@/components/subscription/RazorpayCheckout";

export default function ProfilePage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { status, isSubscribed, loading: subLoading } = useSubscription();
  const [cancelling, setCancelling] = useState(false);
  const [hadTrialBefore, setHadTrialBefore] = useState(false);
  const router = useRouter();

  // Check if user already used trial
  useEffect(() => {
    if (!user?.uid) return;
    fetch(`/api/subscription/check-trial?uid=${user.uid}`)
      .then((r) => r.json())
      .then((data) => setHadTrialBefore(data.hadTrial))
      .catch(() => {});
  }, [user?.uid]);

  // Redirect to /home after login
  useEffect(() => {
    if (!loading && user) {
      // If user just logged in (came from login screen), redirect to home
      const cameFromLogin = sessionStorage.getItem("nataktv_login_redirect");
      if (cameFromLogin) {
        sessionStorage.removeItem("nataktv_login_redirect");
        router.replace("/home");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Poster data for animated rows — more variety, less repetition
  const postersRow1 = [
    { title: "Shs! Kisiko\nBatana Mat!", img: "/posters/1.png", bg: "linear-gradient(160deg, #b91c1c 0%, #f59e0b 50%, #92400e 100%)" },
    { title: "New\nDhulhan", img: "/posters/2.png", bg: "linear-gradient(160deg, #dc2626 0%, #be185d 50%, #7f1d1d 100%)" },
    { title: "Khulja\nSim-Sim", img: "/posters/3.png", bg: "linear-gradient(160deg, #ea580c 0%, #facc15 50%, #78350f 100%)" },
    { title: "Ghat Ghat\nKa Paani", img: "/posters/4.png", bg: "linear-gradient(160deg, #1e40af 0%, #06b6d4 50%, #164e63 100%)" },
    { title: "Pati Patni\nAur Padosan", img: "/posters/5.png", bg: "linear-gradient(160deg, #7e22ce 0%, #ec4899 50%, #581c87 100%)" },
    { title: "Dil Ki\nBaatein", img: "/posters/1.png", bg: "linear-gradient(160deg, #059669 0%, #10b981 50%, #065f46 100%)" },
    { title: "Mohabbat\nKe Rang", img: "/posters/2.png", bg: "linear-gradient(160deg, #d946ef 0%, #a855f7 50%, #7e22ce 100%)" },
    { title: "Anokha\nRishta", img: "/posters/3.png", bg: "linear-gradient(160deg, #0284c7 0%, #38bdf8 50%, #0369a1 100%)" },
    { title: "Pyaar Ka\nSafar", img: "/posters/4.png", bg: "linear-gradient(160deg, #e11d48 0%, #fb7185 50%, #9f1239 100%)" },
    { title: "Sapno Ki\nDuniya", img: "/posters/5.png", bg: "linear-gradient(160deg, #ca8a04 0%, #fbbf24 50%, #92400e 100%)" },
  ];

  const postersRow2 = [
    { title: "Ghat Ghat\nKa Paani", img: "/posters/4.png", bg: "linear-gradient(160deg, #1e40af 0%, #06b6d4 50%, #164e63 100%)" },
    { title: "Pati Patni\nAur Padosan", img: "/posters/5.png", bg: "linear-gradient(160deg, #7e22ce 0%, #ec4899 50%, #581c87 100%)" },
    { title: "Shs! Kisiko\nBatana Mat!", img: "/posters/1.png", bg: "linear-gradient(160deg, #b91c1c 0%, #f59e0b 50%, #92400e 100%)" },
    { title: "Khulja\nSim-Sim", img: "/posters/3.png", bg: "linear-gradient(160deg, #ea580c 0%, #facc15 50%, #78350f 100%)" },
    { title: "Rangeen\nZindagi", img: "/posters/2.png", bg: "linear-gradient(160deg, #f43f5e 0%, #f97316 50%, #dc2626 100%)" },
    { title: "Jhuki\nNazar", img: "/posters/5.png", bg: "linear-gradient(160deg, #6366f1 0%, #818cf8 50%, #4338ca 100%)" },
    { title: "New\nDhulhan", img: "/posters/2.png", bg: "linear-gradient(160deg, #dc2626 0%, #be185d 50%, #7f1d1d 100%)" },
    { title: "Dil Se\nDil Tak", img: "/posters/1.png", bg: "linear-gradient(160deg, #0891b2 0%, #22d3ee 50%, #155e75 100%)" },
    { title: "Mera\nHumsafar", img: "/posters/3.png", bg: "linear-gradient(160deg, #a21caf 0%, #e879f9 50%, #86198f 100%)" },
    { title: "Ishq Wala\nPyaar", img: "/posters/4.png", bg: "linear-gradient(160deg, #15803d 0%, #4ade80 50%, #166534 100%)" },
  ];

  if (!user) {
    const handleLogin = async () => {
      sessionStorage.setItem("nataktv_login_redirect", "1");
      await signInWithGoogle();
    };

    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden fixed inset-0 bg-[#0a0a0c] z-40">
        {/* Logo + Tagline */}
        <div className="pt-14 pb-3 text-center z-10">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="text-3xl font-bold bg-gradient-to-r from-[#FFC107] via-[#FF6D00] via-[#E91E63] to-[#7B1FA2] bg-clip-text text-transparent">
              Natak
            </span>
            <span className="bg-[#7B1FA2] text-white text-base px-2.5 py-0.5 rounded-md font-semibold">
              TV
            </span>
          </div>
          <p className="text-zinc-400 text-sm">Watch dramas, series & stories</p>
        </div>

        {/* Animated Poster Rows — BIGGER thumbnails */}
        <div className="flex-1 flex flex-col justify-center gap-3 py-2 overflow-hidden">
          {/* Row 1 - scrolls right */}
          <div className="overflow-hidden">
            <div
              className="flex gap-3 will-change-transform"
              style={{ animation: "scroll-right 30s linear infinite", width: "max-content" }}
            >
              {[...postersRow1, ...postersRow1].map((poster, i) => (
                <div
                  key={`r1-${i}`}
                  className="relative w-[130px] sm:w-[155px] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl shadow-black/40 border border-white/5"
                  style={{ aspectRatio: "2/3", background: poster.bg }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={poster.img}
                    alt={poster.title}
                    className="absolute inset-0 w-full h-full object-cover z-[1]"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-[2]" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 z-[3]">
                    <span className="text-[11px] font-extrabold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-pre-line">
                      {poster.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - scrolls left */}
          <div className="overflow-hidden">
            <div
              className="flex gap-3 will-change-transform"
              style={{ animation: "scroll-left 35s linear infinite", width: "max-content" }}
            >
              {[...postersRow2, ...postersRow2].map((poster, i) => (
                <div
                  key={`r2-${i}`}
                  className="relative w-[130px] sm:w-[155px] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl shadow-black/40 border border-white/5"
                  style={{ aspectRatio: "2/3", background: poster.bg }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={poster.img}
                    alt={poster.title}
                    className="absolute inset-0 w-full h-full object-cover z-[1]"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-[2]" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 z-[3]">
                    <span className="text-[11px] font-extrabold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-pre-line">
                      {poster.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section — Google Button RIGHT after animation, then benefits, then legal */}
        <div className="px-6 pb-8 pt-4 text-center z-10 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/95 to-transparent">
          {/* Google Sign-In Button — prominent, right after posters */}
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-3 bg-white text-gray-800 w-full max-w-xs mx-auto px-6 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-xl shadow-white/5 mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Benefits row — compact */}
          <div className="flex justify-center gap-4 mb-4 text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span> No ads
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span> HD quality
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span> Cancel anytime
            </span>
          </div>

          {/* Legal links */}
          <p className="text-[10px] text-zinc-600 leading-relaxed">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline hover:text-[#f97316]">Terms</Link>
            {" · "}
            <Link href="/privacy" className="underline hover:text-[#f97316]">Privacy</Link>
            {" · "}
            <Link href="/refund" className="underline hover:text-[#f97316]">Refund</Link>
          </p>
        </div>
      </div>
    );
  }

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You can still watch until the end of your current billing period.")) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch {
      // ignore
    }
    setCancelling(false);
  };

  const subStatusLabel = status?.status || "Free";
  const statusColor: Record<string, string> = {
    ACTIVE: "bg-green-500/20 text-green-400",
    TRIAL: "bg-blue-500/20 text-blue-400",
    PAST_DUE: "bg-yellow-500/20 text-yellow-400",
    CANCELLED: "bg-red-500/20 text-red-400",
    EXPIRED: "bg-zinc-500/20 text-zinc-400",
    Free: "bg-zinc-500/20 text-zinc-400",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || ""}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#f97316] flex items-center justify-center text-white text-xl font-bold">
            {(user.displayName ?? user.email ?? "U")[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold">{user.displayName || "User"}</h1>
          <p className="text-zinc-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-[#121216] border border-white/10 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Subscription</h2>
          {!subLoading && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[subStatusLabel] || statusColor.Free}`}>
              {subStatusLabel}
            </span>
          )}
        </div>

        {isSubscribed ? (
          <>
            {status?.status === "TRIAL" && status.trialEnd && (
              <p className="text-zinc-400 text-sm mb-2">
                Trial ends: {new Date(status.trialEnd).toLocaleDateString()}
              </p>
            )}
            {status?.currentPeriodEnd && (
              <p className="text-zinc-400 text-sm mb-4">
                Next billing: {new Date(status.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full text-center border border-red-500/30 text-red-400 hover:bg-red-500/10 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {cancelling ? "Cancelling..." : "Cancel Subscription"}
            </button>
          </>
        ) : (
          <>
            <p className="text-zinc-400 text-sm mb-4">
              {hadTrialBefore
                ? "Subscribe to continue watching all content."
                : "Subscribe to unlock all content. Start with a ₹2 trial."}
            </p>
            {hadTrialBefore ? (
              <RazorpayCheckout
                onSuccess={() => router.push("/home")}
                onError={() => {}}
                className="w-full text-center text-white py-2.5 rounded-lg font-semibold text-sm"
                style={{
                  background: "linear-gradient(110deg, #f97316 0%, #f97316 40%, #fbbf24 50%, #f97316 60%, #f97316 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s linear infinite",
                }}
              >
                Subscribe Now ✨
              </RazorpayCheckout>
            ) : (
              <Link
                href="/subscribe"
                className="block text-center text-white py-2.5 rounded-lg font-semibold text-sm"
                style={{
                  background: "linear-gradient(110deg, #f97316 0%, #f97316 40%, #fbbf24 50%, #f97316 60%, #f97316 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s linear infinite",
                }}
              >
                Subscribe Now ✨
              </Link>
            )}
          </>
        )}
      </div>

      {/* Account Section */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-2">Account</h3>
        <div className="bg-[#121216] border border-white/10 rounded-xl overflow-hidden">
          {[
            { label: "Payment History", href: "/payments" },
          ].map((item, i, arr) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between py-3.5 px-4 text-sm hover:text-[#f97316] transition-colors ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
            >
              {item.label}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-500">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* History Section */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-2">History</h3>
        <div className="bg-[#121216] border border-white/10 rounded-xl overflow-hidden">
          {[
            { label: "Watch History", href: "/watch-history" },
          ].map((item, i, arr) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between py-3.5 px-4 text-sm hover:text-[#f97316] transition-colors ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
            >
              {item.label}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-500">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-2">Support</h3>
        <div className="bg-[#121216] border border-white/10 rounded-xl overflow-hidden">
          {[
            { label: "Help & Support", href: "/help" },
            { label: "Delete Account", href: "/delete-account" },
          ].map((item, i, arr) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between py-3.5 px-4 text-sm hover:text-[#f97316] transition-colors ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
            >
              {item.label}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-500">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Legal Section */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-2">Legal</h3>
        <div className="bg-[#121216] border border-white/10 rounded-xl overflow-hidden">
          {[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Refund Policy", href: "/refund" },
          ].map((item, i, arr) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between py-3.5 px-4 text-sm hover:text-[#f97316] transition-colors ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
            >
              {item.label}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-500">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={signOut}
        className="w-full mt-4 py-3 text-red-400 text-sm font-medium hover:bg-red-500/10 rounded-lg transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
