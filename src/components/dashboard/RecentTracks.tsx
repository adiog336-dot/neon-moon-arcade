import { Play, MoreHorizontal, Music, Clock, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tracks = [
    { name: "Eclipse Phase", project: "Cyberpunk Beats", bpm: 128, mood: "DARK", duration: "3:45", status: "In Progress" },
    { name: "Morning Coffee", project: "Lo-Fi Sessions", bpm: 84, mood: "CHILL", duration: "2:20", status: "Done" },
    { name: "Neon Skyline", project: "Cyberpunk Beats", bpm: 132, mood: "UPBEAT", duration: "4:12", status: "Review" },
    { name: "Star Dust", project: "Lo-Fi Sessions", bpm: 90, mood: "DREAMY", duration: "3:05", status: "Done" },
];

const RecentTracks = () => {
    return (
        <section className="space-y-10">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-[hsl(var(--retro-red))] shadow-[2px_2px_0_0_rgba(0,0,0,1)]" />
                    <h2 className="pixel-font text-xl text-parchment-dark uppercase tracking-widest">
                        RECENT_ENTRIES
                    </h2>
                </div>
                <button className="pixel-font text-[9px] text-zinc-400 hover:text-[hsl(var(--retro-red))] transition-colors">
                    VIEW_COMPLETE_LOG
                </button>
            </div>

            <div className="retro-content-card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/5 border-b-2 border-black/10">
                                <th className="p-5 pixel-font text-[9px] text-parchment-dark/60 font-normal uppercase tracking-widest">AUDIO_FILE</th>
                                <th className="p-5 pixel-font text-[9px] text-parchment-dark/60 font-normal uppercase tracking-widest hidden md:table-cell">PARENT_DIR</th>
                                <th className="p-5 pixel-font text-[9px] text-parchment-dark/60 font-normal uppercase tracking-widest hidden lg:table-cell">DATA_RATE</th>
                                <th className="p-5 pixel-font text-[9px] text-parchment-dark/60 font-normal uppercase tracking-widest hidden sm:table-cell">TAGS</th>
                                <th className="p-5 pixel-font text-[9px] text-parchment-dark/60 font-normal uppercase tracking-widest text-right">LENGTH</th>
                                <th className="p-5 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {tracks.map((track, index) => (
                                <tr
                                    key={index}
                                    className="group hover:bg-black/5 transition-colors cursor-pointer"
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-5">
                                            <button className="w-10 h-10 bg-black border-2 border-black group-hover:bg-[hsl(var(--retro-red))] group-hover:border-[hsl(var(--retro-red))] flex items-center justify-center text-white transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none">
                                                <Play className="w-4 h-4 fill-current" />
                                            </button>
                                            <div>
                                                <div className="pixel-font text-xs text-parchment-dark group-hover:text-[hsl(var(--retro-red))] transition-colors">{track.name}</div>
                                                <div className="text-[9px] font-mono text-zinc-400 md:hidden uppercase mt-1">{track.project}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 hidden md:table-cell">
                                        <span className="text-xs font-mono text-zinc-500 uppercase">{track.project}</span>
                                    </td>
                                    <td className="p-5 hidden lg:table-cell">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Activity className="w-3 h-3 text-zinc-300" />
                                            <span className="text-xs font-mono">{track.bpm} BPM</span>
                                        </div>
                                    </td>
                                    <td className="p-5 hidden sm:table-cell">
                                        <Badge variant="outline" className="border-black/10 text-[8px] pixel-font px-2 py-0.5 bg-black/5 text-zinc-400 group-hover:text-parchment-dark uppercase">
                                            {track.mood}
                                        </Badge>
                                    </td>
                                    <td className="p-5 text-right font-mono text-xs text-zinc-500">
                                        <div className="flex items-center justify-end gap-2">
                                            <Clock className="w-3 h-3 text-zinc-300" />
                                            {track.duration}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button className="p-2 text-zinc-300 hover:text-parchment-dark transition-all">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default RecentTracks;
