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

  // For moon: circular clip, dark-vibe glow, no black border (asset is pre-processed)
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
            "neon-glow-moon"
          )}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <img 
            src={src} 
            alt={alt}
            className="w-full h-full object-contain pixel-crisp"
            style={{
              filter: 'brightness(1.05) saturate(1.15)',
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
