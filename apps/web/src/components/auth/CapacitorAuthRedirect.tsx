"use client";

import { useEffect } from "react";
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
 * Uses Firebase auth directly (doesn't require AuthProvider — which is
 * only mounted inside the (app) layout).
 */
export function CapacitorAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cap = (window as CapacitorWindow).Capacitor;
    if (!cap?.isNativePlatform?.()) return; // browser — do nothing

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/profile");
      }
    });

    return () => unsub();
  }, [router]);

  return null;
}
