import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ArcadeMenuButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ArcadeMenuButton = ({ icon: Icon, label, isActive, onClick }: ArcadeMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3",
        "font-pixel text-xs uppercase tracking-wider",
        "border-2 border-transparent transition-all duration-200",
        "hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
        "focus:outline-none focus:border-primary",
        "active:scale-95",
        isActive && [
          "border-primary bg-primary/20",
          "text-primary",
          "shadow-[0_0_20px_hsl(var(--primary)/0.4)]",
        ],
        !isActive && "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {isActive && (
        <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
      )}
    </button>
  );
};

export default ArcadeMenuButton;
