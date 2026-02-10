import { Music, ExternalLink, Hash, Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const projects = [
    { name: "Cyberpunk Beats", tracks: 12, mood: "DARK", updated: "2h ago", icon: "💿" },
    { name: "Lo-Fi Sessions", tracks: 5, mood: "CHILL", updated: "1d ago", icon: "🎹" },
    { name: "Future Bass", tracks: 8, mood: "ENERGETIC", updated: "3d ago", icon: "⚡" },
    { name: "Orchestral Score", tracks: 3, mood: "EPIC", updated: "1w ago", icon: "🎻" },
];

const ProjectsGrid = () => {
    return (
        <section className="space-y-10">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-[hsl(var(--retro-red))] shadow-[2px_2px_0_0_rgba(0,0,0,1)]" />
                    <h2 className="pixel-font text-xl text-parchment-dark uppercase tracking-widest">
                        YOUR_COLLECTION
                    </h2>
                </div>
                <button className="pixel-font text-[9px] text-zinc-400 hover:text-[hsl(var(--retro-red))] transition-colors flex items-center gap-2">
                    <Plus className="w-3 h-3" />
                    NEW_PROJECT
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="retro-content-card group hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.1)] transition-all cursor-pointer flex flex-col gap-6"
                    >
                        {/* Project Thumbnail */}
                        <div className="aspect-square bg-white border-2 border-[hsl(var(--parchment-border))] flex items-center justify-center text-4xl shadow-inner overflow-hidden relative">
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="pixel-icon-grid transform group-hover:scale-110 transition-transform duration-300">
                                {project.icon}
                            </span>
                        </div>

                        {/* Info Section */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="pixel-font text-xs text-parchment-dark leading-tight line-clamp-2">
                                    {project.name}
                                </h3>
                                <Badge variant="outline" className="border-black/20 text-[8px] pixel-font px-1 py-0 h-4 bg-black/5">
                                    {project.mood}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-[9px] pixel-font text-zinc-500">
                                <span className="flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    {project.tracks}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {project.updated}
                                </span>
                            </div>
                        </div>

                        {/* Action Box */}
                        <div className="pt-2 border-t border-black/5">
                            <button className="w-full flex items-center justify-center gap-2 pixel-font text-[9px] text-zinc-400 group-hover:text-[hsl(var(--retro-red))] transition-colors py-2">
                                <ExternalLink className="w-3 h-3" />
                                OPEN_WORKSPACE
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProjectsGrid;
