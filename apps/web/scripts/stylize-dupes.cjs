/**
 * Stylize duplicate-looking thumbnails using Sharp artistic filters
 * Takes YouTube originals → applies heavy color grading per video → overlays title
 * No AI API needed — pure Sharp processing
 */
const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ORIGINALS_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'originals');
const GENERATED_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'generated');

const prisma = new PrismaClient();

// Each video gets a RADICALLY different color treatment
const STYLES = {
  'False Affair': { tint: { r: 40, g: 0, b: 60 }, brightness: 0.7, saturation: 0.4, contrast: 1.5, hueRotate: 280 },
  'Bedroom Raaz': { tint: { r: 80, g: 0, b: 0 }, brightness: 0.6, saturation: 0.5, contrast: 1.6, hueRotate: 0 },
  'LSD': { tint: { r: 60, g: 0, b: 80 }, brightness: 1.1, saturation: 2.0, contrast: 1.4, hueRotate: 120 },
  'Sasur Ki Hawas': { tint: { r: 50, g: 40, b: 0 }, brightness: 0.5, saturation: 0.3, contrast: 1.8, hueRotate: 40 },
  'Mobile Bhaiya': { tint: { r: 0, g: 50, b: 70 }, brightness: 1.0, saturation: 1.5, contrast: 1.2, hueRotate: 180 },
  'Doctor Ki Hawas': { tint: { r: 0, g: 60, b: 40 }, brightness: 0.9, saturation: 0.8, contrast: 1.3, hueRotate: 150 },
  'Uppum Mulakum': { tint: { r: 70, g: 40, b: 0 }, brightness: 1.1, saturation: 1.8, contrast: 1.1, hueRotate: 30 },
  'Thatteem': { tint: { r: 0, g: 40, b: 0 }, brightness: 0.9, saturation: 1.2, contrast: 1.4, hueRotate: 100 },
  'Peythozhiyathe': { tint: { r: 0, g: 20, b: 50 }, brightness: 0.7, saturation: 0.6, contrast: 1.5, hueRotate: 220 },
  'Swapnangal': { tint: { r: 30, g: 30, b: 60 }, brightness: 1.2, saturation: 0.5, contrast: 1.0, hueRotate: 250 },
  'Mahalakshmi': { tint: { r: 60, g: 50, b: 0 }, brightness: 1.0, saturation: 1.6, contrast: 1.3, hueRotate: 50 },
  'Archana LLB': { tint: { r: 10, g: 10, b: 30 }, brightness: 0.8, saturation: 0.4, contrast: 1.7, hueRotate: 200 },
  'Hey Leela': { tint: { r: 70, g: 20, b: 40 }, brightness: 1.1, saturation: 1.9, contrast: 1.2, hueRotate: 330 },
  'Sweet & Salt': { tint: { r: 70, g: 40, b: 50 }, brightness: 1.2, saturation: 1.7, contrast: 1.1, hueRotate: 310 },
  'Dohra': { tint: { r: 20, g: 0, b: 40 }, brightness: 0.6, saturation: 0.5, contrast: 2.0, hueRotate: 270 },
  'Hridayam': { tint: { r: 50, g: 30, b: 10 }, brightness: 0.9, saturation: 1.0, contrast: 1.2, hueRotate: 20 },
  'AI Marumakal': { tint: { r: 0, g: 30, b: 60 }, brightness: 0.9, saturation: 0.7, contrast: 1.4, hueRotate: 190 },
};

