const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.video.findMany({
    select: { id: true, title: true, thumbnailUrl: true, generatedThumbnailUrl: true }
  });

  const genDir = path.join(__dirname, '..', 'public', 'thumbnails', 'generated');
  const genFiles = fs.readdirSync(genDir);

  // Check which use YouTube vs generated
  const ytVideos = [];
  const aiVideos = [];

  videos.forEach(v => {
    const hasGen = v.generatedThumbnailUrl && v.generatedThumbnailUrl.includes('/generated/');
    const genFile = genFiles.find(f => f.includes(v.id));
    if (!hasGen || !genFile) {
      ytVideos.push(v);
    } else {
      aiVideos.push({ ...v, file: genFile });
    }
  });

  console.log(`Total: ${videos.length} | AI: ${aiVideos.length} | YouTube: ${ytVideos.length}`);

  if (ytVideos.length > 0) {
    console.log('\n--- Using YouTube thumbnails ---');
    ytVideos.forEach(v => console.log(`  ${v.id} | ${v.title}`));
  }

  // Check for visually similar AI thumbnails (compare file sizes as rough proxy)
  console.log('\n--- AI thumbnail file sizes ---');
  const sizes = {};
  aiVideos.forEach(v => {
    const fpath = path.join(genDir, v.file);
    const size = fs.statSync(fpath).size;
    const sizeKB = Math.round(size / 1024);
    if (!sizes[sizeKB]) sizes[sizeKB] = [];
    sizes[sizeKB].push(v.title);
    console.log(`  ${v.title} => ${sizeKB}KB (${v.file})`);
  });

  // Check perceptual similarity using pixel sampling
  console.log('\n--- Checking for similar thumbnails ---');
  const sharp = require('sharp');
  const fingerprints = [];

  for (const v of aiVideos) {
    const fpath = path.join(genDir, v.file);
    // Create a tiny 8x8 grayscale fingerprint
    const buf = await sharp(fpath).resize(8, 8).grayscale().raw().toBuffer();
    fingerprints.push({ title: v.title, id: v.id, fp: buf, file: v.file });
  }

  // Compare all pairs
  const similar = [];
  for (let i = 0; i < fingerprints.length; i++) {
    for (let j = i + 1; j < fingerprints.length; j++) {
      let diff = 0;
      for (let k = 0; k < fingerprints[i].fp.length; k++) {
        diff += Math.abs(fingerprints[i].fp[k] - fingerprints[j].fp[k]);
      }
      const avgDiff = diff / fingerprints[i].fp.length;
      if (avgDiff < 25) {
        similar.push({
          a: fingerprints[i].title,
          b: fingerprints[j].title,
          aId: fingerprints[i].id,
          bId: fingerprints[j].id,
          diff: avgDiff.toFixed(1)
        });
      }
    }
  }

  if (similar.length > 0) {
    console.log(`Found ${similar.length} similar pairs:`);
    similar.forEach(s => console.log(`  "${s.a}" <=> "${s.b}" (diff: ${s.diff}) [${s.aId}, ${s.bId}]`));
  } else {
    console.log('No visually similar thumbnails found!');
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
