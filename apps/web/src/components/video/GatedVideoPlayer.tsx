"use client";

import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { VideoPlayer } from "./VideoPlayer";

type Props = {
  youtubeId: string;
  title: string;
  videoId: string;
  creditStart?: number | null;
  reelStart?: number;
  startAt?: number;
  onEnded?: () => void;
};

export function GatedVideoPlayer({ youtubeId, title, videoId, creditStart, reelStart, startAt, onEnded }: Props) {
  return (
    <SubscriptionGate>
      <VideoPlayer youtubeId={youtubeId} title={title} videoId={videoId} creditStart={creditStart} reelStart={reelStart} startAt={startAt} onEnded={onEnded} />
    </SubscriptionGate>
  );
}
