# Natak TV v2 — Todo List

## Completed
- [x] Turborepo + Next.js 16 + Prisma + Tailwind v4 scaffolding
- [x] Prisma schema (User, Video, Language, Category, Subscription, Payment, WatchHistory)
- [x] Prisma seed script (7 languages, 7 categories, 10 sample videos)
- [x] Landing page (hero, categories, how-it-works, CTA, footer)
- [x] App layout shell (AppNavbar with logo+search, BottomNav with Home/Reels/Search/Profile)
- [x] Home page (trending, featured, category rows, language rows — graceful DB fallback)
- [x] Profile page (Google sign-in screen, user profile with subscription card + cancel button)
- [x] Subscribe page (₹199/month plan card with ₹2 trial, RazorpayCheckout integration)
- [x] Search page (server-side PostgreSQL full-text search + language/category filter chips)
- [x] Video player page (custom YouTube player with controls overlay, related videos)
- [x] Reels page (vertical swipe with scroll-snap, IntersectionObserver)
- [x] Firebase Auth provider + Google Login code
- [x] Auth sync API route (/api/auth/sync)
- [x] Videos API route (/api/videos)
- [x] Install PostgreSQL 17 locally
- [x] Run Prisma migrations + seed data
- [x] Firebase Auth working (Google Login → syncs user to DB → profile page shows user)
- [x] Admin panel — dashboard (stats: users, videos, subscribers)
- [x] Admin panel — videos CRUD (table, add/edit form with YouTube oEmbed auto-fill, delete)
- [x] Admin panel — users table (subscription status)
- [x] Admin API routes (/api/admin/videos POST/PUT/DELETE)
- [x] Watch History API (/api/watch-history GET/POST upsert)
- [x] Continue Watching row on home page (client component, progress bars)
- [x] Full-text search — PostgreSQL tsvector + trigram indexes, /api/search endpoint
- [x] Razorpay subscription routes (create/verify/webhook/status/cancel)
- [x] RazorpayCheckout component (loads script, opens modal, verifies payment)
- [x] SubscriptionGate component (paywall overlay on video player)
- [x] TrialBanner component (countdown for trial users)
- [x] Watch history tracking in video player (auto-save progress every 30s)
- [x] GitHub org created (nataktv-V2), code pushed to main
- [x] Admin panel auth protection (role-based access check via /api/admin/check)
- [x] Auth sync API — Firebase token verification (firebase-admin server-side)
- [x] Reels page — subscription gate (paywall for non-subscribers)
- [x] Profile page — fixed dead links (Watch History, Help, About)
- [x] Google sign-in — error handling for popup blocked/cancelled
- [x] ContinueWatching — fixed division by zero when duration=0
- [x] Reels page — proper empty state instead of infinite spinner
- [x] SubscriptionGate — loading spinner instead of flash of free content
- [x] Watch history API — fixed nullish coalescing (progress ?? 0)
- [x] SEO — JSON-LD structured data, enhanced meta tags, Twitter cards, robots.txt, sitemap.xml
- [x] SEO — per-page metadata (home, video detail with dynamic OG image)
- [x] Redis caching layer (graceful fallback if Redis unavailable)
- [x] Video catalog cached 5min, cache invalidated on admin CRUD
- [x] Subscription status user lookup cached
- [x] Rate limiting — auth sync (10/min), subscription create (5/min), search (30/min)
- [x] GitHub Actions CI/CD pipeline (ci.yml: lint+typecheck+build, deploy.yml: SSH deploy to Droplet)
- [x] Capacitor 6 Android setup (com.nataktv.app, dark theme, splash screen, hybrid WebView → nataktv.com)
- [x] Razorpay test keys configured (rzp_test_SRBSnPg2g8VLRn)
- [x] Razorpay plan created (plan_SRBfau8ZjW9LcH — ₹199/month)
- [x] Video player — responsive layout fix (fills full width on tablet/desktop, max-w-4xl centered)
- [x] Video player — YouTube iframe forced to fill container (CSS override for 640x360 default)
- [x] Video player — blocked YouTube "More videos" overlay (pointer-events-none on iframe)

