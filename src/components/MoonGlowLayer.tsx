const MoonGlowLayer = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 bg-transparent">
      {/* Outer aura */}
      <div
        className="absolute w-[120%] h-[120%] max-w-[800px] max-h-[800px] rounded-full animate-aura-pulse"
        style={{
          background: `radial-gradient(circle, 
            hsl(0 95% 45% / 0.2) 0%, 
            hsl(0 80% 40% / 0.12) 35%, 
            hsl(0 60% 25% / 0.05) 60%, 
            transparent 75%
          )`,
        }}
      />
      {/* Middle glow */}
      <div
        className="absolute w-[100%] h-[100%] max-w-[600px] max-h-[600px] rounded-full animate-glow-pulse"
        style={{
          background: `radial-gradient(circle, 
            hsl(0 90% 50% / 0.35) 0%, 
            hsl(0 80% 40% / 0.2) 45%, 
            transparent 70%
          )`,
        }}
      />
      {/* Core intense glow */}
      <div
        className="absolute w-[60%] h-[60%] max-w-[400px] max-h-[400px] rounded-full mix-blend-screen"
        style={{
          background: `radial-gradient(circle, 
            hsl(0 100% 60% / 0.45) 0%, 
            hsl(0 100% 50% / 0.25) 50%, 
            transparent 80%
          )`,
        }}
      />
    </div>
  );
};

export default MoonGlowLayer;

