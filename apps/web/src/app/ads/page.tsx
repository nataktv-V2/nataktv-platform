import Link from "next/link";

const banners = [
  {
    theme: "Launch / Intro",
    description: "Brand awareness — introduce Natak TV",
    variants: [
      { name: "Feed (1080x1080)", href: "/ads/launch-feed" },
      { name: "Story (1080x1920)", href: "/ads/launch-story" },
      { name: "Landscape (1200x628)", href: "/ads/launch-landscape" },
    ],
  },
  {
    theme: "Trial Hook",
    description: "Conversion — ₹2 trial offer",
    variants: [
      { name: "Feed (1080x1080)", href: "/ads/trial-feed" },
      { name: "Story (1080x1920)", href: "/ads/trial-story" },
      { name: "Landscape (1200x628)", href: "/ads/trial-landscape" },
    ],
  },
  {
    theme: "Content Discovery",
    description: "Engagement — browse content by language",
    variants: [
      { name: "Feed (1080x1080)", href: "/ads/content-feed" },
      { name: "Story (1080x1920)", href: "/ads/content-story" },
      { name: "Landscape (1200x628)", href: "/ads/content-landscape" },
    ],
  },
  {
    theme: "Drama Showcase",
    description: "Show titles with expressive emotions — real drama names from your catalog",
    variants: [
      { name: "Feed (1080x1080)", href: "/ads/drama-feed" },
      { name: "Story (1080x1920)", href: "/ads/drama-story" },
    ],
  },
  {
    theme: "Emotion-Driven",
    description: "Pick your mood — expressive faces mapped to shows",
    variants: [
      { name: "Feed (1080x1080)", href: "/ads/emotion-feed" },
      { name: "Story (1080x1920)", href: "/ads/emotion-story" },
    ],
  },
];

export default function AdsGallery() {
  return (
    <div
      className="min-h-screen p-10"
      style={{ backgroundColor: "#0a0a0c", fontFamily: "Inter, sans-serif" }}
    >
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#f4f4f5" }}>
        Natak TV — Meta Ad Creatives
      </h1>
      <p className="mb-10" style={{ color: "#a1a1aa" }}>
        Click any variant to view the full-size banner. Screenshot at the listed resolution for Meta Ads Manager.
      </p>

      <div className="space-y-10">
        {banners.map((group) => (
          <div key={group.theme}>
            <h2 className="text-xl font-semibold mb-1" style={{ color: "#f4f4f5" }}>
              {group.theme}
            </h2>
            <p className="text-sm mb-4" style={{ color: "#a1a1aa" }}>
              {group.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {group.variants.map((v) => (
                <Link
                  key={v.href}
                  href={v.href}
                  className="block rounded-xl p-5 transition-colors"
                  style={{
                    backgroundColor: "#121216",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="font-medium mb-1" style={{ color: "#f4f4f5" }}>
                    {v.name}
                  </p>
                  <p className="text-sm" style={{ color: "#f97316" }}>
                    Open banner &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-12 p-6 rounded-xl"
        style={{
          backgroundColor: "#121216",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3 className="font-semibold mb-2" style={{ color: "#f4f4f5" }}>
          How to export
        </h3>
        <ol className="space-y-1 text-sm" style={{ color: "#a1a1aa" }}>
          <li>1. Click a banner variant to open it full-size</li>
          <li>2. Use browser DevTools to set viewport to the exact dimensions</li>
          <li>3. Take a screenshot (Ctrl+Shift+P → &quot;Capture screenshot&quot; in Chrome)</li>
          <li>4. Upload the image to Meta Ads Manager as your ad creative</li>
        </ol>
      </div>
    </div>
  );
}
