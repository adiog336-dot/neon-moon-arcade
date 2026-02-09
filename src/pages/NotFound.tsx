import { Link } from "react-router-dom";
import { useEffect } from "react";
import meeGif from "@/assets/mee.gif";
import CRTOverlay from "@/components/CRTOverlay";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden font-mono">
      {/* Neon Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />

      <CRTOverlay />

      <div className="relative z-10 flex flex-col items-center justify-center p-8 max-w-md w-full">
        {/* Error Header */}
        <div className="mb-8 text-center">
          <h1 className="pixel-font text-5xl md:text-6xl text-primary animate-pulse drop-shadow-[0_0_15px_rgba(234,56,76,0.6)]">
            ERROR 404
          </h1>
          <div className="h-1 w-full bg-primary/30 mt-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary animate-[scan_2s_linear_infinite]" />
          </div>
        </div>

        {/* The Image/GIF */}
        <div className="relative mb-10 group">
          <div className="absolute -inset-4 bg-primary/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <img
            src={meeGif}
            alt="Error illustration"
            className="w-64 h-64 md:w-80 md:h-80 object-contain pixel-crisp relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* Message and Return Button */}
        <div className="text-center space-y-8">
          <p className="text-primary/60 pixel-font text-sm tracking-widest uppercase">
            System_Malfunction: Neural_Link_Severed
          </p>

          <Link
            to="/"
            className="inline-block group relative"
          >
            <div className="absolute -inset-1 bg-primary blur opacity-40 group-hover:opacity-100 transition duration-200" />
            <div className="relative bg-background border-2 border-primary px-8 py-3 text-primary pixel-font text-sm hover:bg-primary hover:text-background transition-all active:scale-95">
              RETURN TO BASE
            </div>
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex gap-4 text-primary/20">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;

