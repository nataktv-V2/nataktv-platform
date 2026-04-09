import { NatakLogo } from "@/components/ads/NatakLogo";

export default function ReviewFeed() {
  const reviews = [
    {
      name: "Priya S.",
      text: "Raat ko ek episode shuru kiya... subah tak 10 dekh liye! Best app ever",
    },
    {
      name: "Rahul M.",
      text: "Netflix cancel kar diya. Natak TV pe sab milta hai sirf \u20B92 mein",
    },
    {
      name: "Anita D.",
      text: "Meri saas bhi ab Natak TV pe! Poora ghar addicted hai",
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
        className="relative flex flex-col items-center h-full"
        style={{ padding: "48px 40px" }}
      >
        {/* Top row: Logo + Rating badge */}
        <div className="flex items-start justify-between w-full">
          <NatakLogo size="lg" />
          <span
            className="rounded-2xl font-bold"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: "12px 28px",
              fontSize: 48,
              color: "#fff",
            }}
          >
            4.8{" "}
            <span style={{ color: "#FBBF24" }}>★</span>
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-center w-full"
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontWeight: 800,
            fontSize: 40,
            color: "#fff",
            marginTop: 36,
            marginBottom: 32,
          }}
        >
          50,000+ log dekhte hain
        </h1>

        {/* Review cards */}
        <div
          className="flex flex-col w-full"
          style={{ gap: 20, padding: "0 0" }}
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="rounded-2xl flex items-center"
              style={{
                width: "100%",
                height: 200,
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "0 36px",
                gap: 28,
              }}
            >
              {/* Avatar */}
              <div
                className="rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 60,
                  height: 60,
                  background: "linear-gradient(135deg, #FF6D00, #FFC107)",
                }}
              >
                <span style={{ fontSize: 28, color: "#fff", fontWeight: 700 }}>
                  {review.name[0]}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col" style={{ gap: 6 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
                  {review.name}
                </span>
                <span style={{ fontSize: 20, color: "#FBBF24" }}>
                  ★★★★★
                </span>
                <span
                  style={{
                    fontSize: 24,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.3,
                  }}
                >
                  {review.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Subtext */}
        <p
          style={{
            fontSize: 24,
            color: "#FF6D00",
            marginTop: 28,
          }}
        >
          Join 50,000+ happy viewers
        </p>

        {/* CTA */}
        <button
          className="rounded-2xl font-bold"
          style={{
            background: "linear-gradient(135deg, #FF6D00, #E91E63)",
            color: "#fff",
            fontSize: 32,
            padding: "20px 64px",
            marginTop: 20,
            border: "none",
            cursor: "pointer",
          }}
        >
          Download — ₹2 Only
        </button>
      </div>
    </div>
  );
}
