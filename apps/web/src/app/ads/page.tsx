import Link from "next/link";

const banners = [
  {
    theme: "Single Show — Feed Ads",
    description: "Full-bleed thumbnail with real actors, drama title + ₹2 badge + CTA",
    variants: [
      { name: "Gaon Ki Biwi (1080x1080)", href: "/ads/visual-feed-1" },
      { name: "Kalyanam to Kadhal (1080x1080)", href: "/ads/visual-feed-2" },
      { name: "Hey Leela (1080x1080)", href: "/ads/visual-feed-3" },
    ],
  },
  {
    theme: "Single Show — Story Ads",
    description: "Full-screen thumbnail with actors, title overlay + ₹2 coin + CTA",
    variants: [
      { name: "Ghat Ghat Ka Paani (1080x1920)", href: "/ads/visual-story-1" },
      { name: "Love Shadi Dhokha (1080x1920)", href: "/ads/visual-story-2" },
      { name: "Love Guru (1080x1920)", href: "/ads/visual-story-3" },
    ],
  },
  {
    theme: "Multi-Show Collage",
    description: "4 thumbnails in a grid — visual variety, one CTA",
    variants: [
      { name: "4-Show Grid (1080x1080)", href: "/ads/visual-collage" },
    ],
  },
];

const videoAds = [
  {
    theme: "Video Ads — Multi-Show Carousel",
    description: "5 shows cycling with transitions, ending with CTA. Screen-record for Meta video ads.",
    variants: [
      { name: "Feed Carousel (1080x1080, ~15s)", href: "/ads/video-feed" },
      { name: "Story Carousel (1080x1920, ~15s)", href: "/ads/video-story" },
    ],
  },
  {
    theme: "Video Ads — Single Show Teaser",
    description: "Dramatic zoom reveal — coin bounce, title drop, CTA slide-up. 8s loop.",
    variants: [
      { name: "Gaon Ki Biwi Teaser (1080x1920)", href: "/ads/video-teaser" },
    ],
  },
  {
    theme: "Video Ads — 3 Positioning Angles (5s Hook → 1.5s Promo → 5s CTA)",
    description: "Structured video ads with precise timing. 3 audience angles: Soft (emotional/female), Bold (male), Female-specific.",
    variants: [
      { name: "Soft — Love Shadi Dhokha (1080x1920)", href: "/ads/video-soft" },
      { name: "Bold — Ghat Ghat Ka Paani (1080x1080)", href: "/ads/video-bold" },
      { name: "Female — Gaon Ki Biwi (1080x1920)", href: "/ads/video-female" },
    ],
  },
];

const thumbAds = [
  {
    theme: "Thumb-Start Ads (Fake Play Button)",
    description: "Static ads that look like paused videos — play button overlay tricks users into clicking. High CTR format.",
    variants: [
      { name: "Gaon Ki Biwi — Feed (1080x1080)", href: "/ads/thumb-start-1" },
      { name: "Love Guru — Story (1080x1920)", href: "/ads/thumb-start-2" },
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

      {/* Video Ads */}
      <div className="space-y-10 mt-14">
        <h2 className="text-2xl font-bold" style={{ color: "#f97316" }}>
          Video Ads (Animated)
        </h2>
        {videoAds.map((group) => (
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
                    border: "1px solid rgba(249,115,22,0.3)",
                  }}
                >
                  <p className="font-medium mb-1" style={{ color: "#f4f4f5" }}>
                    {v.name}
                  </p>
                  <p className="text-sm" style={{ color: "#f97316" }}>
                    Open video ad &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Thumb-Start Ads */}
      <div className="space-y-10 mt-14">
        <h2 className="text-2xl font-bold" style={{ color: "#ef4444" }}>
          Thumb-Start Ads (High CTR)
        </h2>
        {thumbAds.map((group) => (
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
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                >
                  <p className="font-medium mb-1" style={{ color: "#f4f4f5" }}>
                    {v.name}
                  </p>
                  <p className="text-sm" style={{ color: "#ef4444" }}>
                    Open thumb-start ad &rarr;
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
          <li>1. Click a variant to open it full-size</li>
          <li>2. Use browser DevTools to set viewport to the exact dimensions</li>
          <li>3. <strong style={{ color: "#f4f4f5" }}>Static ads:</strong> Take a screenshot (Ctrl+Shift+P &rarr; &quot;Capture screenshot&quot;)</li>
          <li>4. <strong style={{ color: "#f4f4f5" }}>Video ads:</strong> Screen-record the page (OBS / Chrome tab recording). Refresh to replay.</li>
          <li>5. Upload to Meta Ads Manager as your ad creative</li>
        </ol>
      </div>
    </div>
  );
}
