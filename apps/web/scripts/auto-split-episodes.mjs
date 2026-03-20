#!/usr/bin/env node
/**
 * Auto-split videos into micro-drama episodes (1-3 min clips)
 *
 * Usage:
 *   node scripts/auto-split-episodes.mjs --all                    # Split all videos without episodes
 *   node scripts/auto-split-episodes.mjs --ids cm1,cm2,cm3        # Split specific videos
 *   node scripts/auto-split-episodes.mjs --id cm123abc            # Split one video
 *   node scripts/auto-split-episodes.mjs --duration 120           # Episode length in seconds (default: 120)
 *   node scripts/auto-split-episodes.mjs --overlap 3              # Overlap between episodes (default: 3s)
 *   node scripts/auto-split-episodes.mjs --dry-run                # Preview without creating clips
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const targetDuration = parseInt(getArg("--duration") || "120"); // 2 minutes default
const overlap = parseInt(getArg("--overlap") || "3"); // 3s cliffhanger overlap
const dryRun = hasFlag("--dry-run");
const splitAll = hasFlag("--all");
const singleId = getArg("--id");
const multiIds = getArg("--ids");

async function main() {
  let videoIds = [];

  if (singleId) {
    videoIds = [singleId];
  } else if (multiIds) {
    videoIds = multiIds.split(",").map((s) => s.trim());
  } else if (splitAll) {
    // Get videos that don't have episode clips yet
    const videosWithClips = await prisma.clip.findMany({
      where: { episodeNumber: { not: null } },
      select: { videoId: true },
      distinct: ["videoId"],
    });
    const excludeIds = new Set(videosWithClips.map((c) => c.videoId));

    const allVideos = await prisma.video.findMany({
      where: { duration: { gt: targetDuration + 30 } }, // Only videos longer than target + buffer
      select: { id: true, title: true, duration: true },
    });

    videoIds = allVideos
      .filter((v) => !excludeIds.has(v.id))
      .map((v) => v.id);

    console.log(`Found ${videoIds.length} videos to split (excluding ${excludeIds.size} already split)`);
  } else {
    console.log("Usage: node scripts/auto-split-episodes.mjs --all | --id <id> | --ids <id1,id2,...>");
    console.log("Options: --duration <seconds> --overlap <seconds> --dry-run");
    process.exit(1);
  }

  if (videoIds.length === 0) {
    console.log("No videos to split.");
    process.exit(0);
  }

  let totalEpisodes = 0;

  for (const videoId of videoIds) {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { id: true, title: true, duration: true, creditStart: true, reelStart: true },
    });

    if (!video) {
      console.log(`Video ${videoId} not found, skipping.`);
      continue;
    }

    const effectiveStart = video.reelStart || 0;
    const effectiveEnd = video.creditStart || video.duration;
    const contentDuration = effectiveEnd - effectiveStart;

    if (contentDuration <= targetDuration + 30) {
      console.log(`"${video.title}" (${contentDuration}s) too short for episodes, skipping.`);
      continue;
    }

    // Calculate episode boundaries
    const episodes = [];
    let currentStart = effectiveStart;
    let episodeNum = 1;

    while (currentStart < effectiveEnd - 30) { // Don't create episodes shorter than 30s
      let episodeEnd = Math.min(currentStart + targetDuration, effectiveEnd);

      // If remaining is less than 1.5x target, make it one final episode
      if (effectiveEnd - episodeEnd < targetDuration * 0.5) {
        episodeEnd = effectiveEnd;
      }

      episodes.push({
        videoId: video.id,
        title: `${video.title} - Episode ${episodeNum}`,
        startTime: currentStart,
        endTime: episodeEnd,
        sortOrder: episodeNum,
        episodeNumber: episodeNum,
      });

      currentStart = episodeEnd - overlap; // Overlap for cliffhanger effect
      episodeNum++;

      if (episodeEnd >= effectiveEnd) break;
    }

    console.log(`\n"${video.title}" (${contentDuration}s) → ${episodes.length} episodes:`);
    for (const ep of episodes) {
      const dur = ep.endTime - ep.startTime;
      console.log(`  Ep ${ep.episodeNumber}: ${formatTime(ep.startTime)} → ${formatTime(ep.endTime)} (${dur}s)`);
    }

    if (!dryRun) {
      await prisma.clip.createMany({ data: episodes });
      console.log(`  ✅ Created ${episodes.length} episodes in DB`);
    } else {
      console.log(`  [DRY RUN] Would create ${episodes.length} episodes`);
    }

    totalEpisodes += episodes.length;
  }

  console.log(`\nDone! ${dryRun ? "Would create" : "Created"} ${totalEpisodes} episodes across ${videoIds.length} videos.`);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
