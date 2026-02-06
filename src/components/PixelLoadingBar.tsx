import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PixelLoadingBarProps {
  isVisible: boolean;
  onComplete: () => void;
}

const PixelLoadingBar = ({ isVisible, onComplete }: PixelLoadingBarProps) => {
  const [progress, setProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setShowComplete(false);
      return;
    }

    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setShowComplete(true);
          setTimeout(onComplete, 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const segments = 12;
  const filledSegments = Math.floor((progress / 100) * segments);

  return (
    <div className="flex flex-col items-center gap-4 animate-[fadeIn_0.3s_ease-out]">
      {/* Loading bar container */}
      <div 
        className={cn(
          "relative w-64 md:w-80 h-6 md:h-8",
          "border-4 border-primary",
          "bg-background/80"
        )}
        style={{
          clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
        }}
      >
        {/* Segments container */}
        <div className="absolute inset-1 flex gap-1">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-full transition-all duration-75",
                i < filledSegments 
                  ? "bg-gradient-to-b from-neon-red via-primary to-blood" 
                  : "bg-muted/30"
              )}
              style={{
                boxShadow: i < filledSegments 
                  ? "inset 0 1px 0 hsl(0 100% 70% / 0.5), inset 0 -1px 0 hsl(0 60% 30% / 0.5)"
                  : "none",
              }}
            />
          ))}
        </div>

        {/* Scanline effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.3) 2px,
              rgba(0,0,0,0.3) 4px
            )`,
          }}
        />

        {/* Glow overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: `linear-gradient(90deg, 
              transparent, 
              hsl(0 100% 50% / 0.3) ${progress}%, 
              transparent ${progress + 5}%
            )`,
          }}
        />
      </div>

      {/* Loading text */}
      <p className={cn(
        "font-pixel text-xs text-primary tracking-wider",
        "drop-shadow-[0_0_10px_hsl(0_100%_50%/0.8)]",
        showComplete && "animate-pulse"
      )}>
        {showComplete ? "READY..." : "LOADING..."}
      </p>
    </div>
  );
};

export default PixelLoadingBar;
