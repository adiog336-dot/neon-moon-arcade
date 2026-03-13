import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Camera, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

// Characters imported from Dashboard – mirrored here so modal is self-contained
import fireGif from "@/assets/fire.gif";
import peaceGif from "@/assets/peace.gif";
import umbrellaGif from "@/assets/umbrella.gif";

const characters = [
    {
        id: "fire",
        name: "NEON_IGNITER",
        description: "Sets the skyline ablaze with crimson riffs. Ideal for high-energy sessions.",
        image: fireGif,
    },
    {
        id: "peace",
        name: "MIDNIGHT_TRUCE",
        description: "Keeps the noise floor calm while the moonlight does the talking.",
        image: peaceGif,
    },
    {
        id: "umbrella",
        name: "RAINWALKER",
        description: "Moves between neon puddles and broken streetlights. Perfect for rainy takes.",
        image: umbrellaGif,
    },
];

interface ProfileEditorModalProps {
    open: boolean;
    onClose: () => void;
    currentCharacterId: string | null;
    currentAvatarUrl: string;
    onSaved: (characterId: string, avatarUrl: string) => void;
}

const ProfileEditorModal = ({
    open,
    onClose,
    currentCharacterId,
    currentAvatarUrl,
    onSaved,
}: ProfileEditorModalProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
    const [avatarInput, setAvatarInput] = useState(currentAvatarUrl);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync selections when modal is opened / props change
    useEffect(() => {
        if (open) {
            const idx = characters.findIndex((c) => c.id === currentCharacterId);
            setActiveIndex(idx !== -1 ? idx : 0);
            setAvatarUrl(currentAvatarUrl);
            setAvatarInput(currentAvatarUrl);
            setSaved(false);
        }
    }, [open, currentCharacterId, currentAvatarUrl]);

    if (!open) return null;

    const activeCharacter = characters[activeIndex];

    const handlePrev = () => setActiveIndex((p) => (p - 1 + characters.length) % characters.length);
    const handleNext = () => setActiveIndex((p) => (p + 1) % characters.length);

    const handleAvatarInputChange = (val: string) => {
        setAvatarInput(val);
        setAvatarUrl(val);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            setAvatarUrl(result);
            setAvatarInput(result.startsWith("data:") ? "(uploaded image)" : result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const chosenId = activeCharacter.id;

            // localStorage fallback
            window.localStorage.setItem("nm-character-fallback", chosenId);
            if (avatarUrl && !avatarUrl.startsWith("data:")) {
                window.localStorage.setItem("nm-avatar-url", avatarUrl);
            }

            if (supabase) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    window.localStorage.setItem(`nm-character-${user.id}`, chosenId);
                    const updatePayload: Record<string, string> = {
                        id: user.id,
                        character_id: chosenId,
                    };
                    // Only store URL-based avatars in DB (not data URIs)
                    if (avatarUrl && !avatarUrl.startsWith("data:")) {
                        updatePayload.avatar_url = avatarUrl;
                        window.localStorage.setItem(`nm-avatar-${user.id}`, avatarUrl);
                    }
                    await supabase.from("profiles").upsert(updatePayload, { onConflict: "id" });
                }
            }

            onSaved(chosenId, avatarUrl);
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onClose();
            }, 800);
        } catch (err) {
            console.error("Failed to save profile:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            {/* Modal container */}
            <div
                className="relative w-full max-w-2xl bg-[#0a0a0c] border-2 border-[hsl(var(--blood-red))] shadow-[0_0_60px_rgba(220,38,38,0.3)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
                style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
                {/* Scanline overlay */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-10 z-0"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 3px)",
                    }}
                />

                {/* Header */}
                <div className="relative flex items-center justify-between bg-[hsl(var(--blood-red))] px-6 py-4 border-b-2 border-black">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 bg-white/40 border border-white/20 block" />
                        <h2 className="pixel-font text-[13px] tracking-[0.25em] font-bold text-white uppercase">
                            Artist Card Editor
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative z-10 p-6 space-y-8">
                    {/* ──────────── SECTION 1: Character Selection ──────────── */}
                    <div>
                        <p className="pixel-font text-[9px] tracking-[0.25em] text-white/40 uppercase mb-4">
                            01 · SELECT CHARACTER
                        </p>

                        <div className="flex gap-4 items-start">
                            {/* Character preview */}
                            <div className="relative flex-shrink-0">
                                <div className="w-32 h-40 border-2 border-white/20 bg-black/60 flex items-center justify-center overflow-hidden shadow-inner">
                                    <img
                                        src={activeCharacter.image}
                                        alt={activeCharacter.name}
                                        className="w-full h-full object-contain scale-110"
                                        style={{ imageRendering: "pixelated" }}
                                    />
                                </div>
                                {/* Nav arrows */}
                                <div className="flex justify-between mt-2 gap-2">
                                    <button
                                        onClick={handlePrev}
                                        className="flex-1 flex items-center justify-center py-1.5 border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-white/60" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="flex-1 flex items-center justify-center py-1.5 border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4 text-white/60" />
                                    </button>
                                </div>
                            </div>

                            {/* Character info */}
                            <div className="flex-1 pt-1">
                                <p className="pixel-font text-[hsl(var(--blood-red))] text-[11px] tracking-widest font-bold mb-2">
                                    {activeCharacter.name}
                                </p>
                                <p className="text-[11px] font-mono text-white/60 leading-relaxed mb-4">
                                    {activeCharacter.description}
                                </p>

                                {/* Character selector dots */}
                                <div className="flex gap-2">
                                    {characters.map((c, i) => (
                                        <button
                                            key={c.id}
                                            onClick={() => setActiveIndex(i)}
                                            className={`w-6 h-6 border transition-all text-[8px] pixel-font font-bold ${i === activeIndex
                                                ? "bg-[hsl(var(--blood-red))] border-[hsl(var(--blood-red))] text-white"
                                                : "bg-white/5 border-white/20 text-white/40 hover:border-white/40"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/10" />

                    {/* ──────────── SECTION 2: Profile Icon ──────────── */}
                    <div>
                        <p className="pixel-font text-[9px] tracking-[0.25em] text-white/40 uppercase mb-4">
                            02 · PROFILE ICON
                        </p>

                        <div className="flex gap-4 items-center">
                            {/* Avatar preview */}
                            <div className="relative flex-shrink-0 group">
                                <Avatar className="w-20 h-20 border-2 border-white/20">
                                    <AvatarImage src={avatarUrl} className="object-cover" />
                                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl pixel-font">
                                        ?
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white/20 rounded-full"
                                >
                                    <Camera className="w-5 h-5 text-white" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* URL input */}
                            <div className="flex-1 space-y-2">
                                <p className="text-[11px] font-mono text-white/50">
                                    Paste an image URL or upload a file
                                </p>
                                <div className="flex gap-2">
                                    <Input
                                        value={avatarInput.startsWith("data:") ? "" : avatarInput}
                                        onChange={(e) => handleAvatarInputChange(e.target.value)}
                                        placeholder="https://example.com/avatar.png"
                                        className="h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary/50 font-mono text-xs"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 text-xs px-3"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ──────────── SAVE ──────────── */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-white/50 hover:text-white hover:bg-white/10 pixel-font text-[10px] tracking-wider"
                        >
                            Cancel
                        </Button>
                        <button
                            onClick={handleSave}
                            disabled={saving || saved}
                            className="bg-[hsl(var(--blood-red))] text-white pixel-font text-[10px] tracking-[0.2em] px-6 py-2 border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-none transition disabled:opacity-70 flex items-center gap-2"
                        >
                            {saving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : saved ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : null}
                            {saved ? "SAVED!" : "SAVE_CHANGES"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditorModal;
