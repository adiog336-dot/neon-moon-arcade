import { useState } from "react";
import { Home, Library, ListMusic, Heart, Clock } from "lucide-react";
import ArcadeMenuButton from "./ArcadeMenuButton";

const menuItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'library', icon: Library, label: 'Library' },
  { id: 'playlists', icon: ListMusic, label: 'Playlists' },
  { id: 'favorites', icon: Heart, label: 'Favorites' },
  { id: 'recent', icon: Clock, label: 'Recently Played' },
];

const PixelSidebar = () => {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <aside className="w-56 h-full flex flex-col bg-card/50 border-r-2 border-primary/30 shadow-[2px_0_20px_hsl(var(--primary)/0.2)]">
      {/* Logo Section */}
      <div className="p-4 border-b-2 border-primary/20">
        <h2 className="arcade-title text-sm text-center">
          PIXEL BEATS
        </h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <ArcadeMenuButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeItem === item.id}
            onClick={() => setActiveItem(item.id)}
          />
        ))}
      </nav>

      {/* Bottom Decoration */}
      <div className="p-4 border-t-2 border-primary/20">
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary/40 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default PixelSidebar;
