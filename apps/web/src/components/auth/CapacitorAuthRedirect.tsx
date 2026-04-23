"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CapacitorWindow = Window & { Capacitor?: any };

/**
 * For Capacitor (native app) users landing on `/` (the marketing page):
 *   - Not logged in → redirect to /profile (login screen)
 *   - Logged in → redirect to /home
 * Web browsers see the marketing page normally.
 *
 * While auth state resolves, a branded splash is rendered on top of the
 * marketing content so Capacitor users never see the marketing flash.
 */
export function CapacitorAuthRedirect() {
  const router = useRouter();
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cap = (window as CapacitorWindow).Capacitor;
    if (!cap?.isNativePlatform?.()) return; // browser — do nothing

    setIsCapacitor(true);

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/profile");
      }
    });

    return () => unsub();
  }, [router]);

  if (!isCapacitor) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0c]"
      role="status"
      aria-label="Loading Natak TV"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <span
          className="text-5xl font-black leading-none"
          style={{
            background: "linear-gradient(135deg,#f59e0b 0%,#ef4444 50%,#ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Natak
        </span>
        <span className="text-xl font-extrabold bg-[#7c3aed] text-white px-2.5 py-1 rounded-lg leading-none">
          TV
        </span>
      </div>

      {/* Spinner */}
      <div className="w-8 h-8 border-[3px] border-white/20 border-t-[#f97316] rounded-full animate-spin" />
    </div>
  );
}
