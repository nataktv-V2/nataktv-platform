"use client";

/**
 * Branded full-screen loading splash. Used when auth is resolving and we
 * don't want the user to see a flash of the marketing page / empty layout.
 */
export function Splash() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0c]"
      role="status"
      aria-label="Loading Natak TV"
    >
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
      <div className="w-8 h-8 border-[3px] border-white/20 border-t-[#f97316] rounded-full animate-spin" />
    </div>
  );
}
