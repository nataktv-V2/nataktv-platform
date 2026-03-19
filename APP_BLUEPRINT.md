# Natak TV -- App Blueprint

> Complete build reference for Natak TV, an Indian drama/natak streaming platform.
> Load this file into any new Claude session to recreate or extend the app.

---

## 1. Tech Stack Summary

| Layer | Technology | Version / Notes |
|-------|-----------|-----------------|
| Framework | Next.js | 16.1.5 (Turbopack) |
| Monorepo | Turborepo + pnpm workspaces | pnpm 10.32.1 |
| Language | TypeScript | 5.9.2 |
| Styling | Tailwind CSS | v4.1 |
| Database | PostgreSQL | DigitalOcean Managed DB |
| ORM | Prisma | 6.6.0 |
| Cache | Redis (ioredis) | On-droplet, 128MB, allkeys-lru |
| Auth | Firebase Auth | Google Sign-in (client SDK + Admin SDK) |
| Payments | Razorpay Subscriptions | INR 2 trial then INR 199/month |
| Image processing | Sharp | 0.34.5 (thumbnail generation) |
| Server | DigitalOcean Droplet | Ubuntu 24.04, 1GB RAM + 2GB swap |
| Reverse proxy | Nginx + Let's Encrypt SSL | HTTP2, gzip, static caching |
| Process manager | PM2 | fork mode, 512MB max restart |
| DNS | Namecheap | nataktv.com, nataktv.in, natak.tv |
| React | React 19.2 | |

---

## 2. Project Structure

