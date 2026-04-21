"use client";

import Script from "next/script";
import { useEffect } from "react";
import { register } from "@/lib/mixpanel";

/**
 * Loads the Mixpanel library from Mixpanel's CDN (not npm — for Vercel-breach
 * supply chain safety) and initializes it with our project token.
 *
 * Also registers global properties sent with every event:
 *   - platform: "capacitor" | "browser"
 *   - app_version: the Capacitor app versionName if available
 *   - app_build: the versionCode if available
 */

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

// Mixpanel's standard CDN script — published on their own infrastructure.
const MIXPANEL_CDN =
  "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CapacitorWindow = Window & { Capacitor?: any; mixpanel?: any };

export function MixpanelLoader() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!TOKEN) return;

    // Wait for the CDN script to populate window.mixpanel, then init.
    let tries = 0;
    const initTimer = window.setInterval(() => {
      const w = window as CapacitorWindow;
      tries += 1;
      if (w.mixpanel?.init) {
        w.mixpanel.init(TOKEN, {
          // Defer persistence cleanup so page loads aren't blocked
          debug: false,
          // Respect privacy — don't record IP server-side (geoloc from city/region only)
          ip: false,
          // Keep events small — no page URL autotracking
          track_pageview: false,
          // EU / India compliance-friendly defaults
          persistence: "localStorage",
          property_blacklist: ["$current_url", "$initial_referrer"],
        });

        // Register global properties
        const cap = w.Capacitor;
        const isCapacitor = !!cap?.isNativePlatform?.();
        const platform = isCapacitor ? "capacitor-android" : "browser";

        const baseProps: Record<string, unknown> = { platform };

        if (isCapacitor && cap.Plugins?.App?.getInfo) {
          cap.Plugins.App.getInfo()
            .then((info: { version?: string; build?: string }) => {
              register({
                ...baseProps,
                app_version: info?.version,
                app_build: info?.build,
              });
            })
            .catch(() => register(baseProps));
        } else {
          register(baseProps);
        }

        window.clearInterval(initTimer);
      } else if (tries > 50) {
        // 5 seconds — give up silently
        window.clearInterval(initTimer);
      }
    }, 100);

    return () => window.clearInterval(initTimer);
  }, []);

  // Nothing to render if no token configured
  if (!TOKEN) return null;

  return (
    <Script
      src={MIXPANEL_CDN}
      strategy="afterInteractive"
    />
  );
}
