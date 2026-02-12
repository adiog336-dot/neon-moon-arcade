import { useState, useEffect } from "react";
import PixelImage from "@/components/PixelImage";
import fireGif from "@/assets/fire.gif";
import peaceGif from "@/assets/peace.gif";
import umbrellaGif from "@/assets/umbrella.gif";
import raniGif from "@/assets/rani.gif";
import { supabase } from "@/lib/supabase";
import { Moon } from "lucide-react";

const characters = [
    {
        id: "fire",
        name: "NEON_IGNITER",
        description: "Sets the skyline ablaze with crimson riffs. Ideal for high-energy sessions and boss fights.",
        image: fireGif,
        role: "BURNER",
        origin: "FIREWALL_BACKSTREETS",
        tempo: "OVERCLOCK_140BPM",
    },
    {
        id: "peace",
        name: "MIDNIGHT_TRUCE",
        description: "Keeps the noise floor calm while the moonlight does the talking. Built for lo-fi and late nights.",
        image: peaceGif,
        role: "MEDIATOR",
        origin: "QUIET_ZONE_AISLE_3",
        tempo: "DREAMWAVE_90BPM",
    },
    {
        id: "umbrella",
        name: "RAINWALKER",
        description: "Moves between neon puddles and broken streetlights. Perfect companion for rainy takes.",
        image: umbrellaGif,
        role: "DRIFTER",
        origin: "RAINY_BUS_STOP_07",
        tempo: "DRIZZLE_110BPM",
    },
];

