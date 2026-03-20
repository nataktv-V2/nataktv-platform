import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id }, select: { title: true } });
  return { title: video ? `${video.title} — Episodes` : "Episodes" };
}

export default async function EpisodesPage({ params }: Props) {
  const { id } = await params;

  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      language: true,
      category: true,
      clips: {
        where: { episodeNumber: { not: null } },
        orderBy: { episodeNumber: "asc" },
      },
    },
  });

  if (!video) notFound();

  const episodes = video.clips;

  return (
    <div className="py-4 px-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/video/${id}`} className="text-zinc-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
        </Link>
        <div>
          <h1 className="text-lg font-bold">{video.title}</h1>
          <p className="text-text-muted text-sm">{episodes.length} Episodes</p>
        </div>
      </div>

      {episodes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted">No episodes available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {episodes.map((ep, i) => {
            const duration = ep.endTime - ep.startTime;
            const mins = Math.floor(duration / 60);
            const secs = duration % 60;

            return (
              <Link
                key={ep.id}
                href={`/video/${id}?startAt=${ep.startTime}&ep=${ep.episodeNumber}`}
                className="flex items-center gap-3 p-3 bg-bg-surface rounded-xl hover:bg-bg-elevated transition-colors group"
              >
                {/* Thumbnail with play overlay */}
                <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-bg-elevated flex-shrink-0">
                  <Image
                    src={video.generatedThumbnailUrl || video.thumbnailUrl}
                    alt={ep.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Episode info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    Episode {ep.episodeNumber}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {mins}:{secs.toString().padStart(2, "0")} min
                  </p>
                </div>

                {/* Episode number badge */}
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
