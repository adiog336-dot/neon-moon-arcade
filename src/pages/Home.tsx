import { useState } from "react";
import HomeLayout from "@/components/home/HomeLayout";
import SearchBarPixel from "@/components/home/SearchBarPixel";
import FeaturedPanel from "@/components/home/FeaturedPanel";
import PlaylistSection from "@/components/home/PlaylistSection";
import { mockSongs, mockPlaylists, type Song } from "@/data/mockData";

const Home = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(mockSongs[0]);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    console.log('Playing:', song.title);
  };

  return (
    <HomeLayout>
      <div className="p-6 space-y-8">
        {/* Header with Search */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="arcade-title text-lg">ARCADE PLAYER</h1>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
          <SearchBarPixel />
        </div>

        {/* Featured Section */}
        <FeaturedPanel songs={mockSongs} onPlaySong={handlePlaySong} />

        {/* Playlists Section */}
        <PlaylistSection playlists={mockPlaylists} />

        {/* Additional Stats Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'TRACKS', value: '1,234' },
            { label: 'PLAYLISTS', value: '42' },
            { label: 'HOURS', value: '168' },
            { label: 'FAVORITES', value: '89' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border-2 border-border p-4 text-center hover:border-primary/50 transition-colors"
            >
              <p className="font-pixel text-lg text-primary">{stat.value}</p>
              <p className="font-pixel text-[8px] text-muted-foreground uppercase mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;
