import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function LaunchLandscape() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1200,
        height: 628,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Right side: 2x2 show thumbnails grid */}
      <div className="absolute right-0 top-0 bottom-0 grid grid-cols-2 grid-rows-2" style={{ width: 600 }}>
        {["/thumbnails/ads/gaon-ki-biwi.jpg", "/thumbnails/ads/kalyanam-to-kadhal.jpg", "/thumbnails/ads/ghat-ghat-ka-paani.jpg", "/thumbnails/ads/love-guru.jpg"].map((img) => (
          <div key={img} className="relative overflow-hidden">
            <Image
              src={img}
              alt=""
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>
        ))}
        {/* Left fade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #0a0a0c 0%, rgba(10,10,12,0.6) 40%, transparent 80%)",
          }}
        />
      </div>

      {/* Left content */}
      <div className="relative flex flex-col justify-center h-full pl-16" style={{ maxWidth: 600 }}>
        <div className="mb-5">
          <NatakLogo size="md" />
        </div>

        <h1
          className="leading-tight mb-3"
          style={{ fontSize: 46, color: "#f4f4f5", fontFamily: "var(--font-poppins), Inter, sans-serif", fontWeight: 800 }}
        >
          Indian Drama,{" "}
          <span style={{ color: "#f97316" }}>One Subscription.</span>
        </h1>

        <p className="mb-4" style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>
          100+ web series • from ₹199/month
        </p>

        <div className="flex items-center gap-3 mb-5">
          <div
            className="rounded-full font-semibold"
            style={{
              fontSize: 14,
              padding: "5px 16px",
              backgroundColor: "rgba(249,115,22,0.15)",
              border: "1px solid rgba(249,115,22,0.4)",
              color: "#f97316",
            }}
          >
            Rated 4.8 ★
          </div>
        </div>

        <button
          className="rounded-full font-bold self-start"
          style={{
            fontSize: 22,
            padding: "14px 52px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
            color: "#fff",
          }}
        >
          Join 50K+ Viewers
        </button>
      </div>
    </div>
  );
}
