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
    <section className="relative flex flex-col items-center justify-center min-h-screen safe-area-padding prevent-overflow">
      {/* Preloader Overlay */}
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}

      {/* Transition Preloader */}
      {showTransition && <TransitionPreloader onComplete={handleTransitionComplete} />}

      {/* Background Layers */}
      <StarField />
      <FogLayer />

      {/* Decorative stars - responsive positioning */}
      <img src={star} alt="" className="absolute top-[8%] sm:top-[12%] left-[8%] sm:left-[10%] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 pixel-crisp object-contain opacity-80 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[12%] sm:top-[18%] right-[10%] sm:right-[14%] w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 pixel-crisp object-contain opacity-70 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[6%] sm:top-[8%] right-[20%] sm:right-[28%] w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 pixel-crisp object-contain opacity-60 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[15%] sm:top-[22%] left-[15%] sm:left-[22%] w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 pixel-crisp object-contain opacity-65 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[10%] sm:top-[14%] left-[25%] sm:left-[32%] w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 pixel-crisp object-contain opacity-55 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[8%] sm:top-[10%] right-[6%] sm:right-[8%] w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 pixel-crisp object-contain opacity-75 pointer-events-none z-0" aria-hidden />

      {/* Main Hero Content - Fully Responsive */}
      <div className="relative flex items-center justify-center w-full max-w-[100rem] px-2 sm:px-4">
        <MoonGlowLayer />

        {/* Title Reveal - Responsive scaling */}
        <TitleReveal
          text="REQUIEM"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-0 scale-75 sm:scale-90 md:scale-110 lg:scale-125 xl:scale-150"
        />

        {/* Left Character - Responsive positioning and sizing */}
        <div className="absolute left-0 sm:left-2 md:left-2 lg:left-4 bottom-0 sm:bottom-4 md:bottom-8 z-10 character-aura-wrapper flex flex-col items-center animate-float">
          <img
            src={heartsHealth}
            alt="Health"
            className="w-16 h-6 sm:w-20 sm:h-7 md:w-24 md:h-8 lg:w-36 lg:h-12 xl:w-48 xl:h-16 pixel-crisp object-contain mb-1 sm:mb-2 -translate-y-1 sm:-translate-y-2"
          />
          <PixelImage
            src={characterRight}
            alt="Demon character"
            className="w-24 h-32 sm:w-32 sm:h-40 md:w-40 md:h-52 lg:w-60 lg:h-80 xl:w-[22rem] xl:h-[30rem] cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300"
            glowIntensity="soft"
            animationSpeed="slow"
            removeWhiteBg
          />
        </div>

        {/* Center Moon - Responsive sizing */}
        <div className="relative z-20">
          <MoonParticleFlow particleCount={24} />
          <PixelImage
            src={redMoon}
            alt="Red pixel moon"
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-[26rem] lg:h-[26rem] xl:w-[32rem] xl:h-[32rem] cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300"
            glowIntensity="strong"
            animationSpeed="normal"
            removeWhiteBg
            isMoon
          />
        </div>

        {/* Right Character - Responsive positioning and sizing */}
        <div className="absolute right-0 sm:right-2 md:right-2 lg:right-4 bottom-0 sm:bottom-4 md:bottom-8 z-10 character-aura-wrapper flex flex-col items-center animate-float" style={{ animationDelay: '1s' }}>
          <img
            src={heartsHealth}
            alt="Health"
            className="w-16 h-6 sm:w-20 sm:h-7 md:w-24 md:h-8 lg:w-36 lg:h-12 xl:w-48 xl:h-16 pixel-crisp object-contain absolute top-[5%] md:top-[8%] left-1/2 -translate-x-[60%] z-20"
          />
          <PixelImage
            src={characterLeft}
            alt="Sword character"
            className="w-28 h-36 sm:w-36 sm:h-48 md:w-48 md:h-64 lg:w-80 lg:h-[28rem] xl:w-[28rem] xl:h-[32rem] cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300"
            glowIntensity="soft"
            animationSpeed="slow"
            removeWhiteBg
          />
        </div>
      </div>

      {/* Controls Section - Responsive spacing */}
      <div className="mt-4 sm:mt-6 md:mt-10 flex flex-col items-center gap-4 sm:gap-6 z-30 w-full px-4">
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
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroScene;