## Pending — Phase 1
- [x] Create GitHub org on sandeepchoudhary0's account — Done (nataktv-V2)
- [x] Push code to GitHub — Done (91 files, main branch)
- [ ] Re-restrict GCP API key (currently unrestricted for dev — was debugging O vs 0 issue)

## Pending — Phase 2 (Razorpay)
- [x] Get Razorpay test API keys — Done (rzp_test_SRBSnPg2g8VLRn)
- [x] Create Razorpay Plan via dashboard — Done (plan_SRBfau8ZjW9LcH, ₹199/month)
- [ ] Set RAZORPAY_WEBHOOK_SECRET in .env (create webhook in Razorpay dashboard → Settings → Webhooks)
- [ ] Test subscription flow end-to-end (use test card 5267 3181 8797 5449)
- [ ] Get real/live Razorpay keys when ready for production

## Pending — Phase 4 (Deploy + Content)
- [ ] DigitalOcean Droplet setup (Node 20, PM2, Nginx, SSL)
- [ ] DigitalOcean Managed PostgreSQL
- [ ] DNS: point nataktv.com to Droplet
- [x] GitHub Actions CI/CD pipeline
- [ ] Add 100 YouTube videos via admin panel
- [ ] Custom vertical thumbnails
- [x] Capacitor wrap for Play Store (com.nataktv.app)

## Credentials & Config
| Credential | Status |
|-----------|--------|
| Firebase project (natak-tv-71b7a) | Done — keys in .env |
| Razorpay Key ID (test) | Done — rzp_test_SRBSnPg2g8VLRn |
| Razorpay Key Secret (test) | Done — in .env |
| Razorpay Plan ID | Done — plan_SRBfau8ZjW9LcH |
| Razorpay Webhook Secret | Pending — create via dashboard |
| DigitalOcean account | Pending |
| Domain DNS (nataktv.com) | User owns via Namecheap |
| Natak TV logo (high-res) | Pending — user to share |
| GCP API key restriction | Pending — re-restrict in Cloud Console |

## Dev Setup (How to Run Locally)
1. Clone: `git clone https://github.com/nataktv-V2/nataktv-platform.git`
2. Install: `pnpm install`
3. Database: PostgreSQL 17 running on localhost:5432, database `nataktv`
4. Env: Copy `.env` to `apps/web/.env` (keys listed above)
5. Migrate: `cd apps/web && pnpm db:migrate`
6. Seed: `cd apps/web && pnpm db:seed`
7. Dev server: `pnpm dev` (runs on port 3000)
8. Build: `pnpm build` (production build)

## Key Files
| Area | Path |
|------|------|
| Landing page | `apps/web/src/app/page.tsx` |
| Home page | `apps/web/src/app/(app)/home/page.tsx` |
| Video player | `apps/web/src/components/video/VideoPlayer.tsx` |
| Subscription gate | `apps/web/src/components/subscription/SubscriptionGate.tsx` |
| Razorpay checkout | `apps/web/src/components/subscription/RazorpayCheckout.tsx` |
| Auth provider | `apps/web/src/components/auth/AuthProvider.tsx` |
| Admin panel | `apps/web/src/app/admin/` |
| API routes | `apps/web/src/app/api/` |
| Razorpay lib | `apps/web/src/lib/razorpay.ts` |
| Redis cache | `apps/web/src/lib/redis.ts` |
| Rate limiter | `apps/web/src/lib/rate-limit.ts` |
| Prisma schema | `apps/web/prisma/schema.prisma` |
| CI/CD | `.github/workflows/ci.yml`, `.github/workflows/deploy.yml` |
| Capacitor | `apps/web/capacitor.config.ts`, `apps/web/android/` |
