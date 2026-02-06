import { cn } from "@/lib/utils";
import type { Playlist } from "@/data/mockData";

interface PlaylistCartridgeCardProps {
  playlist: Playlist;
  onClick?: () => void;
}

const PlaylistCartridgeCard = ({ playlist, onClick }: PlaylistCartridgeCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 w-40 bg-card border-2 border-border",
        "transition-all duration-200 cursor-pointer",
        "hover:border-primary hover:scale-105",
        "hover:shadow-[0_0_25px_hsl(var(--primary)/0.3)]",
        "active:scale-100"
      )}
    >
      {/* Cartridge Top Notch */}
      <div className="flex justify-center">
        <div className="w-12 h-2 bg-muted border-x-2 border-b-2 border-border" />
      </div>

      {/* Cartridge Body */}
      <div className="p-3">
        {/* Cover Art with Gradient Overlay */}
        <div className="relative aspect-square mb-3 overflow-hidden border-2 border-border">
          <img
            src={playlist.coverArt}
            alt={playlist.name}
            className="w-full h-full object-cover pixel-crisp"
          />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t opacity-60",
            playlist.color
          )} />
        </div>

        {/* Info */}
        <div className="space-y-1 text-left">
          <h3 className="font-pixel text-[9px] text-foreground uppercase truncate">
            {playlist.name}
          </h3>
          <p className="font-pixel text-[8px] text-muted-foreground uppercase">
            {playlist.songCount} TRACKS
          </p>
        </div>
      </div>

      {/* Cartridge Bottom Label */}
      <div className="h-3 bg-muted border-t-2 border-border flex items-center justify-center">
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-primary/50" />
          ))}
        </div>
      </div>
    </button>
  );
};

export default PlaylistCartridgeCard;
