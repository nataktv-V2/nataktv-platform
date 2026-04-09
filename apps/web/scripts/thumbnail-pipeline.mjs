#!/usr/bin/env node
/**
 * NATAK TV — Thumbnail Generation Pipeline
 * ==========================================
 * Reusable script to generate professional thumbnails for any video.
 *
 * USAGE:
 *   # Generate for ALL videos in the database:
 *   node scripts/thumbnail-pipeline.mjs --all
 *
 *   # Generate for specific video IDs:
 *   node scripts/thumbnail-pipeline.mjs --ids cmmqncn5k000fkr2w09s7l1t9,cmmrwzpuc002ekrp0ql821g2e
 *
 *   # Generate using AI base images (portrait overlays):
 *   node scripts/thumbnail-pipeline.mjs --all --mode ai
 *
 *   # Generate using YouTube frames (auto-picks brightest):
 *   node scripts/thumbnail-pipeline.mjs --all --mode youtube
 *
 *   # Preview only (don't update DB):
 *   node scripts/thumbnail-pipeline.mjs --all --no-db
 *
 *   # Custom title override:
 *   node scripts/thumbnail-pipeline.mjs --ids cmmqncn5k000fkr2w09s7l1t9 --title "My Custom Title"
 *
 * MODES:
 *   ai       — Uses AI base images from public/thumbnails/ai-base/ with color tints
 *   youtube  — Fetches best YouTube frame (brightest of 5 samples)
 *   auto     — (default) Uses AI base if available, falls back to YouTube
 *
 * REQUIREMENTS:
 *   - sharp (npm install sharp)
 *   - DATABASE_URL env var set (or uses .env file)
 *
 * OUTPUT:
 *   - Saves to public/thumbnails/generated/{videoId}.jpg
 *   - Updates generatedThumbnailUrl in database (unless --no-db)
 */

import sharp from "sharp";
import { writeFile, mkdir, readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GENERATED_DIR = path.join(ROOT, "public", "thumbnails", "generated");
const AI_BASE_DIR = path.join(ROOT, "public", "thumbnails", "ai-base");
const TARGET_W = 2160;
const TARGET_H = 3840;

// ── Parse CLI args ──────────────────────────────────────────────
const args = process.argv.slice(2);
function getFlag(name) { return args.includes(`--${name}`); }
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const MODE = getArg("mode") || "auto"; // ai | youtube | auto
const DO_ALL = getFlag("all");
const IDS = getArg("ids")?.split(",").map(s => s.trim()) || [];
const NO_DB = getFlag("no-db");
const TITLE_OVERRIDE = getArg("title");

if (!DO_ALL && IDS.length === 0) {
  console.log(`
Natak TV Thumbnail Pipeline
============================
Usage:
  node scripts/thumbnail-pipeline.mjs --all                    Generate for ALL videos
  node scripts/thumbnail-pipeline.mjs --ids id1,id2            Generate for specific videos
  node scripts/thumbnail-pipeline.mjs --all --mode ai          Use AI base images
  node scripts/thumbnail-pipeline.mjs --all --mode youtube     Use YouTube frames
  node scripts/thumbnail-pipeline.mjs --all --no-db            Don't update database
  node scripts/thumbnail-pipeline.mjs --ids id1 --title "X"    Custom title

Modes: ai, youtube, auto (default)
  `);
  process.exit(0);
}

// ── Helpers ─────────────────────────────────────────────────────

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function getImageBrightness(buffer) {
  const { data, info } = await sharp(buffer)
    .resize(100, 100, { fit: "cover" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let total = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    total += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }
  return total / (info.width * info.height);
}

// ── YouTube frame fetcher ───────────────────────────────────────

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
      if (buffer.length < 5000) continue; // skip placeholder
      const brightness = await getImageBrightness(buffer);
      if (brightness > best.brightness) {
        best = { buffer, brightness, url };
      }
    } catch {}
  }

  return best;
}

// ── AI base image picker ────────────────────────────────────────

let aiBaseImages = [];

async function loadAIBaseImages() {
  try {
    const files = await readdir(AI_BASE_DIR);
    const jpgs = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    for (const file of jpgs) {
      const buffer = await readFile(path.join(AI_BASE_DIR, file));
      aiBaseImages.push({ name: file, buffer });
    }
    console.log(`Loaded ${aiBaseImages.length} AI base images from ${AI_BASE_DIR}`);
  } catch {
    console.log("No AI base images found — will use YouTube frames only");
  }
}

