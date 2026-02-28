
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProfileCardProps {
    className?: string;
    characterId?: string;
    characterImage?: string;
    characterName?: string;
    bondCode?: string | null;
}

const ProfileCard = ({ characterId, characterImage, characterName, bondCode }: ProfileCardProps) => {
    const [userName, setUserName] = useState("PLAYER");
    const [userEmail, setUserEmail] = useState("");
    const [joinDate, setJoinDate] = useState("FEB 2024");

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

                    // Format join date
                    if (user.created_at) {
                        const date = new Date(user.created_at);
                        const formatted = date.toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                        }).toUpperCase();
                        setJoinDate(formatted);
                    }
                }
            } catch (error) {
                console.warn("Failed to load user data:", error);
            }
        };

        loadUserData();
    }, []);

    return (
        <div className="relative w-full max-w-lg transform hover:scale-105 transition-transform duration-300">
            {/* Outer border - Crimson Red */}
            <div className="border-4 sm:border-[8px] border-[hsl(var(--blood-red))] bg-[hsl(var(--blood-red))] p-3 sm:p-4 shadow-[12px_12px_0_rgba(0,0,0,0.5)]">
                {/* Inner border - Dark Charcoal */}
                <div className="border-2 sm:border-[4px] border-[hsl(var(--parchment-border))] bg-[#121214] p-0">
                    {/* Header */}
                    <div className="bg-[hsl(var(--blood-red))] border-b-2 sm:border-b-[4px] border-[hsl(var(--parchment-border))] px-4 sm:px-6 py-3 sm:py-4 relative">
                        {/* Corner decorations */}
                        <div className="absolute top-2 left-2 w-3 h-3 sm:w-5 sm:h-5 bg-white/20 border border-white/10" />
                        <div className="absolute top-2 right-2 w-3 h-3 sm:w-5 sm:h-5 bg-white/20 border border-white/10" />

                        <h2 className="pixel-font text-center text-[12px] sm:text-[16px] md:text-[20px] tracking-[0.3em] font-bold text-white drop-shadow-sm">
                            ARTIST CARD
                        </h2>
                    </div>

                    {/* Main content */}
                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="grid grid-cols-[auto_1fr] gap-4 sm:gap-6 md:gap-8">
                            {/* Character image */}
                            <div className="flex items-start">
                                {characterImage ? (
                                    <div className="w-28 h-32 sm:w-36 sm:h-44 md:w-44 md:h-52 border-2 sm:border-4 border-white/10 bg-black/40 flex items-center justify-center pixel-crisp overflow-hidden shadow-inner">
                                        <img
                                            src={characterImage}
                                            alt={characterName || "Character"}
                                            className="w-full h-full object-contain pixel-crisp scale-110"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-28 h-32 sm:w-36 sm:h-44 md:w-44 md:h-52 border-2 sm:border-4 border-white/10 bg-black/40 flex items-center justify-center shadow-inner">
                                        <span className="text-5xl sm:text-6xl md:text-7xl">🎮</span>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-white/90 py-1">
                                {/* Name */}
                                <div className="flex items-start gap-2.5">
                                    <span className="text-base sm:text-lg md:text-xl transform -translate-y-1">👤</span>
                                    <div className="flex-1">
                                        <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-wide font-bold uppercase mb-0.5 opacity-40 text-white">Name:</p>
                                        <p className="pixel-font text-[10px] sm:text-[12px] md:text-[15px] tracking-widest text-white font-bold">
                                            {userName}
                                        </p>
                                        {bondCode && (
                                            <p className="font-mono text-xs text-[hsl(var(--blood-red))] tracking-wider mt-1 font-bold">
                                                BOND: {bondCode}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex items-start gap-2.5">
                                    <span className="text-base sm:text-lg md:text-xl transform -translate-y-1">🏆</span>
                                    <div className="flex-1">
                                        <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-wide font-bold uppercase mb-0.5 opacity-40 text-white">Badges:</p>
                                        <p className="pixel-font text-[10px] sm:text-[12px] md:text-[15px] tracking-widest text-white font-bold">
                                            0
                                        </p>
                                    </div>
                                </div>

                                {/* Level/Score */}
                                <div className="flex items-start gap-2.5">
                                    <span className="text-base sm:text-lg md:text-xl transform -translate-y-1">💎</span>
                                    <div className="flex-1">
                                        <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-wide font-bold uppercase mb-0.5 opacity-40 text-white">Level:</p>
                                        <p className="pixel-font text-[10px] sm:text-[12px] md:text-[15px] tracking-widest text-white font-bold">
                                            1 / ???
                                        </p>
                                    </div>
                                </div>

                                {/* Character Type */}
                                <div className="flex items-start gap-2.5">
                                    <span className="text-base sm:text-lg md:text-xl transform -translate-y-1">💻</span>
                                    <div className="flex-1">
                                        <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-wide font-bold uppercase mb-0.5 opacity-40 text-white">Type:</p>
                                        <p className="pixel-font text-[10px] sm:text-[12px] md:text-[15px] tracking-widest text-[hsl(var(--blood-red))] font-bold brightness-125">
                                            {characterName || "UNKNOWN"}
                                        </p>
                                    </div>
                                </div>

                                {/* Hobby/Status */}
                                <div className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-wide font-bold uppercase mb-0.5 opacity-40 text-white">Status:</p>
                                        <p className="pixel-font text-[10px] sm:text-[12px] md:text-[15px] tracking-widest text-white font-bold">
                                            Active
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Join Date section (Replaced Motto) */}
                        <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-5 border-t-2 sm:border-t-[4px] border-white/10 relative">
                            {/* Corner decorations */}
                            <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-5 sm:h-5 bg-[hsl(var(--blood-red))] border border-white/20" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-5 sm:h-5 bg-[hsl(var(--blood-red))] border border-white/20" />

                            <div className="flex items-center justify-between px-3 sm:px-4 bg-white/5 rounded-lg py-2.5">
                                <span className="pixel-font text-[8px] sm:text-[10px] text-white/40 uppercase tracking-widest">Studio Joined:</span>
                                <p className="pixel-font text-[9px] sm:text-[11px] md:text-[13px] tracking-widest text-white font-bold">
                                    {joinDate}
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
