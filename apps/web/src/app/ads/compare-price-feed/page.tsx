import { NatakLogo } from "@/components/ads/NatakLogo";

export default function ComparePriceFeed() {
  const rows = [
    {
      label: "Monthly Price",
      natak: "₹2",
      netflix: "₹199",
      hotstar: "₹149",
    },
    {
      label: "Indian Dramas",
      natak: "100+",
      netflix: "Limited",
      hotstar: "Some",
    },
    {
      label: "Free Trial",
      natak: "✓ 2 Days",
      netflix: "✗",
      hotstar: "✗",
    },
  ];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Content */}
      <div
        className="flex flex-col items-center h-full"
        style={{ padding: "56px 60px 48px" }}
      >
        {/* Logo top-center */}
        <NatakLogo size="lg" />

        {/* Headline */}
        <h1
          className="text-center"
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontWeight: 800,
            fontSize: 48,
            color: "#fff",
            marginTop: 40,
            marginBottom: 48,
          }}
        >
          Kahan milega itna sasta?
        </h1>

        {/* Comparison table */}
        <div
          className="w-full rounded-2xl overflow-hidden"
          style={{ maxWidth: 940 }}
        >
          {/* Header row */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ padding: "20px 24px" }} />
            <div
              className="flex items-center justify-center font-bold"
              style={{
                padding: "20px 24px",
                fontSize: 28,
                color: "#f97316",
                backgroundColor: "rgba(249, 115, 22, 0.15)",
              }}
            >
              Natak TV
            </div>
            <div
              className="flex items-center justify-center font-bold"
              style={{
                padding: "20px 24px",
                fontSize: 28,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Netflix
            </div>
            <div
              className="flex items-center justify-center font-bold"
              style={{
                padding: "20px 24px",
                fontSize: 28,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Hotstar
            </div>
          </div>

          {/* Data rows */}
          {rows.map((row, i) => (
            <div
              key={row.label}
              className="grid"
              style={{
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                backgroundColor:
                  i % 2 === 0
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.02)",
              }}
            >
              {/* Label */}
              <div
                className="flex items-center font-medium"
                style={{
                  padding: "28px 24px",
                  fontSize: 28,
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                {row.label}
              </div>

              {/* Natak TV value */}
              <div
                className="flex items-center justify-center font-bold"
                style={{
                  padding: "28px 24px",
                  fontSize: row.label === "Monthly Price" ? 40 : 28,
                  color:
                    row.label === "Free Trial" ? "#22c55e" : "#f97316",
                  backgroundColor: "rgba(249, 115, 22, 0.08)",
                }}
              >
                {row.natak}
              </div>

              {/* Netflix value */}
              <div
                className="flex items-center justify-center"
                style={{
                  padding: "28px 24px",
                  fontSize: 28,
                  color:
                    row.netflix === "✗"
                      ? "rgba(239, 68, 68, 0.5)"
                      : "rgba(255, 255, 255, 0.5)",
                }}
              >
                {row.netflix}
              </div>

              {/* Hotstar value */}
              <div
                className="flex items-center justify-center"
                style={{
                  padding: "28px 24px",
                  fontSize: 28,
                  color:
                    row.hotstar === "✗"
                      ? "rgba(239, 68, 68, 0.5)"
                      : "rgba(255, 255, 255, 0.5)",
                }}
              >
                {row.hotstar}
              </div>
            </div>
          ))}
        </div>

        {/* Cheaper text */}
        <span
          style={{
            fontSize: 24,
            color: "#f97316",
            marginTop: 36,
          }}
        >
          99% cheaper than competition
        </span>

        {/* CTA Button */}
        <button
          className="rounded-2xl font-bold"
          style={{
            marginTop: 40,
            fontSize: 32,
            padding: "20px 64px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff",
            border: "none",
          }}
        >
          Try Natak TV — ₹2
        </button>
      </div>
    </div>
  );
}
