import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const thumbDir = path.join(__dirname, "..", "public", "thumbnails", "generated");

// All thumbnails that need regeneration
const badVideos = [
  // Specific bad ones
  { id: "cmmrwzpuc002ekrp0ql821g2e", youtubeId: "cvJyfV2X7dE", title: "Sasur Ki Hawas" },
  { id: "cmmrwzpuc002gkrp072gzufh9", youtubeId: "38DybBBexGw", title: "Doctor Ki Hawas" },
  { id: "cmmrwzpub0028krp0epbndka8", youtubeId: "xD9EOwMv8No", title: "Khet Mein Maje" },
  { id: "cmmrwzpud002wkrp0mmcnb20i", youtubeId: "aNCWZ2x32cM", title: "Thatteem" },
  { id: "cmmrwzpud002skrp02ucgpvue", youtubeId: "K5znpaT_SKg", title: "AI Marumakal" },
  { id: "cmmrwzpue0035krp0zobx4hbz", youtubeId: "X1fMLrlpK7c", title: "Dohra" },
  { id: "cmmrwzpue0031krp0exm9555u", youtubeId: "9ZuDWBrf9EI", title: "Archana LLB" },
  { id: "cmmrwzpud002xkrp0mkoyzp14", youtubeId: "PcZDKdeYy_I", title: "Peythozhiyathe" },
  { id: "cmmrwzpuc002bkrp0j6uoqq0m", youtubeId: "2pHWFUhtdbU", title: "False Affair" },
  // All Romance videos
  { id: "cmmqncn6g000tkr2wvc0syamo", youtubeId: "sNHgoGlO_FI", title: "Emotion" },
  { id: "cmmqncn6c000nkr2wk2kv3kse", youtubeId: "23KufSqo6cQ", title: "Cafe Night" },
  { id: "cmmrwzpud002pkrp0uc4mlkd5", youtubeId: "71yLwwOS80M", title: "Connection" },
  { id: "cmmrwzpud002qkrp0lrlolph1", youtubeId: "sOKH_Z6tNrw", title: "Love Delivery" },
  { id: "cmmrwzpud002ukrp008lcgbfa", youtubeId: "Z8Mqvnx6XhU", title: "Hridayam" },
  { id: "cmmrwzpue0032krp0qs8uuh5j", youtubeId: "W4jdt5QVmFQ", title: "Kadhal" },
  { id: "cmmrwzpud002ykrp0vrvpk86v", youtubeId: "F4Mkn4CfKbE", title: "Mangalyam" },
  { id: "cmmrwzpue0034krp0w8it3e5v", youtubeId: "JSrqUZtWLa8", title: "Sweet & Salt" },
  { id: "cmmrwzpue0033krp018idk9zl", youtubeId: "Ds1X74cvKtI", title: "Hey Leela" },
  { id: "cmmrwzpue002zkrp0dl6sgjq7", youtubeId: "QV9YyYOhzxs", title: "Swapnangal" },
];

const targetWidth = 2160;
const targetHeight = 3840;

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function getImageBrightness(buffer) {
  const { data, info } = await sharp(buffer).resize(100, 100, { fit: "cover" }).raw().toBuffer({ resolveWithObject: true });
  let totalBrightness = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    totalBrightness += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }
  return totalBrightness / (info.width * info.height);
}

async function fetchBestFrame(youtubeId) {
  // Try multiple YouTube frame samples and pick the brightest
  const urls = [
    `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/1.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/2.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/3.jpg`,
  ];

  let bestBuffer = null;
  let bestBrightness = 0;
  let bestUrl = "";

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buffer = Buffer.from(await res.arrayBuffer());
      // Skip tiny placeholder images
      if (buffer.length < 5000) continue;
      const brightness = await getImageBrightness(buffer);
      if (brightness > bestBrightness) {
        bestBrightness = brightness;
        bestBuffer = buffer;
        bestUrl = url;
      }
    } catch {}
  }

  return { buffer: bestBuffer, brightness: bestBrightness, url: bestUrl };
}

