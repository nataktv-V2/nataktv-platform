const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    const videos = await prisma.video.findMany({
      select: { id: true, youtubeId: true, title: true, thumbnailUrl: true }
    });

    console.log(`Found ${videos.length} videos. Checking embed status...\n`);

    const disabled = [];
    const working = [];

    for (const video of videos) {
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.youtubeId}&format=json`);
        if (res.status === 200) {
          working.push(video);
          console.log(`✓ ${video.title} (${video.youtubeId})`);
        } else {
          disabled.push(video);
          console.log(`✗ DISABLED: ${video.title} (${video.youtubeId}) - status ${res.status}`);
        }
      } catch (e) {
        disabled.push(video);
        console.log(`✗ ERROR: ${video.title} (${video.youtubeId}) - ${e.message}`);
      }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Working: ${working.length}`);
    console.log(`Disabled: ${disabled.length}`);

    if (disabled.length > 0) {
      console.log(`\nDisabled video IDs to delete:`);
      disabled.forEach(v => console.log(`  ${v.id} - ${v.title} (${v.youtubeId})`));

      // Delete disabled videos and their related records
      for (const v of disabled) {
        // Delete related records first
        await prisma.watchHistory.deleteMany({ where: { videoId: v.id } });
        await prisma.favourite.deleteMany({ where: { videoId: v.id } });
        await prisma.clip.deleteMany({ where: { videoId: v.id } });
        await prisma.video.delete({ where: { id: v.id } });
        console.log(`  Deleted: ${v.title}`);
      }
      console.log(`\nDeleted ${disabled.length} embed-disabled videos from database.`);
    }

    // Output working videos for thumbnail pipeline
    console.log(`\n=== WORKING VIDEOS FOR THUMBNAIL PIPELINE ===`);
    console.log(JSON.stringify(working.map(v => ({ id: v.id, youtubeId: v.youtubeId, title: v.title, thumbnailUrl: v.thumbnailUrl })), null, 2));

  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
