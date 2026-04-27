"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSubscription } from "@/components/subscription/SubscriptionGate";

type VideoCardProps = {
  id: string;
  title: string;
  thumbnailUrl: string;
  generatedThumbnailUrl?: string | null;
  duration: number;
  language?: string;
  category?: string;
  fullWidth?: boolean;
  createdAt?: string;
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const VideoCard = memo(function VideoCard({ id, title, thumbnailUrl, generatedThumbnailUrl, duration, language, fullWidth, createdAt }: VideoCardProps) {
  const isNew = createdAt ? (Date.now() - new Date(createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000 : false;
  const { isSubscribed, loading: subLoading } = useSubscription();

  // Unauth or non-subscribed users skip straight to /subscribe instead of
  // wasting a tap on /video/[id] just to hit the paywall there.
  const href = !subLoading && !isSubscribed ? "/subscribe" : `/video/${id}`;

  return (
    <Link href={href} className={`group block flex-shrink-0 ${fullWidth ? "w-full" : "w-36 sm:w-44"}`}>
      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-bg-surface">
        <Image
          src={generatedThumbnailUrl || thumbnailUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 144px, 176px"
        />
        {isNew && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-[1]">NEW</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const text = `Watch "${title}" on Natak TV! 🎬\nhttps://app.nataktv.com/video/${id}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
          }}
          className="absolute top-2 right-2 z-[2] bg-[#25D366] text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          title="Share on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-xs font-medium line-clamp-2 leading-tight">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            {language && (
              <span className="text-[10px] bg-white/20 text-white/80 px-1.5 py-0.5 rounded">{language}</span>
            )}
            <span className="text-[10px] text-white/60">{formatDuration(duration)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
});
