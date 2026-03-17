#!/bin/bash
# ── Natak TV — Fresh Ubuntu Droplet Setup (PM2 + Nginx) ──
# Run once on a new DigitalOcean Droplet (Ubuntu 24.04)
# Usage: ssh root@YOUR_DROPLET_IP 'bash -s' < setup.sh
set -euo pipefail

echo "=== Natak TV Server Setup (PM2 + Nginx) ==="

# ── 1. System updates ──
echo "[1/8] Updating system..."
apt-get update -y && apt-get upgrade -y

# ── 2. Install Node.js 20 ──
echo "[2/8] Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo "Node: $(node -v) | npm: $(npm -v)"

# ── 3. Install pnpm + PM2 ──
echo "[3/8] Installing pnpm & PM2..."
npm install -g pnpm@10.32.1 pm2
pm2 install pm2-logrotate

# ── 4. Install Nginx ──
echo "[4/8] Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx

# ── 5. Install Certbot for SSL ──
echo "[5/8] Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx

# ── 6. Install Redis ──
echo "[6/8] Installing Redis..."
apt-get install -y redis-server
sed -i 's/^supervised no/supervised systemd/' /etc/redis/redis.conf
echo "maxmemory 128mb" >> /etc/redis/redis.conf
echo "maxmemory-policy allkeys-lru" >> /etc/redis/redis.conf
systemctl enable redis-server
systemctl restart redis-server

# ── 7. Firewall ──
echo "[7/8] Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# ── 8. Create app directory & logs ──
echo "[8/8] Setting up directories..."
mkdir -p /opt/nataktv
mkdir -p /var/log/nataktv

# Set up PM2 startup on boot
pm2 startup systemd -u root --hp /root
echo "PM2 startup configured."

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Clone repo:  cd /opt/nataktv && git clone YOUR_REPO_URL ."
echo "  2. Create .env.production:  cp apps/web/.env.production.example apps/web/.env.production"
echo "  3. Edit with real values:  nano apps/web/.env.production"
echo "  4. Install deps:  cd /opt/nataktv && pnpm install"
echo "  5. Build:  cd apps/web && npx prisma generate && npx prisma migrate deploy && pnpm build"
echo "  6. Copy nginx config:"
echo "     cp deploy/nginx.conf /etc/nginx/sites-available/nataktv"
echo "     ln -sf /etc/nginx/sites-available/nataktv /etc/nginx/sites-enabled/"
echo "     rm -f /etc/nginx/sites-enabled/default"
echo "     nginx -t && systemctl reload nginx"
echo "  7. Get SSL:"
echo "     certbot --nginx -d nataktv.com -d www.nataktv.com -d nataktv.in -d www.nataktv.in -d natak.tv -d www.natak.tv"
echo "  8. Start app:  pm2 start deploy/ecosystem.config.js && pm2 save"
echo ""
