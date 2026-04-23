"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Splash } from "@/components/layout/Splash";

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
  return <Splash />;
}