const COLOR_PALETTES = [
  { accent: '#FF1744' }, { accent: '#D500F9' }, { accent: '#00BFA5' },
  { accent: '#FF6D00' }, { accent: '#2979FF' }, { accent: '#00C853' },
  { accent: '#FF4081' }, { accent: '#651FFF' }, { accent: '#FF3D00' },
  { accent: '#FFD600' },
];

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function stylizeAndOverlay(originalPath, outputPath, title, style, accentColor) {
  const WIDTH = 720;
  const HEIGHT = 1280;

  // Step 1: Read original, crop to 9:16, apply heavy color grading
  const tintOverlay = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}">
      <rect width="100%" height="100%" fill="rgb(${style.tint.r},${style.tint.g},${style.tint.b})" opacity="0.45"/>
    </svg>`
  );

  // Create a vignette overlay
  const vignetteOverlay = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}">
      <defs>
        <radialGradient id="vig" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="black" stop-opacity="0"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.8"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#vig)"/>
    </svg>`
  );

  const styledScene = await sharp(originalPath)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .modulate({
      brightness: style.brightness,
      saturation: style.saturation,
      hue: style.hueRotate,
    })
    .linear(style.contrast, -(128 * (style.contrast - 1))) // contrast adjustment
    .composite([
      { input: tintOverlay, blend: 'over' },
      { input: vignetteOverlay, blend: 'over' },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  // Step 2: Overlay title text (same as generate-thumbnails.cjs)
  let fontSize = 90;
  if (title.length > 10) fontSize = 80;
  if (title.length > 14) fontSize = 68;
  if (title.length > 18) fontSize = 56;

  const lineHeight = fontSize * 1.15;
  const words = title.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > 10 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else { currentLine = testLine; }
  }
  if (currentLine) lines.push(currentLine);

  const textStartY = 80;
  const strokeWidth = 6;

  const textElements = lines.map((line, i) => {
    const y = textStartY + (i * lineHeight) + fontSize;
    return `
      <text x="${WIDTH / 2}" y="${y}" text-anchor="middle"
        font-family="Impact, 'Arial Black', 'Bebas Neue', sans-serif"
        font-size="${fontSize}" font-weight="900" letter-spacing="4"
        stroke="black" stroke-width="${strokeWidth}" fill="white"
        paint-order="stroke fill"
        filter="url(#shadow)">
        ${escapeXml(line)}
      </text>
    `;
  }).join('');

  const totalTextHeight = lines.length * lineHeight;
  const lineY = textStartY + totalTextHeight + fontSize * 0.2;

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="8" flood-color="black" flood-opacity="0.9"/>
        </filter>
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="0.35">
          <stop offset="0%" stop-color="black" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="black" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT * 0.35}" fill="url(#topFade)"/>
      ${textElements}
      <line x1="${WIDTH * 0.15}" y1="${lineY}" x2="${WIDTH * 0.85}" y2="${lineY}"
        stroke="${accentColor}" stroke-width="4" opacity="0.9"/>
      <rect x="20" y="${HEIGHT - 60}" width="140" height="40" rx="8" fill="black" opacity="0.7"/>
      <text x="90" y="${HEIGHT - 33}" text-anchor="middle"
        font-family="Impact, 'Arial Black', sans-serif"
        font-size="22" font-weight="900" fill="#f97316" letter-spacing="2">
        NATAK TV
      </text>
    </svg>
  `;

  await sharp(styledScene)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(outputPath);
}

async function main() {
  const targets = Object.keys(STYLES);
  const videos = await prisma.video.findMany({
    where: { title: { in: targets } },
    select: { id: true, title: true, youtubeId: true },
  });

  console.log(`\n🎨 Stylizing ${videos.length} thumbnails with Sharp filters (no AI needed)\n`);

  let ok = 0, fail = 0;
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    const style = STYLES[v.title];
    if (!style) continue;

    const originalPath = path.join(ORIGINALS_DIR, `${v.id}.jpg`);
    const outputPath = path.join(GENERATED_DIR, `${v.id}.jpg`);
    const accent = COLOR_PALETTES[i % COLOR_PALETTES.length].accent;

    process.stdout.write(`[${i + 1}/${videos.length}] ${v.title}...`);

    // Download original if missing
    if (!fs.existsSync(originalPath)) {
      try {
        const urls = [
          `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`,
        ];
        let downloaded = false;
        for (const url of urls) {
          const res = await fetch(url);
          if (res.ok) {
            const buf = Buffer.from(await res.arrayBuffer());
            if (buf.length > 5000) {
              fs.writeFileSync(originalPath, buf);
              downloaded = true;
              break;
            }
          }
        }
        if (!downloaded) {
          console.log(' SKIP (no original)');
          fail++;
          continue;
        }
      } catch (e) {
        console.log(` SKIP (download error: ${e.message})`);
        fail++;
        continue;
      }
    }

    try {
      await stylizeAndOverlay(originalPath, outputPath, v.title.toUpperCase(), style, accent);

      await prisma.video.update({
        where: { id: v.id },
        data: { generatedThumbnailUrl: `/thumbnails/generated/${v.id}.jpg` },
      });

      console.log(' DONE');
      ok++;
    } catch (e) {
      console.log(` FAILED: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n=== RESULTS: ${ok} ok, ${fail} failed ===`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
