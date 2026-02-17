
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PixelImage from "@/components/PixelImage";
// Using raniGif again as requested for consistent aesthetic or potential new bg
import raniGif from "@/assets/rani.gif";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Play, Pause, SkipBack, SkipForward, Repeat, Shuffle,
    Volume2, Clock, ListMusic, Mic2, Tag, MessageSquare,
    Plus, Send, CheckCircle2, Circle, MoreVertical, Disc
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const playlists = [
    { id: 1, name: "Neon Nights Mix", tracks: 24 },
    { id: 2, name: "Lo-fi Coding", tracks: 18 },
    { id: 3, name: "Cyberpunk Ambience", tracks: 42 },
    { id: 4, name: "Synthwave Classics", tracks: 30 },
    { id: 5, name: "Deep Focus", tracks: 12 },
];

const sharedAlbums = [
    { id: 1, name: "Project: Chimera", owner: "ADIOG336", collaborators: 3 },
    { id: 2, name: "Glitch Hop Collab", owner: "PixelArt", collaborators: 2 },
];

const mockMessages = [
    { id: 1, user: "PixelArt", message: "Hey, check out the new bass line at 1:45!", time: "10:30 AM" },
    { id: 2, user: "ADIOG336", message: "Nice! I'll overlay some synth pads there.", time: "10:32 AM" },
    { id: 3, user: "SynthQueen", message: "Don't forget to fix the tempo drift in the bridge.", time: "10:45 AM" },
];

const workspaceTasks = [
    { id: 1, text: "Mix vocals for 'REQUIEM'", completed: true },
    { id: 2, text: "Adjust EQ on bass track", completed: false },
    { id: 3, text: "Finalize master export", completed: false },
];

