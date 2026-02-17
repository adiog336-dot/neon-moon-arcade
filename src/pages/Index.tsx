
import HeroScene from "@/components/HeroScene";
import FogBackground from "@/components/FogBackground";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="mx-auto w-full max-w-[120rem] min-h-screen relative">
        <FogBackground />
        <HeroScene />
      </div>
    </div>
  );
};

export default Index;
