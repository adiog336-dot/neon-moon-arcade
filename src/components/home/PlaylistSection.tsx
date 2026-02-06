import PlaylistCartridgeCard from "./PlaylistCartridgeCard";
import type { Playlist } from "@/data/mockData";

interface PlaylistSectionProps {
  playlists: Playlist[];
  onSelectPlaylist?: (playlist: Playlist) => void;
}

const PlaylistSection = ({ playlists, onSelectPlaylist }: PlaylistSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <h2 className="arcade-title text-sm">PLAYLISTS</h2>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {playlists.map((playlist) => (
          <PlaylistCartridgeCard
            key={playlist.id}
            playlist={playlist}
            onClick={() => onSelectPlaylist?.(playlist)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistSection;