const Workspace = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(33);
    const [volume, setVolume] = useState(75);
    const [activeTab, setActiveTab] = useState("chat");
    const [tasks, setTasks] = useState(workspaceTasks);
    const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Timer effect
    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;
        if (isTimerRunning && pomodoroTime > 0) {
            interval = setInterval(() => {
                setPomodoroTime((prev) => prev - 1);
            }, 1000);
        } else if (pomodoroTime === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, pomodoroTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    return (
        <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
            {/* Background Animated GIF */}
            <div className="fixed inset-0 z-0">
                <img
                    src={raniGif}
                    alt="Workspace Background"
                    className="w-full h-full object-cover opacity-30 filter blur-sm scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            </div>

            <Navbar />

            <div className="relative z-10 pt-24 pb-8 px-4 h-screen flex flex-col">
                <div className="grid grid-cols-12 gap-6 h-full max-w-[1600px] mx-auto w-full">

                    {/* LEFT SIDEBAR - Library & Navigation */}
                    <div className="col-span-2 hidden lg:flex flex-col gap-6 h-full">
                        <div className="glass-panel p-4 flex-1 rounded-2xl border border-white/10 backdrop-blur-xl bg-black/40 flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2 mb-6 px-2">
                                <ListMusic className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold tracking-tight text-white/90">Library</h2>
                            </div>

                            <ScrollArea className="flex-1 -mx-2 px-2">
                                <div className="space-y-6">
                                    {/* Playlists Section */}
                                    <div>
                                        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-2">My Playlists</h3>
                                        <div className="space-y-1">
                                            {playlists.map(playlist => (
                                                <button key={playlist.id} className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 transition-colors group flex justify-between items-center">
                                                    <span className="text-sm text-gray-300 group-hover:text-white truncate">{playlist.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shared Albums Section */}
                                    <div>
                                        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-2">Shared Albums</h3>
                                        <div className="space-y-1">
                                            {sharedAlbums.map(album => (
                                                <button key={album.id} className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 transition-colors group">
                                                    <div className="text-sm text-gray-300 group-hover:text-white truncate">{album.name}</div>
                                                    <div className="text-xs text-gray-500 truncate">By {album.owner}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>

                            <div className="pt-4 mt-2 border-t border-white/10">
                                <Button variant="outline" className="w-full justify-start gap-2 border-primary/30 hover:bg-primary/20 hover:text-primary text-primary/80">
                                    <Plus className="w-4 h-4" />
                                    New Playlist
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* CENTER MAIN PANEL - Player & Tasks */}
                    <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 h-full">

                        {/* Top Status Strip */}
                        <div className="glass-panel px-6 py-3 rounded-full flex items-center justify-between border border-white/10 backdrop-blur-md bg-black/30">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <span className="text-sm font-medium text-white/80">Project: <span className="text-primary font-bold">REQUIEM</span></span>
                            </div>

                            <div className="hidden md:flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <Avatar className="w-6 h-6 border border-black"><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>CN</AvatarFallback></Avatar>
                                    <Avatar className="w-6 h-6 border border-black"><AvatarImage src="https://github.com/1.png" /><AvatarFallback>P2</AvatarFallback></Avatar>
                                    <div className="w-6 h-6 rounded-full bg-gray-800 border border-black flex items-center justify-center text-[9px] text-white font-bold">+2</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="font-mono text-sm font-bold w-12 text-center">{formatTime(pomodoroTime)}</span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="w-6 h-6 rounded-full hover:bg-primary/20 text-primary"
                                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                                >
                                    <div className={`w-2 h-2 rounded-sm ${isTimerRunning ? 'bg-primary' : 'border border-current'}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Main Player Card */}
                        <div className="flex-1 glass-panel rounded-3xl border border-white/10 backdrop-blur-xl bg-gradient-to-br from-black/60 to-black/40 p-8 flex flex-col justify-between relative overflow-hidden group">
                            {/* Animated Glow Backdrop */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none" />

                            <div className="flex justify-between items-start z-10">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-2">
                                        <Disc className="w-3 h-3 animate-spin duration-[3s]" /> Now Playing
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">Midnight City</h1>
                                    <p className="text-lg text-white/60 font-light">M83 • Hurry Up, We're Dreaming</p>
                                </div>
                                <Button size="icon" variant="ghost" className="text-white/40 hover:text-white">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Visualizer Placeholder */}
                            <div className="flex-1 flex items-center justify-center py-8 z-10">
                                <div className="flex items-end justify-center gap-1 h-32 w-full max-w-md mx-auto opacity-80">
                                    {[...Array(20)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 bg-primary rounded-t-full transition-all duration-300 ease-in-out"
                                            style={{ height: `${isPlaying ? Math.max(20, Math.random() * 100) : 20}%`, opacity: 0.5 + Math.random() * 0.5 }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 z-10">
                                {/* Progress Bar */}
                                <div className="space-y-2 group/progress">
                                    <div className="flex justify-between text-xs font-mono text-gray-400">
                                        <span>1:24</span>
                                        <span>4:03</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                                        <div className="h-full bg-primary w-1/3 relative shadow-[0_0_10px_rgba(var(--primary),0.8)]">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 shadow shadow-black transition-opacity" />
                                        </div>
                                    </div>
                                </div>

                                {/* Player Controls */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <Button size="icon" variant="ghost" className="hover:text-white"><Shuffle className="w-4 h-4" /></Button>
                                        <Button size="icon" variant="ghost" className="hover:text-white"><Repeat className="w-4 h-4" /></Button>
                                    </div>

                                    <div className="flex items-center gap-6 md:gap-8">
                                        <Button size="icon" variant="ghost" className="hover:text-white hover:scale-110 transition"><SkipBack className="w-6 h-6" /></Button>
                                        <Button
                                            size="icon"
                                            className="w-16 h-16 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)]"
                                            onClick={() => setIsPlaying(!isPlaying)}
                                        >
                                            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                                        </Button>
                                        <Button size="icon" variant="ghost" className="hover:text-white hover:scale-110 transition"><SkipForward className="w-6 h-6" /></Button>
                                    </div>

                                    <div className="flex items-center gap-2 w-24 md:w-32 group/volume">
                                        <Volume2 className="w-4 h-4 text-gray-400 group-hover/volume:text-white" />
                                        <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                                            <div className="h-full bg-gray-400 group-hover/volume:bg-primary w-[75%]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Task Checklist Strip */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/10 backdrop-blur-md bg-black/40">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-white/80">Session Tasks</h3>
                                <span className="text-xs text-gray-500 font-mono">{tasks.filter(t => t.completed).length}/{tasks.length} Completed</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {tasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all select-none",
                                            task.completed
                                                ? "bg-primary/20 border-primary/40 text-primary line-through opacity-60"
                                                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20"
                                        )}
                                    >
                                        {task.completed ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                                        {task.text}
                                    </div>
                                ))}
                                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-white/20 text-xs text-gray-500 hover:text-primary hover:border-primary/50 transition-colors">
                                    <Plus className="w-3 h-3" /> Add Task
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR - Tabs */}
                    <div className="col-span-12 lg:col-span-3 h-full flex flex-col">
                        <div className="glass-panel flex-1 rounded-2xl border border-white/10 backdrop-blur-xl bg-black/40 overflow-hidden flex flex-col">
                            <Tabs defaultValue="chat" className="flex flex-col h-full w-full" onValueChange={setActiveTab}>
                                <div className="px-4 pt-4 pb-2 border-b border-white/10">
                                    <TabsList className="w-full bg-white/5 p-1">
                                        <TabsTrigger value="notes" className="flex-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><ListMusic className="w-4 h-4 mr-1" /> Notes</TabsTrigger>
                                        <TabsTrigger value="chat" className="flex-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><MessageSquare className="w-4 h-4 mr-1" /> Chat</TabsTrigger>
                                        <TabsTrigger value="info" className="flex-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Tag className="w-4 h-4 mr-1" /> Info</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="notes" className="flex-1 flex flex-col p-4 m-0 outline-none overflow-hidden">
                                    <ScrollArea className="flex-1 -mr-3 pr-3">
                                        <div className="space-y-4">
                                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-primary text-xs font-mono">01:45</span>
                                                    <span className="text-[10px] text-gray-500">Just now</span>
                                                </div>
                                                <p className="text-sm text-gray-300">Needs more reverb on the backing vocals to widen the stereo field.</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-lg border border-white/10 opacity-70">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-primary text-xs font-mono">03:20</span>
                                                    <span className="text-[10px] text-gray-500">2h ago</span>
                                                </div>
                                                <p className="text-sm text-gray-300">Cut the low frequencies on the synth pad.</p>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <div className="relative">
                                            <Input placeholder="Add a timestamped note..." className="bg-black/40 border-white/10 pr-10 text-sm focus-visible:ring-primary/50" />
                                            <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8 text-primary hover:text-white"><Send className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="chat" className="flex-1 flex flex-col p-4 m-0 outline-none overflow-hidden">
                                    <ScrollArea className="flex-1 -mr-3 pr-3">
                                        <div className="space-y-4">
                                            {mockMessages.map(msg => (
                                                <div key={msg.id} className="flex gap-3 items-start">
                                                    <Avatar className="w-8 h-8 mt-1 border border-white/10">
                                                        <AvatarFallback className="bg-primary/10 text-[10px]">{msg.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-baseline mb-0.5">
                                                            <span className="text-xs font-bold text-gray-200">{msg.user}</span>
                                                            <span className="text-[10px] text-gray-600">{msg.time}</span>
                                                        </div>
                                                        <div className="p-2 bg-white/5 rounded-r-lg rounded-bl-lg border border-white/5 text-sm text-gray-300">
                                                            {msg.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <div className="flex gap-2">
                                            <Input placeholder="Team chat..." className="bg-black/40 border-white/10 text-sm focus-visible:ring-primary/50 flex-1" />
                                            <Button size="icon" className="bg-primary hover:bg-primary/90 text-black"><Send className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="info" className="flex-1 p-4 m-0 outline-none">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mood Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {["Synthwave", "Chill", "Night Drive", "Retro"].map(tag => (
                                                    <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-primary">{tag}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Track Details</h4>
                                            <div className="flex justify-between text-sm py-1 border-b border-white/5">
                                                <span className="text-gray-400">Key</span>
                                                <span className="text-white">F Minor</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-1 border-b border-white/5">
                                                <span className="text-gray-400">BPM</span>
                                                <span className="text-white">128</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-1 border-b border-white/5">
                                                <span className="text-gray-400">Duration</span>
                                                <span className="text-white">4:03</span>
                                            </div>
                                        </div>
                                    </div>
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
