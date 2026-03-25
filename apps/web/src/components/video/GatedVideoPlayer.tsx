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
  seekRef?: React.MutableRefObject<((seconds: number) => void) | null>;
};

export function GatedVideoPlayer({ youtubeId, title, videoId, creditStart, reelStart, startAt, onEnded, seekRef }: Props) {
  return (
    <SubscriptionGate>
      <VideoPlayer youtubeId={youtubeId} title={title} videoId={videoId} creditStart={creditStart} reelStart={reelStart} startAt={startAt} onEnded={onEnded} seekRef={seekRef} />
    </SubscriptionGate>
  );
}
