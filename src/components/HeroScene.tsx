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

      {/* Main Hero Content */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full max-w-[120rem] flex-1 mt-4 md:mt-0">

        {/* Left Character Area */}
        <div className="order-2 lg:order-1 relative lg:absolute lg:left-0 xl:left-8 bottom-0 lg:bottom-12 z-20 flex flex-col items-center animate-float mt-4 lg:mt-0">
          <img
            src={heartsHealth}
            alt="Health"
            className="w-28 h-10 md:w-40 md:h-14 lg:w-48 lg:h-16 pixel-crisp object-contain mb-1"
          />
          <PixelImage
            src={characterRight}
            alt="Demon character"
            className="w-40 h-48 md:w-56 md:h-72 lg:w-[20rem] lg:h-[26rem] xl:w-[24rem] xl:h-[30rem] cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300"
            glowIntensity="soft"
            animationSpeed="slow"
            removeWhiteBg
          />
        </div>

        {/* Center Content (Moon + Title) */}
        <div className="order-1 lg:order-2 relative z-30 flex flex-col items-center justify-center">
          <MoonGlowLayer />

          {/* Title Reveal - Responsive scaling */}
          {!isLoading && (
            <TitleReveal
              text="REQUIEM"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] z-0 scale-[1.2] md:scale-[1.8] lg:scale-[2.2] xl:scale-[2.8]"
            />
          )}

          <div className="relative">
            <MoonParticleFlow particleCount={20} />
            <PixelImage
              src={redMoon}
              alt="Red pixel moon"
              className="w-56 h-56 md:w-72 md:h-72 lg:w-[24rem] lg:h-[24rem] xl:w-[32rem] xl:h-[32rem] cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300"
              glowIntensity="strong"
              animationSpeed="normal"
              removeWhiteBg
              isMoon
            />
          </div>
        </div>

        {/* Right Character Area */}
        <div className="order-3 lg:order-3 relative lg:absolute lg:right-0 xl:right-8 bottom-0 lg:bottom-12 z-20 flex flex-col items-center animate-float mt-4 lg:mt-0" style={{ animationDelay: '1s' }}>
          <img
            src={heartsHealth}
            alt="Health"
            className="w-28 h-10 md:w-40 md:h-14 lg:w-48 lg:h-16 pixel-crisp object-contain mb-1"
          />
          <PixelImage
            src={characterLeft}
            alt="Sword character"
            className="w-48 h-56 md:w-64 md:h-80 lg:w-[22rem] lg:h-[28rem] xl:w-[28rem] xl:h-[34rem] cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300"
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
