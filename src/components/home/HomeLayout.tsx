import { ReactNode } from "react";
import PixelSidebar from "./PixelSidebar";
import BottomPlayerBar from "./BottomPlayerBar";
import CRTOverlay from "@/components/CRTOverlay";
import FogBackground from "@/components/FogBackground";
import { currentSong } from "@/data/mockData";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <FogBackground />
      
      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <PixelSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24">
          {children}
        </main>
      </div>

      {/* Bottom Player */}
      <BottomPlayerBar currentSong={currentSong} />
      
      <CRTOverlay />
    </div>
  );
};

export default HomeLayout;
