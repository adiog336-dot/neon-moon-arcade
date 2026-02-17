import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProfileCardProps {
    characterId?: string;
    characterImage?: string;
    characterName?: string;
}

const ProfileCard = ({ characterId, characterImage, characterName }: ProfileCardProps) => {
    const [userName, setUserName] = useState("PLAYER");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const loadUserData = async () => {
            if (!supabase) return;

            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (user) {
                    // Get name from user metadata or email
                    const name = user.user_metadata?.name || user.email?.split("@")[0] || "PLAYER";
                    setUserName(name.toUpperCase());
                    setUserEmail(user.email || "");
                }
            } catch (error) {
                console.warn("Failed to load user data:", error);
            }
        };

        loadUserData();
    }, []);

    return (
        <div className="relative w-full max-w-lg transform hover:scale-105 transition-transform duration-300">
            {/* Outer border - red/primary color */}
            <div className="border-4 sm:border-[8px] border-[hsl(var(--retro-red))] bg-[hsl(var(--retro-red))] p-3 sm:p-4 shadow-[12px_12px_0_rgba(0,0,0,0.5)]">
                {/* Inner border - parchment */}
                <div className="border-2 sm:border-[4px] border-[hsl(var(--parchment-border))] bg-parchment p-0">
                    {/* Header */}
                    <div className="bg-[hsl(var(--retro-red))] border-b-2 sm:border-b-[4px] border-[hsl(var(--parchment-border))] px-4 sm:px-6 py-3 sm:py-4 relative">
                        {/* Corner decorations */}
                        <div className="absolute top-2 left-2 w-3 h-3 sm:w-5 sm:h-5 bg-[hsl(var(--parchment))] border border-[hsl(var(--parchment-border))]" />
                        <div className="absolute top-2 right-2 w-3 h-3 sm:w-5 sm:h-5 bg-[hsl(var(--parchment))] border border-[hsl(var(--parchment-border))]" />

                        <h2 className="pixel-font text-center text-[12px] sm:text-[16px] md:text-[20px] tracking-[0.3em] font-bold text-[hsl(var(--studio-dark))] drop-shadow-sm">
                            TRAINER CARD
                        </h2>
                    </div>

                    {/* Main content */}
                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="grid grid-cols-[auto_1fr] gap-4 sm:gap-6 md:gap-8">
                            {/* Character image */}
                            <div className="flex items-start">
                                {characterImage ? (
                                    <div className="w-28 h-32 sm:w-36 sm:h-44 md:w-44 md:h-52 border-2 sm:border-4 border-[hsl(var(--parchment-border))] bg-white/50 flex items-center justify-center pixel-crisp overflow-hidden shadow-inner">
                                        <img
                                            src={characterImage}
                                            alt={characterName || "Character"}
                                            className="w-full h-full object-contain pixel-crisp scale-110"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-28 h-32 sm:w-36 sm:h-44 md:w-44 md:h-52 border-2 sm:border-4 border-[hsl(var(--parchment-border))] bg-white/50 flex items-center justify-center shadow-inner">
                                        <span className="text-5xl sm:text-6xl md:text-7xl">🎮</span>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-[hsl(var(--parchment-border))] py-1">
                                {/* Name */}
                                <div className="flex items-start gap-2.5">
                                    <span className="text-base sm:text-lg md:text-xl transform -translate-y-1">👤</span>
                                    <div className="flex-1">
                                        <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-wide font-bold uppercase mb-0.5 opacity-60">Name:</p>
                                        <p className="pixel-font text-[10px] sm:text-[12px] md:text-[15px] tracking-widest text-black font-bold">
                                            {userName}
                                        </p>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex items-start gap-2.5">
                                    <span className="text-base sm:text-lg md:text-xl transform -translate-y-1">🏆</span>
                                    <div className="flex-1">
                                        <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-wide font-bold uppercase mb-0.5 opacity-60">Badges:</p>
                                        <p className="pixel-font text-[10px] sm:text-[12px] md:text-[15px] tracking-widest text-black font-bold">
                                            0
                                        </p>
                                    </div>
                                </div>

                                {/* Level/Score */}
                                <div className="flex items-start gap-2.5">
                                    <span className="text-base sm:text-lg md:text-xl transform -translate-y-1">💎</span>
                                    <div className="flex-1">
                                        <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-wide font-bold uppercase mb-0.5 opacity-60">Level:</p>
                                        <p className="pixel-font text-[10px] sm:text-[12px] md:text-[15px] tracking-widest text-black font-bold">
                                            1 / ???
                                        </p>
                                    </div>
                                </div>

                                {/* Character Type */}
                                <div className="flex items-start gap-2.5">
                                    <span className="text-base sm:text-lg md:text-xl transform -translate-y-1">💻</span>
                                    <div className="flex-1">
                                        <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-wide font-bold uppercase mb-0.5 opacity-60">Type:</p>
                                        <p className="pixel-font text-[10px] sm:text-[12px] md:text-[15px] tracking-widest text-[hsl(var(--retro-red-dark))] font-bold">
                                            {characterName || "UNKNOWN"}
                                        </p>
                                    </div>
                                </div>

                                {/* Hobby/Status */}
                                <div className="flex items-start gap-2.5">
                                    <span className="text-base sm:text-lg md:text-xl transform -translate-y-1">💪</span>
                                    <div className="flex-1">
                                        <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-wide font-bold uppercase mb-0.5 opacity-60">Status:</p>
                                        <p className="pixel-font text-[10px] sm:text-[12px] md:text-[15px] tracking-widest text-black font-bold">
                                            Active Player
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Motto section */}
                        <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-5 border-t-2 sm:border-t-4 border-[hsl(var(--parchment-border))] relative">
                            {/* Corner decorations */}
                            <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-5 sm:h-5 bg-[hsl(var(--retro-red))] border border-[hsl(var(--parchment-border))]" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-5 sm:h-5 bg-[hsl(var(--retro-red))] border border-[hsl(var(--parchment-border))]" />

                            <div className="flex items-center gap-3 px-3 sm:px-4 bg-white/10 rounded-lg py-2">
                                <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0 animate-pulse">⚡</span>
                                <p className="pixel-font text-[8px] sm:text-[10px] md:text-[12px] tracking-wider text-[hsl(var(--parchment-border))] leading-relaxed flex-1 italic font-bold">
                                    "Play hard, code harder"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
