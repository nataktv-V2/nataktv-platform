"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/mixpanel";

/**
 * Fires a `page_viewed` Mixpanel event on every client-side route change
 * inside the authenticated app shell. Also fires named landmark events
 * for the key funnel steps so Mixpanel funnels can be built without
 * regex filters on `page`.
 *
 * Mount once inside AuthGatedLayout.
 */

// Map pathname → landmark event name. Pathnames matched with startsWith.
const LANDMARKS: { prefix: string; event: string }[] = [
  { prefix: "/home", event: "home_viewed" },
  { prefix: "/reels", event: "reels_viewed" },
  { prefix: "/video/", event: "video_page_viewed" },
  { prefix: "/subscribe", event: "subscribe_page_viewed" },
  { prefix: "/search", event: "search_viewed" },
  { prefix: "/favourites", event: "favourites_viewed" },
  { prefix: "/watch-history", event: "watch_history_viewed" },
  { prefix: "/profile", event: "profile_viewed" },
  { prefix: "/payment-done", event: "payment_done_page_viewed" },
  { prefix: "/payments", event: "payments_page_viewed" },
];

function resolveLandmark(pathname: string): string | null {
  for (const { prefix, event } of LANDMARKS) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return event;
  }
  return null;
}

export function PageViewTracker({ isAuthed }: { isAuthed: boolean }) {
  const pathname = usePathname();
  const lastFiredRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // De-dupe: don't re-fire for the same pathname on re-render
    if (lastFiredRef.current === pathname) return;
    lastFiredRef.current = pathname;

    track("page_viewed", { page: pathname, authed: isAuthed });

    // For unauthed users on /profile, fire the dedicated login_page_viewed
    // event so the funnel step is explicit.
    if (pathname === "/profile" && !isAuthed) {
      track("login_page_viewed");
    }

    const landmark = resolveLandmark(pathname);
    if (landmark) track(landmark, { page: pathname });
  }, [pathname, isAuthed]);

  return null;
}
