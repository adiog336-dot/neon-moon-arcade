
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Plus, User, Settings, LogOut, Music, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";


const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", path: "/dashboard" },
        { name: "Workspace", path: "/workspace" },
        { name: "Albums", path: "/albums" },
        { name: "Collabs", path: "/collabs" },
        { name: "Bond Report", path: "/bond-report" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-12 py-4 ${isScrolled
                ? "bg-black/40 backdrop-blur-md border-b border-white/5 py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="flex items-center justify-between mx-auto max-w-7xl">
                {/* Left: Logo & App Name */}
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm text-primary transition-transform group-hover:scale-110 duration-300 border border-primary/20 group-hover:border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                        <Music className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-[0.2em] text-white group-hover:text-primary transition-colors duration-300 pixel-font">
                        REQ<span className="text-primary group-hover:text-white transition-colors duration-300">UIEM</span>
                    </span>
                </Link>

                {/* Center: Navigation Links (Desktop) */}
                <div className="hidden lg:flex items-center gap-8 bg-black/20 backdrop-blur-sm px-8 py-2 rounded-full border border-white/5">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="text-sm font-medium text-gray-300 transition-all hover:text-white relative group py-1"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-primary -translate-x-1/2 transition-all group-hover:w-full duration-300 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                        </Link>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Search */}
                    <div className="hidden md:flex items-center relative">
                        <div
                            className={`flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isSearchOpen ? "w-64 opacity-100 mr-2" : "w-0 opacity-0"
                                }`}
                        >
                            <Input
                                type="text"
                                placeholder="Search tracks, artists..."
                                className="h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-primary/50 rounded-full pl-4"
                                autoFocus={isSearchOpen}
                                onBlur={() => !isSearchOpen && setIsSearchOpen(false)}
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full transition-colors ${isSearchOpen ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full relative"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                    </Button>

                    {/* Create Button */}
                    <Button className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full px-6 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] hover:scale-105 active:scale-95">
                        <Plus className="w-4 h-4" />
                        <span>Create</span>
                    </Button>

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all p-0 ring-offset-2 ring-offset-black focus:ring-2 focus:ring-primary/50 ml-1"
                            >
                                <Avatar className="w-full h-full">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback className="bg-primary/20 text-primary font-bold">AD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 bg-black/80 backdrop-blur-xl border border-white/10 text-gray-200 mt-2 animate-in fade-in-0 zoom-in-95"
                        >
                            <DropdownMenuLabel className="text-gray-400 font-normal text-xs uppercase tracking-wider">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer transition-colors">
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer transition-colors">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer transition-colors">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden ml-1">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-black/90 backdrop-blur-xl border-l border-white/10 text-white w-[300px] p-0">
                                <div className="flex flex-col gap-8 p-8">
                                    <div className="flex flex-col gap-4">
                                        {navLinks.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                className="text-lg font-medium text-gray-400 hover:text-white hover:text-primary transition-colors flex items-center gap-3"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="w-full h-px bg-white/10" />
                                    <Button className="w-full bg-primary hover:bg-primary/80 gap-2">
                                        <Plus className="w-4 h-4" /> Create New
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
