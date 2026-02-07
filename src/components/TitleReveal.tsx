import { cn } from "@/lib/utils";

interface TitleRevealProps {
    text: string;
    className?: string;
}

const TitleReveal = ({ text, className }: TitleRevealProps) => {
    return (
        <div className={cn("flex flex-col items-center justify-center py-4", className)}>
            <h1 className="requiem-title animate-title-reveal text-4xl md:text-6xl lg:text-8xl">
                {text}
            </h1>

            {/* Subtle outer aura/glow layer */}
            <div className="absolute inset-0 -z-10 bg-red-600/5 blur-[100px] rounded-full animate-aura-pulse pointer-events-none" />
        </div>
    );
};

export default TitleReveal;
