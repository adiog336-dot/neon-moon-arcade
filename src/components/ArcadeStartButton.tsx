import { useState } from "react";
import { cn } from "@/lib/utils";

interface ArcadeStartButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const ArcadeStartButton = ({ onClick, disabled = false }: ArcadeStartButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
      onClick();
    }, 100);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative group cursor-pointer transition-all duration-100",
        "px-8 py-4 md:px-12 md:py-5",
        "border-4 border-primary",
        "bg-gradient-to-b from-primary via-blood to-blood-dark",
        "font-pixel text-xs md:text-sm text-primary-foreground",
        "shadow-[inset_0_2px_0_0_hsl(0_100%_70%),inset_0_-3px_0_0_hsl(0_70%_25%)]",
        "hover:shadow-[inset_0_2px_0_0_hsl(0_100%_75%),inset_0_-3px_0_0_hsl(0_70%_30%),0_0_30px_hsl(0_100%_50%/0.5)]",
        "hover:border-neon-red",
        "active:translate-y-[2px] active:shadow-[inset_0_1px_0_0_hsl(0_100%_60%),inset_0_-1px_0_0_hsl(0_70%_20%)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isPressed && "translate-y-[2px]"
      )}
      style={{
        clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
      }}
    >
      {/* Segmented pixel effect overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 8px,
            hsl(0 0% 0% / 0.3) 8px,
            hsl(0 0% 0% / 0.3) 9px
          )`,
        }}
      />
      
      {/* Shine effect */}
      <div 
        className="absolute top-1 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60"
      />

      {/* Button text */}
      <span className="relative z-10 tracking-widest drop-shadow-[0_2px_0_hsl(0_70%_20%)]">
        START LISTENING
      </span>

      {/* Hover glow effect */}
      <div 
        className={cn(
          "absolute -inset-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
          "bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-xl"
        )}
      />
    </button>
  );
};

export default ArcadeStartButton;