```
nataktv-platform/
|-- package.json                    # Root monorepo config
|-- pnpm-workspace.yaml            # Workspace: apps/*, packages/*
|-- turbo.json                      # Turborepo pipeline (build, dev, lint)
|-- deploy/
|   |-- setup.sh                   # Fresh Ubuntu droplet provisioning
|   |-- deploy.sh                  # Pull, build, restart PM2
|   |-- ecosystem.config.js        # PM2 config (port 3000, fork mode)
|   |-- nginx.conf                 # Reverse proxy, SSL, caching rules
|-- scripts/
|   |-- generate-thumbnails.mjs    # Custom thumbnail generator
|   |-- create-excel.mjs           # Video catalog tooling
|-- packages/
|   |-- eslint-config/             # Shared ESLint config
|   |-- typescript-config/         # Shared tsconfig
|-- apps/web/                      # Main Next.js application
    |-- prisma/
    |   |-- schema.prisma          # Database schema (9 models)
    |   |-- migrations/            # Prisma migrations
    |   |-- seed.ts                # Database seeder
    |-- public/                    # Static assets, posters, thumbnails
    |-- next.config.js             # Image remote patterns (YouTube, Google)
    |-- src/
        |-- app/
        |   |-- layout.tsx         # Root layout (fonts, metadata, AuthProvider)
        |   |-- page.tsx           # Landing page (/)
        |   |-- robots.ts          # SEO robots.txt
        |   |-- sitemap.ts         # SEO sitemap
        |   |-- (app)/             # Auth-gated route group
        |   |   |-- layout.tsx     # AppNavbar + BottomNav + AuthGatedLayout
        |   |   |-- home/page.tsx          # Home (category filters, video grid)
        |   |   |-- video/[id]/page.tsx    # Video player page
        |   |   |-- reels/page.tsx         # TikTok-style vertical reels
        |   |   |-- search/page.tsx        # Search results
        |   |   |-- subscribe/page.tsx     # Subscription checkout
        |   |   |-- profile/page.tsx       # User profile (4 sections)
        |   |   |-- watch-history/page.tsx # Watch history with progress bars
        |   |   |-- favourites/page.tsx    # Saved favourites
        |   |   |-- payments/page.tsx      # Payment history
        |   |   |-- help/page.tsx          # Help & Support (mailto form)
        |   |-- admin/             # Admin panel (role-protected)
        |   |   |-- layout.tsx     # Admin layout with role check
        |   |   |-- page.tsx       # Admin dashboard
        |   |   |-- videos/        # Video CRUD + bulk upload
        |   |   |   |-- page.tsx           # Video list
        |   |   |   |-- new/page.tsx       # Add video
        |   |   |   |-- bulk/page.tsx      # Bulk upload
        |   |   |   |-- [id]/edit/page.tsx # Edit video
        |   |   |   |-- [id]/clips/page.tsx # Manage clips/reels
        |   |   |   |-- video-form.tsx     # Shared form component
        |   |   |   |-- delete-button.tsx  # Delete with confirmation
        |   |   |-- categories/page.tsx    # Category management
        |   |   |-- languages/page.tsx     # Language management
        |   |   |-- users/page.tsx         # User management
        |   |   |-- notifications/page.tsx # Push notification sender
        |   |-- ads/               # Ad creative pages (20+ variants)
        |   |   |-- layout.tsx     # Ad layout (no nav)
        |   |   |-- page.tsx       # Ad index
        |   |   |-- launch-*/      # Launch campaign variants
        |   |   |-- trial-*/       # Trial campaign variants
        |   |   |-- video-*/       # Video ad variants
        |   |   |-- visual-*/      # Visual ad variants
        |   |   |-- drama-*/       # Drama angle variants
        |   |   |-- emotion-*/     # Emotion angle variants
        |   |   |-- content-*/     # Content angle variants
        |   |-- api/               # API Routes
        |   |   |-- auth/sync/route.ts              # Firebase -> DB user sync
        |   |   |-- videos/route.ts                 # GET videos (paginated, filtered)
        |   |   |-- reels/route.ts                  # GET reels (cursor-based)
        |   |   |-- search/route.ts                 # GET search
        |   |   |-- watch-history/route.ts           # GET/POST watch progress
        |   |   |-- favourites/route.ts              # GET/POST/DELETE favourites
        |   |   |-- health/route.ts                  # Health check endpoint
        |   |   |-- subscription/
        |   |   |   |-- create/route.ts             # Create Razorpay subscription
        |   |   |   |-- verify/route.ts             # Verify payment signature
        |   |   |   |-- webhook/route.ts            # Razorpay webhook handler
        |   |   |   |-- status/route.ts             # Check subscription status
        |   |   |   |-- cancel/route.ts             # Cancel subscription
        |   |   |   |-- history/route.ts            # Payment history
        |   |   |-- notifications/
        |   |   |   |-- register/route.ts           # Register FCM token
        |   |   |   |-- send/route.ts               # Send push notification
        |   |   |-- admin/                          # Admin-only API routes
        |   |       |-- check/route.ts              # Admin role check
        |   |       |-- videos/route.ts             # CRUD videos
        |   |       |-- videos/bulk/route.ts        # Bulk video import
        |   |       |-- videos/[id]/route.ts        # Single video ops
        |   |       |-- videos/[id]/clips/route.ts  # Clip management
        |   |       |-- videos/[id]/generate-thumbnail/route.ts  # Thumbnail gen
        |   |       |-- categories/route.ts         # CRUD categories
        |   |       |-- categories/[id]/route.ts    # Single category
        |   |       |-- languages/route.ts          # CRUD languages
        |   |       |-- languages/[id]/route.ts     # Single language
        |   |-- delete-account/page.tsx  # Account deletion (public)
        |   |-- privacy/page.tsx         # Privacy policy
        |   |-- terms/page.tsx           # Terms of service
        |   |-- refund/page.tsx          # Refund policy
        |-- components/
        |   |-- auth/
        |   |   |-- AuthProvider.tsx          # Firebase auth context
        |   |-- layout/
        |   |   |-- AppNavbar.tsx             # Top navigation bar
        |   |   |-- BottomNav.tsx             # Mobile bottom navigation
        |   |   |-- AuthGatedLayout.tsx       # Redirect if not logged in
        |   |   |-- HomeTags.tsx             # Category filter tags
        |   |-- video/
        |   |   |-- VideoPlayer.tsx           # YouTube iframe player with custom controls
        |   |   |-- VideoPageClient.tsx       # Video page client wrapper
        |   |   |-- GatedVideoPlayer.tsx      # Subscription-gated player
        |   |   |-- VideoCard.tsx             # Video thumbnail card
        |   |   |-- VideoRow.tsx              # Horizontal scroll video row
        |   |   |-- ContinueWatching.tsx      # Resume watching section
        |   |   |-- FavouriteButton.tsx       # Heart/favourite toggle
        |   |   |-- ShareButton.tsx           # Share via Web Share API
        |   |-- subscription/
        |   |   |-- RazorpayCheckout.tsx      # Razorpay payment modal
        |   |   |-- SubscriptionGate.tsx      # Paywall gate component
        |   |   |-- TrialBanner.tsx           # Trial expiry countdown
        |   |-- notifications/
        |   |   |-- NotificationPrompt.tsx   # FCM push notification opt-in
        |   |-- ads/
        |       |-- AdScaler.tsx             # Responsive ad frame scaler
        |       |-- NatakLogo.tsx            # Branding logo component
        |-- hooks/                           # Custom React hooks (if any)
        |-- lib/
            |-- prisma.ts           # Prisma client singleton
            |-- firebase.ts         # Firebase client SDK init
            |-- firebase-admin.ts   # Firebase Admin SDK init
            |-- razorpay.ts         # Razorpay SDK instance
            |-- redis.ts            # Redis client singleton
            |-- rate-limit.ts       # API rate limiting via Redis
```

