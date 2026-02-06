import { cn } from "@/lib/utils";

interface PixelImageProps {
  src: string;
  alt: string;
  className?: string;
  glowIntensity?: 'soft' | 'normal' | 'strong';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  removeWhiteBg?: boolean;
  isMoon?: boolean;
}

const PixelImage = ({ 
  src, 
  alt, 
  className, 
  glowIntensity = 'normal',
  animationSpeed = 'normal',
  removeWhiteBg = false,
  isMoon = false
}: PixelImageProps) => {
  const glowClass = {
    soft: 'neon-glow-soft',
    normal: 'neon-glow',
    strong: 'neon-glow-strong',
  }[glowIntensity];

  const animationClass = {
    slow: 'animate-breathe-slow',
    normal: 'animate-breathe',
    fast: 'animate-breathe-fast',
  }[animationSpeed];

  // For moon: use circular clip and remove black background
  if (isMoon) {
    return (
      <div 
        className={cn(
          "relative",
          animationClass,
          className
        )}
      >
        <div 
          className={cn(
            "relative overflow-hidden rounded-full",
            glowClass
          )}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <img 
            src={src} 
            alt={alt}
            className="w-full h-full object-cover pixel-crisp scale-110"
            style={{
              filter: 'brightness(1.1) saturate(1.2)',
            }}
          />
        </div>
      </div>
    );
  }

  // For characters: aggressive background removal
  return (
    <div 
      className={cn(
        "relative",
        animationClass,
        className
      )}
    >
      <img 
        src={src} 
        alt={alt}
        className={cn(
          "pixel-crisp object-contain w-full h-full",
          glowClass,
          removeWhiteBg && "mix-blend-lighten"
        )}
        style={removeWhiteBg ? {
          filter: 'contrast(1.15) brightness(1.1) saturate(1.1)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 100%)',
        } : undefined}
      />
    </div>
  );
};

export default PixelImage;
