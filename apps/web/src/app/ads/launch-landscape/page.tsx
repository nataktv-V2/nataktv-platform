import { NatakLogo } from "@/components/ads/NatakLogo";

export default function LaunchLandscape() {
  const categories = ["Short Films", "Web Series", "Drama", "Comedy"];

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
      {/* Background glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 rounded-full blur-[120px] opacity-20"
        style={{
          width: 500,
          height: 500,
          background: "linear-gradient(135deg, #E91E63, #7B1FA2)",
        }}
      />

      {/* Left content */}
      <div className="flex flex-col justify-center pl-16 pr-8" style={{ maxWidth: 750 }}>
        <div className="mb-6">
          <NatakLogo size="lg" />
        </div>

        <h1
          className="font-bold leading-tight mb-4"
          style={{ fontSize: 48, color: "#f4f4f5" }}
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

        <p className="mb-6" style={{ fontSize: 22, color: "#a1a1aa" }}>
          Web series, short films & originals — from ₹199/month
        </p>

        <div className="flex gap-3 mb-6">
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full font-medium"
              style={{
                fontSize: 16,
                padding: "6px 18px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#f4f4f5",
              }}
            >
              {cat}
            </span>
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
            Start Watching
          </button>
        </div>
      </div>

      {/* Right decorative element */}
      <div
        className="absolute right-12 top-1/2 -translate-y-1/2 rounded-2xl"
        style={{
          width: 320,
          height: 480,
          background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(233,30,99,0.15))",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🎬</div>
          <p style={{ color: "#a1a1aa", fontSize: 18 }}>100+ Shows</p>
        </div>
      </div>
    </div>
  );
}
