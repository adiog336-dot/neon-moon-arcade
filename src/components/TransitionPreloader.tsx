import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import mirGif from "@/assets/mir.gif";

interface TransitionPreloaderProps {
    onComplete: () => void;
}

const Heart = ({ className, delay }: { className?: string; delay: number }) => (
    <div
        className={cn("absolute opacity-0 animate-float-heart pointer-events-none", className)}
        style={{ animationDelay: `${delay}s` }}
    >
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-pink-400 drop-shadow-[0_0_5px_rgba(244,114,182,0.8)]"
        >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    </div>
);

const TransitionPreloader = ({ onComplete }: TransitionPreloaderProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    onComplete();
                    return 100;
                }
                return prev + 1.5;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[200] bg-[#6b21a8] flex flex-col items-center justify-center p-4 overflow-hidden pointer-events-auto">
            {/* Centered Content */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="relative flex flex-col items-center justify-center gap-6">
                    {/* Character/GIF with Hearts */}
                    <div className="relative">
                        {/* Floating Hearts */}
                        <Heart className="top-0 -left-8" delay={0} />
                        <Heart className="top-8 -right-10" delay={0.5} />
                        <Heart className="bottom-4 -left-12" delay={1.2} />
                        <Heart className="top-1/2 -right-14" delay={0.8} />
                        <Heart className="-top-12 left-1/2" delay={1.5} />

                        <img
                            src={mirGif}
                            alt="Loading..."
                            className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain pixel-crisp drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        />
                    </div>

                    {/* Loading Bar Container */}
                    <div className="w-64 md:w-80 space-y-3">
                        <div className="w-full h-1.5 bg-white/10 rounded-full relative overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.9)] transition-all duration-150 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] text-pink-300 pixel-font tracking-widest animate-pulse font-bold">LOADING...</span>
                            <span className="text-[10px] text-pink-300 pixel-font font-bold">{Math.round(progress)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float-heart {
                    0% { transform: translateY(0) scale(0.5); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
                }
                .animate-float-heart {
                    animation: float-heart 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default TransitionPreloader;


