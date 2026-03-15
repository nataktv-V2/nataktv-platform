# Natak TV — Ad Creatives Progress

> Last updated: 2026-03-14

---

## Strategy (from handwritten notes)

### Ad Structure (Video)
| Section | Duration | Purpose |
|---------|----------|---------|
| Hook (STW) | 5 sec | Stop the scroll — dramatic/emotional scene |
| Drama Promo | 1.5 sec | Quick clip/title reveal |
| CTA | 5 sec | "Sarupe me start kare" (Start in ₹2) |
| **Total** | **~15 sec** | (or 30 sec extended) |

### 3 Positioning Angles
1. **Soft** — Emotional story-based (targeting Females)
2. **Bold** — "Aap satisfied nahi ho" (targeting Males)
3. **Female** — Female-specific angle

### Hook Categories
- Watchman talking → targets Elderly
- Authority Based (Police scene) → "Seekho" educational hook
- Political → Talking to crowd

### Funnel Targets
- Impressions → 20-30% STW → 2%+ Clicks → 20-30% Downloads
- ~₹25 per install
- 70% cancel first day → need sticky content
- Trial conversion: 20% ok, 30% great
- Renewal: 50% M1, 25% M2

### Budget
- ₹1,600 initial → ₹50,000 if it works

### Tools
- Veo 3.1, Kling, HeyGen (AI video)
- Eleven Labs (voiceover)
- Google Input Tools (Hindi/Telugu text)
- Pinterest + GPT (image prompts)

---

## Files Overview

### Shared Components
| File | Purpose |
|------|---------|
| `components/ads/NatakLogo.tsx` | Reusable logo — gradient "Natak" + purple "TV" badge. Sizes: sm/md/lg/xl |
| `app/ads/layout.tsx` | Clean layout (no app shell, just renders children) |
| `app/ads/page.tsx` | Gallery index — lists all ad variants with links |

### Active Ads (in gallery)

#### Static — Single Show Feed (1080x1080)
| Route | Drama | YouTube ID | Status |
|-------|-------|------------|--------|
| `/ads/visual-feed-1` | Gaon Ki Biwi | eZkwCc4KpGc | Done |
| `/ads/visual-feed-2` | Kalyanam to Kadhal | W4jdt5QVmFQ | Done |
| `/ads/visual-feed-3` | Hey Leela | Ds1X74cvKtI | Done |

**Format:** Full-bleed YouTube thumbnail → gradient overlay → NatakLogo (top-left) → ₹2 coin badge (top-right) → drama title → "Watch Now" CTA

#### Static — Single Show Story (1080x1920)
| Route | Drama | YouTube ID | Status |
|-------|-------|------------|--------|
| `/ads/visual-story-1` | Ghat Ghat Ka Paani | -Jts8lNYLJo | Done |
| `/ads/visual-story-2` | Love Shadi Dhokha | v-sD6hE-AKc | Done |
| `/ads/visual-story-3` | Love Guru | pCbuY1jnKbk | Done |

**Format:** Same as feed but 1080x1920 portrait, larger title + CTA

#### Static — Multi-Show Collage (1080x1080)
| Route | Shows | Status |
|-------|-------|--------|
| `/ads/visual-collage` | Gaon Ki Biwi, Kalyanam to Kadhal, Hey Leela, Hurry Burry | Done |

**Format:** 2x2 grid of thumbnails, NatakLogo + ₹2 badge top, CTA bottom

#### Video — Multi-Show Carousel
| Route | Format | Duration | Status |
|-------|--------|----------|--------|
| `/ads/video-feed` | 1080x1080 | ~15s | Done |
| `/ads/video-story` | 1080x1920 | ~15s | Done |

**Format:** 5 shows cycling with Ken Burns zoom + fade/circle-wipe transitions, ends with CTA overlay (logo + "100+ Shows" + "Watch Now — ₹2")

**Shows used:** Gaon Ki Biwi, Kalyanam to Kadhal, Hey Leela, Ghat Ghat Ka Paani, Love Shadi Dhokha

#### Video — Single Show Teaser
| Route | Drama | Format | Duration | Status |
|-------|-------|--------|----------|--------|
| `/ads/video-teaser` | Gaon Ki Biwi | 1080x1920 | 8s loop | Done |

**Format:** Dramatic blur→reveal zoom, coin bounce, title drop, CTA slide-up. Infinite loop.

