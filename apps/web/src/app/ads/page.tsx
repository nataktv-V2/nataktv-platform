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

const carouselAds = [
  {
    theme: "Carousel Ads — Shows",
    description: "5 best shows + CTA card. Crop each 1080x1080 card for Meta carousel format.",
    variants: [
      { name: "5 Shows Carousel (6 cards)", href: "/ads/carousel-shows" },
      { name: "5 Genres Carousel (6 cards)", href: "/ads/carousel-genres" },
    ],
  },
];

const beforeAfterAds = [
  {
    theme: "Before/After Ads",
    description: "Split-screen transformation: boring life → exciting Natak TV. High engagement format.",
    variants: [
      { name: "Horizontal Split — Feed (1080x1080)", href: "/ads/before-after-feed" },
      { name: "Vertical Split — Story (1080x1920)", href: "/ads/before-after-story" },
      { name: "Swipe Reveal — Story (1080x1920)", href: "/ads/before-after-swipe" },
    ],
  },
];

const fomoAds = [
  {
    theme: "FOMO / Countdown Ads",
    description: "Urgency-driven with countdown timer and expiring ₹2 offer. Creates FOMO.",
    variants: [
      { name: "Countdown Timer — Feed (1080x1080)", href: "/ads/fomo-feed" },
      { name: "Hurry Offer — Story (1080x1920)", href: "/ads/fomo-story" },
    ],
  },
];

const compareAds = [
  {
    theme: "Comparison Ads — vs Netflix/Hotstar",
    description: "Price and content comparison tables. Shows Natak TV is 99% cheaper.",
    variants: [
      { name: "Price Table — Feed (1080x1080)", href: "/ads/compare-price-feed" },
      { name: "Content Split — Feed (1080x1080)", href: "/ads/compare-content-feed" },
    ],
  },
];

const reviewAds = [
  {
    theme: "Social Proof / Review Ads",
    description: "User reviews and ratings. Trust-building format with 4.8★ rating.",
    variants: [
      { name: "3 Reviews Stack — Feed (1080x1080)", href: "/ads/review-feed" },
      { name: "Full Review — Story (1080x1920)", href: "/ads/review-story" },
    ],
  },
];

const ugcAds = [
  {
    theme: "UGC-Style Ads (Fake Screen Recording)",
    description: "Looks like someone screen-recording their phone browsing Natak TV. Authentic feel.",
    variants: [
      { name: "App Browse — Story (1080x1920)", href: "/ads/ugc-browse" },
      { name: "Reaction — Story (1080x1920)", href: "/ads/ugc-reaction" },
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

      {/* New Ad Types */}
      {[
        { title: "Carousel Ads", color: "#8b5cf6", data: carouselAds, label: "Open carousel" },
        { title: "Before/After Ads", color: "#06b6d4", data: beforeAfterAds, label: "Open ad" },
        { title: "FOMO / Countdown Ads", color: "#ef4444", data: fomoAds, label: "Open ad" },
        { title: "Comparison Ads", color: "#22c55e", data: compareAds, label: "Open ad" },
        { title: "Social Proof Ads", color: "#eab308", data: reviewAds, label: "Open ad" },
        { title: "UGC-Style Ads", color: "#ec4899", data: ugcAds, label: "Open ad" },
      ].map((section) => (
        <div key={section.title} className="space-y-10 mt-14">
          <h2 className="text-2xl font-bold" style={{ color: section.color }}>
            {section.title}
          </h2>
          {section.data.map((group) => (
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
                      border: `1px solid ${section.color}33`,
                    }}
                  >
                    <p className="font-medium mb-1" style={{ color: "#f4f4f5" }}>
                      {v.name}
                    </p>
                    <p className="text-sm" style={{ color: section.color }}>
                      {section.label} &rarr;
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

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
