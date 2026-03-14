import { NatakLogo } from "@/components/ads/NatakLogo";

export default function LaunchStory() {
  const categories = ["Short Films", "Web Series", "Drama", "Comedy", "Originals"];

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
      {/* Background glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 rounded-full blur-[160px] opacity-25"
        style={{
          width: 800,
          height: 800,
          background: "linear-gradient(135deg, #FFC107, #FF6D00)",
        }}
      />

      {/* Background glow bottom */}
      <div
        className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 rounded-full blur-[140px] opacity-20"
        style={{
          width: 600,
          height: 600,
          background: "linear-gradient(135deg, #E91E63, #7B1FA2)",
        }}
      />

      {/* Logo */}
      <div className="mb-20">
        <NatakLogo size="xl" />
      </div>

      {/* Headline */}
      <h1
        className="text-center font-bold leading-tight mb-8"
        style={{ fontSize: 80, color: "#f4f4f5", maxWidth: 900, padding: "0 40px" }}
      >
        Indian Drama,
        <br />
        <span
          style={{
            background: "linear-gradient(to right, #FF6D00, #E91E63)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          One Subscription.
        </span>
      </h1>

      {/* Subtext */}
      <p
        className="text-center mb-16"
        style={{ fontSize: 36, color: "#a1a1aa", maxWidth: 800, padding: "0 60px" }}
      >
        Web series, short films & originals — from ₹199/month
      </p>

      {/* Category pills - stacked */}
      <div className="flex flex-wrap justify-center gap-4 mb-20" style={{ maxWidth: 800 }}>
        {categories.map((cat) => (
          <span
            key={cat}
            className="rounded-full font-medium"
            style={{
              fontSize: 28,
              padding: "14px 36px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#f4f4f5",
            }}
          >
            {cat}
          </span>
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
        Start Watching
      </button>

      {/* Swipe up hint */}
      <p
        className="absolute bottom-16 text-center"
        style={{ fontSize: 24, color: "#a1a1aa" }}
      >
        Swipe up to explore
      </p>
    </div>
  );
}
