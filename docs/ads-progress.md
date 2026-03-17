# Natak TV — Ad Creatives Progress

> Last updated: 2026-03-15

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

## Visual Upgrade Log (2026-03-15)

All 28 ads received a comprehensive upgrade:

### Changes Applied
| Upgrade | Scope | Status |
|---------|-------|--------|
| **Poppins typography** | All 28 ads — headlines use `var(--font-poppins)` weight 800 | ✅ Done |
| **Gradient CTA buttons** | All ads — `linear-gradient(135deg, #f97316, #ea580c)` + box-shadow | ✅ Done |
| **Social proof badges** | 8 key ads — "50K+ users", "Rated 4.8★", "New episodes weekly" etc. | ✅ Done |
| **Urgency badges** | trial-feed ("Offer ends Sunday"), trial-story ("Limited Time Offer") | ✅ Done |
| **Differentiated CTA copy** | All static ads — no more repetitive "Abhi Dekho" | ✅ Done |
| **Emoji removal** | drama-feed, drama-story → colored dots; emotion-feed, emotion-story → text labels | ✅ Done |
| **Text shadows** | visual-feed 1/2/3, visual-story 1/2/3 — show titles readable on any thumbnail | ✅ Done |
| **GPU hints** | video-soft/bold/female/teaser — `willChange` + `backfaceVisibility` | ✅ Done |
| **AdScaler component** | Auto-scales fixed-size ads to fit browser viewport | ✅ Done |
| **AI thumbnail script** | `scripts/generate-thumbnails.mjs` — ready to run when Pollinations API recovers | ⏳ Pending |

### CTA Copy Mapping
| Ad | Old CTA | New CTA |
|---|---|---|
| trial-feed | Try for ₹2 | Start Free Trial — ₹2 |
| trial-story | Try for ₹2 | Unlock 100+ Shows — ₹2 |
| launch-feed | Start Watching | Join 50K+ Viewers |
| launch-story | Start Watching | Explore Free for ₹2 |
| content-feed | Abhi Dekho | Browse All Shows |
| drama-feed | Abhi Dekho | Binge Now — ₹2 Only |
| visual-feed-1 | Watch Now | Play Gaon Ki Biwi — ₹2 |
| visual-story-1/2/3 | Watch Now | Swipe Up to Watch |
| video-bold | Watch Now | Watch Now — Free |
| video-soft | Abhi Dekho | Start Watching — ₹2 |
| video-female | Abhi Dekho | Apni Kahaani Dekho |

---

## Files Overview

### Shared Components
| File | Purpose |
|------|---------|
| `components/ads/NatakLogo.tsx` | Reusable logo — gradient "Natak" + purple "TV" badge. Sizes: sm/md/lg/xl |
| `components/ads/AdScaler.tsx` | Auto-scales fixed-size ad pages to fit browser viewport via DOM manipulation |
| `app/ads/layout.tsx` | Loads Poppins font + wraps children in AdScaler |
| `app/ads/page.tsx` | Gallery index — lists all ad variants with links |
| `scripts/generate-thumbnails.mjs` | AI thumbnail generator via Pollinations API (free, no key) |

### Active Ads

#### Static — Single Show Feed (1080x1080)
| Route | Drama | YouTube ID | Status |
|-------|-------|------------|--------|
| `/ads/visual-feed-1` | Gaon Ki Biwi | eZkwCc4KpGc | Done |
| `/ads/visual-feed-2` | Kalyanam to Kadhal | W4jdt5QVmFQ | Done |
| `/ads/visual-feed-3` | Hey Leela | Ds1X74cvKtI | Done |

#### Static — Single Show Story (1080x1920)
| Route | Drama | YouTube ID | Status |
|-------|-------|------------|--------|
| `/ads/visual-story-1` | Ghat Ghat Ka Paani | -Jts8lNYLJo | Done |
| `/ads/visual-story-2` | Love Shadi Dhokha | v-sD6hE-AKc | Done |
| `/ads/visual-story-3` | Love Guru | pCbuY1jnKbk | Done |

