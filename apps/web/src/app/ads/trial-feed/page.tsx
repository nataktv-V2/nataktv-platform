import { NatakLogo } from "@/components/ads/NatakLogo";

export default function TrialFeed() {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Orange glow behind price */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-25"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, #f97316, transparent)",
        }}
      />

      {/* Logo */}
      <div className="mb-10">
        <NatakLogo size="lg" />
      </div>

      {/* Price hero */}
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-4 mb-2">
          <span
            className="line-through"
            style={{ fontSize: 48, color: "#a1a1aa" }}
          >
            ₹199
          </span>
          <span
            className="font-black"
            style={{ fontSize: 140, color: "#f97316", lineHeight: 1 }}
          >
            ₹2
          </span>
        </div>
        <p style={{ fontSize: 28, color: "#a1a1aa" }}>for 2 days trial</p>
      </div>

      {/* Headline */}
      <h1
        className="text-center font-bold mb-4"
        style={{ fontSize: 56, color: "#f4f4f5" }}
      >
        ₹2 mein start karo
      </h1>

      {/* Subtext */}
      <p
        className="text-center mb-10"
        style={{ fontSize: 28, color: "#a1a1aa", maxWidth: 700 }}
      >
        2 din ka free trial, phir sirf ₹199/month
      </p>

      {/* Features */}
      <div className="flex gap-8 mb-10">
        {["HD Quality", "No Ads", "Cancel Anytime"].map((f) => (
          <div key={f} className="flex items-center gap-2">
            <span style={{ color: "#10b981", fontSize: 24 }}>&#10003;</span>
            <span style={{ color: "#f4f4f5", fontSize: 22 }}>{f}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="rounded-full font-bold"
        style={{
          fontSize: 30,
          padding: "18px 60px",
          backgroundColor: "#f97316",
          color: "#fff",
        }}
      >
        Try for ₹2
      </button>
    </div>
  );
}
