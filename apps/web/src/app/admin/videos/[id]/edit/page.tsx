import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VideoForm } from "../../video-form";

async function getVideo(id: string) {
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) notFound();
  return video;
}

async function getFormData() {
  const [languages, categories] = await Promise.all([
    prisma.language.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { languages, categories };
}

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [video, { languages, categories }] = await Promise.all([
    getVideo(id),
    getFormData(),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Video</h1>
      <VideoForm
        languages={languages}
        categories={categories}
        initialData={{
          id: video.id,
          youtubeId: video.youtubeId,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          languageId: video.languageId,
          categoryId: video.categoryId,
          isFeatured: video.isFeatured,
          isTrending: video.isTrending,
        }}
      />
    </div>
  );
}
