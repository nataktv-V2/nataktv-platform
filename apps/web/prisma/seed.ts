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
      youtubeId: "jKyXUJceZ6k",
      title: "Plus Minus",
      description: "Two strangers meet on an overnight train journey — a frustrated wife and a young army soldier. Starring Divya Dutta & Bhuvan Bam. Filmfare Award 2019.",
      duration: 900,
      languageId: langMap.hi,
      categoryId: catMap.drama,
      isFeatured: true,
      isTrending: true,
      tags: ["train", "army", "drama", "award-winning"],
    },
    {
      youtubeId: "0krwKbsQscw",
      title: "Chutney",
      description: "A housewife narrates a chilling tale to the woman who flirted with her husband. Starring Tisca Chopra & Adil Hussain. A dark thriller about betrayal.",
      duration: 960,
      languageId: langMap.hi,
      categoryId: catMap.drama,
      isFeatured: true,
      tags: ["thriller", "marriage", "dark"],
    },
    {
      youtubeId: "2oZOOKFTKpE",
      title: "The School Bag",
      description: "Six-year-old Farooq wants a new school bag for his birthday. His mother struggles with a heartbreaking secret. Starring Rasika Dugal. Won 44 awards.",
      duration: 960,
      languageId: langMap.hi,
      categoryId: catMap["short-film"],
      isTrending: true,
      tags: ["school", "heartbreaking", "award-winning"],
    },
    {
      youtubeId: "AQR6cB1DXzY",
      title: "That Day After Everyday",
      description: "Three women facing daily harassment find strength in each other and learn to fight back. Directed by Anurag Kashyap. Starring Radhika Apte.",
      duration: 1320,
      languageId: langMap.hi,
      categoryId: catMap.action,
      isFeatured: true,
      tags: ["women", "empowerment", "anurag-kashyap"],
    },
    {
      youtubeId: "23KufSqo6cQ",
      title: "Interior Cafe Night",
      description: "Two long-lost lovers reunite in a cafe after 30 years. Starring Naseeruddin Shah & Shernaz Patel. A story of love, loss and reunion.",
      duration: 720,
      languageId: langMap.hi,
      categoryId: catMap.romance,
      isTrending: true,
      tags: ["romance", "reunion", "naseeruddin-shah"],
    },
    {
      youtubeId: "KmRzflPuCjE",
      title: "Khujli",
      description: "A middle-aged couple discovers handcuffs in their son's room, sparking a hilarious conversation. Starring Jackie Shroff & Neena Gupta.",
      duration: 660,
      languageId: langMap.hi,
      categoryId: catMap.comedy,
      isFeatured: true,
      isTrending: true,
      tags: ["comedy", "couple", "jackie-shroff"],
    },
    {
      youtubeId: "2KP0aDTVtFI",
      title: "Devi",
      description: "Nine women from different walks of life share stories of abuse. Starring Kajol & Shruti Haasan. Best Short Film, Filmfare 2021.",
      duration: 780,
      languageId: langMap.hi,
      categoryId: catMap.drama,
      isTrending: true,
      tags: ["women", "kajol", "filmfare"],
    },
    {
      youtubeId: "sNHgoGlO_FI",
      title: "Emotion",
      description: "A Telugu short film about a couple who find all options for being together closed. They must decide whether to give up or fight for love.",
      duration: 900,
      languageId: langMap.te,
      categoryId: catMap.romance,
      isFeatured: true,
      tags: ["love", "telugu", "runwayreel"],
    },
    {
      youtubeId: "0B5gDOv0TVI",
      title: "Masala",
      description: "An award-winning Marathi short film telling a heartwarming slice-of-life story about everyday moments that matter.",
      duration: 912,
      languageId: langMap.mr,
      categoryId: catMap.drama,
      isFeatured: true,
      tags: ["marathi", "award-winning", "slice-of-life"],
    },
    {
      youtubeId: "Rv7j9s1iODI",
      title: "Paath",
      description: "An award-winning Hindi short film starring Jackie Shroff. A powerful story about lessons life teaches us.",
      duration: 1022,
      languageId: langMap.hi,
      categoryId: catMap["short-film"],
      tags: ["jackie-shroff", "award-winning", "short-film"],
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