---

## 3. Database Schema

### Enums
- **Role**: `USER`, `ADMIN`
- **SubscriptionStatus**: `TRIAL`, `ACTIVE`, `PAST_DUE`, `CANCELLED`, `EXPIRED`

### Models

#### User
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| uniqueId | String | Auto-generated `NTV-XXXXXX` |
| firebaseUid | String | Unique, from Firebase Auth |
| email | String | Unique |
| displayName | String | Default "" |
| photoUrl | String? | Google avatar |
| role | Role | Default USER |
| fcmToken | String? | Push notification token |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Relations: subscriptions[], watchHistory[], favourites[]

#### Video
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| youtubeId | String | YouTube video ID |
| title | String | |
| description | String | Default "" |
| thumbnailUrl | String | Default "" |
| duration | Int | Seconds |
| languageId | String | FK to Language |
| categoryId | String | FK to Category |
| tags | String[] | Default [] |
| isFeatured | Boolean | Default false |
| isTrending | Boolean | Default false |
| views | Int | Default 0 |
| sortOrder | Int | Display ordering |
| reelStart | Int | Reel clip start time (seconds) |
| creditStart | Int? | Where credits begin |
| generatedThumbnailUrl | String? | Custom 9:16 thumbnail |
| publishedAt | DateTime? | |
| createdAt, updatedAt | DateTime | Auto |

Relations: language, category, watchHistory[], clips[], favourites[]
Indexes: languageId, categoryId, isFeatured, isTrending, createdAt DESC

#### Language
| Field | Type |
|-------|------|
| id | String (cuid) |
| name | String (unique) |
| code | String (unique) |

#### Category
| Field | Type |
|-------|------|
| id | String (cuid) |
| name | String (unique) |
| slug | String (unique) |

#### Subscription
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| userId | String | FK to User |
| razorpaySubscriptionId | String? | Unique |
| razorpayPlanId | String? | |
| razorpayCustomerId | String? | |
| status | SubscriptionStatus | Default TRIAL |
| trialStart, trialEnd | DateTime? | |
| currentPeriodStart, currentPeriodEnd | DateTime? | |
| amountPaise | Int | Default 19900 (INR 199) |
| cancelledAt | DateTime? | |

Indexes: userId, status

#### Payment
| Field | Type |
|-------|------|
| id | String (cuid) |
| subscriptionId | String |
| razorpayPaymentId | String (unique) |
| razorpaySignature | String? |
| amountPaise | Int |
| currency | String (default INR) |
| status | String |
| paidAt | DateTime |

#### WatchHistory
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| userId | String | |
| videoId | String | |
| progress | Int | Seconds watched |
| duration | Int | Total duration |
| watchedAt | DateTime | |

Unique constraint: [userId, videoId]
Index: [userId, watchedAt DESC]

#### Clip
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| videoId | String | FK to Video |
| title | String | Default "" |
| startTime | Int | Seconds |
| endTime | Int | Seconds |
| sortOrder | Int | |

#### Favourite
| Field | Type |
|-------|------|
| id | String (cuid) |
| userId | String |
| videoId | String |

Unique constraint: [userId, videoId]
Index: [userId, createdAt DESC]

---

## 4. Key Features Built

### Landing Page
- Scrolling thumbnail showcase of available content
- Google OAuth sign-in button
- App branding and value proposition

### Authentication
- Firebase Auth with Google Sign-in
- AuthProvider context wrapping the entire app
- `/api/auth/sync` -- syncs Firebase user to PostgreSQL on first login
- AuthGatedLayout redirects unauthenticated users

### Home Page
- Category filter tags (HomeTags component)
- Video grid with VideoCard components
- Paginated video loading from `/api/videos`

### Video Player
- YouTube iframe embed with custom overlay controls
- Play/pause, 10s skip forward/back, progress scrubbing
- Fullscreen with landscape orientation lock on mobile
- GatedVideoPlayer wraps player with subscription check
- Credit skip detection via `creditStart` field

