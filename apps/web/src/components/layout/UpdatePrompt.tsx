"use client";

import { useEffect, useState } from "react";

/**
 * Shows an "Update Available" modal to Capacitor app users running an
 * older version. Reads the app version via window.Capacitor.Plugins.App.
 * Does nothing in regular browsers.
 *
 * The MIN_VERSION_CODE below should be bumped each time we ship a new
 * AAB with breaking/important changes (UPI intent fix, security patches,
 * etc). Users below this version see the prompt.
 */

// v1.4.4 ships UPI Intent fix + stealth branding. Anyone below = outdated.
const MIN_VERSION_CODE = 14;

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.nataktv.app";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CapacitorWindow = Window & { Capacitor?: any };

export function UpdatePrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cap = (window as CapacitorWindow).Capacitor;
    if (!cap?.isNativePlatform?.()) return; // browser — skip

    const appPlugin = cap.Plugins?.App;
    if (!appPlugin?.getInfo) return;

    appPlugin
      .getInfo()
      .then((info: { version?: string; build?: string }) => {
        const vcStr = info?.build ?? "0";
        const vc = parseInt(vcStr, 10);
        if (Number.isFinite(vc) && vc < MIN_VERSION_CODE) {
          setVisible(true);
        }
      })
      .catch(() => {});
  }, []);

  if (!visible) return null;

  function handleUpdate() {
    window.open(PLAY_STORE_URL, "_blank");
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[#121216] border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 mx-0 sm:mx-4 mb-0 sm:mb-0 shadow-2xl">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f97316]/20 mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#f97316]">
            <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white text-center mb-1">
          Update required
        </h2>
        <p className="text-sm text-zinc-400 text-center mb-5">
          This version of Natak TV is no longer supported. Please update on Play Store to continue watching.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleUpdate}
            className="w-full text-white py-3 rounded-xl font-semibold text-sm"
            style={{
              background:
                "linear-gradient(110deg, #f97316 0%, #f97316 40%, #fbbf24 50%, #f97316 60%, #f97316 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s linear infinite",
            }}
          >
            Update on Play Store
          </button>
        </div>
      </div>
    </div>
  );
}
