const MoonGlowLayer = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
      {/* Outer aura */}
      <div 
        className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full animate-aura-pulse"
        style={{
          background: `radial-gradient(circle, 
            hsl(0 90% 40% / 0.2) 0%, 
            hsl(0 80% 35% / 0.12) 30%, 
            hsl(0 60% 25% / 0.06) 50%, 
            transparent 70%
          )`,
        }}
      />
      {/* Inner glow - deeper red for dark vibe */}
      <div 
        className="absolute w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px] rounded-full animate-glow-pulse"
        style={{
          background: `radial-gradient(circle, 
            hsl(0 85% 45% / 0.35) 0%, 
            hsl(0 75% 35% / 0.2) 40%, 
            transparent 70%
          )`,
        }}
      />
    </div>
  );
};

export default MoonGlowLayer;
