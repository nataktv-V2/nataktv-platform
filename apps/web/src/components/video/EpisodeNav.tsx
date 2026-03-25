"use client";

type Episode = {
  id: string;
  episodeNumber: number;
  startTime: number;
  endTime: number;
};

type Props = {
  videoId: string;
  episodes: Episode[];
  currentEpisode?: number;
  onEpisodeSelect?: (startTime: number, episodeNumber: number) => void;
};

export function EpisodeNav({ videoId, episodes, currentEpisode, onEpisodeSelect }: Props) {
  if (episodes.length === 0) return null;

  const handleClick = (ep: Episode) => {
    if (onEpisodeSelect) {
      onEpisodeSelect(ep.startTime, ep.episodeNumber);
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-bg-surface rounded-xl overflow-x-auto scrollbar-hide">
      <span className="text-xs text-text-muted whitespace-nowrap mr-1">Episodes</span>
      <div className="flex gap-1.5">
        {episodes.map((ep) => (
          <button
            key={ep.id}
            onClick={() => handleClick(ep)}
            className={`min-w-[28px] h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              ep.episodeNumber === currentEpisode
                ? "bg-accent text-white scale-110"
                : "bg-bg-elevated text-zinc-400 hover:text-white hover:bg-bg-elevated/80"
            }`}
          >
            {ep.episodeNumber}
          </button>
        ))}
      </div>
    </div>
  );
}
