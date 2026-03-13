
import React, { useState, useEffect, useRef } from "react";
import {
    Plus,
    MoreVertical,
    ArrowLeft,
    Play,
    Trash2,
    Users,
    Lock,
    Edit2,
    Music,
    User as UserIcon,
    Calendar,
    Globe,
    Loader2,
    AlertCircle,
    X,
    Youtube,
    FolderOpen,
    ChevronDown,
    ChevronUp,
    Disc3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// ── TypeScript Types (aligned to Supabase schema) ────────────────────────────

interface SupabaseAlbum {
    id: string;
    name: string;
    created_by: string;
    is_collaborative: boolean;
    created_at: string;
}

interface SupabaseTrack {
    id: string;
    album_id: string;
    title: string;
    type: "local" | "youtube";
    file_name: string | null;
    file_url: string | null;
    yt_url: string | null;
    yt_embed_url: string | null;
    added_by: string | null;
    duration: string | null;
    created_at: string;
}

interface Album {
    id: string;
    name: string;
    trackCount: number;
    lastUpdated: string;
    isCollaborative: boolean;
    coverColor: string;
    createdDate: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const COVER_GRADIENTS = [
    "bg-gradient-to-br from-purple-600 to-blue-900",
    "bg-gradient-to-br from-red-600 to-amber-900",
    "bg-gradient-to-br from-zinc-700 to-zinc-950",
    "bg-gradient-to-br from-emerald-700 to-teal-900",
    "bg-gradient-to-br from-pink-600 to-fuchsia-900",
    "bg-gradient-to-br from-sky-600 to-indigo-900",
    "bg-gradient-to-br from-orange-600 to-red-900",
];

function pickGradient(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return COVER_GRADIENTS[Math.abs(hash) % COVER_GRADIENTS.length];
}

function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch { return "—"; }
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return days === 1 ? "Yesterday" : `${days} days ago`;
}

function toAlbum(row: SupabaseAlbum, trackCount = 0): Album {
    return {
        id: row.id,
        name: row.name,
        trackCount,
        lastUpdated: timeAgo(row.created_at),
        isCollaborative: row.is_collaborative,
        coverColor: pickGradient(row.id),
        createdDate: formatDate(row.created_at),
    };
}

/** Convert any YouTube URL to a safe embed URL. Returns null if not a valid YT link. */
function toYouTubeEmbed(url: string): string | null {
    try {
        const u = new URL(url.trim());
        let videoId: string | null = null;

        if (u.hostname === "youtu.be") {
            videoId = u.pathname.slice(1);
        } else if (u.hostname.includes("youtube.com") || u.hostname.includes("music.youtube.com")) {
            videoId = u.searchParams.get("v");
            // Handle /embed/ and /shorts/ too
            if (!videoId) {
                const parts = u.pathname.split("/");
                const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
                if (idx !== -1) videoId = parts[idx + 1];
            }
        }
        if (!videoId) return null;
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    } catch {
        return null;
    }
}

// ── Create Album Modal ───────────────────────────────────────────────────────

const CreateAlbumModal = ({
    onClose,
    onCreate,
    creating,
}: {
    onClose: () => void;
    onCreate: (name: string) => Promise<void>;
    creating: boolean;
}) => {
    const [name, setName] = useState("");
    const [err, setErr] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) { setErr("Album name cannot be empty."); return; }
        setErr("");
        await onCreate(trimmed);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[#111113] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-[0_0_60px_rgba(220,38,38,0.15)] animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Disc3 className="w-5 h-5 text-[hsl(var(--blood-red))]" />
                        <h3 className="pixel-font text-sm font-bold text-white tracking-widest">NEW ALBUM</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] pixel-font text-gray-500 uppercase tracking-widest mb-2">
                            Album Name
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Midnight Drift"
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[hsl(var(--blood-red))]/60 transition-colors"
                        />
                        {err && (
                            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {err}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={creating}
                        className="w-full bg-[hsl(var(--blood-red))] hover:bg-[hsl(var(--blood-red))]/80 text-white h-12 rounded-xl pixel-font text-xs tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50"
                    >
                        {creating
                            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> CREATING…</>
                            : <><Plus className="w-4 h-4 mr-2" /> CREATE ALBUM</>
                        }
                    </Button>
                </form>
            </div>
        </div>
    );
};

// ── Add Track Modal ───────────────────────────────────────────────────────────

interface YtEntry { url: string; title: string; }

/** Pretty-print a Supabase / Postgres RLS error into a human-readable hint */
function friendlyError(e: unknown): string {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("row-level security") || msg.includes("violates"))
        return "Permission denied by Supabase RLS. Run the RLS policy SQL in your Supabase SQL editor, then retry.";
    if (msg.includes("Bucket not found") || msg.includes("storage/bucket-not-found"))
        return 'Storage bucket "tracks" not found. Create a PUBLIC bucket named "tracks" in Supabase Dashboard → Storage.';
    if (msg.includes("JWT") || msg.includes("not authenticated"))
        return "You are not logged in. Please log in and try again.";
    return msg || "Unknown error.";
}

