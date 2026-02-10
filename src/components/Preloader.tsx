import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import guitarGif from "@/assets/upguitar.gif";
import StarField from "./StarField";

interface PreloaderProps {
    onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
    const [opening, setOpening] = useState(false);

    useEffect(() => {
        // Start opening sequence after 2.5s
        const timer = setTimeout(() => {
            setOpening(true);
        }, 2500);

        // Complete after animation (1s roughly)
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3500); // 2500 + 1000ms duration

        return () => {
            clearTimeout(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Left Door - Slides Left */}
            <div
                className={cn(
                    "absolute left-0 top-0 bottom-0 w-1/2 bg-background z-0 transition-transform duration-1000 ease-in-out transform will-change-transform overflow-hidden",
                    opening ? "-translate-x-full" : "translate-x-0"
                )}
            >
                <div className="absolute inset-0 opacity-50">
                    <StarField />
                </div>
            </div>

            {/* Right Door - Slides Right */}
            <div
                className={cn(
                    "absolute right-0 top-0 bottom-0 w-1/2 bg-background z-0 transition-transform duration-1000 ease-in-out transform will-change-transform overflow-hidden",
                    opening ? "translate-x-full" : "translate-x-0"
                )}
            >
                <div className="absolute inset-0 opacity-50">
                    <StarField />
                </div>
            </div>

            {/* Centered Content - Fades out as doors open */}
            <div
                className={cn(
                    "relative z-10 flex flex-col items-center justify-center transition-opacity duration-500",
                    opening ? "opacity-0" : "opacity-100"
                )}
            >
                <div className="relative flex flex-col items-center justify-center">
                    <img
                        src={guitarGif}
                        alt="Loading..."
                        className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain pixel-crisp mix-blend-screen"
                    />
                    <div className="mt-4 text-primary pixel-font text-sm tracking-widest animate-pulse">
                        LOADING...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
