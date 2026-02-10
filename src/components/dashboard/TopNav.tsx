import { Search, Upload, Settings, LogOut, User, Bell, Menu, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const TopNav = () => {
    return (
        <header className="fixed top-2 left-0 right-0 z-50 px-2 sm:px-4">
            <div className="dashboard-container">
                <div className="retro-nav-box h-12 sm:h-14 flex items-center overflow-hidden">
                    {/* Brand / Logo Section */}
                    <div className="bg-black text-[hsl(var(--parchment))] px-4 h-full flex items-center gap-2 border-r-4 border-black">
                        <span className="pixel-font text-xs sm:text-sm tracking-tighter">DENSTEY 28</span>
                    </div>

                    {/* Navigation Tabs - Desktop */}
                    <nav className="flex-1 flex h-full overflow-x-auto scrollbar-hide">
                        <button className="retro-nav-tab active">HOME</button>
                        <button className="retro-nav-tab hidden sm:flex">PROJECTS</button>
                        <button className="retro-nav-tab hidden sm:flex">TRACKS</button>
                        <button className="retro-nav-tab hidden md:flex">WORKSPACE</button>
                        <button className="retro-nav-tab hidden lg:flex">STATUS</button>
                    </nav>

                    {/* Search & Actions Area */}
                    <div className="flex items-center gap-2 px-3 sm:px-4 h-full bg-black/10 border-l-4 border-black/20">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/60" />
                            <input
                                type="text"
                                placeholder="SEARCH..."
                                className="bg-black/20 border-none text-[9px] pixel-font text-white placeholder:text-white/30 pl-7 pr-2 h-8 w-32 focus:w-48 transition-all focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4 ml-2">
                            <button className="text-white hover:scale-110 transition-transform">
                                <Upload className="w-4 h-4" />
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="focus:outline-none flex items-center gap-2 group">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black border-2 border-[hsl(var(--parchment-border))] group-hover:border-white transition-colors overflow-hidden">
                                            <Avatar className="w-full h-full rounded-none">
                                                <AvatarImage src="" />
                                                <AvatarFallback className="bg-black text-[hsl(var(--parchment))] pixel-font text-[8px] rounded-none">
                                                    AR
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-zinc-900 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-[hsl(var(--parchment))] mt-2 rounded-none p-1">
                                    <DropdownMenuLabel className="pixel-font text-[9px] opacity-50 uppercase tracking-widest px-2 py-3">
                                        USER_SETTINGS
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/5" />
                                    <DropdownMenuItem className="flex items-center gap-3 p-3 focus:bg-white/10 cursor-pointer rounded-none">
                                        <User className="w-4 h-4 text-[hsl(var(--retro-red))]" />
                                        <span className="pixel-font text-[9px]">PROFILE</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center gap-3 p-3 focus:bg-white/10 cursor-pointer rounded-none">
                                        <Settings className="w-4 h-4 text-[hsl(var(--retro-red))]" />
                                        <span className="pixel-font text-[9px]">SETTINGS</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/5" />
                                    <DropdownMenuItem className="flex items-center gap-3 p-3 focus:bg-destructive/20 text-destructive cursor-pointer rounded-none">
                                        <LogOut className="w-4 h-4" />
                                        <span className="pixel-font text-[9px]">LOGOUT</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button className="p-1 sm:hidden text-white">
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
