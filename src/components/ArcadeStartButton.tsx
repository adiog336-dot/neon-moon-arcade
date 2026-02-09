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
    }, 120);
  };

  return (
    <div className="relative group perspective-1000">
      {/* 2D Button Container with Pixel Border */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "relative min-w-[280px] max-w-full h-16 md:min-w-[340px] md:h-20",
          "pixel-font text-sm md:text-base tracking-[0.2em] font-bold",
          "transition-all duration-75 ease-out uppercase",
          "flex items-center justify-center",

          /* Visual Body */
          "bg-primary border-t-4 border-l-4 border-white/30 border-b-4 border-r-4 border-black/40",
          "shadow-[4px_4px_0_0_rgba(0,0,0,0.5),-4px_-4px_0_0_rgba(255,255,255,0.1)]",

          /* Pressed State */
          isPressed
            ? "translate-y-1 translate-x-1 shadow-[1px_1px_0_0_rgba(0,0,0,0.8)] border-b-2 border-r-2"
            : "hover:-translate-y-1 hover:brightness-110 active:scale-95",

          "disabled:opacity-50 disabled:cursor-not-allowed",
          "text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
        )}
        style={{
          /* Authentic pixel corner clip */
          clipPath: `polygon(
            4px 0, calc(100% - 4px) 0, 100% 4px, 
            100% calc(100% - 4px), calc(100% - 4px) 100%, 
            4px 100%, 0 calc(100% - 4px), 0 4px
          )`
        }}
      >
        {/* Inner Glare for Plastic Look */}
        <div className="absolute top-1 left-1 right-1 h-1/2 bg-white/10 pointer-events-none" />

        <span className="relative z-10 transition-transform duration-75">
          START LISTENING
        </span>
      </button>

      {/* Outer Glow Ring */}
      <div className={cn(
        "absolute -inset-1 z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        "bg-primary/20 blur-xl rounded-lg"
      )} />
    </div>
  );
};

export default ArcadeStartButton;
