import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { renameSync, statSync, mkdirSync, rmdirSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = "apps/web/public/audio/ads";

async function generate(text, filename, rate = "-10%", pitch = "+5Hz") {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("hi-IN-SwaraNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const tempDir = join(OUTPUT_DIR, `_temp_${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });
  await tts.toFile(tempDir, text, { rate, pitch });

  const tempFile = join(tempDir, "audio.mp3");
  const finalFile = join(OUTPUT_DIR, filename);
  renameSync(tempFile, finalFile);
  rmdirSync(tempDir);

  const size = statSync(finalFile).size;
  console.log(`  ${filename} (${(size / 1024).toFixed(1)} KB)`);
  return size;
}

// ──────────────────────────────────────────────────────────
// 10 TEMPTING AD SCRIPTS — Each with HOOK + CTA
// Ad fundamentals: Pattern interrupt → Curiosity → Desire → CTA
// ──────────────────────────────────────────────────────────

const scripts = [
  {
    name: "01-raat-akeli",
    hook: "Raat ko akeli ho? Chalo, ek raaz dikhati hoon!",
    cta: "Sirf 2 rupaye mein, 100 se zyaada natak! Download karo Natak TV aaj hi!",
    hookRate: "-15%", hookPitch: "+8Hz",
    ctaRate: "-5%", ctaPitch: "+10Hz",
  },
  {
    name: "02-bore-ho-rahi",
    hook: "Bore ho rahi ho? Yeh dekho, neend bhi bhool jaogi!",
    cta: "2 rupaye mein poori raat ka entertainment. Natak TV download karo, abhi!",
    hookRate: "-10%", hookPitch: "+10Hz",
    ctaRate: "-5%", ctaPitch: "+8Hz",
  },
  {
    name: "03-pyaar-ki-kahani",
    hook: "Pyaar ki woh kahani jo sabne chhupaayi. Tumhe dikhaaun?",
    cta: "100 se zyaada dramas, sirf 2 rupaye mein. Natak TV pe aaj hi shuru karo!",
    hookRate: "-15%", hookPitch: "+5Hz",
    ctaRate: "-8%", ctaPitch: "+10Hz",
  },
  {
    name: "04-kuch-spicy",
    hook: "Kuch spicy chahiye? Yeh dramas dil jala denge!",
    cta: "Download karo Natak TV! 2 rupaye mein 100 plus shows, bilkul free trial!",
    hookRate: "-8%", hookPitch: "+12Hz",
    ctaRate: "-5%", ctaPitch: "+10Hz",
  },
  {
    name: "05-boyfriend-se-better",
    hook: "Boyfriend se better hai yeh! Trust me, try karo!",
    cta: "Natak TV pe 100 se zyaada dramas. Sirf 2 rupaye! Aaj hi download karo!",
    hookRate: "-5%", hookPitch: "+12Hz",
    ctaRate: "-5%", ctaPitch: "+8Hz",
  },
  {
    name: "06-secret-addiction",
    hook: "Meri secret addiction? Yeh Indian dramas! Ab tumhari baari.",
    cta: "2 rupaye mein unlimited natak. Natak TV download karo, regret nahi hoga!",
    hookRate: "-12%", hookPitch: "+8Hz",
    ctaRate: "-8%", ctaPitch: "+10Hz",
  },
  {
    name: "07-ek-baar-dekho",
    hook: "Ek baar dekho, phir ruk nahi paoge! Promise!",
    cta: "Natak TV! 100 plus Indian dramas, sirf 2 rupaye mein. Download karo abhi!",
    hookRate: "-8%", hookPitch: "+10Hz",
    ctaRate: "-5%", ctaPitch: "+12Hz",
  },
  {
    name: "08-dil-todne-wali",
    hook: "Dil todne wali kahani sunogi? Warning, tissues ready rakhna!",
    cta: "Sirf 2 rupaye mein sab kuch! Natak TV download karo, aaj hi!",
    hookRate: "-12%", hookPitch: "+8Hz",
    ctaRate: "-5%", ctaPitch: "+10Hz",
  },
  {
    name: "09-netflix-ko-bhool",
    hook: "Netflix ko bhool jao! Asli drama toh yahaan hai!",
    cta: "2 rupaye mein 100 se zyaada shows! Natak TV download karo, free trial hai!",
    hookRate: "-5%", hookPitch: "+12Hz",
    ctaRate: "-5%", ctaPitch: "+10Hz",
  },
  {
    name: "10-sabse-hot",
    hook: "Sabse hot Indian dramas, ek jagah. Tum ready ho?",
    cta: "Download Natak TV aaj hi! 2 rupaye mein 100 se zyaada natak!",
    hookRate: "-10%", hookPitch: "+10Hz",
    ctaRate: "-5%", ctaPitch: "+12Hz",
  },
];

console.log("Generating 10 tempting ad scripts (hook + cta each)...\n");

for (const s of scripts) {
  console.log(`Script: ${s.name}`);
  console.log(`  Hook: "${s.hook}"`);
  console.log(`  CTA:  "${s.cta}"`);

  await generate(s.hook, `${s.name}-hook.mp3`, s.hookRate, s.hookPitch);
  await generate(s.cta, `${s.name}-cta.mp3`, s.ctaRate, s.ctaPitch);
  console.log("");
}

console.log("All 10 scripts generated! (20 audio files total)");
