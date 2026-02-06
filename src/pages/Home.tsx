import CRTOverlay from "@/components/CRTOverlay";
import FogBackground from "@/components/FogBackground";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <FogBackground />
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="arcade-title text-2xl md:text-4xl mb-8 text-center">
          WELCOME
        </h1>
        <p className="font-pixel text-xs md:text-sm text-muted-foreground text-center max-w-md">
          Your music adventure begins...
        </p>
      </div>
      <CRTOverlay />
    </div>
  );
};

export default Home;