async function generateThumbnail(video) {
  const { buffer, brightness, url } = await fetchBestFrame(video.youtubeId);
  if (!buffer) {
    console.log(`❌ ${video.title} - No usable frame found`);
    return;
  }

  // If still too dark (brightness < 40), boost it
  let cropped = await sharp(buffer)
    .resize(targetWidth, targetHeight, { fit: "cover", position: "attention" })
    .toBuffer();

  if (brightness < 50) {
    // Brighten dark images
    cropped = await sharp(cropped)
      .modulate({ brightness: 1.6, saturation: 1.3 })
      .gamma(1.8)
      .toBuffer();
    console.log(`💡 ${video.title} - Brightened (was ${Math.round(brightness)})`);
  }

  // Gradient overlay
  const gradientSvg = `
    <svg width="${targetWidth}" height="${targetHeight}">
      <defs>
        <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black" stop-opacity="0.5" />
          <stop offset="25%" stop-color="black" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="botGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black" stop-opacity="0" />
          <stop offset="50%" stop-color="black" stop-opacity="0" />
          <stop offset="80%" stop-color="black" stop-opacity="0.5" />
          <stop offset="100%" stop-color="black" stop-opacity="0.8" />
        </linearGradient>
      </defs>
      <rect width="${targetWidth}" height="${targetHeight}" fill="url(#topGrad)" />
      <rect width="${targetWidth}" height="${targetHeight}" fill="url(#botGrad)" />
    </svg>
  `;

  // Title text
  const words = video.title.toUpperCase().split(" ");
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

  // Random accent color
  const colors = ["#f97316", "#ef4444", "#a855f7", "#3b82f6", "#22c55e", "#ec4899"];
  const accentColor = colors[Math.floor(Math.random() * colors.length)];

  const textElements = displayLines.map((line, i) =>
    `<text x="${targetWidth / 2}" y="${textStartY + i * lineHeight}"
      text-anchor="middle" font-family="Impact, Arial Black, sans-serif"
      font-size="140" font-weight="900" fill="white"
      stroke="black" stroke-width="4"
      style="text-shadow: 0 4px 12px rgba(0,0,0,0.9)">
      ${escapeXml(line)}
    </text>`
  ).join("");

  // Accent line under title
  const lineY = textStartY + displayLines.length * lineHeight - 60;
  const accentLine = `<rect x="${targetWidth * 0.15}" y="${lineY}" width="${targetWidth * 0.7}" height="8" fill="${accentColor}" rx="4" />`;

  // Natak TV branding at bottom
  const brandingSvg = `
    <text x="100" y="${targetHeight - 100}"
      font-family="Arial Black, sans-serif"
      font-size="72" font-weight="900" fill="#f97316" letter-spacing="4">
      NATAK TV
    </text>
  `;

  const textOverlaySvg = `
    <svg width="${targetWidth}" height="${targetHeight}">
      ${textElements}
      ${accentLine}
      ${brandingSvg}
    </svg>
  `;

  const finalImage = await sharp(cropped)
    .composite([
      { input: Buffer.from(gradientSvg), blend: "over" },
      { input: Buffer.from(textOverlaySvg), blend: "over" },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  await mkdir(thumbDir, { recursive: true });
  const filename = `${video.id}.jpg`;
  await writeFile(path.join(thumbDir, filename), finalImage);

  // Also save to root thumbnails dir (some videos reference this path)
  const rootThumbDir = path.join(__dirname, "..", "public", "thumbnails");
  await writeFile(path.join(rootThumbDir, filename), finalImage);

  const sizeKB = Math.round(finalImage.length / 1024);
  console.log(`✅ ${video.title} - ${sizeKB}KB (brightness: ${Math.round(brightness)}, src: ${url.split("/").pop()})`);
}

async function main() {
  console.log(`Regenerating ${badVideos.length} bad thumbnails...\n`);
  for (const video of badVideos) {
    await generateThumbnail(video);
  }
  console.log("\n🎉 Done!");
}

main().catch(console.error);
