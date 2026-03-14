# Natak TV — Meta Ads Design Specs

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Brand Yellow | `#FFC107` | Logo gradient start |
| Brand Orange | `#FF6D00` | Logo gradient, accents |
| Brand Pink | `#E91E63` | Logo gradient, highlights |
| Brand Purple | `#7B1FA2` | "TV" badge, logo gradient end |
| Accent (CTA) | `#f97316` | All CTA buttons |
| Accent Hover | `#ea580c` | Button hover state |
| Background | `#0a0a0c` | Banner background |
| Surface | `#121216` | Card backgrounds |
| Text Primary | `#f4f4f5` | Headlines, body text |
| Text Muted | `#a1a1aa` | Subtitles, descriptions |
| Success | `#10b981` | Checkmarks, feature lists |
| Border Subtle | `rgba(255,255,255,0.08)` | Card borders |

## Logo Specs

**"Natak" text:**
- Font: Inter, Bold
- Color: Gradient → `#FFC107` → `#FF6D00` → `#E91E63` → `#7B1FA2` (left to right)
- CSS: `background: linear-gradient(to right, #FFC107, #FF6D00, #E91E63, #7B1FA2); -webkit-background-clip: text;`

**"TV" badge:**
- Font: Inter, Semi-Bold
- Background: `#7B1FA2` (solid)
- Text: `#FFFFFF`
- Border-radius: 6px
- Padding: varies by size (see component)
- Margin-left: 8px from "Natak"

### Logo Sizes

| Size | "Natak" font | "TV" font | Use |
|------|-------------|-----------|-----|
| sm | 20px | 12px | Small placements |
| md | 30px | 14px | Landscape banners |
| lg | 48px | 18px | Feed banners |
| xl | 72px | 24px | Story banners |

## Banner Dimensions

| Format | Width | Height | Aspect Ratio | Meta Placement |
|--------|-------|--------|-------------|----------------|
| Feed Square | 1080px | 1080px | 1:1 | Facebook Feed, Instagram Feed |
| Story/Reels | 1080px | 1920px | 9:16 | Instagram Stories, Reels, Facebook Stories |
| Feed Landscape | 1200px | 628px | 1.91:1 | Facebook Feed, Link Ads, Right Column |

## Typography

| Element | Font | Weight | Size (Feed) | Size (Story) | Size (Landscape) |
|---------|------|--------|-------------|-------------|-----------------|
| Headline | Inter | Bold (700) | 56-72px | 64-80px | 40-48px |
| Subtext | Inter | Regular (400) | 26-32px | 32-36px | 18-22px |
| CTA Button | Inter | Bold (700) | 28-30px | 34-36px | 18-20px |
| Category Pill | Inter | Medium (500) | 22-24px | 26-28px | 14-16px |
| Language Badge | Inter | Semi-Bold (600) | 22px | 26px | 14px |

## CTA Button Specs

| Property | Value |
|----------|-------|
| Background | `#f97316` |
| Text Color | `#FFFFFF` |
| Font Weight | Bold (700) |
| Border Radius | 9999px (fully rounded) |
| Padding (Feed) | 18px 60px |
| Padding (Story) | 24px 80px |
| Padding (Landscape) | 14px 48px |

## Background Effects

**Glow/Gradient Blurs:**
- Used for visual depth behind key elements
- Size: 400-800px circles
- Opacity: 15-30%
- Blur: 100-160px
- Colors: Brand gradient colors
- Position: Behind headline or price display

## Meta Ads Text Overlay Rule

Meta recommends **less than 20% text** on ad images. To comply:
- Keep headlines short (under 8 words)
- Use large negative space
- Limit text to: logo + headline + CTA (3 text elements max)
- Category pills count as text — use max 5 on feed, 6 on story
- Test with Meta's [Text Overlay Tool](https://www.facebook.com/ads/tools/text_overlay)

## Export Workflow

1. Run the dev server: `pnpm dev`
2. Navigate to `localhost:3000/ads` for the gallery
3. Click any banner variant
4. Open Chrome DevTools → Device toolbar
5. Set custom dimensions matching the banner size
6. Use `Ctrl+Shift+P` → "Capture full size screenshot"
7. The exported PNG is ready for Meta Ads Manager

## File Structure

```
apps/web/src/
├── app/ads/
│   ├── page.tsx                    # Gallery index
│   ├── layout.tsx                  # Clean layout (no app shell)
│   ├── launch-feed/page.tsx        # Theme 1 — 1080x1080
│   ├── launch-story/page.tsx       # Theme 1 — 1080x1920
│   ├── launch-landscape/page.tsx   # Theme 1 — 1200x628
│   ├── trial-feed/page.tsx         # Theme 2 — 1080x1080
│   ├── trial-story/page.tsx        # Theme 2 — 1080x1920
│   ├── trial-landscape/page.tsx    # Theme 2 — 1200x628
│   ├── content-feed/page.tsx       # Theme 3 — 1080x1080
│   ├── content-story/page.tsx      # Theme 3 — 1080x1920
│   └── content-landscape/page.tsx  # Theme 3 — 1200x628
└── components/ads/
    └── NatakLogo.tsx               # Reusable logo component
```
