"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Notification permission prompt component.
 * Shows a banner asking user to enable push notifications.
 * Handles FCM token registration and storage.
 *
 * Requirements:
 * - Set NEXT_PUBLIC_FIREBASE_VAPID_KEY in .env
 * - Set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID in .env
 * - Update firebase-messaging-sw.js with correct Firebase config
 */
export function NotificationPrompt() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Don't show if already granted or denied
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted" || Notification.permission === "denied") return;
    // Don't show if user dismissed before (check localStorage)
    const dismissed = localStorage.getItem("nataktv_notif_dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }
    // Wait 10 seconds before showing to not annoy user immediately
    const timer = setTimeout(() => setShow(true), 10000);
    return () => clearTimeout(timer);
  }, [user]);

  const handleEnable = async () => {
    setRegistering(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await registerFCMToken();
        setShow(false);
      }
    } catch {
      // ignore
    }
    setRegistering(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("nataktv_notif_dismissed", Date.now().toString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto animate-in slide-in-from-bottom">
      <div className="bg-[#1a1a20] border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-[#f97316]/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#f97316]">
              <path fillRule="evenodd" d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">Stay Updated!</p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Get notified when new dramas drop & trial reminders
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDismiss}
            className="flex-1 text-zinc-400 text-xs py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleEnable}
            disabled={registering}
            className="flex-1 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {registering ? "Enabling..." : "Enable"}
          </button>
        </div>
      </div>
    </div>
  );
}

async function registerFCMToken() {
  try {
    const { getMessaging, getToken } = await import("firebase/messaging");
    const { app } = await import("@/lib/firebase");

    const messaging = getMessaging(app);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    if (!vapidKey) {
      console.warn("NEXT_PUBLIC_FIREBASE_VAPID_KEY not set — skipping FCM registration");
      return;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      // Save token to server
      await fetch("/api/notifications/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    }
  } catch (err) {
    console.error("FCM registration failed:", err);
  }
}
