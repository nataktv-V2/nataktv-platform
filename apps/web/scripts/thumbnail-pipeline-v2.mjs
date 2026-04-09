#!/usr/bin/env node
/**
 * NATAK TV — Thumbnail Pipeline v2
 * Each thumbnail uses UNIQUE YouTube frames + category-matched color grading
 * No two thumbnails look alike.
 *
 * USAGE:
 *   node scripts/thumbnail-pipeline-v2.mjs --all
 *   node scripts/thumbnail-pipeline-v2.mjs --ids id1,id2
 *   node scripts/thumbnail-pipeline-v2.mjs --all --no-db
 */

import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GENERATED_DIR = path.join(ROOT, "public", "thumbnails", "generated");
const TARGET_W = 2160;
const TARGET_H = 3840;

const args = process.argv.slice(2);
const getFlag = (n) => args.includes(`--${n}`);
const getArg = (n) => { const i = args.indexOf(`--${n}`); return i !== -1 && args[i+1] ? args[i+1] : null; };
const DO_ALL = getFlag("all");
const IDS = getArg("ids")?.split(",").map(s => s.trim()) || [];
const NO_DB = getFlag("no-db");

if (!DO_ALL && IDS.length === 0) {
  console.log("Usage: node scripts/thumbnail-pipeline-v2.mjs --all | --ids id1,id2 [--no-db]");
  process.exit(0);
}

