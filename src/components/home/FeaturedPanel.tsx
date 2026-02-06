import SongCard from "./SongCard";
import type { Song } from "@/data/mockData";

interface FeaturedPanelProps {
  songs: Song[];
  onPlaySong?: (song: Song) => void;
}

const FeaturedPanel = ({ songs, onPlaySong }: FeaturedPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <h2 className="arcade-title text-sm">FEATURED TRACKS</h2>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
      </div>

      {/* Grid of Songs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onPlay={() => onPlaySong?.(song)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedPanel;
