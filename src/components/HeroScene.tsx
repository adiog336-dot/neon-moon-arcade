import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PixelImage from "./PixelImage";
import MoonGlowLayer from "./MoonGlowLayer";
import ArcadeStartButton from "./ArcadeStartButton";
import PixelLoadingBar from "./PixelLoadingBar";
import redMoon from "@/assets/red-moon.jpg";
import characterLeft from "@/assets/character-left.png";
import characterRight from "@/assets/character-right.png";

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
      {/* Neon Title */}
      <h1 className="arcade-title text-xl md:text-3xl lg:text-4xl mb-8 md:mb-12 text-center z-10">
        PIXEL BEATS
      </h1>

      {/* Main Hero Content */}
      <div className="relative flex items-center justify-center w-full max-w-6xl">
        {/* Moon Glow Layer */}
        <MoonGlowLayer />

        {/* Left Character */}
        <div className="absolute left-0 md:left-8 lg:left-16 bottom-0 md:bottom-8 z-10">
          <PixelImage
            src={characterLeft}
            alt="Left character"
            className="w-24 h-32 md:w-40 md:h-52 lg:w-52 lg:h-64"
            glowIntensity="soft"
            animationSpeed="slow"
            removeWhiteBg
          />
        </div>

        {/* Center Moon */}
        <div className="relative z-20">
          <PixelImage
            src={redMoon}
            alt="Red pixel moon"
            className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96"
            glowIntensity="strong"
            animationSpeed="normal"
          />
        </div>

        {/* Right Character */}
        <div className="absolute right-0 md:right-8 lg:right-16 bottom-0 md:bottom-8 z-10">
          <PixelImage
            src={characterRight}
            alt="Right character"
            className="w-24 h-32 md:w-40 md:h-52 lg:w-52 lg:h-64"
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
