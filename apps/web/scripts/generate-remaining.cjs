/**
 * Generate remaining thumbnails using original YouTube thumbnails as base
 * Applies stylized color effects + vertical crop + text overlay
 * For videos that failed due to HuggingFace credit limit
 */

const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const THUMBNAILS_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'generated');
const ORIGINALS_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'originals');
const TEMP_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'temp');

const COLOR_PALETTES = [
  { bg: 'deep red and gold', accent: '#FF1744', tint: { r: 255, g: 23, b: 68 } },
  { bg: 'electric purple', accent: '#D500F9', tint: { r: 213, g: 0, b: 249 } },
  { bg: 'teal', accent: '#00BFA5', tint: { r: 0, g: 191, b: 165 } },
  { bg: 'sunset orange', accent: '#FF6D00', tint: { r: 255, g: 109, b: 0 } },
  { bg: 'royal blue', accent: '#2979FF', tint: { r: 41, g: 121, b: 255 } },
  { bg: 'emerald', accent: '#00C853', tint: { r: 0, g: 200, b: 83 } },
  { bg: 'hot pink', accent: '#FF4081', tint: { r: 255, g: 64, b: 129 } },
  { bg: 'indigo', accent: '#651FFF', tint: { r: 101, g: 31, b: 255 } },
  { bg: 'crimson', accent: '#FF3D00', tint: { r: 255, g: 61, b: 0 } },
  { bg: 'gold', accent: '#FFD600', tint: { r: 255, g: 214, b: 0 } },
];

const FAILED_TITLES = [
  'LSD', 'Sasur Ki Hawas', 'Mobile Bhaiya', 'Doctor Ki Hawas',
  'Peythozhiyathe', 'Mangalyam', 'Kadhal', 'Swapnangal',
  'Mahalakshmi', 'Archana LLB', 'Hey Leela', 'Sweet & Salt',
  'Dohra', 'Hridayam', 'AI Marumakal', 'Uppum Mulakum', 'Thatteem'
];

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function stylizeOriginal(originalPath, outputPath, colorIndex) {
  const WIDTH = 720;
  const HEIGHT = 1280;
  const palette = COLOR_PALETTES[colorIndex % COLOR_PALETTES.length];
  const tint = palette.tint;

  // Read original, resize to vertical 9:16, apply dramatic effect
  await sharp(originalPath)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    // Boost saturation and contrast for dramatic look
    .modulate({ brightness: 0.85, saturation: 1.6 })
    // Apply color tint overlay
    .composite([
      {
        input: {
          create: {
            width: WIDTH,
            height: HEIGHT,
            channels: 4,
            background: { r: tint.r, g: tint.g, b: tint.b, alpha: 0.15 },
          },
        },
        blend: 'over',
      },
      // Add vignette (dark edges)
      {
        input: Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}">
          <defs>
            <radialGradient id="vig" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stop-color="black" stop-opacity="0"/>
              <stop offset="100%" stop-color="black" stop-opacity="0.7"/>
            </radialGradient>
          </defs>
          <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vig)"/>
        </svg>`),
        blend: 'over',
      },
    ])
    .sharpen({ sigma: 1.5 })
    .jpeg({ quality: 92 })
    .toFile(outputPath);
}

async function overlayTitle(scenePath, outputPath, title, accentColor) {
  const WIDTH = 720;
  const HEIGHT = 1280;

  let fontSize = 90;
  if (title.length > 10) fontSize = 80;
  if (title.length > 14) fontSize = 68;
  if (title.length > 18) fontSize = 56;

  const strokeWidth = 6;
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
  const decorLine = `
    <line x1="${WIDTH * 0.15}" y1="${lineY}" x2="${WIDTH * 0.85}" y2="${lineY}"
      stroke="${accentColor}" stroke-width="4" opacity="0.9"/>
  `;

  const brandingSvg = `
    <rect x="20" y="${HEIGHT - 60}" width="140" height="40" rx="8" fill="black" opacity="0.7"/>
    <text x="90" y="${HEIGHT - 33}" text-anchor="middle"
      font-family="Impact, 'Arial Black', sans-serif"
      font-size="22" font-weight="900" fill="#f97316" letter-spacing="2">
      NATAK TV
    </text>
  `;

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
      ${decorLine}
      ${brandingSvg}
    </svg>
  `;

  await sharp(scenePath)
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(outputPath);
}

async function main() {
  const prisma = new PrismaClient();

  try {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    const videos = await prisma.video.findMany({
      where: { title: { in: FAILED_TITLES } },
      select: { id: true, title: true, youtubeId: true },
      orderBy: { createdAt: 'asc' },
    });

    console.log(`\n🎬 Generating ${videos.length} thumbnails from YouTube originals\n`);

    let generated = 0, failed = 0;

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const originalPath = path.join(ORIGINALS_DIR, `${video.id}.jpg`);
      const tempStylizedPath = path.join(TEMP_DIR, `${video.id}_stylized.jpg`);
      const generatedPath = path.join(THUMBNAILS_DIR, `${video.id}.jpg`);
      const colorIndex = 31 + i;
      const shorterTitle = video.title.toUpperCase();

      process.stdout.write(`[${i + 1}/${videos.length}] ${video.title} → "${shorterTitle}"...`);

      try {
        // Check if original exists, download if not
        if (!fs.existsSync(originalPath)) {
          const urls = [
            `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
            `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
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
          if (!downloaded) throw new Error('Could not download original');
        }

        // Step 1: Stylize the original YouTube thumbnail
        await stylizeOriginal(originalPath, tempStylizedPath, colorIndex);
        process.stdout.write(' stylized...');

        // Step 2: Overlay text
        await overlayTitle(tempStylizedPath, generatedPath, shorterTitle, COLOR_PALETTES[colorIndex % COLOR_PALETTES.length].accent);
        console.log(' DONE');

        const generatedUrl = `/thumbnails/generated/${video.id}.jpg`;
        await prisma.video.update({
          where: { id: video.id },
          data: { generatedThumbnailUrl: generatedUrl },
        });

        generated++;
      } catch (e) {
        console.log(` FAILED: ${e.message}`);
        failed++;
      }
    }

    try { fs.rmSync(TEMP_DIR, { recursive: true }); } catch {}

    console.log(`\n=== RESULTS ===`);
    console.log(`Generated: ${generated}`);
    console.log(`Failed: ${failed}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