// ── Category color grading profiles ─────────────────────────────
// Each category gets a distinct look. Multiple variations per category for variety.
const CATEGORY_STYLES = {
  Romance: [
    { name: "rose-glow",     sat: 1.5, brightness: 1.1, hue: 0,   tintR: 1.20, tintG: 0.85, tintB: 0.90, gamma: 1.2, accentColor: "#ec4899" },
    { name: "warm-blush",    sat: 1.4, brightness: 1.05, hue: 0,  tintR: 1.15, tintG: 0.90, tintB: 0.85, gamma: 1.1, accentColor: "#f43f5e" },
    { name: "sunset-love",   sat: 1.3, brightness: 1.15, hue: 0,  tintR: 1.25, tintG: 0.95, tintB: 0.80, gamma: 1.3, accentColor: "#fb923c" },
    { name: "deep-romance",  sat: 1.6, brightness: 1.0, hue: 0,   tintR: 1.10, tintG: 0.80, tintB: 0.95, gamma: 1.0, accentColor: "#a855f7" },
    { name: "cherry-red",    sat: 1.5, brightness: 1.1, hue: 0,   tintR: 1.30, tintG: 0.82, tintB: 0.82, gamma: 1.2, accentColor: "#ef4444" },
  ],
  Drama: [
    { name: "golden-cinema", sat: 1.2, brightness: 1.05, hue: 0, tintR: 1.15, tintG: 1.05, tintB: 0.80, gamma: 1.1, accentColor: "#f59e0b" },
    { name: "amber-mood",    sat: 1.3, brightness: 1.0, hue: 0,  tintR: 1.20, tintG: 1.00, tintB: 0.75, gamma: 1.0, accentColor: "#d97706" },
    { name: "cool-drama",    sat: 1.1, brightness: 1.1, hue: 0,  tintR: 0.90, tintG: 0.95, tintB: 1.15, gamma: 1.2, accentColor: "#6366f1" },
    { name: "teal-shadow",   sat: 1.2, brightness: 1.05, hue: 0, tintR: 0.85, tintG: 1.05, tintB: 1.10, gamma: 1.1, accentColor: "#14b8a6" },
    { name: "bronze-warm",   sat: 1.4, brightness: 1.0, hue: 0,  tintR: 1.18, tintG: 1.02, tintB: 0.82, gamma: 1.0, accentColor: "#ea580c" },
    { name: "slate-blue",    sat: 1.1, brightness: 1.1, hue: 0,  tintR: 0.92, tintG: 0.92, tintB: 1.12, gamma: 1.2, accentColor: "#818cf8" },
    { name: "deep-gold",     sat: 1.3, brightness: 0.95, hue: 0, tintR: 1.22, tintG: 1.08, tintB: 0.78, gamma: 0.9, accentColor: "#b45309" },
  ],
  Comedy: [
    { name: "bright-pop",    sat: 1.6, brightness: 1.2, hue: 0,  tintR: 1.10, tintG: 1.10, tintB: 0.85, gamma: 1.4, accentColor: "#facc15" },
    { name: "neon-fun",      sat: 1.5, brightness: 1.15, hue: 0, tintR: 0.95, tintG: 1.15, tintB: 1.05, gamma: 1.3, accentColor: "#22c55e" },
    { name: "candy-orange",  sat: 1.7, brightness: 1.2, hue: 0,  tintR: 1.20, tintG: 1.05, tintB: 0.80, gamma: 1.5, accentColor: "#f97316" },
    { name: "electric-lime", sat: 1.5, brightness: 1.25, hue: 0, tintR: 1.00, tintG: 1.18, tintB: 0.85, gamma: 1.4, accentColor: "#84cc16" },
    { name: "bubblegum",     sat: 1.6, brightness: 1.15, hue: 0, tintR: 1.15, tintG: 0.90, tintB: 1.10, gamma: 1.3, accentColor: "#d946ef" },
  ],
  Action: [
    { name: "teal-orange",   sat: 1.4, brightness: 1.05, hue: 0, tintR: 1.15, tintG: 0.95, tintB: 0.85, gamma: 1.0, accentColor: "#f97316" },
    { name: "cold-steel",    sat: 1.1, brightness: 1.0, hue: 0,  tintR: 0.90, tintG: 0.95, tintB: 1.20, gamma: 0.9, accentColor: "#3b82f6" },
    { name: "fire-blast",    sat: 1.5, brightness: 1.1, hue: 0,  tintR: 1.25, tintG: 0.90, tintB: 0.80, gamma: 1.1, accentColor: "#ef4444" },
    { name: "dark-impact",   sat: 1.3, brightness: 0.95, hue: 0, tintR: 1.05, tintG: 0.90, tintB: 1.05, gamma: 0.8, accentColor: "#8b5cf6" },
  ],
  Crime: [
    { name: "noir-green",    sat: 1.1, brightness: 0.9, hue: 0,  tintR: 0.85, tintG: 1.05, tintB: 0.90, gamma: 0.8, accentColor: "#10b981" },
    { name: "cold-case",     sat: 1.0, brightness: 0.85, hue: 0, tintR: 0.88, tintG: 0.92, tintB: 1.15, gamma: 0.7, accentColor: "#64748b" },
    { name: "blood-dark",    sat: 1.2, brightness: 0.9, hue: 0,  tintR: 1.10, tintG: 0.85, tintB: 0.85, gamma: 0.8, accentColor: "#dc2626" },
  ],
  "Short Film": [
    { name: "cool-indie",    sat: 1.2, brightness: 1.1, hue: 0,  tintR: 0.92, tintG: 1.00, tintB: 1.15, gamma: 1.2, accentColor: "#06b6d4" },
    { name: "warm-film",     sat: 1.3, brightness: 1.05, hue: 0, tintR: 1.12, tintG: 1.05, tintB: 0.88, gamma: 1.1, accentColor: "#eab308" },
    { name: "pastel-art",    sat: 1.1, brightness: 1.2, hue: 0,  tintR: 1.05, tintG: 0.95, tintB: 1.08, gamma: 1.3, accentColor: "#c084fc" },
    { name: "muted-earth",   sat: 1.0, brightness: 1.0, hue: 0,  tintR: 1.08, tintG: 1.02, tintB: 0.90, gamma: 1.0, accentColor: "#a3a3a3" },
  ],
  Horror: [
    { name: "dark-purple",   sat: 1.0, brightness: 0.8, hue: 0,  tintR: 0.95, tintG: 0.80, tintB: 1.10, gamma: 0.7, accentColor: "#7c3aed" },
    { name: "deathly-green", sat: 0.9, brightness: 0.85, hue: 0, tintR: 0.85, tintG: 1.00, tintB: 0.85, gamma: 0.7, accentColor: "#16a34a" },
  ],
};

