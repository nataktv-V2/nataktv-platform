// Generate a moody, cinematic background music loop using Web Audio offline rendering
// This creates a dark ambient pad + subtle beat perfect for drama ads

import { writeFileSync } from "fs";

// Simple WAV file writer
function createWav(sampleRate, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(headerSize + dataSize - 8, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), headerSize + i * 2);
  }

  return buffer;
}

// Synth functions
function sine(freq, t) { return Math.sin(2 * Math.PI * freq * t); }
function saw(freq, t) { return 2 * ((freq * t) % 1) - 1; }

const sampleRate = 44100;
const duration = 16; // 16 seconds (slightly longer than 15s video for fade)
const totalSamples = sampleRate * duration;
const samples = new Float64Array(totalSamples);

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  let sample = 0;

  // 1. Deep ambient pad (C2 + E2 + G2 chord, detuned)
  const padVol = 0.08;
  sample += sine(65.4, t) * padVol;       // C2
  sample += sine(82.4, t) * padVol * 0.7; // E2
  sample += sine(98.0, t) * padVol * 0.5; // G2
  sample += sine(65.8, t) * padVol * 0.3; // slight detune for width

  // 2. Sub bass pulse (every 2 beats at ~90 BPM)
  const beatPeriod = 60 / 90; // 0.667s per beat
  const beatPhase = t % (beatPeriod * 2);
  if (beatPhase < 0.15) {
    const env = 1 - beatPhase / 0.15;
    sample += sine(55, t) * env * 0.12;
  }

  // 3. Hi-hat shimmer (every beat, very quiet)
  const hatPhase = t % beatPeriod;
  if (hatPhase < 0.03) {
    const noise = (Math.random() * 2 - 1);
    const env = 1 - hatPhase / 0.03;
    sample += noise * env * 0.04;
  }

  // 4. Ethereal high pad (slow LFO)
  const lfo = 0.5 + 0.5 * sine(0.3, t);
  sample += sine(523, t) * 0.015 * lfo;  // C5 shimmer
  sample += sine(659, t) * 0.01 * lfo;   // E5

  // 5. Tension riser in last 3 seconds (for CTA urgency)
  if (t > 12) {
    const riserT = (t - 12) / 4; // 0 to 1 over 4 seconds
    const riserFreq = 200 + riserT * 600;
    sample += sine(riserFreq, t) * riserT * 0.06;
    // Add filtered noise
    sample += (Math.random() * 2 - 1) * riserT * 0.03;
  }

  // 6. Fade in (first 1s) and fade out (last 0.5s)
  let envelope = 1;
  if (t < 1) envelope = t;
  if (t > duration - 0.5) envelope = (duration - t) / 0.5;

  samples[i] = sample * envelope;
}

const wav = createWav(sampleRate, samples);
const outPath = "apps/web/public/audio/ads/bgm-dark-ambient.wav";
writeFileSync(outPath, wav);
console.log(`Generated ${outPath} (${(wav.length / 1024).toFixed(0)} KB)`);
