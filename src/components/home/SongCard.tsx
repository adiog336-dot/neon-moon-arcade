import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Song } from "@/data/mockData";

interface SongCardProps {
  song: Song;
  onPlay?: () => void;
}

const SongCard = ({ song, onPlay }: SongCardProps) => {
  return (
    <div
      className={cn(
        "group relative bg-card border-2 border-border p-3",
        "transition-all duration-200 cursor-pointer",
        "hover:border-primary hover:scale-105",
        "hover:shadow-[0_0_25px_hsl(var(--primary)/0.3)]"
      )}
    >
      {/* Badge */}
      {song.badge && (
        <div
          className={cn(
            "absolute -top-2 -right-2 px-2 py-1 font-pixel text-[8px] z-10",
            "border-2 animate-pulse",
            song.badge === 'NEW' 
              ? "bg-accent text-accent-foreground border-accent" 
              : "bg-primary text-primary-foreground border-primary"
          )}
        >
          {song.badge}
        </div>
      )}

      {/* Album Art */}
      <div className="relative aspect-square mb-3 overflow-hidden border-2 border-border">
        <img
          src={song.albumArt}
          alt={song.album}
          className="w-full h-full object-cover pixel-crisp"
        />
        {/* Play Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-background/80 flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity"
          )}
        >
          <button
            onClick={onPlay}
            className={cn(
              "w-12 h-12 flex items-center justify-center",
              "bg-primary text-primary-foreground border-2 border-primary",
              "hover:bg-primary/80 hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)]",
              "transition-all active:scale-90"
            )}
          >
            <Play className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="font-pixel text-[10px] text-foreground uppercase truncate">
          {song.title}
        </h3>
        <p className="font-pixel text-[8px] text-muted-foreground uppercase truncate">
          {song.artist}
        </p>
        <p className="font-pixel text-[8px] text-muted-foreground/60 uppercase">
          {song.duration}
        </p>
      </div>
    </div>
  );
};

export default SongCard;
