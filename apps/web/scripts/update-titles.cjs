const { PrismaClient } = require('@prisma/client');

const titleMap = {
  'Plus Minus': 'Plus Minus',
  'Chutney': 'Chutney',
  'The School Bag': 'School Bag',
  'That Day After Everyday': 'Us Raat Ke Baad',
  'Interior Cafe Night': 'Cafe Night',
  'Khujli': 'Khujli',
  'Devi': 'Devi',
  'Emotion': 'Emotion',
  'Masala': 'Masala',
  'Paath': 'Paath',
  'Video 17': 'Sasur Ki Hawas',
  'Video 18': 'Mobile Bhaiya',
  'Video 19': 'Doctor Ki Hawas',
  'Video 20': 'Badi Bhabhi',
  'Video 22': 'Do Biwi',
  'Video 24': 'North vs South',
  'Video 25': 'Samarthya',
  'Video 26': 'Love Guru',
  'Video 27': 'Harichum',
  'Video 28': 'Hurry Burry',
  'Video 29': 'Connection',
  'Video 30': 'Love Delivery',
  'Video 31': 'Bumblinga',
  'Video 1': 'Ghat Ka Paani',
  'Video 14': 'False Affair',
  'Video 3': 'Gaon Ki Biwi',
  'Video 46': 'Dohra',
  'Video 34': 'Hridayam',
  'Video 32': 'AI Marumakal',
  'Video 35': 'Uppum Mulakum',
  'Video 36': 'Thatteem',
  'Video 37': 'Peythozhiyathe',
  'Video 38': 'Mangalyam',
  'Video 39': 'Swapnangal',
  'Video 40': 'Mahalakshmi',
  'Video 41': 'Archana LLB',
  'Video 42': 'Kadhal',
  'Video 43': 'Hey Leela',
  'Video 44': 'Sweet & Salt',
  'Video 4': 'Shikaaru',
  'Video 7': 'Hot Saali',
  'Video 8': 'Desires',
  'Video 9': 'Jeth Ji',
  'Video 10': 'Khet Mein Maje',
  'Video 12': 'Bedroom Raaz',
  'Video 13': 'Sasur Bahu',
  'Video 15': 'Shikari',
  'Video 16': 'LSD',
};

async function main() {
  const prisma = new PrismaClient();
  const videos = await prisma.video.findMany({ select: { id: true, title: true } });

  let updated = 0;
  for (const video of videos) {
    const newTitle = titleMap[video.title];
    if (newTitle && newTitle !== video.title) {
      await prisma.video.update({ where: { id: video.id }, data: { title: newTitle } });
      console.log(`${video.title} → ${newTitle}`);
      updated++;
    }
  }
  console.log(`\nUpdated ${updated} titles`);
  await prisma.$disconnect();
}
main();
