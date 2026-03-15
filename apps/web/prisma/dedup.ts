import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.video.findMany({ orderBy: { createdAt: "asc" } });
  const seen = new Set<string>();
  let deleted = 0;
  for (const v of videos) {
    if (seen.has(v.youtubeId)) {
      await prisma.watchHistory.deleteMany({ where: { videoId: v.id } });
      await prisma.clip.deleteMany({ where: { videoId: v.id } });
      await prisma.video.delete({ where: { id: v.id } });
      deleted++;
    } else {
      seen.add(v.youtubeId);
    }
  }
  console.log(`Deleted ${deleted} duplicates`);
  await prisma.$disconnect();
}

main();
