import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nataktv.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/home`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/subscribe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  // Dynamic video pages
  try {
    const videos = await prisma.video.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const videoPages: MetadataRoute.Sitemap = videos.map((video) => ({
      url: `${baseUrl}/video/${video.id}`,
      lastModified: video.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...videoPages];
  } catch {
    return staticPages;
  }
}
