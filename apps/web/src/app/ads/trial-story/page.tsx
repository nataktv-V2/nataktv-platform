import { NatakLogo } from "@/components/ads/NatakLogo";

export default function TrialStory() {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Orange glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-30"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, #f97316, transparent)",
        }}
      />

      {/* Purple glow bottom */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full blur-[120px] opacity-15"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, #7B1FA2, transparent)",
        }}
      />

      {/* Logo */}
      <div className="mb-16">
        <NatakLogo size="xl" />
      </div>

      {/* "Limited Offer" badge */}
      <div
        className="rounded-full font-semibold mb-12"
        style={{
          fontSize: 24,
          padding: "10px 32px",
          backgroundColor: "rgba(249, 115, 22, 0.15)",
          border: "1px solid #f97316",
          color: "#f97316",
        }}
      >
        Limited Time Offer
      </div>

      {/* Price hero */}
      <div className="text-center mb-10">
        <div className="flex items-baseline justify-center gap-6 mb-4">
          <span
            className="line-through"
            style={{ fontSize: 60, color: "#a1a1aa" }}
          >
            ₹199
          </span>
          <span
            className="font-black"
            style={{ fontSize: 180, color: "#f97316", lineHeight: 1 }}
          >
            ₹2
          </span>
        </div>
        <p style={{ fontSize: 36, color: "#a1a1aa" }}>for 2 days trial</p>
      </div>

      {/* Headline */}
      <h1
        className="text-center font-bold mb-6"
        style={{ fontSize: 64, color: "#f4f4f5", padding: "0 60px" }}
      >
        ₹2 mein start karo
      </h1>

      {/* Subtext */}
      <p
        className="text-center mb-14"
        style={{ fontSize: 34, color: "#a1a1aa", maxWidth: 800, padding: "0 40px" }}
      >
        2 din ka free trial, phir sirf ₹199/month. Cancel anytime.
      </p>

      {/* Features */}
      <div className="flex flex-col gap-5 mb-16">
        {["HD streaming quality", "No ads, ever", "Cancel anytime — no lock-in"].map((f) => (
          <div key={f} className="flex items-center gap-4">
            <span
              className="flex items-center justify-center rounded-full"
              style={{
                width: 40,
                height: 40,
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                fontSize: 22,
              }}
            >
              &#10003;
            </span>
            <span style={{ color: "#f4f4f5", fontSize: 28 }}>{f}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="rounded-full font-bold"
        style={{
          fontSize: 36,
          padding: "24px 80px",
          backgroundColor: "#f97316",
          color: "#fff",
        }}
      >
        Try for ₹2
      </button>

      {/* Swipe hint */}
      <p
        className="absolute bottom-16 text-center"
        style={{ fontSize: 24, color: "#a1a1aa" }}
      >
        Swipe up to subscribe
      </p>
    </div>
  );
}
