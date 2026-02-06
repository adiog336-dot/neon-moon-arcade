import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SearchBarPixel = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 px-4 py-3",
        "bg-secondary/50 border-2 transition-all duration-200",
        isFocused 
          ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]" 
          : "border-border hover:border-primary/50"
      )}
    >
      <Search className={cn(
        "w-4 h-4 transition-colors",
        isFocused ? "text-primary" : "text-muted-foreground"
      )} />
      <input
        type="text"
        placeholder="SEARCH TRACKS..."
        className="flex-1 bg-transparent font-pixel text-xs uppercase tracking-wider placeholder:text-muted-foreground focus:outline-none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className="flex gap-1">
        <kbd className="px-2 py-1 bg-muted text-[10px] font-pixel text-muted-foreground border border-border">
          /
        </kbd>
      </div>
    </div>
  );
};

export default SearchBarPixel;
