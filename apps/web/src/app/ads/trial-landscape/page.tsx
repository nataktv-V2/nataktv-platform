import { NatakLogo } from "@/components/ads/NatakLogo";

export default function TrialLandscape() {
  return (
    <div
      className="relative overflow-hidden flex items-center"
      style={{
        width: 1200,
        height: 628,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Orange glow */}
      <div
        className="absolute right-1/4 top-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-20"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, #f97316, transparent)",
        }}
      />

      {/* Left content */}
      <div className="flex flex-col pl-16" style={{ maxWidth: 650 }}>
        <div className="mb-5">
          <NatakLogo size="md" />
        </div>

        <h1
          className="font-bold leading-tight mb-3"
          style={{ fontSize: 44, color: "#f4f4f5" }}
        >
          ₹2 mein start karo
        </h1>

        <p className="mb-5" style={{ fontSize: 20, color: "#a1a1aa" }}>
          2 din ka trial, phir sirf ₹199/month. Cancel anytime.
        </p>

        <div className="flex gap-5 mb-5">
          {["HD Quality", "No Ads", "Cancel Anytime"].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <span style={{ color: "#10b981", fontSize: 18 }}>&#10003;</span>
              <span style={{ color: "#f4f4f5", fontSize: 16 }}>{f}</span>
            </div>
          ))}
        </div>

        <div>
          <button
            className="rounded-full font-bold"
            style={{
              fontSize: 20,
              padding: "14px 48px",
              backgroundColor: "#f97316",
              color: "#fff",
            }}
          >
            Try for ₹2
          </button>
        </div>
      </div>

      {/* Right - price display */}
      <div
        className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-3xl"
        style={{
          width: 380,
          height: 440,
          background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.05))",
          border: "1px solid rgba(249,115,22,0.2)",
        }}
      >
        <span
          className="line-through"
          style={{ fontSize: 36, color: "#a1a1aa" }}
        >
          ₹199
        </span>
        <span
          className="font-black"
          style={{ fontSize: 120, color: "#f97316", lineHeight: 1 }}
        >
          ₹2
        </span>
        <p style={{ fontSize: 20, color: "#a1a1aa", marginTop: 8 }}>
          2-day trial
        </p>
      </div>
    </div>
  );
}
