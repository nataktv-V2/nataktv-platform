"use client";

import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { VideoPlayer } from "./VideoPlayer";

type Props = {
  youtubeId: string;
  title: string;
  videoId: string;
};

export function GatedVideoPlayer({ youtubeId, title, videoId }: Props) {
  return (
    <SubscriptionGate>
      <VideoPlayer youtubeId={youtubeId} title={title} videoId={videoId} />
    </SubscriptionGate>
  );
}
