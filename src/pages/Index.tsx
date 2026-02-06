import HeroScene from "@/components/HeroScene";
import CRTOverlay from "@/components/CRTOverlay";
import FogBackground from "@/components/FogBackground";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <FogBackground />
      <HeroScene />
      <CRTOverlay />
    </div>
  );
};

export default Index;
