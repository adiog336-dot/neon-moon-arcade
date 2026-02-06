import { cn } from "@/lib/utils";

interface PixelImageProps {
  src: string;
  alt: string;
  className?: string;
  glowIntensity?: 'soft' | 'normal' | 'strong';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  removeWhiteBg?: boolean;
}

const PixelImage = ({ 
  src, 
  alt, 
  className, 
  glowIntensity = 'normal',
  animationSpeed = 'normal',
  removeWhiteBg = false
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
          "pixel-crisp object-contain",
          glowClass,
          removeWhiteBg && "mix-blend-screen"
        )}
        style={removeWhiteBg ? {
          filter: 'contrast(1.1) brightness(1.05)',
        } : undefined}
      />
    </div>
  );
};

export default PixelImage;
