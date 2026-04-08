"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { isCapacitorApp, checkEntitlement } from "@/lib/revenuecat";

type SubscriptionGateProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type SubStatus = {
  subscribed: boolean;
  status: string | null;
  trialEnd?: string;
  currentPeriodEnd?: string;
};

export function useSubscription() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setStatus(null);
      setLoading(false);
      return;
    }

    const uid = user.uid;

    // In Capacitor, also check RevenueCat entitlement
    if (isCapacitorApp()) {
      checkEntitlement().then((active) => {
        if (active) {
          setStatus({ subscribed: true, status: "ACTIVE" });
          setLoading(false);
          return;
        }
        fetchServerStatus();
      });
    } else {
      fetchServerStatus();
    }

    function fetchServerStatus() {
      fetch(`/api/subscription/status?uid=${uid}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data);
          setLoading(false);
        })
        .catch(() => {
          setStatus(null);
          setLoading(false);
        });
    }
  }, [user?.uid]);

  return { status, loading, isSubscribed: status?.subscribed === true };
}

export function SubscriptionGate({ children, fallback }: SubscriptionGateProps) {
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, loading: subLoading } = useSubscription();

  // Show loading skeleton while checking subscription
  if (authLoading || subLoading) {
    return (
      <div className="relative w-full aspect-video bg-bg-surface flex items-center justify-center rounded-xl">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — show login prompt
  if (!user) {
    return (
      fallback || (
        <div className="relative">
          <div className="blur-sm pointer-events-none">{children}</div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
            <div className="text-center p-6">
              <p className="text-white font-semibold mb-2">Sign in to watch</p>
              <Link
                href="/subscribe"
                className="inline-block bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )
    );
  }

  // Subscribed — show content
  if (isSubscribed) return <>{children}</>;

  // Not subscribed — show paywall
  return (
    fallback || (
      <div className="relative">
        <div className="blur-sm pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
          <div className="text-center p-6 max-w-xs">
            <p className="text-white font-semibold mb-1">
              Subscribe to watch
            </p>
            <p className="text-white text-lg font-bold mb-0.5">
              Free for 4 days
            </p>
            <p className="text-zinc-500 text-xs mb-4">
              then ₹199/month · cancel anytime
            </p>
            <Link
              href="/subscribe"
              className="inline-block bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
