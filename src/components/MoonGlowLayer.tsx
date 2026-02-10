const MoonGlowLayer = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
      {/* Outer aura */}
      <div
        className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full animate-aura-pulse"
        style={{
          background: `radial-gradient(circle, 
            hsl(0 95% 45% / 0.25) 0%, 
            hsl(0 80% 40% / 0.15) 35%, 
            hsl(0 60% 25% / 0.08) 60%, 
            transparent 75%
          )`,
        }}
      />
      {/* Middle glow */}
      <div
        className="absolute w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px] rounded-full animate-glow-pulse"
        style={{
          background: `radial-gradient(circle, 
            hsl(0 90% 50% / 0.4) 0%, 
            hsl(0 80% 40% / 0.25) 45%, 
            transparent 70%
          )`,
        }}
      />
      {/* Core intense glow */}
      <div
        className="absolute w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] rounded-full mix-blend-screen"
        style={{
          background: `radial-gradient(circle, 
            hsl(0 100% 60% / 0.5) 0%, 
            hsl(0 100% 50% / 0.3) 50%, 
            transparent 80%
          )`,
        }}
      />
    </div>
  );
};

export default MoonGlowLayer;