// Fallback for unknown categories
const DEFAULT_STYLES = [
  { name: "neutral", sat: 1.2, brightness: 1.05, hue: 0, tintR: 1.05, tintG: 1.00, tintB: 0.95, gamma: 1.1, accentColor: "#f97316" },
];

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function getImageBrightness(buffer) {
  const { data, info } = await sharp(buffer).resize(100, 100, { fit: "cover" }).raw().toBuffer({ resolveWithObject: true });
  let total = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    total += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }
  return total / (info.width * info.height);
}

// ── Fetch UNIQUE YouTube frame per video ────────────────────────

async function fetchBestYouTubeFrame(youtubeId) {
  const urls = [
    `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/1.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/2.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/3.jpg`,
  ];

  let best = { buffer: null, brightness: 0, url: "" };

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 5000) continue;
      const brightness = await getImageBrightness(buffer);
      if (brightness > best.brightness) {
        best = { buffer, brightness, url };
      }
    } catch {}
  }
  return best;
}

// ── Apply category color grading ────────────────────────────────

async function applyColorGrade(buffer, style) {
  // Step 1: Modulate saturation + brightness (gamma must be >= 1.0)
  const gammaVal = Math.max(1.0, style.gamma);
  let processed = await sharp(buffer)
    .modulate({ saturation: style.sat, brightness: style.brightness })
    .gamma(gammaVal)
    .toBuffer();

  // Step 2: Apply RGB tint via raw pixels
  const { data, info } = await sharp(processed).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    data[i]     = Math.min(255, Math.round(data[i] * style.tintR));
    data[i + 1] = Math.min(255, Math.round(data[i + 1] * style.tintG));
    data[i + 2] = Math.min(255, Math.round(data[i + 2] * style.tintB));
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .jpeg()
    .toBuffer();
}

// ── Vignette effect (dark edges) ────────────────────────────────

function makeVignetteSvg() {
  return `
    <svg width="${TARGET_W}" height="${TARGET_H}">
      <defs>
        <radialGradient id="vig" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="black" stop-opacity="0" />
          <stop offset="70%" stop-color="black" stop-opacity="0" />
          <stop offset="100%" stop-color="black" stop-opacity="0.6" />
        </radialGradient>
      </defs>
      <rect width="${TARGET_W}" height="${TARGET_H}" fill="url(#vig)" />
    </svg>
  `;
}

// ── Gradient overlays ───────────────────────────────────────────

function makeGradientSvg(accentColor) {
  return `
    <svg width="${TARGET_W}" height="${TARGET_H}">
      <defs>
        <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black" stop-opacity="0.65" />
          <stop offset="35%" stop-color="black" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="botGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black" stop-opacity="0" />
          <stop offset="55%" stop-color="black" stop-opacity="0" />
          <stop offset="82%" stop-color="black" stop-opacity="0.55" />
          <stop offset="100%" stop-color="black" stop-opacity="0.9" />
        </linearGradient>
        <linearGradient id="accentGlow" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.15" />
          <stop offset="15%" stop-color="${accentColor}" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="${TARGET_W}" height="${TARGET_H}" fill="url(#topGrad)" />
      <rect width="${TARGET_W}" height="${TARGET_H}" fill="url(#botGrad)" />
      <rect width="${TARGET_W}" height="${TARGET_H}" fill="url(#accentGlow)" />
    </svg>
  `;
}

// ── Text overlay ────────────────────────────────────────────────