// Color tint presets for creating variations from AI base images
const COLOR_TINTS = [
  { name: "warm-red",    r: 1.15, g: 0.95, b: 0.90, sat: 1.3 },
  { name: "golden",      r: 1.10, g: 1.05, b: 0.85, sat: 1.2 },
  { name: "cool-blue",   r: 0.90, g: 0.95, b: 1.15, sat: 1.1 },
  { name: "purple",      r: 1.05, g: 0.90, b: 1.10, sat: 1.2 },
  { name: "pink",        r: 1.15, g: 0.90, b: 1.00, sat: 1.3 },
  { name: "emerald",     r: 0.90, g: 1.10, b: 0.95, sat: 1.1 },
  { name: "sunset",      r: 1.20, g: 1.00, b: 0.80, sat: 1.4 },
  { name: "midnight",    r: 0.85, g: 0.85, b: 1.10, sat: 1.0 },
  { name: "rose",        r: 1.10, g: 0.85, b: 0.95, sat: 1.3 },
  { name: "amber",       r: 1.15, g: 1.05, b: 0.80, sat: 1.2 },
];

// Crop position presets for variety
const CROP_POSITIONS = [
  "attention", "entropy", "centre", "north", "east",
];

function pickAIBase(index) {
  return aiBaseImages[index % aiBaseImages.length];
}

function pickTint(index) {
  return COLOR_TINTS[index % COLOR_TINTS.length];
}

function pickCrop(index) {
  return CROP_POSITIONS[index % CROP_POSITIONS.length];
}

async function getAIBaseBuffer(index) {
  const base = pickAIBase(index);
  const tint = pickTint(index);
  const crop = pickCrop(Math.floor(index / aiBaseImages.length));

  // Apply color tint + crop variation
  let processed = await sharp(base.buffer)
    .resize(TARGET_W, TARGET_H, { fit: "cover", position: crop })
    .modulate({ saturation: tint.sat })
    .toBuffer();

  // Apply RGB channel tint via raw pixel manipulation
  const { data, info } = await sharp(processed).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    data[i] = Math.min(255, Math.round(data[i] * tint.r));     // R
    data[i + 1] = Math.min(255, Math.round(data[i + 1] * tint.g)); // G
    data[i + 2] = Math.min(255, Math.round(data[i + 2] * tint.b)); // B
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .jpeg()
    .toBuffer();
}

// ── SVG overlays ────────────────────────────────────────────────

function makeGradientSvg() {
  return `
    <svg width="${TARGET_W}" height="${TARGET_H}">
      <defs>
        <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black" stop-opacity="0.6" />
          <stop offset="30%" stop-color="black" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="botGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black" stop-opacity="0" />
          <stop offset="55%" stop-color="black" stop-opacity="0" />
          <stop offset="80%" stop-color="black" stop-opacity="0.5" />
          <stop offset="100%" stop-color="black" stop-opacity="0.85" />
        </linearGradient>
      </defs>
      <rect width="${TARGET_W}" height="${TARGET_H}" fill="url(#topGrad)" />
      <rect width="${TARGET_W}" height="${TARGET_H}" fill="url(#botGrad)" />
    </svg>
  `;
}

const ACCENT_COLORS = ["#f97316", "#ef4444", "#a855f7", "#3b82f6", "#22c55e", "#ec4899", "#eab308", "#06b6d4"];

function makeTextOverlaySvg(title, index) {
  const words = title.toUpperCase().split(" ");
  const lines = [];
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).trim().length > 16 && currentLine) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + " " + word : word;
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());
  const displayLines = lines.slice(0, 3);

  const lineHeight = 160;
  const textStartY = 300;
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];

  const textElements = displayLines.map((line, i) =>
    `<text x="${TARGET_W / 2}" y="${textStartY + i * lineHeight}"
      text-anchor="middle" font-family="Impact, Arial Black, sans-serif"
      font-size="140" font-weight="900" fill="white"
      stroke="black" stroke-width="5"
      style="text-shadow: 0 4px 16px rgba(0,0,0,0.95)">
      ${escapeXml(line)}
    </text>`
  ).join("");

  // Accent bar under title
  const barY = textStartY + displayLines.length * lineHeight - 50;
  const accentBar = `<rect x="${TARGET_W * 0.12}" y="${barY}" width="${TARGET_W * 0.76}" height="10" fill="${accentColor}" rx="5" />`;

  // NATAK TV branding bottom-left
  const branding = `
    <text x="100" y="${TARGET_H - 100}"
      font-family="Arial Black, sans-serif"
      font-size="72" font-weight="900" fill="#f97316" letter-spacing="4">
      NATAK TV
    </text>
  `;

  return `
    <svg width="${TARGET_W}" height="${TARGET_H}">
      ${textElements}
      ${accentBar}
      ${branding}
    </svg>
  `;
}

