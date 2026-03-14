import { NatakLogo } from "@/components/ads/NatakLogo";

export default function LaunchFeed() {
  const categories = ["Short Films", "Web Series", "Drama", "Comedy", "Originals"];

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
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-30"
        style={{
          width: 600,
          height: 600,
          background: "linear-gradient(135deg, #FF6D00, #E91E63, #7B1FA2)",
        }}
      />

      {/* Logo */}
      <div className="mb-12">
        <NatakLogo size="xl" />
      </div>

      {/* Headline */}
      <h1
        className="text-center font-bold leading-tight mb-6"
        style={{ fontSize: 72, color: "#f4f4f5", maxWidth: 800 }}
      >
        Indian Drama,{" "}
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
        className="text-center mb-10"
        style={{ fontSize: 32, color: "#a1a1aa", maxWidth: 700 }}
      >
        Web series, short films & originals — from ₹199/month
      </p>

      {/* Category pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <span
            key={cat}
            className="rounded-full font-medium"
            style={{
              fontSize: 24,
              padding: "10px 28px",
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
          fontSize: 30,
          padding: "18px 60px",
          backgroundColor: "#f97316",
          color: "#fff",
        }}
      >
        Start Watching
      </button>
    </div>
  );
}
