
import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import raniGif from "@/assets/rani.gif";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Play, Pause, SkipBack, SkipForward, Volume2, ListMusic,
    MessageSquare, Plus, Send, ChevronDown, ChevronRight,
    Music, Youtube, Lock, Disc3, FileAudio, Loader2,
    StickyNote, AlertCircle, X, Users, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { BondChatPanel } from "@/components/BondChatPanel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SupabaseAlbum {
    id: string;
    name: string;
    created_by: string;
    created_at: string;
    is_shared?: boolean;
    creator_code?: string;
}

interface SupabaseTrack {
    id: string;
    album_id: string;
    title: string;
    type: "local" | "youtube";
    file_url: string | null;
    yt_url: string | null;
    yt_embed_url: string | null;
    duration: string | null;
    created_at: string;
}

interface Note {
    id: string;
    text: string;
    createdAt: string; // ISO
}

interface ActiveTrack {
    track: SupabaseTrack;
    albumName: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

function notesKey(albumId: string) { return `workspace_notes_${albumId}`; }

function loadNotes(albumId: string): Note[] {
    try { return JSON.parse(localStorage.getItem(notesKey(albumId)) ?? "[]"); }
    catch { return []; }
}

function saveNotes(albumId: string, notes: Note[]) {
    localStorage.setItem(notesKey(albumId), JSON.stringify(notes));
}

// ── AlbumRow (left sidebar expandable row) ────────────────────────────────────

const AlbumRow = ({
    album,
    activeTrack,
    onSelectTrack,
}: {
    album: SupabaseAlbum;
    activeTrack: ActiveTrack | null;
    onSelectTrack: (t: SupabaseTrack, albumName: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [tracks, setTracks] = useState<SupabaseTrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    const toggle = async () => {
        if (!open && !fetched) {
            setLoading(true);
            try {
                const { data } = await supabase!
                    .from("tracks")
                    .select("*")
                    .eq("album_id", album.id)
                    .order("created_at", { ascending: true });
                setTracks((data as SupabaseTrack[]) ?? []);
                setFetched(true);
            } finally { setLoading(false); }
        }
        setOpen((v) => !v);
    };

    return (
        <div>
            <button
                onClick={toggle}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 group"
            >
                {open ? <ChevronDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />}
                {album.is_shared
                    ? <Users className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    : <Disc3 className="w-3.5 h-3.5 text-[hsl(var(--blood-red))] flex-shrink-0" />
                }
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm text-gray-300 group-hover:text-white truncate">{album.name}</span>
                    {album.is_shared && (
                        <span className="text-[9px] text-blue-400/80 font-mono tracking-widest uppercase">By: {album.creator_code}</span>
                    )}
                </div>
                {loading && <Loader2 className="w-3 h-3 animate-spin text-gray-500 flex-shrink-0" />}
            </button>

            {open && (
                <div className="ml-4 border-l border-white/5 pl-2 space-y-0.5 mt-0.5">
                    {!loading && tracks.length === 0 && (
                        <p className="text-[10px] text-gray-600 px-3 py-2 italic">No tracks</p>
                    )}
                    {tracks.map((t) => {
                        const isActive = activeTrack?.track.id === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => onSelectTrack(t, album.name)}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all group",
                                    isActive
                                        ? "bg-[hsl(var(--blood-red))]/15 text-[hsl(var(--blood-red))]"
                                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                                )}
                            >
                                {t.type === "youtube"
                                    ? <Youtube className="w-3 h-3 flex-shrink-0 text-red-500" />
                                    : <FileAudio className="w-3 h-3 flex-shrink-0 text-blue-400" />
                                }
                                <span className="text-xs truncate flex-1">{t.title}</span>
                                {isActive && (
                                    <div className="flex gap-0.5 flex-shrink-0">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-0.5 bg-[hsl(var(--blood-red))] animate-pulse rounded-full"
                                                style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 150}ms` }} />
                                        ))}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ── Notes Tab ─────────────────────────────────────────────────────────────────

const NotesTab = ({ albumId }: { albumId: string | null }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (albumId) setNotes(loadNotes(albumId));
        else setNotes([]);
    }, [albumId]);

    const addNote = () => {
        if (!input.trim() || !albumId) return;
        const next: Note[] = [
            { id: crypto.randomUUID(), text: input.trim(), createdAt: new Date().toISOString() },
            ...notes,
        ];
        setNotes(next);
        saveNotes(albumId, next);
        setInput("");
    };

    const deleteNote = (id: string) => {
        if (!albumId) return;
        const next = notes.filter((n) => n.id !== id);
        setNotes(next);
        saveNotes(albumId, next);
    };

    if (!albumId) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600 py-12">
                <StickyNote className="w-10 h-10" />
                <p className="text-xs pixel-font tracking-widest">SELECT AN ALBUM TO SEE NOTES</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mr-2 pr-2">
                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 gap-2 text-gray-600">
                        <StickyNote className="w-8 h-8" />
                        <p className="text-xs pixel-font tracking-widest">NO NOTES YET</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notes.map((note) => (
                            <div key={note.id} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 group relative">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] text-gray-500 font-mono">{timeAgo(note.createdAt)}</span>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed">{note.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
            <div className="mt-4 pt-4 border-t border-white/10">
                <div className="relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addNote(); } }}
                        placeholder="Write a note…"
                        className="bg-black/40 border-white/10 pr-10 text-sm focus-visible:ring-[hsl(var(--blood-red))]/50 text-white placeholder:text-gray-600"
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={addNote}
                        disabled={!input.trim()}
                        className="absolute right-1 top-1 h-8 w-8 text-[hsl(var(--blood-red))] hover:text-white disabled:opacity-30"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ── Chat Lock Tab ─────────────────────────────────────────────────────────────

const ChatLockedTab = () => (
    <div className="flex flex-col items-center justify-center h-full gap-5 py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Lock className="w-7 h-7 text-gray-500" />
        </div>
        <div className="space-y-2">
            <p className="pixel-font text-xs tracking-widest text-white">CHAT LOCKED</p>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[220px]">
                Chat is available when you collaborate on a shared album. Invite a friend to unlock.
            </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-gray-500 text-xs w-full justify-center">
            <Users className="w-4 h-4" />
            Collaboration coming soon
        </div>
    </div>
);

// ── Main Player ───────────────────────────────────────────────────────────────

const LocalPlayer = ({ src, title }: { src: string; title: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);

    const togglePlay = () => {
        const a = audioRef.current; if (!a) return;
        if (playing) { a.pause(); } else { a.play(); }
        setPlaying(!playing);
    };

    const seek = (e: React.MouseEvent<HTMLDivElement>) => {
        const a = audioRef.current; if (!a || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        a.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
    };

    const fmt = (s: number) => isNaN(s) ? "0:00" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

    return (
        <div className="h-full flex flex-col justify-between">
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={() => setProgress(audioRef.current?.currentTime ?? 0)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                onEnded={() => setPlaying(false)}
                onVolumeChange={() => setVolume(audioRef.current?.volume ?? 0.8)}
            />

            {/* Now Playing label */}
            <div className="flex items-start justify-between z-10">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-2">
                        <FileAudio className="w-3 h-3 text-blue-400" /> Local File
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg line-clamp-2">{title}</h1>
                </div>
            </div>

            {/* Visualizer bars (animated when playing) */}
            <div className="flex items-end justify-center gap-1 h-24 w-full max-w-sm mx-auto opacity-60 z-10">
                {[...Array(18)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 bg-[hsl(var(--blood-red))] rounded-t-full transition-all duration-150"
                        style={{
                            height: playing ? `${20 + Math.sin(i * 0.8 + Date.now() / 300) * 60 + 20}%` : "15%",
                            opacity: 0.4 + (i % 3) * 0.2,
                        }}
                    />
                ))}
            </div>

            {/* Controls */}
            <div className="space-y-5 z-10">
                {/* Progress */}
                <div className="space-y-2">
                    <div
                        className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer"
                        onClick={seek}
                    >
                        <div
                            className="h-full bg-[hsl(var(--blood-red))] rounded-full shadow-[0_0_8px_rgba(220,38,38,0.6)] transition-all"
                            style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
                        />
                    </div>
                    <div className="flex justify-between text-xs font-mono text-gray-500">
                        <span>{fmt(progress)}</span>
                        <span>{fmt(duration)}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 w-28">
                        <Volume2 className="w-4 h-4 text-gray-400" />
                        <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const v = (e.clientX - rect.left) / rect.width;
                                if (audioRef.current) audioRef.current.volume = v;
                                setVolume(v);
                            }}
                        >
                            <div className="h-full bg-gray-400 hover:bg-[hsl(var(--blood-red))] transition-colors rounded-full" style={{ width: `${volume * 100}%` }} />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button size="icon" variant="ghost" className="hover:text-white text-gray-400"
                            onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, progress - 10); }}
                        >
                            <SkipBack className="w-6 h-6" />
                        </Button>
                        <Button
                            size="icon"
                            className="w-16 h-16 rounded-full bg-white text-black hover:bg-[hsl(var(--blood-red))] hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                            onClick={togglePlay}
                        >
                            {playing ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="hover:text-white text-gray-400"
                            onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(duration, progress + 10); }}
                        >
                            <SkipForward className="w-6 h-6" />
                        </Button>
                    </div>

                    <div className="w-28" />
                </div>
            </div>
        </div>
    );
};

const YouTubePlayer = ({ embedUrl, title }: { embedUrl: string; title: string }) => (
    <div className="h-full flex flex-col gap-4">
        <div className="flex items-start gap-3">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                <Youtube className="w-3 h-3 text-red-500" /> YouTube
            </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight line-clamp-2">{title}</h1>
        <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black min-h-0">
            <iframe
                src={`${embedUrl}&autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    </div>
);

const EmptyPlayer = () => (
    <div className="h-full flex flex-col items-center justify-center gap-6 text-gray-700">
        <div className="w-28 h-28 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
            <Music className="w-12 h-12" />
        </div>
        <div className="text-center space-y-2">
            <p className="pixel-font text-sm tracking-widest text-gray-600">NO TRACK SELECTED</p>
            <p className="text-sm text-gray-600">Pick an album from the library and click a track to start listening.</p>
        </div>
    </div>
);

// ── Workspace ─────────────────────────────────────────────────────────────────

const Workspace = () => {
    const [albums, setAlbums] = useState<SupabaseAlbum[]>([]);
    const [loadingAlbums, setLoadingAlbums] = useState(true);
    const [albumsError, setAlbumsError] = useState<string | null>(null);
    const [activeTrack, setActiveTrack] = useState<ActiveTrack | null>(null);

    // Auth & Bonds state
    const [userId, setUserId] = useState<string | null>(null);
    const [activeBondId, setActiveBondId] = useState<string | null>(null);

    // Fetch albums on mount
    useEffect(() => {
        const fetch = async () => {
            setLoadingAlbums(true);
            try {
                if (!supabase) { setAlbums([]); return; }
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) { setAlbums([]); return; }
                setUserId(user.id);

                // 1. Fetch User's Own Albums
                const { data: myAlbums, error } = await supabase
                    .from("albums")
                    .select("id, name, created_by, created_at")
                    .eq("created_by", user.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                let allAlbums: SupabaseAlbum[] = (myAlbums as SupabaseAlbum[]) ?? [];

                // 2. Fetch Bonds & Shared Albums
                const { data: bonds } = await supabase
                    .from("bonds")
                    .select("id, user1_id, user2_id")
                    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

                if (bonds && bonds.length > 0) {
                    // Set the first active bond for chat purposes (simplification for MVP)
                    setActiveBondId(bonds[0].id);

                    const partnerIds = bonds.flatMap(b => [b.user1_id, b.user2_id]).filter(id => id !== user.id);

                    // Fetch codes to display names
                    const { data: pCodes } = await supabase
                        .from("bond_codes")
                        .select("user_id, code")
                        .in("user_id", partnerIds);

                    const partnerCodesMap: Record<string, string> = {};
                    pCodes?.forEach(c => { partnerCodesMap[c.user_id] = c.code; });

                    const { data: sharedAlbums } = await supabase
                        .from("albums")
                        .select("id, name, created_by, created_at")
                        .in("created_by", partnerIds)
                        .order("created_at", { ascending: false });

                    if (sharedAlbums) {
                        const enhancedShared = sharedAlbums.map((a: any) => ({
                            ...a,
                            is_shared: true,
                            creator_code: partnerCodesMap[a.created_by] || "UNKNOWN"
                        }));
                        allAlbums = [...allAlbums, ...enhancedShared];
                    }
                }

                setAlbums(allAlbums);
            } catch (e) {
                console.error("[Workspace] albums fetch:", e);
                setAlbumsError("Failed to load library.");
            } finally { setLoadingAlbums(false); }
        };
        fetch();
    }, []);

    const handleSelectTrack = useCallback((track: SupabaseTrack, albumName: string) => {
        setActiveTrack({ track, albumName });
    }, []);

    const activeAlbumId = activeTrack?.track.album_id ?? null;

    return (
        <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <img src={raniGif} alt="bg" className="w-full h-full object-cover opacity-25 filter blur-sm scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
            </div>

            <Navbar />

            <div className="relative z-10 pt-24 pb-8 px-4 h-screen flex flex-col">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 h-full max-w-[1600px] mx-auto w-full">

                    {/* ── LEFT SIDEBAR — Library (Desktop) ───────────────── */}
                    <div className="hidden lg:flex flex-col h-full col-span-2">
                        <div className="glass-panel flex-1 rounded-2xl border border-white/10 backdrop-blur-xl bg-black/40 flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2 p-4 border-b border-white/5">
                                <ListMusic className="w-5 h-5 text-[hsl(var(--blood-red))]" />
                                <h2 className="text-sm font-bold tracking-tight text-white/90 pixel-font">LIBRARY</h2>
                            </div>

                            <ScrollArea className="flex-1 p-3">
                                {loadingAlbums && (
                                    <div className="flex items-center gap-2 text-gray-500 px-3 py-4">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-xs pixel-font tracking-widest">LOADING…</span>
                                    </div>
                                )}
                                {!loadingAlbums && albumsError && (
                                    <div className="flex items-center gap-2 text-red-400 px-3 py-3 text-xs">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {albumsError}
                                    </div>
                                )}
                                {!loadingAlbums && !albumsError && albums.length === 0 && (
                                    <div className="flex flex-col items-center gap-2 py-10 text-gray-600">
                                        <Disc3 className="w-8 h-8" />
                                        <p className="text-[10px] pixel-font tracking-widest text-center">NO ALBUMS YET</p>
                                        <p className="text-[10px] text-gray-700 text-center">Go to Albums to create one.</p>
                                    </div>
                                )}
                                {!loadingAlbums && !albumsError && albums.map((album) => (
                                    <AlbumRow
                                        key={album.id}
                                        album={album}
                                        activeTrack={activeTrack}
                                        onSelectTrack={handleSelectTrack}
                                    />
                                ))}
                            </ScrollArea>
                        </div>
                    </div>

                    {/* ── CENTER — Player ──────────────────────────────────── */}
                    <div className="flex-1 lg:col-span-7 flex flex-col gap-4 h-full min-h-0">

                        {/* Status strip */}
                        <div className="glass-panel px-4 py-3 rounded-full flex items-center justify-between border border-white/10 backdrop-blur-md bg-black/30">
                            <div className="flex items-center gap-3">
                                {/* Mobile Library Toggle */}
                                <div className="lg:hidden">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white bg-white/5 hover:bg-white/10 rounded-full shrink-0">
                                                <ListMusic className="w-4 h-4" />
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="bg-black/90 backdrop-blur-xl border-r border-white/10 text-white w-[300px] p-0 flex flex-col">
                                            <div className="flex items-center gap-2 p-4 border-b border-white/5 mt-8">
                                                <ListMusic className="w-5 h-5 text-[hsl(var(--blood-red))]" />
                                                <h2 className="text-sm font-bold tracking-tight text-white/90 pixel-font">LIBRARY</h2>
                                            </div>
                                            <ScrollArea className="flex-1 p-3">
                                                {loadingAlbums && (
                                                    <div className="flex items-center gap-2 text-gray-500 px-3 py-4">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span className="text-xs pixel-font tracking-widest">LOADING…</span>
                                                    </div>
                                                )}
                                                {!loadingAlbums && albumsError && (
                                                    <div className="flex items-center gap-2 text-red-400 px-3 py-3 text-xs">
                                                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {albumsError}
                                                    </div>
                                                )}
                                                {!loadingAlbums && !albumsError && albums.length === 0 && (
                                                    <div className="flex flex-col items-center gap-2 py-10 text-gray-600">
                                                        <Disc3 className="w-8 h-8" />
                                                        <p className="text-[10px] pixel-font tracking-widest text-center">NO ALBUMS YET</p>
                                                        <p className="text-[10px] text-gray-700 text-center">Go to Albums to create one.</p>
                                                    </div>
                                                )}
                                                {!loadingAlbums && !albumsError && albums.map((album) => (
                                                    <AlbumRow
                                                        key={album.id}
                                                        album={album}
                                                        activeTrack={activeTrack}
                                                        onSelectTrack={handleSelectTrack}
                                                    />
                                                ))}
                                            </ScrollArea>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                                <div className={cn(
                                    "w-2 h-2 rounded-full hidden sm:block",
                                    activeTrack ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-600"
                                )} />
                                <span className="text-sm font-medium text-white/80">
                                    {activeTrack
                                        ? <>Album: <span className="text-[hsl(var(--blood-red))] font-bold">{activeTrack.albumName}</span></>
                                        : <span className="text-gray-500">No track playing</span>
                                    }
                                </span>
                            </div>
                            {activeTrack && (
                                <span className="text-xs text-gray-500 truncate max-w-[200px] font-mono">{activeTrack.track.title}</span>
                            )}
                        </div>

                        {/* Main Player Card */}
                        <div className="flex-1 glass-panel rounded-3xl border border-white/10 backdrop-blur-xl bg-gradient-to-br from-black/60 to-black/40 p-8 relative overflow-hidden">
                            {/* Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[hsl(var(--blood-red))]/10 rounded-full blur-[120px] pointer-events-none" />

                            {!activeTrack && <EmptyPlayer />}

                            {activeTrack?.track.type === "local" && activeTrack.track.file_url && (
                                <LocalPlayer
                                    key={activeTrack.track.id}
                                    src={activeTrack.track.file_url}
                                    title={activeTrack.track.title}
                                />
                            )}

                            {activeTrack?.track.type === "youtube" && activeTrack.track.yt_embed_url && (
                                <YouTubePlayer
                                    key={activeTrack.track.id}
                                    embedUrl={activeTrack.track.yt_embed_url}
                                    title={activeTrack.track.title}
                                />
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT SIDEBAR — Notes / Chat ─────────────────────── */}
                    <div className="flex-1 lg:col-span-3 h-full flex flex-col min-h-0">
                        <div className="glass-panel flex-1 rounded-2xl border border-white/10 backdrop-blur-xl bg-black/40 overflow-hidden flex flex-col">
                            <Tabs defaultValue="notes" className="flex flex-col h-full w-full">
                                <div className="px-4 pt-4 pb-2 border-b border-white/10">
                                    <TabsList className="w-full bg-white/5 p-1">
                                        <TabsTrigger
                                            value="notes"
                                            className="flex-1 text-xs data-[state=active]:bg-[hsl(var(--blood-red))]/20 data-[state=active]:text-[hsl(var(--blood-red))]"
                                        >
                                            <StickyNote className="w-3.5 h-3.5 mr-1.5" /> Notes
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="chat"
                                            className="flex-1 text-xs data-[state=active]:bg-[hsl(var(--blood-red))]/20 data-[state=active]:text-[hsl(var(--blood-red))]"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Chat
                                            <span className="ml-1.5 text-[9px] bg-white/10 text-gray-500 px-1 rounded pixel-font">SOON</span>
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="notes" className="flex-1 flex flex-col p-4 m-0 outline-none overflow-hidden">
                                    <NotesTab albumId={activeAlbumId} />
                                </TabsContent>

                                <TabsContent value="chat" className="flex-1 m-0 outline-none overflow-hidden pb-4">
                                    {activeBondId && userId ? (
                                        <BondChatPanel bondId={activeBondId} currentUserId={userId} />
                                    ) : (
                                        <ChatLockedTab />
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Workspace;
