import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PixelImage from "./PixelImage";
import MoonGlowLayer from "./MoonGlowLayer";
import ArcadeStartButton from "./ArcadeStartButton";
import PixelLoadingBar from "./PixelLoadingBar";
import redMoon from "@/assets/red-moon.png";
import characterLeft from "@/assets/character-left.png";
import characterRight from "@/assets/character-right.png";
import heartsHealth from "@/assets/hearts-health.png";
import star from "@/assets/star.png";

const HeroScene = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartClick = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
      {/* Decorative stars - no white bg, scattered for landing vibe */}
      <img src={star} alt="" className="absolute top-[12%] left-[10%] w-8 h-8 md:w-10 md:h-10 pixel-crisp object-contain opacity-80 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[18%] right-[14%] w-6 h-6 md:w-8 md:h-8 pixel-crisp object-contain opacity-70 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[8%] right-[28%] w-5 h-5 md:w-6 md:h-6 pixel-crisp object-contain opacity-60 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[22%] left-[22%] w-5 h-5 md:w-7 md:h-7 pixel-crisp object-contain opacity-65 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[14%] left-[32%] w-6 h-6 md:w-7 md:h-7 pixel-crisp object-contain opacity-55 pointer-events-none z-0" aria-hidden />
      <img src={star} alt="" className="absolute top-[10%] right-[8%] w-7 h-7 md:w-9 md:h-9 pixel-crisp object-contain opacity-75 pointer-events-none z-0" aria-hidden />

      {/* Main Hero Content - no title */}
      <div className="relative flex items-center justify-center w-full max-w-6xl">
        <MoonGlowLayer />

        {/* Left Character - health bar above head + blue/red aura */}
        <div className="absolute left-[4%] md:left-[8%] lg:left-[12%] bottom-0 md:bottom-8 z-10 character-aura-wrapper flex flex-col items-center">
          <img
            src={heartsHealth}
            alt="Health"
            className="w-28 h-10 md:w-36 md:h-12 lg:w-44 lg:h-16 pixel-crisp object-contain mb-1 -translate-y-1"
          />
          <PixelImage
            src={characterRight}
            alt="Demon character"
            className="w-28 h-36 md:w-48 md:h-60 lg:w-60 lg:h-76"
            glowIntensity="soft"
            animationSpeed="slow"
            removeWhiteBg
          />
        </div>

        {/* Center Moon - larger */}
        <div className="relative z-20">
          <PixelImage
            src={redMoon}
            alt="Red pixel moon"
            className="w-56 h-56 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem]"
            glowIntensity="strong"
            animationSpeed="normal"
            removeWhiteBg
            isMoon
          />
        </div>

        {/* Right Character - health bar on head (aligned like left) + blue/red aura */}
        <div className="absolute right-[4%] md:right-[8%] lg:right-[12%] bottom-0 md:bottom-8 z-10 character-aura-wrapper flex flex-col items-center">
          <img
            src={heartsHealth}
            alt="Health"
            className="w-28 h-10 md:w-36 md:h-12 lg:w-44 lg:h-16 pixel-crisp object-contain mb-0 translate-y-6 md:translate-y-8 lg:translate-y-10 -translate-x-4 md:-translate-x-6 lg:-translate-x-8"
          />
          <PixelImage
            src={characterLeft}
            alt="Sword character"
            className="w-32 h-42 md:w-56 md:h-72 lg:w-72 lg:h-92"
            glowIntensity="soft"
            animationSpeed="slow"
            removeWhiteBg
          />
        </div>
      </div>

      {/* Controls Section */}
      <div className="mt-8 md:mt-12 flex flex-col items-center gap-6 z-30">
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
