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

## Pending — Phase 1
- [ ] Create GitHub org on sandeepchoudhary0's account (CAPTCHA pending)
- [ ] Push code to GitHub
- [ ] Re-restrict GCP API key (currently unrestricted for dev — was debugging O vs 0 issue)

## Pending — Phase 2 (Needs Razorpay Keys)
- [ ] Get real Razorpay API keys from dashboard (replace placeholders in .env)
- [ ] Create Razorpay Plan via dashboard (₹199/month with ₹2 trial for 2 days)
- [ ] Set RAZORPAY_WEBHOOK_SECRET in .env
- [ ] Test subscription flow end-to-end with Razorpay test mode

## Pending — Phase 3 (Polish)
- [ ] Redis caching (video catalog 5min, subscription status 60s/user)
- [ ] Rate limiting
- [ ] SEO: structured data, meta tags, OG images

## Pending — Phase 4 (Deploy + Content)
- [ ] DigitalOcean Droplet setup (Node 20, PM2, Nginx, SSL)
- [ ] DigitalOcean Managed PostgreSQL
- [ ] DNS: point nataktv.com to Droplet
- [ ] GitHub Actions CI/CD pipeline
- [ ] Add 100 YouTube videos via admin panel
- [ ] Custom vertical thumbnails
- [ ] Capacitor wrap for Play Store (com.nataktv.app)

## Credentials Needed
| Credential | Status |
|-----------|--------|
| Firebase project (natak-tv-71b7a) | Done — keys in .env |
| Razorpay Key ID + Secret | Pending — placeholder in .env |
| Razorpay Plan ID | Pending — create via dashboard |
| Razorpay Webhook Secret | Pending — placeholder in .env |
| DigitalOcean account | Pending |
| Domain DNS (nataktv.com) | User owns via Namecheap |
| Natak TV logo (high-res) | Pending — user to share |
