const { PrismaClient } = require('@prisma/client');
async function main() {
  const p = new PrismaClient();
  const videos = await p.video.findMany({ select: { id: true, title: true, youtubeId: true }, orderBy: { createdAt: 'asc' } });

  for (const v of videos) {
    try {
      const res = await fetch('https://noembed.com/embed?url=https://www.youtube.com/watch?v=' + v.youtubeId);
      const data = await res.json();
      const ytTitle = data.title || 'N/A';
      console.log(v.title + ' ||| ' + ytTitle);
    } catch(e) {
      console.log(v.title + ' ||| FETCH_ERROR');
    }
  }
  await p.$disconnect();
}
main();