### Reels Section
- TikTok-style vertical scroll interface
- Cursor-based pagination (`/api/reels`)
- Each reel uses the `reelStart` field to play a clip segment from the full video
- Swipe up/down navigation

### Continue Watching
- WatchHistory saves progress every 15 seconds via `/api/watch-history`
- ContinueWatching component on home page
- Resume playback with `?t=` query parameter
- Progress bar overlay on video cards

### Search
- Full-text search via `/api/search`
- Real-time results as user types

### Subscription Flow
1. User visits `/subscribe`
2. Frontend calls `/api/subscription/create` -- creates Razorpay subscription
3. RazorpayCheckout component opens Razorpay payment modal
4. On success, frontend calls `/api/subscription/verify` with payment signature
5. Razorpay sends webhook events to `/api/subscription/webhook`
6. SubscriptionGate component checks status before allowing video access
7. TrialBanner shows countdown during trial period
8. Pricing: INR 2 trial then INR 199/month recurring

### Profile
Four sections in a single page:
1. **Account** -- avatar, name, email, NTV-ID
2. **History** -- link to watch history
3. **Support** -- link to help page
4. **Legal** -- links to privacy, terms, refund policies

### Watch History
- Chronological list with thumbnail + progress bar overlay
- Shows percentage completed per video
- Click to resume from saved position

### Favourites
- Heart button on video cards and player page
- Toggle via `/api/favourites` (POST to add, DELETE to remove)
- Dedicated favourites page listing saved videos

### Help & Support
- Contact form using `mailto:` link
- Pre-filled subject line

### Delete Account
- Public page at `/delete-account`
- Handles full account + data removal

### Admin Panel
- Protected by role check (`/api/admin/check`)
- Admin layout with sidebar navigation
- **Video management**: CRUD, inline editing, search/filter
- **Bulk upload**: CSV/spreadsheet import via `/api/admin/videos/bulk`
- **Category management**: add/edit/delete categories
- **Language management**: add/edit/delete languages
- **User management**: view users, role assignment
- **Notifications**: send push notifications to all users via FCM
- **Custom thumbnail generator**: fetches YouTube frame, crops to 9:16, overlays title text + Natak TV branding via Sharp

### Ad Creatives
- 20+ ad variant pages under `/ads/*`
- Three positioning angles: launch, trial, drama/emotion/content
- Three formats: feed (1:1), story (9:16), landscape (16:9)
- AdScaler component for responsive rendering
- Used for Meta and Google ad campaigns

### Auto-Deploy
- Cron job on server checks GitHub every 5 minutes
- Pulls latest code, installs deps, builds, restarts PM2
- Health check validation after deploy

### SEO
- `robots.ts` and `sitemap.ts` for search engine indexing
- Legal pages (privacy, terms, refund) publicly accessible

---

## 5. Deployment Steps

### One-Time Server Setup

```bash
# 1. Create DigitalOcean Droplet (Ubuntu 24.04, 1GB RAM)
# 2. SSH in and add swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 3. Run setup script
bash deploy/setup.sh
# This installs: Node 20, pnpm, PM2, Nginx, Certbot, Redis, UFW firewall

# 4. Clone repository
cd /opt/nataktv
git clone YOUR_REPO_URL .

# 5. Create production env file
cp apps/web/.env.production.example apps/web/.env.production
nano apps/web/.env.production  # Fill in real values

# 6. Install dependencies
pnpm install

# 7. Database setup
cd apps/web
npx prisma generate
npx prisma migrate deploy

# 8. Build
pnpm build

# 9. Configure Nginx
cp deploy/nginx.conf /etc/nginx/sites-available/nataktv
ln -sf /etc/nginx/sites-available/nataktv /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 10. Get SSL certificates
certbot --nginx -d nataktv.com -d www.nataktv.com -d nataktv.in -d www.nataktv.in -d natak.tv -d www.natak.tv

# 11. Start application
pm2 start deploy/ecosystem.config.js
pm2 save
```

### Subsequent Deploys

```bash
cd /opt/nataktv
bash deploy/deploy.sh
# Pulls code, installs deps, runs migrations, builds, restarts PM2, health checks
```

### Auto-Deploy Cron

```bash
crontab -e
# Add:
*/5 * * * * cd /opt/nataktv && git fetch origin main && [ $(git rev-parse HEAD) != $(git rev-parse origin/main) ] && bash deploy/deploy.sh >> /var/log/nataktv/deploy.log 2>&1
```

---

## 6. Environment Variables

### apps/web/.env.production

