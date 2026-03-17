#!/bin/bash
# ── Natak TV — Deploy / Redeploy (PM2 + Nginx) ──
# Run from /opt/nataktv on the Droplet
# Usage: bash deploy/deploy.sh
set -euo pipefail

APP_DIR="/opt/nataktv"
cd "$APP_DIR"

echo "=== Natak TV Deploy ==="
echo "Time: $(date)"

# ── 1. Pull latest code ──
echo "[1/5] Pulling latest code..."
git pull origin main

# ── 2. Install dependencies ──
echo "[2/5] Installing dependencies..."
pnpm install --frozen-lockfile

# ── 3. Database migrations ──
echo "[3/5] Running database migrations..."
cd apps/web
npx prisma generate
npx prisma migrate deploy

# ── 4. Build Next.js ──
echo "[4/5] Building Next.js..."
pnpm build
cd "$APP_DIR"

# ── 5. Restart PM2 ──
echo "[5/5] Restarting PM2..."
pm2 reload nataktv --update-env || pm2 start deploy/ecosystem.config.js
pm2 save

# ── Health check ──
echo "Waiting for health check..."
sleep 3
for i in {1..10}; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null || echo "000")
    if [ "$STATUS" = "200" ]; then
        echo "✅ Health check passed! Site is live."
        break
    fi
    echo "  Waiting... (attempt $i/10, status: $STATUS)"
    sleep 3
done

if [ "$STATUS" != "200" ]; then
    echo "❌ Health check failed! Check logs:"
    echo "   pm2 logs nataktv --lines 50"
    exit 1
fi

echo ""
echo "=== Deploy Complete ==="
echo "Site: https://nataktv.com"
echo "Logs: pm2 logs nataktv"
echo "Status: pm2 status"
echo ""