#### Static — Multi-Show Collage (1080x1080)
| Route | Shows | Status |
|-------|-------|--------|
| `/ads/visual-collage` | Gaon Ki Biwi, Kalyanam to Kadhal, Hey Leela, Hurry Burry | Done |

#### Static — Theme Banners (all formats)
| Route | Theme | Format | Status |
|-------|-------|--------|--------|
| `/ads/trial-feed` | Trial Hook (₹2) | 1080x1080 | Done |
| `/ads/trial-story` | Trial Hook (₹2) | 1080x1920 | Done |
| `/ads/trial-landscape` | Trial Hook (₹2) | 1200x628 | Done |
| `/ads/launch-feed` | Launch / Intro | 1080x1080 | Done |
| `/ads/launch-story` | Launch / Intro | 1080x1920 | Done |
| `/ads/launch-landscape` | Launch / Intro | 1200x628 | Done |
| `/ads/content-feed` | Content Discovery | 1080x1080 | Done |
| `/ads/content-story` | Content Discovery | 1080x1920 | Done |
| `/ads/content-landscape` | Content Discovery | 1200x628 | Done |
| `/ads/drama-feed` | Drama Names | 1080x1080 | Done |
| `/ads/drama-story` | Drama Names | 1080x1920 | Done |
| `/ads/emotion-feed` | Emotion/Mood | 1080x1080 | Done |
| `/ads/emotion-story` | Emotion/Mood | 1080x1920 | Done |

#### Video — Multi-Show Carousel
| Route | Format | Duration | Status |
|-------|--------|----------|--------|
| `/ads/video-feed` | 1080x1080 | ~15s | Done |
| `/ads/video-story` | 1080x1920 | ~15s | Done |

#### Video — Single Show Teaser
| Route | Drama | Format | Duration | Status |
|-------|-------|--------|----------|--------|
| `/ads/video-teaser` | Gaon Ki Biwi | 1080x1920 | 8s loop | Done |

#### Video — 3 Positioning Angles (5s Hook → 1.5s Promo → 5s CTA)
| Route | Positioning | Target | Drama | Format | Status |
|-------|-------------|--------|-------|--------|--------|
| `/ads/video-soft` | Soft/Emotional | Female 18-35 | Love Shadi Dhokha | 1080x1920 | Done |
| `/ads/video-bold` | Bold | Male 18-35 | Ghat Ghat Ka Paani | 1080x1080 | Done |
| `/ads/video-female` | Female-specific | Female 18-35 | Gaon Ki Biwi | 1080x1920 | Done |

#### Thumb-Start Ads (Fake Play Button — High CTR)
| Route | Drama | Format | Status |
|-------|-------|--------|--------|
| `/ads/thumb-start-1` | Gaon Ki Biwi | 1080x1080 | Done |
| `/ads/thumb-start-2` | Love Guru | 1080x1920 | Done |

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

## AI Thumbnail Generation

Script: `scripts/generate-thumbnails.mjs`
- Uses Pollinations.ai (free, no API key)
- Generates 7 show thumbnails to `public/thumbnails/ads/`
- Run: `node scripts/generate-thumbnails.mjs`
- Shows: Gaon Ki Biwi, Kalyanam to Kadhal, Hey Leela, Ghat Ghat Ka Paani, Love Shadi Dhokha, Love Guru, Hurry Burry
- Status: Script ready, API was down on 2026-03-15. Retry later.

Alternative: Use Bing Image Creator (bing.com/images/create) manually with the prompts in the script.

---

## Master Roadmap (from notes)
1. ~~Remove Test Credentials~~
2. Google Login
3. Make Login Page Better (Visual AI)
4. Razorpay wall UP
5. Autopay Setup
6. ~~**Make Ads (Video Ads)**~~ ✅ DONE
7. ~~**Make Thumb Start Meta ADS**~~ ✅ DONE
8. Make Thumbnail for Rest
9. Upload Rest 50 vids
10. Smaller Thumbnail & Update Home UI
11. Masking On Player (YT)
12. Play from where you stopped
13. Make PWA
14. Clone repo with Claude, take control
15. Understand own application
16. New scalable GitHub project (10K concurrent users)
