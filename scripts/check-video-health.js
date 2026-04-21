/**
 * Video Health Check — finds broken YouTube videos in the DB.
 *
 * Checks each video against YouTube's oEmbed API (no auth required):
 *   - 200 OK → video exists and is embeddable ✓
 *   - 401     → video exists but blocks embedding ✗
 *   - 404     → video deleted/unavailable ✗
 *   - Other   → network issue, skip
 *
 * Usage on server:
 *   cd /opt/nataktv/apps/web && node /opt/nataktv/scripts/check-video-health.js
 *
 * Outputs a table of broken videos with their ID, title, and reason.
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const OEMBED = (id) =>
  `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;

async function checkVideo(video) {
  try {
    const res = await fetch(OEMBED(video.youtubeId), {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) return { status: "ok", video };
    if (res.status === 401) return { status: "not_embeddable", video };
    if (res.status === 404) return { status: "deleted", video };
    return { status: `http_${res.status}`, video };
  } catch (err) {
    return { status: "network_error", video, error: String(err?.message || err) };
  }
}

async function main() {
  const videos = await prisma.video.findMany({
    select: {
      id: true,
      youtubeId: true,
      title: true,
      views: true,
      language: { select: { name: true } },
      category: { select: { name: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  console.log(`Checking ${videos.length} videos...\n`);

  const results = [];
  // Run in batches of 10 to avoid rate limiting
  const BATCH = 10;
  for (let i = 0; i < videos.length; i += BATCH) {
    const batch = videos.slice(i, i + BATCH);
    const batchResults = await Promise.all(batch.map(checkVideo));
    results.push(...batchResults);
    process.stdout.write(`  progress: ${Math.min(i + BATCH, videos.length)}/${videos.length}\r`);
  }
  console.log("\n");

  const broken = results.filter((r) => r.status !== "ok");
  const ok = results.filter((r) => r.status === "ok");

  console.log(`\n=== Summary ===`);
  console.log(`✓ Working:       ${ok.length}`);
  console.log(`✗ Broken:        ${broken.length}`);
  console.log(`  - Deleted:     ${broken.filter((r) => r.status === "deleted").length}`);
  console.log(`  - No embed:    ${broken.filter((r) => r.status === "not_embeddable").length}`);
  console.log(`  - Other:       ${broken.filter((r) => !["deleted", "not_embeddable"].includes(r.status)).length}`);

  if (broken.length === 0) {
    console.log("\n🎉 All videos healthy. Nothing to replace.");
    await prisma.$disconnect();
    return;
  }

  console.log(`\n=== Broken Videos ===\n`);
  console.log("Status              | YT ID          | Views | Lang   | Title");
  console.log("--------------------|----------------|-------|--------|-----------------------------");
  for (const r of broken) {
    const v = r.video;
    const status = r.status.padEnd(19);
    const yid = v.youtubeId.padEnd(14);
    const views = String(v.views).padStart(5);
    const lang = (v.language?.name || "?").padEnd(6);
    const title = (v.title || "").slice(0, 50);
    console.log(`${status} | ${yid} | ${views} | ${lang} | ${title}`);
  }

  console.log(`\n=== DB IDs (for bulk operations) ===`);
  console.log(broken.map((r) => r.video.id).join(","));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