const Dashboard = () => {
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const activeCharacter = characters[activeIndex];

    // Load previously selected character for this user (by Supabase user id),
    // with a localStorage fallback so the choice sticks for the same account.
    useEffect(() => {
        let isMounted = true;

        const loadCharacter = async () => {
            try {
                // Fallback key if we can't get a user
                const fallbackKey = "nm-character-fallback";

                if (!supabase) {
                    const stored = window.localStorage.getItem(fallbackKey);
                    if (stored) {
                        const idx = characters.findIndex((c) => c.id === stored);
                        if (idx !== -1 && isMounted) {
                            setSelectedCharacter(stored);
                            setActiveIndex(idx);
                        }
                    }
                    return;
                }

                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    const stored = window.localStorage.getItem(fallbackKey);
                    if (stored) {
                        const idx = characters.findIndex((c) => c.id === stored);
                        if (idx !== -1 && isMounted) {
                            setSelectedCharacter(stored);
                            setActiveIndex(idx);
                        }
                    }
                    return;
                }

                const localKey = `nm-character-${user.id}`;

                // Try Supabase profiles table first
                try {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("character_id")
                        .eq("id", user.id)
                        .single();

                    let characterId = data?.character_id as string | null | undefined;

                    if (!characterId) {
                        // Fallback to localStorage per user
                        characterId = window.localStorage.getItem(localKey) || null;
                    }

                    if (characterId) {
                        const idx = characters.findIndex((c) => c.id === characterId);
                        if (idx !== -1 && isMounted) {
                            setSelectedCharacter(characterId);
                            setActiveIndex(idx);
                        }
                    }
                } catch (profileError) {
                    // If profiles table doesn't exist or any other error occurs,
                    // gracefully fall back to localStorage.
                    console.warn("Profile load error:", profileError);
                    const stored = window.localStorage.getItem(localKey);
                    if (stored) {
                        const idx = characters.findIndex((c) => c.id === stored);
                        if (idx !== -1 && isMounted) {
                            setSelectedCharacter(stored);
                            setActiveIndex(idx);
                        }
                    }
                }
            } finally {
                if (isMounted) {
                    setLoadingProfile(false);
                }
            }
        };

        loadCharacter();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % characters.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + characters.length) % characters.length);
    };

    const handleConfirmSelection = async () => {
        const chosenId = activeCharacter.id;
        setSelectedCharacter(chosenId);

        // Always keep a simple fallback
        window.localStorage.setItem("nm-character-fallback", chosenId);

        if (!supabase) {
            return;
        }

        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                return;
            }

            const localKey = `nm-character-${user.id}`;
            window.localStorage.setItem(localKey, chosenId);

            // Persist in Supabase profiles table (id matches auth user id)
            await supabase
                .from("profiles")
                .upsert(
                    { id: user.id, character_id: chosenId },
                    { onConflict: "id" },
                );
        } catch (error) {
            console.warn("Failed to persist character selection:", error);
        }
    };

    return (
        <div className="relative min-h-screen bg-[hsl(var(--studio-dark))] text-white">
            {/* Character selection overlay shown right after auth */}
            {!loadingProfile && !selectedCharacter && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md">
                    <div className="dashboard-container max-w-4xl">
                        <div className="relative bg-[hsl(var(--studio-dark))] border-4 border-[hsl(var(--retro-red))] shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_60px_rgba(220,38,38,0.4)] px-4 sm:px-8 py-6 sm:py-8 overflow-hidden">
                            {/* Scanline / glow overlay */}
                            <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
                                 style={{
                                     backgroundImage:
                                        "repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 3px)"
                                 }}
                            />

                            {/* Top status bar */}
                            <div className="relative flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 bg-[hsl(var(--retro-red))] shadow-[0_0_8px_rgba(248,113,113,0.9)]" />
                                    <p className="pixel-font text-[9px] tracking-[0.25em] text-white/80">
                                        PROFILE_INIT :: CHARACTER_SELECT
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-mono text-white/60">
                                    <span>PLAYER_01</span>
                                    <span className="h-3 w-[1px] bg-white/20" />
                                    <span>INSERT_CARD ▌</span>
                                </div>
                            </div>

                            {/* Main layout: side preview + info */}
                            <div className="relative grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 sm:gap-8 items-center">
                                {/* Character preview area */}
                                <div className="relative flex flex-col items-center">
                                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 border-4 border-white/40 bg-black/80 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                                        <PixelImage
                                            src={activeCharacter.image}
                                            alt={activeCharacter.name}
                                            glowIntensity="soft"
                                            animationSpeed="slow"
                                            className="w-full h-full"
                                        />

                                        {/* Bottom name plate */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 border-t border-white/20 px-3 py-1.5 flex items-center justify-between">
                                            <span className="pixel-font text-[9px] text-[hsl(var(--retro-red))] tracking-[0.2em]">
                                                {activeCharacter.name}
                                            </span>
                                            <span className="text-[9px] font-mono text-white/60">
                                                LVL_01
                                            </span>
                                        </div>
                                    </div>

                                    {/* Navigation hints */}
                                    <div className="mt-4 flex items-center gap-4 text-[9px] font-mono text-white/60">
                                        <button
                                            type="button"
                                            onClick={handlePrev}
                                            className="px-2 py-1 border border-white/40 bg-white/5 pixel-font text-[9px] hover:bg-white/15 active:translate-y-[1px] transition"
                                        >
                                            ◀ PREV
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="px-2 py-1 border border-white/40 bg-white/5 pixel-font text-[9px] hover:bg-white/15 active:translate-y-[1px] transition"
                                        >
                                            NEXT ▶
                                        </button>
                                    </div>
                                </div>

                                {/* Right-hand character info panel */}
                                <div className="relative bg-parchment text-parchment-dark border-2 border-black shadow-[6px_6px_0_rgba(0,0,0,1)] px-4 py-4 sm:px-5 sm:py-5">
                                    <p className="pixel-font text-[10px] tracking-[0.25em] mb-3">
                                        CHARACTER_INFO
                                    </p>

                                    <p className="text-[9px] font-mono leading-relaxed mb-4">
                                        {activeCharacter.description}
                                    </p>

                                    <div className="space-y-2 text-[9px] font-mono">
                                        <p>
                                            ROLE: <span className="font-bold">{activeCharacter.role}</span>
                                        </p>
                                        <p>
                                            ORIGIN: <span className="font-bold">{activeCharacter.origin}</span>
                                        </p>
                                        <p>
                                            TEMPO: <span className="font-bold">{activeCharacter.tempo}</span>
                                        </p>
                                    </div>

                                    <p className="mt-4 text-[8px] font-mono text-parchment-dark/80 text-right">
                                        USE ◀ / ▶ TO BROWSE AVATARS
                                    </p>
                                </div>
                            </div>

                            {/* Confirm button outside of the info box */}
                            <div className="relative mt-5 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleConfirmSelection}
                                    className="bg-[hsl(var(--retro-red))] text-white pixel-font text-[11px] px-6 py-2 border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-none transition"
                                >
                                    CONFIRM_SELECTION
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="relative">
                {/* HERO SECTION with custom GIF background (no navbar, no console panel) */}
                <section className="relative sticky top-0 h-[70vh] flex flex-col items-center justify-center overflow-hidden px-0 z-0">
                    {/* Rani GIF background */}
                    <div className="absolute inset-0 -z-10">
                        <img
                            src={raniGif}
                            alt="Hero background"
                            className="w-full h-full object-cover object-bottom"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Decorative Studio Elements (kept for vibe) */}
                    <div className="absolute top-[20%] left-[10%] opacity-20 hidden lg:block">
                        <div className="w-32 h-48 bg-zinc-800 border-4 border-zinc-700 rounded-lg shadow-2xl flex flex-col items-center p-4">
                            <div className="w-20 h-20 rounded-full border-4 border-zinc-600 mb-4" />
                            <div className="w-16 h-1 bg-zinc-600 rounded mb-2" />
                            <div className="w-16 h-1 bg-zinc-600 rounded" />
                        </div>
                    </div>
                    <div className="absolute top-[20%] right-[10%] opacity-20 hidden lg:block">
                        <div className="w-32 h-48 bg-zinc-800 border-4 border-zinc-700 rounded-lg shadow-2xl flex flex-col items-center p-4">
                            <div className="w-20 h-20 rounded-full border-4 border-zinc-600 mb-4" />
                            <div className="w-16 h-1 bg-zinc-600 rounded mb-2" />
                            <div className="w-16 h-1 bg-zinc-600 rounded" />
                        </div>
                    </div>

                    {/* Moon accent */}
                    <div className="absolute top-32 left-[15%] text-yellow-200/40">
                        <Moon className="w-16 h-16 fill-current blur-[2px]" />
                    </div>
                </section>

                {/* SLIDE 1: CONTENT AREA WRAPPER - connects to hero with wavy parchment border */}
                <div className="relative z-10 -mt-16 shadow-[0_-15px_60px_rgba(0,0,0,0.8)]">
                    {/* WAVY TRANSITION DIVIDER (continues the curvy parchment edge) */}
                    <div className="wavy-transition" />

                    {/* SLIDE 1 (Parchment) - background only, ready for content */}
                    <section className="bg-parchment pt-16 pb-24 px-4 min-h-screen -mt-1">
                        <div className="dashboard-container" />
                    </section>
                </div>

                {/* SLIDE 2 */}
                <div className="relative z-10 shadow-[0_-15px_60px_rgba(0,0,0,0.8)]">
                    <div className="wavy-transition wavy-transition--navy" />
                    <section className="pt-16 pb-24 px-4 min-h-screen -mt-1 bg-[#3E4462]">
                        <div className="dashboard-container" />
                    </section>
                </div>

                {/* SLIDE 3 */}
                <div className="relative z-10 shadow-[0_-15px_60px_rgba(0,0,0,0.8)]">
                    <div className="wavy-transition wavy-transition--teal" />
                    <section className="pt-16 pb-24 px-4 min-h-screen -mt-1 bg-[#59AC99]">
                        <div className="dashboard-container" />
                    </section>
                </div>
            </main>

        </div>
    );
};

export default Dashboard;
