import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface MoonParticleFlowProps {
    particleCount?: number;
}

const MoonParticleFlow = ({ particleCount = 20 }: MoonParticleFlowProps) => {
    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => ({
            angle: `${Math.random() * 360}deg`,
            delay: `${Math.random() * 2}s`,
            duration: `${1.5 + Math.random() * 2}s`,
            size: `${2 + Math.random() * 3}px`,
            // Distances relative to center
            // 100% of moon size is roughly 21rem (half of 42rem lg)
            // We use pixels or relative units that match the moon's responsive sizes
        }));
    }, [particleCount]);

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="relative w-0 h-0">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-primary animate-moon-particle"
                        style={{
                            '--angle': p.angle,
                            '--delay': p.delay,
                            '--duration': p.duration,
                            // Start further out, end at the "border"
                            // For responsive, we can use CSS variables or common md/lg values
                            // Let's use responsive-friendly start/end
                            '--start-dist': 'calc(-160px - 40 * 1vh)', // Start outskirts
                            '--end-dist': 'calc(-120px - 20 * 1vh)',   // End near moon border
                            width: p.size,
                            height: p.size,
                            boxShadow: `0 0 10px 2px hsl(var(--neon-red) / 0.6)`,
                            left: '50%',
                            top: '50%',
                            marginLeft: `calc(-${p.size} / 2)`,
                            marginTop: `calc(-${p.size} / 2)`,
                        } as any}
                    />
                ))}
            </div>
        </div>
    );
};

export default MoonParticleFlow;
