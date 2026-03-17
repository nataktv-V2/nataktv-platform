/**
 * AI Thumbnail Generator for Natak TV Ads
 * Uses Pollinations.ai (free, no API key, no signup)
 *
 * Usage: node scripts/generate-thumbnails.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../apps/web/public/thumbnails/ads");

// All 7 shows used across the 28 ads
const shows = [
  {
    filename: "gaon-ki-biwi.jpg",
    prompt: "Indian village woman red saree ghoonghat cinematic portrait golden hour",
  },
  {
    filename: "kalyanam-to-kadhal.jpg",
    prompt: "South Indian wedding couple temple romantic cinematic portrait",
  },
  {
    filename: "hey-leela.jpg",
    prompt: "Stylish Indian woman city rooftop night neon lights cinematic portrait",
  },
  {
    filename: "ghat-ghat-ka-paani.jpg",
    prompt: "Intense Indian man dark lighting rainy street thriller cinematic portrait",
  },
  {
    filename: "love-shadi-dhokha.jpg",
    prompt: "Indian couple emotional confrontation dramatic indoor cinematic scene",
  },
  {
    filename: "love-guru.jpg",
    prompt: "Charming Indian man winking colorful backdrop comedy romance cinematic",
  },
  {
    filename: "hurry-burry.jpg",
    prompt: "Two Indian friends surprised expressions colorful comedy cinematic scene",
  },
];

// Pollinations API — just a URL, returns image directly
function buildUrl(prompt, width = 1280, height = 720) {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true`;
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    console.log(`  Downloading to ${path.basename(filepath)}...`);

    const request = (currentUrl, redirectCount = 0) => {
      if (redirectCount > 5) return reject(new Error("Too many redirects"));

      https.get(currentUrl, { timeout: 120000 }, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location, redirectCount + 1);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }

        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          const size = fs.statSync(filepath).size;
          console.log(`  ✓ Saved (${(size / 1024).toFixed(0)} KB)`);
          resolve();
        });
        fileStream.on("error", reject);
      }).on("error", reject);
    };

    request(url);
  });
}

async function main() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created ${OUTPUT_DIR}\n`);
  }

  console.log("=== Natak TV AI Thumbnail Generator ===");
  console.log(`Generating ${shows.length} thumbnails via Pollinations.ai (free, no API key)\n`);

  for (let i = 0; i < shows.length; i++) {
    const show = shows[i];
    const filepath = path.join(OUTPUT_DIR, show.filename);

    // Skip if already generated
    if (fs.existsSync(filepath)) {
      const size = fs.statSync(filepath).size;
      if (size > 10000) {
        console.log(`[${i + 1}/${shows.length}] ${show.filename} — already exists (${(size / 1024).toFixed(0)} KB), skipping`);
        continue;
      }
    }

    console.log(`[${i + 1}/${shows.length}] Generating: ${show.filename}`);
    const url = buildUrl(show.prompt, 1280, 720);

    try {
      await downloadImage(url, filepath);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      console.log("  Retrying in 5s...");
      await new Promise((r) => setTimeout(r, 5000));
      try {
        await downloadImage(url, filepath);
      } catch (err2) {
        console.error(`  ✗ Retry failed: ${err2.message}. Skipping.`);
      }
    }

    // Small delay between requests to be polite
    if (i < shows.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("\n=== Done! ===");
  console.log(`Thumbnails saved to: ${OUTPUT_DIR}`);
  console.log("\nNext step: Tell Claude to update all ad pages to use local images.");
}

main().catch(console.error);