```bash
# ── Database (DigitalOcean Managed PostgreSQL) ──
DATABASE_URL=postgresql://doadmin:PASSWORD@db-host:25060/nataktv?sslmode=require

# ── Redis (on same Droplet) ──
REDIS_URL=redis://127.0.0.1:6379

# ── Firebase Auth ──
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# ── Razorpay ──
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXX
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_PLAN_ID=plan_XXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# ── App ──
NEXT_PUBLIC_APP_URL=https://nataktv.com
NODE_ENV=production
```

### Required External Services
1. **DigitalOcean** -- Managed PostgreSQL database + Droplet
2. **Firebase** -- Project with Authentication (Google provider) enabled
3. **Razorpay** -- Account with Subscriptions plan created (INR 2 trial, INR 199/month)
4. **Namecheap** -- Domain DNS pointing A records to Droplet IP

---

## 7. Common Issues & Fixes

### OOM During Build
**Problem**: `next build` kills the process on 1GB RAM droplet.
**Fix**: Add 2GB swap file before building.
```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
```

### Prisma Migration Gaps
**Problem**: Schema changes don't match migration history.
**Fix**: Never use `prisma db push` in production. Always create migrations locally with `prisma migrate dev`, commit them, then run `prisma migrate deploy` on server.

### SSL Certificate Setup
**Problem**: Certbot fails because DNS hasn't propagated.
**Fix**: Wait for DNS propagation (check with `dig nataktv.com`), ensure ports 80/443 are open (`ufw allow 80/tcp && ufw allow 443/tcp`), then run certbot.

### SSL Certificate Renewal
Certbot auto-renews via systemd timer. Verify with:
```bash
certbot renew --dry-run
```

### PM2 Won't Start
**Problem**: Next.js process crashes on start.
**Fix**: Check logs with `pm2 logs nataktv --lines 50`. Common cause: missing `.env.production` or ungenerated Prisma client.

### Redis Connection Refused
**Fix**: Ensure Redis is running: `systemctl status redis-server`. If not: `systemctl start redis-server`.

### YouTube Thumbnails Not Loading
**Fix**: Ensure `next.config.js` includes `img.youtube.com` and `i.ytimg.com` in `images.remotePatterns`.

### Build Cache Issues
**Fix**: Clear Turbo cache and Next.js cache:
```bash
rm -rf .turbo apps/web/.next
pnpm build
```

---

## 8. Cost Breakdown

| Service | Monthly Cost |
|---------|-------------|
| DigitalOcean Droplet (1GB RAM) | $6/month |
| DigitalOcean Managed PostgreSQL | $15/month |
| Firebase Auth | Free tier |
| Redis (self-hosted on Droplet) | $0 |
| Namecheap Domains | ~$10-20/year (amortized) |
| Let's Encrypt SSL | Free |
| **Total** | **~$21/month** |

---

## 9. Key Architectural Patterns

### Authentication Flow
1. Client-side: Firebase SDK handles Google OAuth
2. On login, `AuthProvider` calls `/api/auth/sync` with Firebase ID token
3. Server verifies token with Firebase Admin SDK, upserts user in PostgreSQL
4. All protected API routes extract Firebase token from `Authorization: Bearer <token>` header

### Subscription Gating
1. `SubscriptionGate` component wraps protected content
2. Checks `/api/subscription/status` on mount
3. If no active subscription or expired trial, redirects to `/subscribe`
4. Webhook at `/api/subscription/webhook` handles Razorpay events (activated, charged, cancelled, etc.)

### Video Content Strategy
- All video content is hosted on YouTube (unlisted)
- App stores `youtubeId` and embeds via iframe
- Thumbnails pulled from YouTube or custom-generated via Sharp
- No video hosting costs

### Rate Limiting
- Redis-based rate limiting via `lib/rate-limit.ts`
- Applied to sensitive API routes (auth, subscription, search)

### Caching
- Redis caching for frequently accessed data
- Nginx caches static assets (365d for `_next/static`, 30d for thumbnails, 7d for images)

---

## 10. How to Recreate This App for a Different Domain

1. Fork the repository
2. Update branding (logos, colors, app name) in components and public assets
3. Create new Firebase project, enable Google Auth
4. Create new Razorpay account, configure subscription plan
5. Provision DigitalOcean Droplet + Managed PostgreSQL
6. Update `.env.production` with new credentials
7. Update `nginx.conf` with new domain names
8. Run `deploy/setup.sh` then `deploy/deploy.sh`
9. Point DNS to Droplet IP, run certbot for SSL
