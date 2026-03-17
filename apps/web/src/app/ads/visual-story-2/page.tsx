import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

export default function VisualStory2() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Image
        src="/thumbnails/ads/love-shadi-dhokha.jpg"
        alt="LSD - Love Shadi Dhokha"
        fill
        style={{ objectFit: "cover" }}
        unoptimized
      />

      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 200, background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 550, background: "linear-gradient(to top, #0a0a0c 30%, transparent)" }}
      />

      <div className="absolute top-8 left-8">
        <NatakLogo size="md" />
      </div>

      <div
        className="absolute top-8 right-8 flex items-center justify-center rounded-full font-black"
        style={{
          width: 120,
          height: 120,
          backgroundColor: "#f97316",
          color: "#fff",
          fontSize: 48,
          boxShadow: "0 4px 30px rgba(249,115,22,0.6)",
        }}
      >
        ₹2
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-16 px-10">
        <h2 className="font-bold text-center mb-6" style={{ fontSize: 56, color: "#f4f4f5", fontFamily: "var(--font-poppins), Inter, sans-serif", fontWeight: 800, textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 1px 6px rgba(0,0,0,0.9)" }}>
          Love Shadi Dhokha
        </h2>
        <button
          className="rounded-full font-bold"
          style={{ fontSize: 34, padding: "22px 72px", background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 4px 24px rgba(249,115,22,0.4)", color: "#fff" }}
        >
          Swipe Up to Watch
        </button>
      </div>
    </div>
  );
}
