import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PixelProgressBar from "./PixelProgressBar";
import type { Song } from "@/data/mockData";

interface BottomPlayerBarProps {
  currentSong: Song | null;
}

const BottomPlayerBar = ({ currentSong }: BottomPlayerBarProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(70);

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur border-t-2 border-primary/30 shadow-[0_-4px_30px_hsl(var(--primary)/0.2)]">
      {/* LED Strip */}
      <div className="h-1 flex">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 transition-colors",
              i < Math.floor((progress / 100) * 40)
                ? "bg-primary"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 px-4 py-3">
        {/* Song Info */}
        <div className="flex items-center gap-3 w-64">
          <div className="w-12 h-12 border-2 border-border overflow-hidden flex-shrink-0">
            <img
              src={currentSong.albumArt}
              alt={currentSong.album}
              className="w-full h-full object-cover pixel-crisp"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-pixel text-[10px] text-foreground uppercase truncate">
              {currentSong.title}
            </h4>
            <p className="font-pixel text-[8px] text-muted-foreground uppercase truncate">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Glowing Separator */}
        <div className="w-[2px] h-10 bg-primary/30 shadow-[0_0_10px_hsl(var(--primary)/0.3)]" />

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {/* Playback Buttons */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                "w-10 h-10 flex items-center justify-center",
                "bg-primary text-primary-foreground border-2 border-primary",
                "hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)]",
                "transition-all active:scale-90"
              )}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md flex items-center gap-2">
            <span className="font-pixel text-[8px] text-muted-foreground w-8">
              1:18
            </span>
            <PixelProgressBar progress={progress} className="flex-1" />
            <span className="font-pixel text-[8px] text-muted-foreground w-8 text-right">
              {currentSong.duration}
            </span>
          </div>
        </div>

        {/* Glowing Separator */}
        <div className="w-[2px] h-10 bg-primary/30 shadow-[0_0_10px_hsl(var(--primary)/0.3)]" />

        {/* Volume */}
        <div className="flex items-center gap-2 w-32">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-[2px] flex-1">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                onClick={() => setVolume((i + 1) * 10)}
                className={cn(
                  "h-4 flex-1 min-w-[3px] transition-colors",
                  i < volume / 10
                    ? "bg-primary hover:bg-primary/80"
                    : "bg-muted hover:bg-muted-foreground/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomPlayerBar;
