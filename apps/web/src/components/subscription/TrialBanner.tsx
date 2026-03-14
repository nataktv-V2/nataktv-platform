"use client";

import { useSubscription } from "./SubscriptionGate";
import Link from "next/link";

export function TrialBanner() {
  const { status } = useSubscription();

  if (!status || status.status !== "TRIAL" || !status.trialEnd) return null;

  const trialEnd = new Date(status.trialEnd);
  const now = new Date();
  const hoursLeft = Math.max(
    0,
    Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60))
  );

  if (hoursLeft <= 0) return null;

  return (
    <div className="bg-gradient-to-r from-[#f97316] to-[#e91e63] px-4 py-2 text-center text-sm text-white">
      <span className="font-medium">Trial ends in {hoursLeft}h</span>
      {" — "}
      <Link href="/subscribe" className="underline font-semibold">
        Subscribe now
      </Link>
      {" for uninterrupted access"}
    </div>
  );
}
