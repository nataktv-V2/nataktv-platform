import { NatakLogo } from "@/components/ads/NatakLogo";
import Image from "next/image";

const shows = [
  { img: "/thumbnails/ads/gaon-ki-biwi.jpg", title: "Gaon Ki Biwi" },
  { img: "/thumbnails/ads/hey-leela.jpg", title: "Hey Leela" },
  { img: "/thumbnails/ads/ghat-ghat-ka-paani.jpg", title: "Ghat Ghat Ka Paani" },
  { img: "/thumbnails/ads/love-shadi-dhokha.jpg", title: "Love Shadi Dhokha" },
  { img: "/thumbnails/ads/kalyanam-to-kadhal.jpg", title: "Kalyanam to Kadhal" },
];

function ShowCard({ img, title, index }: { img: string; title: string; index: number }) {
  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Full-bleed thumbnail background */}
      <Image
        src={img}
        alt={title}
        fill
        style={{ objectFit: "cover" }}
        unoptimized
      />

      {/* Heavy dark gradient overlay bottom 40% */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "100%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(10,10,12,0.7) 50%, rgba(10,10,12,0.95) 100%)",
        }}
      />

      {/* NatakLogo top-left */}
      <div className="absolute top-6 left-6" style={{ zIndex: 2 }}>
        <NatakLogo size="sm" />
      </div>

      {/* Bottom content */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center"
        style={{ zIndex: 2, paddingBottom: 48 }}
      >
        {/* Orange pill badge */}
        <span
          className="rounded-full font-semibold"
          style={{
            fontSize: 20,
            padding: "8px 24px",
            backgroundColor: "#f97316",
            color: "#fff",
            marginBottom: 16,
          }}
        >
          ₹2 mein dekho
        </span>

        {/* Show title */}
        <h2
          style={{
            fontSize: 48,
            fontFamily: "var(--font-poppins), Inter, sans-serif",
            fontWeight: 800,
            color: "#fff",
            textAlign: "center",
            textShadow:
              "0 2px 20px rgba(0,0,0,0.8), 0 1px 6px rgba(0,0,0,0.9)",
            margin: 0,
            padding: "0 40px",
          }}
        >
          {title}
        </h2>

        {/* Card number indicator dots */}
        <div className="flex items-center gap-3" style={{ marginTop: 24 }}>
          {[0, 1, 2, 3, 4].map((dot) => (
            <div
              key={dot}
              className="rounded-full"
              style={{
                width: dot === index ? 14 : 10,
                height: dot === index ? 14 : 10,
                backgroundColor: dot === index ? "#f97316" : "rgba(255,255,255,0.35)",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CTACard() {
  return (
    <div
      className="relative overflow-hidden flex-shrink-0 flex flex-col items-center justify-center"
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <NatakLogo size="lg" />

      <p
        style={{
          fontSize: 40,
          fontFamily: "var(--font-poppins), Inter, sans-serif",
          fontWeight: 800,
          color: "#f4f4f5",
          marginTop: 40,
          marginBottom: 40,
          textAlign: "center",
        }}
      >
        Sirf ₹2 mein shuru karo
      </p>

      <button
        className="rounded-full font-bold"
        style={{
          fontSize: 30,
          padding: "20px 64px",
          background: "linear-gradient(135deg, #f97316, #ea580c)",
          boxShadow: "0 4px 24px rgba(249,115,22,0.4)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Download Now
      </button>
    </div>
  );
}

export default function CarouselShows() {
  return (
    <div className="flex flex-row">
      {shows.map((show, i) => (
        <ShowCard key={show.title} img={show.img} title={show.title} index={i} />
      ))}
      <CTACard />
    </div>
  );
}
