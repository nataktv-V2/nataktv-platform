"use client";

import { useEffect } from "react";

/**
 * Handles the Android hardware/gesture back button inside a Capacitor WebView.
 *
 * Behaviour:
 *  - If the browser has history entries, navigate back (like pressing the browser back button).
 *  - If there is no history to go back to, minimize the app instead of closing it.
 *
 * This component renders nothing — it only registers / cleans up the listener.
 * It is safe to include on the web: the import is dynamic so @capacitor/app is
 * never bundled when Capacitor is not present.
 */
export function BackButtonHandler() {
  useEffect(() => {
    const isCapacitor =
      typeof window !== "undefined" &&
      !!(window as unknown as { Capacitor?: unknown }).Capacitor;

    if (!isCapacitor) return;

    let removeListener: (() => void) | undefined;

    // Dynamic import so @capacitor/app is only loaded inside a Capacitor WebView.
    // In a normal browser this effect is a no-op (the guard above returns early).
    import("@capacitor/app").then(({ App }) => {
      App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          // No history left — minimize instead of exiting
          App.minimizeApp();
        }
      }).then((handle) => {
        removeListener = () => handle.remove();
      });
    });

    return () => {
      removeListener?.();
    };
  }, []);

  return null;
}
