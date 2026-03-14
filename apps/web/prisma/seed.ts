import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Languages
  const languages = await Promise.all(
    [
      { name: "Hindi", code: "hi" },
      { name: "Tamil", code: "ta" },
      { name: "Telugu", code: "te" },
      { name: "Marathi", code: "mr" },
      { name: "Bengali", code: "bn" },
      { name: "Kannada", code: "kn" },
      { name: "Malayalam", code: "ml" },
    ].map((lang) =>
      prisma.language.upsert({
        where: { code: lang.code },
        update: {},
        create: lang,
      })
    )
  );

  console.log(`Seeded ${languages.length} languages`);

  // Seed Categories
  const categories = await Promise.all(
    [
      { name: "Drama", slug: "drama" },
      { name: "Comedy", slug: "comedy" },
      { name: "Romance", slug: "romance" },
      { name: "Action", slug: "action" },
      { name: "Short Film", slug: "short-film" },
      { name: "Web Series", slug: "web-series" },
      { name: "Originals", slug: "originals" },
    ].map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );

  console.log(`Seeded ${categories.length} categories`);

  // Seed sample videos (YouTube IDs from Creative Commons / public domain content)
  const langMap = Object.fromEntries(languages.map((l) => [l.code, l.id]));
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const sampleVideos = [
    {
      youtubeId: "dQw4w9WgXcQ",
      title: "Sapno Ka Shehar - Episode 1",
      description: "A young woman moves to Mumbai chasing her dreams. Hindi drama series.",
      duration: 1200,
      languageId: langMap.hi,
      categoryId: catMap.drama,
      isFeatured: true,
      isTrending: true,
      tags: ["mumbai", "dreams", "drama"],
    },
    {
      youtubeId: "jNQXAC9IVRw",
      title: "Haseen Raatein - Comedy Special",
      description: "A hilarious take on modern relationships. Stand-up comedy special.",
      duration: 900,
      languageId: langMap.hi,
      categoryId: catMap.comedy,
      isFeatured: true,
      tags: ["comedy", "relationships", "standup"],
    },
    {
      youtubeId: "9bZkp7q19f0",
      title: "Kadhal Kanavugal",
      description: "Tamil romantic short film about love in the digital age.",
      duration: 1500,
      languageId: langMap.ta,
      categoryId: catMap.romance,
      isTrending: true,
      tags: ["romance", "love", "modern"],
    },
    {
      youtubeId: "kJQP7kiw5Fk",
      title: "Veera - The Warrior",
      description: "Telugu action short film. A retired soldier protects his village.",
      duration: 1800,
      languageId: langMap.te,
      categoryId: catMap.action,
      isFeatured: true,
      tags: ["action", "soldier", "village"],
    },
    {
      youtubeId: "RgKAFK5djSk",
      title: "Ek Cup Chai",
      description: "Award-winning Hindi short film about human connections over tea.",
      duration: 600,
      languageId: langMap.hi,
      categoryId: catMap["short-film"],
      isTrending: true,
      tags: ["short-film", "tea", "heartwarming"],
    },
    {
      youtubeId: "OPf0YbXqDm0",
      title: "Mumbai Diaries - S1E1",
      description: "Web series following the lives of five friends in Mumbai.",
      duration: 2400,
      languageId: langMap.hi,
      categoryId: catMap["web-series"],
      isFeatured: true,
      isTrending: true,
      tags: ["webseries", "mumbai", "friends"],
    },
    {
      youtubeId: "hT_nvWreIhg",
      title: "Kolkata Chronicles",
      description: "Bengali drama exploring the lives of three generations in Kolkata.",
      duration: 1100,
      languageId: langMap.bn,
      categoryId: catMap.drama,
      tags: ["kolkata", "family", "generations"],
    },
    {
      youtubeId: "CevxZvSJLk8",
      title: "Puneri Patya - Marathi Comedy",
      description: "Hilarious Marathi comedy about Pune's famous signboards and culture.",
      duration: 800,
      languageId: langMap.mr,
      categoryId: catMap.comedy,
      isTrending: true,
      tags: ["pune", "comedy", "culture"],
    },
    {
      youtubeId: "fJ9rUzIMcZQ",
      title: "Bengaluru Days",
      description: "Kannada web series about IT professionals and their weekend adventures.",
      duration: 1400,
      languageId: langMap.kn,
      categoryId: catMap["web-series"],
      tags: ["bengaluru", "it", "weekends"],
    },
    {
      youtubeId: "60ItHLz5WEA",
      title: "Kerala Diaries",
      description: "Malayalam drama short film set in the backwaters of Kerala.",
      duration: 950,
      languageId: langMap.ml,
      categoryId: catMap["short-film"],
      isFeatured: true,
      tags: ["kerala", "backwaters", "drama"],
    },
  ];

  for (const video of sampleVideos) {
    await prisma.video.upsert({
      where: {
        id: video.youtubeId, // won't match, forces create
      },
      update: {},
      create: {
        ...video,
        languageId: video.languageId!,
        categoryId: video.categoryId!,
        thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
        sortOrder: sampleVideos.indexOf(video),
        publishedAt: new Date(),
      },
    });
  }

  console.log(`Seeded ${sampleVideos.length} sample videos`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
