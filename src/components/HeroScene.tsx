import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import PixelImage from "./PixelImage";
import MoonGlowLayer from "./MoonGlowLayer";
import MoonParticleFlow from "./MoonParticleFlow";
import ArcadeStartButton from "./ArcadeStartButton";
import PixelLoadingBar from "./PixelLoadingBar";
import redMoon from "@/assets/red-moon.png";
import characterLeft from "@/assets/character-left.png";
import characterRight from "@/assets/character-right.png";
import heartsHealth from "@/assets/hearts-health.png";
import star from "@/assets/star.png";
import StarField from "./StarField";
import Preloader from "./Preloader";
import TitleReveal from "./TitleReveal";
import FogLayer from "./FogLayer";
import TransitionPreloader from "./TransitionPreloader";

const HeroScene = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [showTransition, setShowTransition] = useState(false);

  const handleStartClick = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setShowTransition(true);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    navigate("/auth");
  }, [navigate]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
      {/* Preloader Overlay */}
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}

      {/* Transition Preloader */}
      {showTransition && <TransitionPreloader onComplete={handleTransitionComplete} />}

      {/* Background Layers */}
      <StarField />
      <FogLayer />

      {/* Decorative stars - restored original positions */}
      <img src={star} alt="" className="absolute top-[12%] left-[10%] w-8 h-8 md:w-10 md:h-10 pixel-crisp object-contain opacity-80 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[18%] right-[14%] w-6 h-6 md:w-8 md:h-8 pixel-crisp object-contain opacity-70 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[8%] right-[28%] w-5 h-5 md:w-6 md:h-6 pixel-crisp object-contain opacity-60 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[22%] left-[22%] w-5 h-5 md:w-7 md:h-7 pixel-crisp object-contain opacity-65 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[14%] left-[32%] w-6 h-6 md:w-7 md:h-7 pixel-crisp object-contain opacity-55 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[10%] right-[8%] w-7 h-7 md:w-9 md:h-9 pixel-crisp object-contain opacity-75 pointer-events-none z-0" aria-hidden />

      {/* Main Hero Content - no title */}
      <div className="relative flex items-center justify-center w-full max-w-[100rem]">
        <MoonGlowLayer />

        {/* Title Reveal - Behind Moon and Characters */}
        <TitleReveal
          text="REQUIEM"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-0 scale-110 md:scale-125 lg:scale-150"
        />

        {/* Left Character - health bar above head + blue/red aura */}
        <div className="absolute left-0 md:left-2 lg:left-4 bottom-0 md:bottom-8 z-10 character-aura-wrapper flex flex-col items-center animate-float">
          <img
            src={heartsHealth}
            alt="Health"
            className="w-24 h-8 md:w-36 md:h-12 lg:w-48 lg:h-16 pixel-crisp object-contain mb-2 -translate-y-2"
          />
          <PixelImage
            src={characterRight}
            alt="Demon character"
            className="w-40 h-52 md:w-60 md:h-80 lg:w-[22rem] lg:h-[30rem] cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300"
            glowIntensity="soft"
            animationSpeed="slow"
            removeWhiteBg
          />
        </div>

        {/* Center Moon - larger */}
        <div className="relative z-20">
          <MoonParticleFlow particleCount={24} />
          <PixelImage
            src={redMoon}
            alt="Red pixel moon"
            className="w-64 h-64 md:w-[26rem] md:h-[26rem] lg:w-[32rem] lg:h-[32rem] cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300"
            glowIntensity="strong"
            animationSpeed="normal"
            removeWhiteBg
            isMoon
          />
        </div>

        {/* Right Character - health bar on head (aligned like left) + blue/red aura */}
        <div className="absolute right-0 md:right-2 lg:right-4 bottom-0 md:bottom-8 z-10 character-aura-wrapper flex flex-col items-center animate-float" style={{ animationDelay: '1s' }}>
          <img
            src={heartsHealth}
            alt="Health"
            className="w-24 h-8 md:w-36 md:h-12 lg:w-48 lg:h-16 pixel-crisp object-contain absolute top-[5%] md:top-[8%] left-1/2 -translate-x-[60%] z-20"
          />
          <PixelImage
            src={characterLeft}
            alt="Sword character"
            className="w-48 h-64 md:w-80 md:h-[28rem] lg:w-[28rem] lg:h-[32rem] cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300"
            glowIntensity="soft"
            animationSpeed="slow"
            removeWhiteBg
          />
        </div>
      </div>

      {/* Controls Section */}
      <div className="mt-6 md:mt-10 flex flex-col items-center gap-6 z-30">
        {!isLoading ? (
          <ArcadeStartButton onClick={handleStartClick} />
        ) : (
          <PixelLoadingBar
            isVisible={isLoading}
            onComplete={handleLoadingComplete}
          />
        )}
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroScene;
