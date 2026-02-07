import { cn } from "@/lib/utils";

const FogLayer = () => {
    return (
        <div className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none overflow-hidden select-none z-0">
            {/* Layer 1: Large slow drift */}
            <div
                className="fog-particle w-[200%] h-[150%] -left-1/2 -top-1/4 animate-fog-drift opacity-40"
                style={{ animationDuration: '45s', background: 'radial-gradient(circle, hsla(0, 80%, 15%, 0.4) 0%, transparent 60%)' }}
            />

            {/* Layer 2: Medium drift, different offset */}
            <div
                className="fog-particle w-[150%] h-full left-0 bottom-0 animate-fog-drift opacity-30"
                style={{ animationDuration: '30s', animationDelay: '-10s', background: 'radial-gradient(circle, hsla(0, 70%, 10%, 0.5) 0%, transparent 70%)' }}
            />

            {/* Layer 3: Lower concentrated fog */}
            <div
                className="fog-particle w-[180%] h-[80%] -left-[40%] bottom-0 animate-fog-drift opacity-20"
                style={{ animationDuration: '60s', animationDelay: '-5s', background: 'radial-gradient(circle, hsla(0, 90%, 20%, 0.3) 0%, transparent 50%)' }}
            />

            {/* Ground Mist */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-red-950/20 to-transparent blur-3xl opacity-50" />
        </div>
    );
};

export default FogLayer;
