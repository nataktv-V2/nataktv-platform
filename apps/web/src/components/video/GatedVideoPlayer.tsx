"use client";

import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { VideoPlayer } from "./VideoPlayer";

type Props = {
  youtubeId: string;
  title: string;
  videoId: string;
  creditStart?: number | null;
  reelStart?: number;
};

export function GatedVideoPlayer({ youtubeId, title, videoId, creditStart, reelStart }: Props) {
  return (
    <SubscriptionGate>
      <VideoPlayer youtubeId={youtubeId} title={title} videoId={videoId} creditStart={creditStart} reelStart={reelStart} />
    </SubscriptionGate>
  );
}
