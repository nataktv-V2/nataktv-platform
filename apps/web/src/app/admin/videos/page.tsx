import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { DeleteVideoButton } from "./delete-button";

async function getVideos() {
  try {
    return await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
      include: { language: true, category: true },
    });
  } catch {
    return [];
  }
}

export default async function AdminVideos() {
  const videos = await getVideos();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          Videos ({videos.length})
        </h1>
        <Link
          href="/admin/videos/new"
          className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Add Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="bg-[#121216] rounded-xl border border-white/5 p-12 text-center">
          <p className="text-zinc-500">No videos yet. Add your first video!</p>
        </div>
      ) : (
        <div className="bg-[#121216] rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-white/5">
                <th className="p-4 font-medium">Thumbnail</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Language</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium">Trending</th>
                <th className="p-4 font-medium">Views</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr
                  key={video.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="p-4">
                    <Image
                      src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      width={80}
                      height={45}
                      className="rounded object-cover"
                    />
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-white font-medium max-w-[200px] truncate">
                      {video.title}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {video.youtubeId}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-zinc-400">
                    {video.language.name}
                  </td>
                  <td className="p-4 text-sm text-zinc-400">
                    {video.category.name}
                  </td>
                  <td className="p-4 text-sm">
                    {video.isFeatured ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-zinc-600">No</span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    {video.isTrending ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-zinc-600">No</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-zinc-400">{video.views}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/videos/${video.id}/edit`}
                        className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-zinc-300 rounded transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteVideoButton videoId={video.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
