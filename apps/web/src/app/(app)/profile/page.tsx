"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useSubscription } from "@/components/subscription/SubscriptionGate";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { status, isSubscribed, loading: subLoading } = useSubscription();
  const [cancelling, setCancelling] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Sign in to Natak TV</h1>
        <p className="text-zinc-400 mb-6">
          Watch unlimited dramas, short films, and web series.
        </p>
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-3 bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
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
              Subscribe to unlock all content. Start with a ₹2 trial.
            </p>
            <Link
              href="/subscribe"
              className="block text-center bg-[#f97316] hover:bg-[#ea580c] text-white py-2.5 rounded-lg font-semibold transition-colors text-sm"
            >
              Subscribe — ₹199/month
            </Link>
          </>
        )}
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        {[
          { label: "Watch History", href: "/home" },
          { label: "Help & Support", href: "mailto:officialnataktv@gmail.com" },
          { label: "About Natak TV", href: "/" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center justify-between py-3 px-1 border-b border-white/5 text-sm hover:text-[#f97316] transition-colors"
          >
            {item.label}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-500">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </a>
        ))}
      </div>

      {/* Sign Out */}
      <button
        onClick={signOut}
        className="w-full mt-8 py-3 text-red-400 text-sm font-medium hover:bg-red-500/10 rounded-lg transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
