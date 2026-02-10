import { Plus, Upload, FolderPlus, Music } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
    { label: "NEW PROJECT", icon: Plus, color: "text-green-400" },
    { label: "UPLOAD TRACK", icon: Upload, color: "text-blue-400" },
    { label: "IMPORT FOLDER", icon: FolderPlus, color: "text-yellow-400" },
    { label: "WORKSPACE", icon: Music, color: "text-purple-400" },
];

const QuickActions = () => {
    return (
        <div className="pixel-terminal-panel">
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-zinc-700">
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="pixel-font text-[8px] text-zinc-500 tracking-widest uppercase">Console :: Active</div>
            </div>

            {/* Terminal Screen Area */}
            <div className="bg-black p-6 border-2 border-zinc-800 relative overflow-hidden group">
                {/* Green Scanlines Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle,rgba(34,197,94,0.3)_0%,transparent_70%)]" />

                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            className="flex flex-col items-center gap-3 p-4 group/btn hover:bg-zinc-900 transition-all border-2 border-transparent hover:border-zinc-700 active:scale-95"
                        >
                            <div className={cn(
                                "p-3 bg-zinc-900 border border-zinc-700 shadow-[2px_2px_0_0_rgba(0,0,0,1)] group-hover/btn:shadow-[0_0_10px_rgba(34,197,94,0.3)] group-hover/btn:border-green-500/50 transition-all",
                                action.color
                            )}>
                                <action.icon className="w-5 h-5" />
                            </div>
                            <span className="pixel-font text-[8px] text-zinc-400 group-hover/btn:text-white text-center leading-tight">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Decorative Cursor */}
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-green-500 pixel-font text-[10px]">&gt;</span>
                    <div className="w-2 h-4 bg-green-500 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default QuickActions;