const AddTrackModal = ({
    albumId,
    onClose,
    onAdded,
}: {
    albumId: string;
    onClose: () => void;
    onAdded: (tracks: SupabaseTrack[]) => void;
}) => {
    const [tab, setTab] = useState<"youtube" | "local">("youtube");

    // ── YouTube state ─────────────────────────────────────────────────────────
    const [ytEntries, setYtEntries] = useState<YtEntry[]>([{ url: "", title: "" }]);
    const [ytErr, setYtErr] = useState("");
    const [ytSaving, setYtSaving] = useState(false);

    const addYtRow = () => setYtEntries((p) => [...p, { url: "", title: "" }]);
    const removeYtRow = (i: number) => setYtEntries((p) => p.filter((_, idx) => idx !== i));
    const updateYtRow = (i: number, field: keyof YtEntry, val: string) =>
        setYtEntries((p) => p.map((e, idx) => idx === i ? { ...e, [field]: val } : e));

    const validYtCount = ytEntries.filter((e) => toYouTubeEmbed(e.url.trim())).length;

    const saveYouTube = async () => {
        if (validYtCount === 0) { setYtErr("Add at least one valid YouTube URL."); return; }
        setYtErr(""); setYtSaving(true);
        try {
            if (!supabase) throw new Error("Supabase not initialised.");
            const { data: { user } } = await supabase.auth.getUser();
            const rows = ytEntries
                .filter((e) => toYouTubeEmbed(e.url.trim()))
                .map((e) => ({
                    album_id: albumId,
                    title: e.title.trim() || "Untitled Track",
                    type: "youtube" as const,
                    yt_url: e.url.trim(),
                    yt_embed_url: toYouTubeEmbed(e.url.trim())!,
                    added_by: user?.id ?? null,
                }));
            const { data, error } = await supabase.from("tracks").insert(rows).select();
            if (error) throw error;
            onAdded(data as SupabaseTrack[]);
            onClose();
        } catch (e) {
            console.error("saveYouTube:", e);
            setYtErr(friendlyError(e));
        } finally { setYtSaving(false); }
    };

    // ── Local file state ──────────────────────────────────────────────────────
    const [localFiles, setLocalFiles] = useState<File[]>([]);
    const [localErr, setLocalErr] = useState("");
    const [localSaving, setLocalSaving] = useState(false);
    const [localProgress, setLocalProgress] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFiles(Array.from(e.target.files ?? [])); setLocalErr("");
    };
    const removeLocalFile = (i: number) => setLocalFiles((p) => p.filter((_, idx) => idx !== i));

    const saveLocal = async () => {
        if (localFiles.length === 0) { setLocalErr("Select at least one audio file."); return; }
        setLocalErr(""); setLocalSaving(true);
        const saved: SupabaseTrack[] = [];
        try {
            if (!supabase) throw new Error("Supabase not initialised.");
            const { data: { user } } = await supabase.auth.getUser();
            for (let i = 0; i < localFiles.length; i++) {
                const file = localFiles[i];
                setLocalProgress(`Uploading ${i + 1} / ${localFiles.length}: ${file.name}`);
                const path = `${user?.id ?? "anon"}/${albumId}/${Date.now()}_${file.name}`;
                const { error: uploadErr } = await supabase.storage
                    .from("tracks").upload(path, file, { upsert: false });
                if (uploadErr) throw uploadErr;
                const { data: pub } = supabase.storage.from("tracks").getPublicUrl(path);
                const { data, error } = await supabase.from("tracks").insert({
                    album_id: albumId,
                    title: file.name.replace(/\.[^.]+$/, ""),
                    type: "local",
                    file_name: file.name,
                    file_url: pub.publicUrl,
                    added_by: user?.id ?? null,
                }).select().single();
                if (error) throw error;
                saved.push(data as SupabaseTrack);
            }
            onAdded(saved);
            onClose();
        } catch (e) {
            console.error("saveLocal:", e);
            setLocalErr(friendlyError(e));
        } finally { setLocalSaving(false); setLocalProgress(""); }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[#111113] border border-white/10 rounded-2xl p-8 w-full max-w-xl shadow-[0_0_60px_rgba(220,38,38,0.12)] animate-fade-in max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Music className="w-5 h-5 text-[hsl(var(--blood-red))]" />
                        <h3 className="pixel-font text-sm font-bold text-white tracking-widest">ADD TRACKS</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-xl border border-white/5 flex-shrink-0">
                    {(["youtube", "local"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs pixel-font tracking-widest transition-all",
                                tab === t
                                    ? "bg-[hsl(var(--blood-red))] text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                                    : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {t === "youtube" ? <Youtube className="w-3.5 h-3.5" /> : <FolderOpen className="w-3.5 h-3.5" />}
                            {t === "youtube" ? "YOUTUBE" : "LOCAL FILES"}
                        </button>
                    ))}
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 space-y-3 pr-1">

                    {/* ── YouTube Tab ────────────────────────────────────────── */}
                    {tab === "youtube" && (
                        <>
                            <p className="text-[10px] pixel-font text-gray-500 uppercase tracking-widest mb-3">
                                Add one or more YouTube / YouTube Music URLs
                            </p>

                            {ytEntries.map((entry, i) => (
                                <div key={i} className="space-y-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] pixel-font text-gray-600 w-5 text-right flex-shrink-0">{i + 1}</span>
                                        <input
                                            type="url"
                                            value={entry.url}
                                            onChange={(e) => { updateYtRow(i, "url", e.target.value); setYtErr(""); }}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-[hsl(var(--blood-red))]/60 transition-colors"
                                        />
                                        {ytEntries.length > 1 && (
                                            <button onClick={() => removeYtRow(i)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="pl-7">
                                        <input
                                            type="text"
                                            value={entry.title}
                                            onChange={(e) => updateYtRow(i, "title", e.target.value)}
                                            placeholder='Track title (optional)'
                                            className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-[hsl(var(--blood-red))]/60 transition-colors"
                                        />
                                    </div>
                                    {entry.url && toYouTubeEmbed(entry.url) && (
                                        <div className="pl-7">
                                            <div className="rounded-lg overflow-hidden border border-white/10 bg-black aspect-video">
                                                <iframe
                                                    src={toYouTubeEmbed(entry.url)!}
                                                    className="w-full h-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {entry.url && !toYouTubeEmbed(entry.url) && (
                                        <p className="pl-7 text-[10px] text-amber-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Not a valid YouTube URL — will be skipped
                                        </p>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={addYtRow}
                                className="w-full border border-dashed border-white/15 hover:border-[hsl(var(--blood-red))]/40 rounded-xl py-3 text-xs pixel-font text-gray-600 hover:text-gray-300 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-3.5 h-3.5" /> ADD ANOTHER URL
                            </button>

                            {ytErr && (
                                <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs">{ytErr}</p>
                                </div>
                            )}

                            <Button
                                onClick={saveYouTube}
                                disabled={ytSaving || validYtCount === 0}
                                className="w-full bg-[hsl(var(--blood-red))] hover:bg-[hsl(var(--blood-red))]/80 text-white h-12 rounded-xl pixel-font text-xs tracking-widest disabled:opacity-50"
                            >
                                {ytSaving
                                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> SAVING…</>
                                    : <><Youtube className="w-4 h-4 mr-2" /> ADD {validYtCount > 0 ? validYtCount : ""} YOUTUBE TRACK{validYtCount !== 1 ? "S" : ""}</>
                                }
                            </Button>
                        </>
                    )}

                    {/* ── Local Files Tab ─────────────────────────────────────── */}
                    {tab === "local" && (
                        <>
                            <p className="text-[10px] pixel-font text-gray-500 uppercase tracking-widest mb-3">
                                Select one or more audio files from your computer
                            </p>

                            <input ref={fileRef} type="file" accept="audio/*" multiple className="hidden" onChange={handleFileChange} />
                            <button
                                onClick={() => fileRef.current?.click()}
                                className={cn(
                                    "w-full border border-dashed rounded-xl h-28 flex flex-col items-center justify-center gap-2 transition-all",
                                    localFiles.length > 0
                                        ? "border-[hsl(var(--blood-red))]/60 bg-[hsl(var(--blood-red))]/5"
                                        : "border-white/20 hover:border-[hsl(var(--blood-red))]/40 hover:bg-white/[0.02]"
                                )}
                            >
                                <FolderOpen className={cn("w-7 h-7", localFiles.length > 0 ? "text-[hsl(var(--blood-red))]" : "text-gray-500")} />
                                <span className="text-xs pixel-font tracking-widest text-gray-400">
                                    {localFiles.length > 0 ? `${localFiles.length} FILE${localFiles.length > 1 ? "S" : ""} SELECTED — Click to change` : "BROWSE FILES"}
                                </span>
                                <span className="text-[10px] text-gray-600">MP3, WAV, OGG, FLAC, AAC, etc.</span>
                            </button>

                            {localFiles.length > 0 && (
                                <div className="space-y-2">
                                    {localFiles.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Music className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                                <span className="text-xs text-white truncate">{file.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                                                <span className="text-[10px] text-gray-600 font-mono">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                                                <button onClick={() => removeLocalFile(i)} className="text-gray-600 hover:text-red-400 transition-colors">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {localProgress && (
                                <div className="flex items-center gap-2 text-gray-400 text-xs bg-white/[0.03] border border-white/5 rounded-lg px-4 py-3">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[hsl(var(--blood-red))] flex-shrink-0" />
                                    <span className="truncate">{localProgress}</span>
                                </div>
                            )}

                            {localErr && (
                                <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs">{localErr}</p>
                                </div>
                            )}

                            <Button
                                onClick={saveLocal}
                                disabled={localSaving || localFiles.length === 0}
                                className="w-full bg-[hsl(var(--blood-red))] hover:bg-[hsl(var(--blood-red))]/80 text-white h-12 rounded-xl pixel-font text-xs tracking-widest disabled:opacity-50"
                            >
                                {localSaving
                                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> UPLOADING…</>
                                    : <><FolderOpen className="w-4 h-4 mr-2" /> UPLOAD {localFiles.length > 0 ? localFiles.length : ""} FILE{localFiles.length !== 1 ? "S" : ""}</>
                                }
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── AlbumsView (main page) ────────────────────────────────────────────────────

const AlbumsView = ({ onBack }: { onBack: () => void }) => {
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true); setError(null);
            try {
                if (!supabase) { setAlbums([]); return; }
                const { data: { user }, error: ae } = await supabase.auth.getUser();
                if (ae) throw ae;
                if (!user) { setAlbums([]); return; }

                const { data, error: fe } = await supabase
                    .from("albums")
                    .select("id, name, created_by, is_collaborative, created_at")
                    .eq("created_by", user.id)
                    .order("created_at", { ascending: false });
                if (fe) throw fe;
                setAlbums((data as SupabaseAlbum[]).map((r) => toAlbum(r)));
            } catch (e: unknown) {
                console.error("[AlbumsView] fetch:", e);
                setError(e instanceof Error ? e.message : "Failed to load albums.");
            } finally { setLoading(false); }
        };
        fetch();

        // Check for action=create in URL
        const params = new URLSearchParams(window.location.search);
        if (params.get("action") === "create") {
            setModalOpen(true);
            // Optionally clear the param so it doesn't re-open on refresh? 
            // In a small app, it's fine.
        }
    }, []);

    const createAlbum = async (name: string) => {
        if (!supabase) return;
        setCreating(true);
        try {
            const { data: { user }, error: ae } = await supabase.auth.getUser();
            if (ae) throw ae;
            if (!user) throw new Error("Not logged in.");
            const { data, error: ie } = await supabase
                .from("albums")
                .insert({ name, created_by: user.id, is_collaborative: false })
                .select("id, name, created_by, is_collaborative, created_at")
                .single();
            if (ie) throw ie;
            setAlbums((prev) => [toAlbum(data as SupabaseAlbum), ...prev]);
        } catch (e) {
            console.error("[AlbumsView] createAlbum:", e);
        } finally { setCreating(false); }
    };

    if (selectedAlbum) {
        return (
            <AlbumDetailView
                album={selectedAlbum}
                onBack={() => setSelectedAlbum(null)}
            />
        );
    }

    return (
        <>
            {modalOpen && (
                <CreateAlbumModal
                    onClose={() => setModalOpen(false)}
                    onCreate={createAlbum}
                    creating={creating}
                />
            )}
            <div className="w-full min-h-screen bg-black/95 text-white p-6 md:p-12 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <h1 className="pixel-font text-3xl md:text-4xl text-white font-bold tracking-tight">ALBUMS</h1>
                        <p className="text-gray-400 text-sm md:text-base font-medium">Manage your personal and collaborative albums</p>
                    </div>
                    <Button
                        onClick={() => setModalOpen(true)}
                        className="bg-[hsl(var(--blood-red))] hover:bg-[hsl(var(--blood-red))]/80 text-white rounded-lg px-6 py-6 h-auto shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        <span className="pixel-font text-sm">CREATE ALBUM</span>
                    </Button>
                </div>

                {/* My Albums */}
                <div className="space-y-6 mb-16">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-[hsl(var(--blood-red))]" />
                        <h2 className="pixel-font text-xl font-bold tracking-wide">MY ALBUMS</h2>
                    </div>

                    {loading && (
                        <div className="flex items-center gap-3 text-gray-500 py-10">
                            <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--blood-red))]" />
                            <span className="pixel-font text-xs tracking-widest">LOADING ALBUMS…</span>
                        </div>
                    )}
                    {!loading && error && (
                        <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                    {!loading && !error && albums.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-700">
                            <Disc3 className="w-14 h-14" />
                            <p className="pixel-font text-xs tracking-widest text-gray-600">NO ALBUMS YET</p>
                            <p className="text-sm text-gray-600">Hit CREATE ALBUM to get started.</p>
                        </div>
                    )}
                    {!loading && !error && albums.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {albums.map((album) => (
                                <AlbumCard key={album.id} album={album} onClick={() => setSelectedAlbum(album)} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Shared Albums — empty placeholder for now */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-[hsl(var(--blood-red))]" />
                        <h2 className="pixel-font text-xl font-bold tracking-wide">SHARED ALBUMS</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-700">
                        <Users className="w-10 h-10" />
                        <p className="pixel-font text-xs tracking-widest text-gray-600">NO SHARED ALBUMS</p>
                        <p className="text-sm text-gray-600">Collaborative albums shared with you will appear here.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

// ── AlbumCard ────────────────────────────────────────────────────────────────

const AlbumCard = ({ album, onClick, isShared }: { album: Album; onClick: () => void; isShared?: boolean }) => (
    <Card
        onClick={onClick}
        className="group relative bg-[#121214]/40 backdrop-blur-md border border-white/5 p-4 rounded-xl cursor-pointer hover:bg-[#18181b]/60 transition-all duration-300 hover:-translate-y-2 hover:border-[hsl(var(--blood-red))]/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(220,38,38,0.1)] overflow-hidden"
    >
        <div className={cn(
            "w-full aspect-square rounded-lg mb-4 flex items-center justify-center relative overflow-hidden",
            album.coverColor
        )}>
            <Music className="w-12 h-12 text-white/20 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isShared && (
                <div className="absolute top-2 left-2 bg-[hsl(var(--blood-red))] text-white text-[10px] pixel-font px-2 py-1 rounded">SHARED</div>
            )}
        </div>
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <h3 className="pixel-font text-sm font-bold text-white truncate group-hover:text-[hsl(var(--blood-red))] transition-colors">
                    {album.name}
                </h3>
                {album.isCollaborative
                    ? <Users className="w-3.5 h-3.5 text-[hsl(var(--blood-red))] flex-shrink-0" />
                    : <Lock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                }
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>{album.trackCount} TRACKS</span>
                <span>{album.lastUpdated}</span>
            </div>
        </div>
    </Card>
);

// ── TrackRow ─────────────────────────────────────────────────────────────────

const TrackRow = ({
    track,
    index,
    onDelete,
}: {
    track: SupabaseTrack;
    index: number;
    onDelete: (id: string) => void;
}) => {
    const [expanded, setExpanded] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!supabase) return;
        setDeleting(true);
        try {
            const { error } = await supabase.from("tracks").delete().eq("id", track.id);
            if (error) throw error;
            onDelete(track.id);
        } catch (e) {
            console.error("deleteTrack:", e);
        } finally { setDeleting(false); }
    };

    return (
        <>
            <tr className="group hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0">
                <td className="px-6 py-4 text-sm font-mono text-gray-500">{index + 1}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {track.type === "youtube"
                            ? <Youtube className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                            : <Music className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        }
                        <span className="text-sm font-bold text-white group-hover:text-[hsl(var(--blood-red))] transition-colors">
                            {track.title}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className={cn(
                        "text-[9px] pixel-font px-2 py-1 rounded",
                        track.type === "youtube" ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"
                    )}>
                        {track.type === "youtube" ? "YOUTUBE" : "LOCAL"}
                    </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-gray-400">{track.duration ?? "—"}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost" size="icon"
                            onClick={() => setExpanded((v) => !v)}
                            className="w-8 h-8 rounded-full bg-[hsl(var(--blood-red))] text-white hover:bg-[hsl(var(--blood-red))] hover:scale-110"
                        >
                            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        </Button>
                        <Button
                            variant="ghost" size="icon"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="w-8 h-8 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </Button>
                    </div>
                </td>
            </tr>
            {/* Inline player row */}
            {expanded && (
                <tr className="border-b border-white/[0.02]">
                    <td colSpan={5} className="px-6 pb-5">
                        {track.type === "youtube" && track.yt_embed_url ? (
                            <div className="rounded-xl overflow-hidden border border-white/10 bg-black aspect-video max-w-2xl">
                                <iframe
                                    src={track.yt_embed_url}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : track.type === "local" && track.file_url ? (
                            <audio
                                controls
                                src={track.file_url}
                                className="w-full max-w-lg rounded-lg"
                                style={{ colorScheme: "dark" }}
                            />
                        ) : (
                            <p className="text-xs text-gray-500 italic">No playback source available.</p>
                        )}
                    </td>
                </tr>
            )}
        </>
    );
};

// ── AlbumDetailView ────────────────────────────────────────────────────────────

const AlbumDetailView = ({ album, onBack }: { album: Album; onBack: () => void }) => {
    const [tracks, setTracks] = useState<SupabaseTrack[]>([]);
    const [loadingTracks, setLoadingTracks] = useState(true);
    const [trackError, setTrackError] = useState<string | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);

    useEffect(() => {
        const fetchTracks = async () => {
            setLoadingTracks(true); setTrackError(null);
            try {
                if (!supabase) { setTracks([]); return; }
                const { data, error } = await supabase
                    .from("tracks")
                    .select("*")
                    .eq("album_id", album.id)
                    .order("created_at", { ascending: true });
                if (error) throw error;
                setTracks(data as SupabaseTrack[]);
            } catch (e: unknown) {
                console.error("[AlbumDetailView] fetchTracks:", e);
                setTrackError(e instanceof Error ? e.message : "Failed to load tracks.");
            } finally { setLoadingTracks(false); }
        };
        fetchTracks();
    }, [album.id]);

    const handleTrackAdded = (newTracks: SupabaseTrack[]) => {
        setTracks((prev) => [...prev, ...newTracks]);
    };

    const handleTrackDeleted = (id: string) => {
        setTracks((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <>
            {addModalOpen && (
                <AddTrackModal
                    albumId={album.id}
                    onClose={() => setAddModalOpen(false)}
                    onAdded={handleTrackAdded}
                />
            )}

            <div className="w-full min-h-screen bg-[#0a0a0b] text-white animate-slide-up-fade">
                {/* Top Bar */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost" size="icon" onClick={onBack}
                            className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className={cn("w-10 h-10 rounded shadow-lg", album.coverColor)} />
                            <div className="flex items-center gap-2">
                                <h2 className="pixel-font text-lg font-bold truncate">{album.name}</h2>
                                <Edit2 className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="hidden sm:flex border-white/10 hover:bg-white/5 text-xs pixel-font h-9">
                            <Plus className="w-3.5 h-3.5 mr-2" /> ADD MEMBER
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="pt-32 pb-12 px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 max-w-[1600px] mx-auto">

                        {/* Track List Panel */}
                        <div className="space-y-6">
                            <div className="bg-[#121214]/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                                {loadingTracks ? (
                                    <div className="flex items-center gap-3 p-10 text-gray-500">
                                        <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--blood-red))]" />
                                        <span className="pixel-font text-xs tracking-widest">LOADING TRACKS…</span>
                                    </div>
                                ) : trackError ? (
                                    <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/20 m-6 rounded-xl px-5 py-4">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm">{trackError}</span>
                                    </div>
                                ) : tracks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-700">
                                        <Music className="w-12 h-12" />
                                        <p className="pixel-font text-xs tracking-widest text-gray-600">NO TRACKS ADDED YET</p>
                                        <p className="text-sm text-gray-600">Add a YouTube link or a local audio file below.</p>
                                    </div>
                                ) : (
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 text-left text-[11px] pixel-font text-gray-500 uppercase tracking-widest">
                                                <th className="px-6 py-4 font-normal">#</th>
                                                <th className="px-6 py-4 font-normal">TRACK NAME</th>
                                                <th className="px-6 py-4 font-normal">TYPE</th>
                                                <th className="px-6 py-4 font-normal">DURATION</th>
                                                <th className="px-6 py-4 font-normal text-right">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tracks.map((track, i) => (
                                                <TrackRow
                                                    key={track.id}
                                                    track={track}
                                                    index={i}
                                                    onDelete={handleTrackDeleted}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* Add Track button */}
                                <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                                    <Button
                                        onClick={() => setAddModalOpen(true)}
                                        className="w-full bg-transparent border border-dashed border-white/20 hover:border-[hsl(var(--blood-red))]/50 hover:bg-[hsl(var(--blood-red))]/5 text-gray-400 hover:text-white transition-all h-14 rounded-xl group"
                                    >
                                        <Plus className="w-5 h-5 mr-3 group-hover:text-[hsl(var(--blood-red))] transition-colors" />
                                        <span className="pixel-font text-xs">ADD NEW TRACK</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Side Info Panel */}
                        <div className="space-y-6">
                            <Card className="bg-[#121214]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
                                <h3 className="pixel-font text-xs font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-[hsl(var(--blood-red))]" />
                                    ALBUM INFO
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] pixel-font text-gray-500 uppercase">CREATED</p>
                                            <div className="flex items-center gap-2 text-white">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-xs font-bold">{album.createdDate}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] pixel-font text-gray-500 uppercase">TOTAL TRACKS</p>
                                            <div className="flex items-center gap-2 text-white">
                                                <Music className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-xs font-bold">{tracks.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] pixel-font text-gray-500 uppercase">STATUS</span>
                                            <span className={cn(
                                                "text-[9px] pixel-font px-2 py-1 rounded",
                                                album.isCollaborative ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"
                                            )}>
                                                {album.isCollaborative ? "COLLABORATIVE" : "PRIVATE"}
                                            </span>
                                        </div>

                                        {/* Track type breakdown */}
                                        <div className="space-y-2">
                                            <span className="text-[10px] pixel-font text-gray-500 uppercase">TRACKS BY TYPE</span>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Youtube className="w-3 h-3 text-red-400" />
                                                    <span className="text-gray-300">YouTube</span>
                                                </div>
                                                <span className="text-gray-500 font-mono">{tracks.filter((t) => t.type === "youtube").length}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <FolderOpen className="w-3 h-3 text-blue-400" />
                                                    <span className="text-gray-300">Local Files</span>
                                                </div>
                                                <span className="text-gray-500 font-mono">{tracks.filter((t) => t.type === "local").length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlbumsView;