#### Video — 3 Positioning Angles (5s Hook → 1.5s Promo → 5s CTA)
| Route | Positioning | Target | Drama | Format | Status |
|-------|-------------|--------|-------|--------|--------|
| `/ads/video-soft` | Soft/Emotional | Female 18-35 | Love Shadi Dhokha | 1080x1920 | Done |
| `/ads/video-bold` | Bold | Male 18-35 | Ghat Ghat Ka Paani | 1080x1080 | Done |
| `/ads/video-female` | Female-specific | Female 18-35 | Gaon Ki Biwi | 1080x1920 | Done |

**Structure:** 5s emotional/bold hook text → 1.5s drama title flash → 5s CTA (logo + ₹2 coin + button). 15s loop.

**Hook copy:**
- Soft: "Kya pyaar mein sab maaf hai?" → "Dekhiye ek aisi kahaani..."
- Bold: "AAP SATISFIED NAHI HO?" (red accent bar)
- Female: "Har aurat ki ek kahaani hai" → "Jo kabhi kisine nahi suni..."

#### Thumb-Start Ads (Fake Play Button — High CTR)
| Route | Drama | Format | Status |
|-------|-------|--------|--------|
| `/ads/thumb-start-1` | Gaon Ki Biwi | 1080x1080 | Done |
| `/ads/thumb-start-2` | Love Guru | 1080x1920 | Done |

**Format:** Full-bleed thumbnail with centered play button overlay, fake progress bar, fake timestamp. Looks like a paused video — users click instinctively. NatakLogo + ₹2 badge + title at bottom.

### Deprecated Ads (files exist, removed from gallery)
These were text-heavy banners — replaced by visual-first approach per user feedback.

| Route | Theme | Why Deprecated |
|-------|-------|----------------|
| `/ads/launch-feed` | Launch / Intro | Text-only, no visuals |
| `/ads/launch-story` | Launch / Intro | Text-only |
| `/ads/launch-landscape` | Launch / Intro | Text-only |
| `/ads/trial-feed` | Trial Hook | Text-only |
| `/ads/trial-story` | Trial Hook | Text-only |
| `/ads/trial-landscape` | Trial Hook | Text-only |
| `/ads/content-feed` | Content Discovery | Text-only |
| `/ads/content-story` | Content Discovery | Text-only |
| `/ads/content-landscape` | Content Discovery | Text-only |
| `/ads/drama-feed` | Drama Names | Early version, replaced |
| `/ads/drama-story` | Drama Names | Early version, replaced |
| `/ads/emotion-feed` | Emotion | Early version, replaced |
| `/ads/emotion-story` | Emotion | Early version, replaced |

---

## Planned (Next)

All positioning video ads and thumb-start ads are complete. Potential next:
- More thumb-start variants with different dramas
- 30-second extended versions of the positioned video ads
- A/B test variants with different hook copy
- Landscape format (1200x628) versions for Facebook link ads

---

## Documentation Files
| File | Content |
|------|---------|
| `docs/meta-ads-copy.md` | 3 campaign ad copy sets (Awareness, Trial, Regional) with Hindi/English/Tamil/Telugu |
| `docs/meta-ads-design-specs.md` | Brand colors, logo specs, typography, CTA button specs, Meta compliance |
| `docs/ads-progress.md` | This file — tracks all ad work, status, and strategy |

---

## How to Export Ads

### Static Ads (Screenshot)
1. Run dev server: `pnpm dev` from `apps/web/`
2. Visit `localhost:3000/ads` → click any static variant
3. DevTools → set viewport to exact dimensions (1080x1080 or 1080x1920)
4. `Ctrl+Shift+P` → "Capture screenshot" in Chrome
5. Upload PNG to Meta Ads Manager

### Video Ads (Screen Record)
1. Visit the video ad route (e.g., `localhost:3000/ads/video-feed`)
2. Set viewport to exact dimensions
3. Screen-record using OBS or Chrome tab recording
4. Refresh page to replay animation from start
5. Upload MP4 to Meta Ads Manager

---

## Master Roadmap (from notes)
1. ~~Remove Test Credentials~~
2. Google Login
3. Make Login Page Better (Visual AI)
4. Razorpay wall UP
5. Autopay Setup
6. **Make Ads (Video Ads)** ← IN PROGRESS
7. **Make Thumb Start Meta ADS** ← UP NEXT
8. Make Thumbnail for Rest
9. Upload Rest 50 vids
10. Smaller Thumbnail & Update Home UI
11. Masking On Player (YT)
12. Play from where you stopped
13. Make PWA
14. Clone repo with Claude, take control
15. Understand own application
16. New scalable GitHub project (10K concurrent users)
