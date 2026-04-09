import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { renameSync, statSync, mkdirSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = "apps/web/public/audio/ads";

async function generate(text, filename, voice, rate, pitch) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const tempDir = join(OUTPUT_DIR, `_temp_${filename}`);
  mkdirSync(tempDir, { recursive: true });
  await tts.toFile(tempDir, text, { rate, pitch });

  const tempFile = join(tempDir, "audio.mp3");
  const finalFile = join(OUTPUT_DIR, filename);
  renameSync(tempFile, finalFile);
  const { rmdirSync } = await import("fs");
  rmdirSync(tempDir);

  const size = statSync(finalFile).size;
  console.log(`Generated ${filename} (${(size / 1024).toFixed(1)} KB)`);
}

// Hook audio (0-5s): More expressive, dramatic pauses with SSML-like phrasing
// Using SwaraNeural with more dramatic pitch variation
await generate(
  "Raat ko... akeli ho? ... Chalo... ek raaz dikhati hoon!",
  "hook-v2.mp3",
  "hi-IN-SwaraNeural",
  "-20%",   // even slower for dramatic pauses
  "+8Hz"    // higher pitch for more energy
);

// CTA audio (7-15s): Energetic, punchy, commanding
await generate(
  "Sirf 2 rupaye mein, 100 se zyaada natak! Download karo Natak TV, aaj hi!",
  "cta-v2.mp3",
  "hi-IN-SwaraNeural",
  "-5%",    // slightly faster for urgency
  "+10Hz"   // higher pitch for excitement
);

console.log("\nAll v2 audio generated!");
