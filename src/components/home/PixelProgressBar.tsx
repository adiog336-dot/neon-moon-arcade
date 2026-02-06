import { cn } from "@/lib/utils";

interface PixelProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

const PixelProgressBar = ({ progress, className }: PixelProgressBarProps) => {
  const segments = 20;
  const filledSegments = Math.floor((progress / 100) * segments);

  return (
    <div className={cn("flex gap-[2px]", className)}>
      {[...Array(segments)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 flex-1 min-w-[4px] transition-colors duration-100",
            i < filledSegments
              ? "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
              : "bg-muted"
          )}
        />
      ))}
    </div>
  );
};

export default PixelProgressBar;