// ── Main thumbnail generator ────────────────────────────────────

async function generateThumbnail(video, index) {
  let baseBuffer;
  let source = "";

  // Step 1: Get base image
  if (MODE === "ai" || (MODE === "auto" && aiBaseImages.length > 0)) {
    baseBuffer = await getAIBaseBuffer(index);
    source = `ai-base/${pickAIBase(index).name} + ${pickTint(index).name} tint`;
  }

  if (!baseBuffer && (MODE === "youtube" || MODE === "auto")) {
    const yt = await fetchBestYouTubeFrame(video.youtubeId);
    if (yt.buffer) {
      let cropped = await sharp(yt.buffer)
        .resize(TARGET_W, TARGET_H, { fit: "cover", position: "attention" })
        .toBuffer();

      if (yt.brightness < 50) {
        cropped = await sharp(cropped)
          .modulate({ brightness: 1.6, saturation: 1.3 })
          .gamma(1.8)
          .toBuffer();
      }
      baseBuffer = cropped;
      source = `youtube/${yt.url.split("/").pop()} (brightness: ${Math.round(yt.brightness)})`;
    }
  }

  if (!baseBuffer) {
    console.log(`  ❌ ${video.title} — No image source available`);
    return null;
  }

  // Step 2: Compose overlays
  const title = TITLE_OVERRIDE || video.title;
  const gradientSvg = makeGradientSvg();
  const textSvg = makeTextOverlaySvg(title, index);

  const finalImage = await sharp(baseBuffer)
    .composite([
      { input: Buffer.from(gradientSvg), blend: "over" },
      { input: Buffer.from(textSvg), blend: "over" },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  // Step 3: Save
  await mkdir(GENERATED_DIR, { recursive: true });
  const filename = `${video.id}.jpg`;
  await writeFile(path.join(GENERATED_DIR, filename), finalImage);

  // Also save to root thumbnails dir
  const rootDir = path.join(ROOT, "public", "thumbnails");
  await writeFile(path.join(rootDir, filename), finalImage);

  const sizeKB = Math.round(finalImage.length / 1024);
  console.log(`  ✅ ${video.title} — ${sizeKB}KB [${source}]`);

  return `/thumbnails/generated/${filename}`;
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║   NATAK TV — Thumbnail Pipeline      ║");
  console.log("╚══════════════════════════════════════╝\n");
  console.log(`Mode: ${MODE} | DB update: ${!NO_DB} | IDs: ${DO_ALL ? "ALL" : IDS.length}\n`);

  // Load AI base images if needed
  if (MODE === "ai" || MODE === "auto") {
    await loadAIBaseImages();
  }

  // Connect to DB
  const prisma = new PrismaClient();

  try {
    // Fetch videos
    let videos;
    if (DO_ALL) {
      videos = await prisma.video.findMany({
        orderBy: { createdAt: "asc" },
      });
    } else {
      videos = await prisma.video.findMany({
        where: { id: { in: IDS } },
      });
    }

    console.log(`Found ${videos.length} videos to process\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const thumbnailUrl = await generateThumbnail(video, i);

      if (thumbnailUrl) {
        success++;
        if (!NO_DB) {
          await prisma.video.update({
            where: { id: video.id },
            data: { generatedThumbnailUrl: thumbnailUrl },
          });
        }
      } else {
        failed++;
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Done! ✅ ${success} generated, ❌ ${failed} failed`);
    console.log(`Thumbnails saved to: ${GENERATED_DIR}`);
    if (!NO_DB) {
      console.log(`Database updated with generatedThumbnailUrl`);
    }
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
