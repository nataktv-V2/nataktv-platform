"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { isCapacitorApp, getEntitlementInfo, syncGooglePlayToServer } from "@/lib/revenuecat";

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

    // In Capacitor, check RevenueCat entitlement and sync to server
    if (isCapacitorApp()) {
      getEntitlementInfo().then((ent) => {
        // Sync Google Play state to our DB (fire-and-forget)
        syncGooglePlayToServer(uid, ent);

        if (ent.active) {
          if (ent.willRenew) {
            setStatus({ subscribed: true, status: "ACTIVE", currentPeriodEnd: ent.expirationDate });
          } else {
            // Cancelled but still in paid period — show as cancelled with expiry
            setStatus({ subscribed: true, status: "CANCELLED", currentPeriodEnd: ent.expirationDate });
          }
          setLoading(false);
          return;
        }
        // RevenueCat says not active — trust it over stale server data
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
            <p className="text-white text-xl font-bold mb-1">
              FREE FOR 4 DAYS
            </p>
            <p className="text-zinc-500 text-xs mb-4">then ₹199/month</p>
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
