import { useEffect, useState } from "react";
import { Play, Music, Clock, Youtube, FileAudio } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SupabaseTrack {
    id: string;
    album_id: string;
    title: string;
    type: "local" | "youtube";
    file_url: string | null;
    yt_embed_url: string | null;
    created_at: string;
}

interface AlbumInfo {
    id: string;
    name: string;
}

const RecentTracks = () => {
    const [tracks, setTracks] = useState<SupabaseTrack[]>([]);
    const [albumMap, setAlbumMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!supabase) { setLoading(false); return; }
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) { setLoading(false); return; }

                // Get user's albums
                const { data: albums } = await supabase
                    .from("albums")
                    .select("id, name")
                    .eq("created_by", user.id);

                const albumIds = (albums as AlbumInfo[] ?? []).map((a) => a.id);
                const map: Record<string, string> = {};
                (albums as AlbumInfo[] ?? []).forEach((a) => { map[a.id] = a.name; });
                setAlbumMap(map);

                if (albumIds.length === 0) { setLoading(false); return; }

                // Get 6 most recent tracks
                const { data: trackData } = await supabase
                    .from("tracks")
                    .select("id, album_id, title, type, file_url, yt_embed_url, created_at")
                    .in("album_id", albumIds)
                    .order("created_at", { ascending: false })
                    .limit(6);

                setTracks((trackData as SupabaseTrack[]) ?? []);
            } catch (e) {
                console.error("[RecentTracks]", e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <section className="space-y-10">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-[hsl(var(--retro-red))] shadow-[2px_2px_0_0_rgba(0,0,0,1)]" />
                    <h2 className="pixel-font text-xl text-parchment-dark uppercase tracking-widest">
                        RECENT_ENTRIES
                    </h2>
                </div>
            </div>

            <div className="retro-content-card !p-0 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <p className="pixel-font text-[10px] text-zinc-400 tracking-widest animate-pulse">LOADING TRACKS…</p>
                    </div>
                ) : tracks.length === 0 ? (
                    <div className="p-10 flex flex-col items-center gap-3 text-zinc-500">
                        <Music className="w-10 h-10 opacity-30" />
                        <p className="pixel-font text-[10px] tracking-widest">NO TRACKS YET</p>
                        <p className="text-xs text-zinc-600 text-center">Add tracks in the Albums section to see them here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/5 border-b-2 border-black/10">
                                    <th className="p-5 pixel-font text-[9px] text-parchment-dark/60 font-normal uppercase tracking-widest">AUDIO_FILE</th>
                                    <th className="p-5 pixel-font text-[9px] text-parchment-dark/60 font-normal uppercase tracking-widest hidden md:table-cell">ALBUM</th>
                                    <th className="p-5 pixel-font text-[9px] text-parchment-dark/60 font-normal uppercase tracking-widest hidden sm:table-cell">TYPE</th>
                                    <th className="p-5 pixel-font text-[9px] text-parchment-dark/60 font-normal uppercase tracking-widest text-right">
                                        <Clock className="w-3 h-3 inline" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {tracks.map((track) => (
                                    <tr key={track.id} className="group hover:bg-black/5 transition-colors cursor-pointer">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <button className="w-9 h-9 bg-black border-2 border-black group-hover:bg-[hsl(var(--retro-red))] group-hover:border-[hsl(var(--retro-red))] flex items-center justify-center text-white transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none flex-shrink-0">
                                                    <Play className="w-3.5 h-3.5 fill-current" />
                                                </button>
                                                <span className="pixel-font text-xs text-parchment-dark group-hover:text-[hsl(var(--retro-red))] transition-colors truncate max-w-[160px]">
                                                    {track.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5 hidden md:table-cell">
                                            <span className="text-xs font-mono text-zinc-500 uppercase truncate max-w-[120px] block">
                                                {albumMap[track.album_id] ?? "—"}
                                            </span>
                                        </td>
                                        <td className="p-5 hidden sm:table-cell">
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                {track.type === "youtube"
                                                    ? <><Youtube className="w-3 h-3 text-red-500" /><span className="text-[10px] font-mono">YouTube</span></>
                                                    : <><FileAudio className="w-3 h-3 text-blue-400" /><span className="text-[10px] font-mono">Local</span></>
                                                }
                                            </div>
                                        </td>
                                        <td className="p-5 text-right font-mono text-[10px] text-zinc-500 whitespace-nowrap">
                                            {new Date(track.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RecentTracks;
