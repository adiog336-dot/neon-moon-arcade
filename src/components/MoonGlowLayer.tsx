const MoonGlowLayer = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
      {/* Outer aura */}
      <div 
        className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full animate-aura-pulse"
        style={{
          background: `radial-gradient(circle, 
            hsl(0 100% 50% / 0.3) 0%, 
            hsl(0 100% 45% / 0.2) 30%, 
            hsl(0 80% 40% / 0.1) 50%, 
            transparent 70%
          )`,
        }}
      />
      {/* Inner glow */}
      <div 
        className="absolute w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px] rounded-full animate-glow-pulse"
        style={{
          background: `radial-gradient(circle, 
            hsl(0 100% 50% / 0.5) 0%, 
            hsl(0 100% 45% / 0.3) 40%, 
            transparent 70%
          )`,
        }}
      />
    </div>
  );
};

export default MoonGlowLayer;
