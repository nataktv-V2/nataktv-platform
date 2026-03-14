import { prisma } from "@/lib/prisma";
import { VideoForm } from "../video-form";

async function getFormData() {
  const [languages, categories] = await Promise.all([
    prisma.language.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { languages, categories };
}

export default async function NewVideoPage() {
  const { languages, categories } = await getFormData();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Add Video</h1>
      <VideoForm languages={languages} categories={categories} />
    </div>
  );
}
