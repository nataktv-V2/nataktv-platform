import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function UgcReaction() {
  const emojis = [
    { emoji: "❤️", top: 300, left: 60, size: 40, rotate: -12 },
    { emoji: "😍", top: 450, left: 680, size: 36, rotate: 8 },
    { emoji: "🔥", top: 600, left: 90, size: 32, rotate: 15 },
    { emoji: "😱", top: 750, left: 700, size: 38, rotate: -8 },
    { emoji: "💯", top: 550, left: 720, size: 28, rotate: 20 },
    { emoji: "❤️", top: 380, left: 710, size: 24, rotate: -5 },
    { emoji: "🔥", top: 820, left: 70, size: 34, rotate: 10 },
    { emoji: "😍", top: 700, left: 50, size: 30, rotate: -18 },
  ];

  return (
    <div
      className="relative overflow-hidden flex flex-col items-center"
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Logo top-left */}
      <div
        className="absolute"
        style={{ top: 48, left: 40, zIndex: 20 }}
      >
        <NatakLogo size="lg" />
      </div>

      {/* Headline above phone */}
      <h1
        className="text-center"
        style={{
          fontFamily: "var(--font-poppins), Poppins, sans-serif",
          fontWeight: 800,
          fontSize: 48,
          color: "#fff",
          marginTop: 160,
          marginBottom: 40,
        }}
      >
        Log pagal ho rahe hain!
      </h1>

      {/* Phone mockup + floating emojis container */}
      <div
        className="relative"
        style={{ width: 800, height: 900 }}
      >
        {/* Floating reaction emojis */}
        {emojis.map((e, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              top: e.top - 250,
              left: e.left - 100,
              fontSize: e.size,
              transform: `rotate(${e.rotate}deg)`,
              zIndex: 15,
            }}
          >
            {e.emoji}
          </span>
        ))}

        {/* Phone frame centered */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: 380,
            height: 780,
            borderRadius: 40,
            border: "4px solid rgba(255,255,255,0.2)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Full-screen show image */}
          <div className="relative w-full h-full">
            <Image
              src="/thumbnails/ads/love-shadi-dhokha.jpg"
              alt="Love Shadi Dhokha"
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />

            {/* Bottom overlay inside phone */}
            <div
              className="absolute bottom-0 left-0 right-0 flex flex-col"
              style={{
                padding: "20px 16px 16px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
              }}
            >
              {/* Show title */}
              <span
                style={{
                  fontSize: 22,
                  color: "#fff",
                  fontWeight: 600,
                  textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                }}
              >
                Love Shadi Dhokha
              </span>

              {/* Progress bar */}
              <div
                className="w-full"
                style={{
                  height: 4,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    width: "60%",
                    height: "100%",
                    backgroundColor: "#FF6D00",
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Below phone text */}
      <p
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.6)",
          marginTop: 24,
        }}
      >
        ₹2 mein sab dekho
      </p>

      {/* CTA */}
      <button
        className="rounded-2xl font-bold"
        style={{
          background: "linear-gradient(135deg, #FF6D00, #E91E63)",
          color: "#fff",
          fontSize: 36,
          padding: "22px 80px",
          marginTop: 24,
          border: "none",
          cursor: "pointer",
        }}
      >
        Download Natak TV
      </button>
    </div>
  );
}
