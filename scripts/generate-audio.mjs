import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { renameSync, statSync, mkdirSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = "apps/web/public/audio/ads";

async function generate(text, filename, rate = "-10%", pitch = "+5Hz") {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("hi-IN-SwaraNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  // toFile writes to {dir}/audio.mp3, so use a temp dir then rename
  const tempDir = join(OUTPUT_DIR, `_temp_${filename}`);
  mkdirSync(tempDir, { recursive: true });
  await tts.toFile(tempDir, text, { rate, pitch });

  const tempFile = join(tempDir, "audio.mp3");
  const finalFile = join(OUTPUT_DIR, filename);
  renameSync(tempFile, finalFile);

  // Clean up temp dir
  const { rmdirSync } = await import("fs");
  rmdirSync(tempDir);

  const size = statSync(finalFile).size;
  console.log(`Generated ${filename} (${(size / 1024).toFixed(1)} KB)`);
}

// Hook audio (0-5s): Flirty, teasing whisper
await generate(
  "Raat ko akeli ho? ... Chalo, ek raaz dikhati hoon",
  "hook.mp3",
  "-15%",
  "+3Hz"
);

// CTA audio (7-15s): Warm, inviting
await generate(
  "Sirf do rupaye mein, poori raat ka entertainment. Abhi try karo, free hai.",
  "cta.mp3",
  "-10%",
  "+5Hz"
);

console.log("\nAll audio generated in", OUTPUT_DIR);