function makeTextOverlaySvg(title, accentColor) {
  const words = title.toUpperCase().split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 14 && cur) { lines.push(cur.trim()); cur = w; }
    else { cur = cur ? cur + " " + w : w; }
  }
  if (cur.trim()) lines.push(cur.trim());
  const display = lines.slice(0, 3);

  const lineH = 170;
  const startY = 320;

  const texts = display.map((line, i) =>
    `<text x="${TARGET_W / 2}" y="${startY + i * lineH}"
      text-anchor="middle" font-family="Impact, Arial Black, sans-serif"
      font-size="150" font-weight="900" fill="white"
      stroke="black" stroke-width="6"
      paint-order="stroke"
      style="text-shadow: 0 6px 20px rgba(0,0,0,0.95)">
      ${escapeXml(line)}
    </text>`
  ).join("");

  // Accent bar
  const barY = startY + display.length * lineH - 50;
  const bar = `<rect x="${TARGET_W * 0.15}" y="${barY}" width="${TARGET_W * 0.7}" height="12" fill="${accentColor}" rx="6" opacity="0.9" />`;

  // NATAK TV branding bottom-left with glow
  const brand = `
    <text x="110" y="${TARGET_H - 90}"
      font-family="Arial Black, sans-serif"
      font-size="76" font-weight="900" fill="${accentColor}" letter-spacing="6"
      stroke="black" stroke-width="3" paint-order="stroke">
      NATAK TV
    </text>
  `;

  return `<svg width="${TARGET_W}" height="${TARGET_H}">${texts}${bar}${brand}</svg>`;
}

// ── Main generator ──────────────────────────────────────────────

async function generateThumbnail(video, categoryCounters) {
  const category = video.category?.name || "Drama";
  const styles = CATEGORY_STYLES[category] || DEFAULT_STYLES;

  // Pick style based on how many of this category we've seen (ensures variety within category)
  if (!categoryCounters[category]) categoryCounters[category] = 0;
  const styleIdx = categoryCounters[category] % styles.length;
  categoryCounters[category]++;
  const style = styles[styleIdx];

  // Fetch unique YouTube frame
  const yt = await fetchBestYouTubeFrame(video.youtubeId);
  if (!yt.buffer) {
    console.log(`  ❌ ${video.title} — No YouTube frame found`);
    return null;
  }

  // Crop to 9:16 portrait
  let cropped = await sharp(yt.buffer)
    .resize(TARGET_W, TARGET_H, { fit: "cover", position: "attention" })
    .toBuffer();

  // Brighten if too dark
  if (yt.brightness < 45) {
    cropped = await sharp(cropped)
      .modulate({ brightness: 1.5, saturation: 1.2 })
      .gamma(1.6)
      .toBuffer();
  }

  // Apply category color grading
  const graded = await applyColorGrade(cropped, style);

  // Compose: graded image + vignette + gradient + text
  const finalImage = await sharp(graded)
    .composite([
      { input: Buffer.from(makeVignetteSvg()), blend: "over" },
      { input: Buffer.from(makeGradientSvg(style.accentColor)), blend: "over" },
      { input: Buffer.from(makeTextOverlaySvg(video.title, style.accentColor)), blend: "over" },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  // Save
  await mkdir(GENERATED_DIR, { recursive: true });
  const filename = `${video.id}.jpg`;
  await writeFile(path.join(GENERATED_DIR, filename), finalImage);
  await writeFile(path.join(ROOT, "public", "thumbnails", filename), finalImage);

  const sizeKB = Math.round(finalImage.length / 1024);
  console.log(`  ✅ ${video.title} [${category}] — ${style.name} — ${sizeKB}KB`);
  return `/thumbnails/generated/${filename}`;
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   NATAK TV — Thumbnail Pipeline v2       ║");
  console.log("║   Unique frames + category color grading  ║");
  console.log("╚══════════════════════════════════════════╝\n");

  const prisma = new PrismaClient();
  try {
    let videos;
    if (DO_ALL) {
      videos = await prisma.video.findMany({ include: { category: true }, orderBy: { createdAt: "asc" } });
    } else {
      videos = await prisma.video.findMany({ where: { id: { in: IDS } }, include: { category: true } });
    }

    console.log(`Processing ${videos.length} videos...\n`);

    const categoryCounters = {};
    let success = 0, failed = 0;

    for (const video of videos) {
      const url = await generateThumbnail(video, categoryCounters);
      if (url) {
        success++;
        if (!NO_DB) {
          await prisma.video.update({ where: { id: video.id }, data: { generatedThumbnailUrl: url } });
        }
      } else {
        failed++;
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Done! ✅ ${success} generated, ❌ ${failed} failed`);
    if (!NO_DB) console.log("Database updated.");
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
