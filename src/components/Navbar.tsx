
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Plus, User, LogOut, Music, Menu, X } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import ProfileEditorModal from "@/components/ProfileEditorModal";


interface NavbarProps {
    activeView?: string;
    onNavigate?: (view: string) => void;
    /** Called when user saves profile changes so parent can update character + avatar */
    onProfileSaved?: (characterId: string, avatarUrl: string) => void;
    /** Currently selected character id (from parent) */
    currentCharacterId?: string | null;
    /** Current avatar URL (from parent) */
    currentAvatarUrl?: string;
}

const Navbar = ({
    activeView = "home",
    onNavigate,
    onProfileSaved,
    currentCharacterId = null,
    currentAvatarUrl = "",
}: NavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const navigate = useNavigate();

    // Keep internal avatarUrl in sync when parent updates it
    useEffect(() => {
        setAvatarUrl(currentAvatarUrl);
    }, [currentAvatarUrl]);

    useEffect(() => {
        // Load avatar from Supabase profiles
        const loadAvatar = async () => {
            if (!supabase) {
                const stored = window.localStorage.getItem("nm-avatar-url");
                if (stored) setAvatarUrl(stored);
                return;
            }
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                const stored = window.localStorage.getItem(`nm-avatar-${user.id}`);
                if (stored) setAvatarUrl(stored);
                const { data } = await supabase
                    .from("profiles")
                    .select("avatar_url")
                    .eq("id", user.id)
                    .single();
                if (data?.avatar_url) {
                    setAvatarUrl(data.avatar_url);
                    window.localStorage.setItem(`nm-avatar-${user.id}`, data.avatar_url);
                }
            } catch { }
        };

        const fetchPendingRequests = async () => {
            try {
                if (!supabase) return;
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, count } = await supabase
                    .from("bond_requests")
                    .select("*", { count: 'exact' })
                    .eq("to_user", user.id)
                    .eq("status", "pending");

                if (data) {
                    const senderIds = data.map(r => r.from_user);
                    const { data: codes } = await supabase
                        .from("bond_codes")
                        .select("user_id, code")
                        .in("user_id", senderIds);

                    const enriched = data.map(req => ({
                        ...req,
                        senderCode: codes?.find(c => c.user_id === req.from_user)?.code || "Unknown"
                    }));
                    setNotifications(enriched);
                    setPendingCount(count || 0);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        loadAvatar();
        fetchPendingRequests();

        const interval = setInterval(fetchPendingRequests, 60000);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearInterval(interval);
        };
    }, []);

    const navLinks = [
        { name: "Home", path: "/dashboard", view: "home" },
        { name: "Workspace", path: "/workspace", view: "workspace" },
        { name: "Albums", path: "/dashboard?view=albums", view: "albums" },
        { name: "Collabs", path: "/collabs", view: "collabs" },
    ];

    const handleLinkClick = (e: React.MouseEvent, item: typeof navLinks[0]) => {
        if (onNavigate && item.view && (item.path.startsWith("/dashboard") || item.view === "home")) {
            e.preventDefault();
            onNavigate(item.view);
        }
    };

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
                            onClick={(e) => handleLinkClick(e, item)}
                            className={cn(
                                "text-sm font-medium transition-all hover:text-white relative group py-1",
                                activeView === item.view ? "text-white" : "text-gray-300"
                            )}
                        >
                            {item.name}
                            <span className={cn(
                                "absolute -bottom-1 left-1/2 h-[2px] bg-primary -translate-x-1/2 transition-all duration-300 shadow-[0_0_8px_rgba(var(--primary),0.8)]",
                                activeView === item.view ? "w-full" : "w-0 group-hover:w-full"
                            )} />
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full relative"
                            >
                                <Bell className="w-5 h-5" />
                                {pendingCount > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-80 bg-black/90 backdrop-blur-xl border border-white/10 text-gray-200 mt-2 p-0 overflow-hidden animate-in fade-in-0 zoom-in-95"
                        >
                            <DropdownMenuLabel className="p-4 flex items-center justify-between border-b border-white/10">
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">Notifications</span>
                                {pendingCount > 0 && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">{pendingCount} New</span>}
                            </DropdownMenuLabel>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-20" />
                                        <p className="text-xs text-gray-500 font-mono">NO NEW NOTIFICATIONS</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors group relative"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white mb-1">
                                                        Bond Request
                                                    </p>
                                                    <p className="text-xs text-gray-400 leading-normal">
                                                        User <span className="text-primary font-bold">{notif.senderCode}</span> wants to bond with you.
                                                    </p>
                                                    <div className="flex gap-2 mt-3">
                                                        <Button
                                                            size="sm"
                                                            className="h-7 text-[10px] bg-primary hover:bg-primary/80 text-white"
                                                            onClick={() => navigate("/collabs")}
                                                        >
                                                            View Details
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-7 text-[10px] text-gray-400 hover:text-white hover:bg-white/10"
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                try {
                                                                    if (!supabase) return;
                                                                    await supabase.from("bond_requests").delete().eq("id", notif.id);
                                                                    setNotifications(prev => prev.filter(n => n.id !== notif.id));
                                                                    setPendingCount(prev => Math.max(0, prev - 1));
                                                                } catch (err) {
                                                                    console.error(err);
                                                                }
                                                            }}
                                                        >
                                                            Dismiss
                                                        </Button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        try {
                                                            if (!supabase) return;
                                                            await supabase.from("bond_requests").delete().eq("id", notif.id);
                                                            setNotifications(prev => prev.filter(n => n.id !== notif.id));
                                                            setPendingCount(prev => Math.max(0, prev - 1));
                                                        } catch (err) {
                                                            console.error(err);
                                                        }
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <Link
                                    to="/collabs"
                                    className="block p-3 text-center text-[10px] font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all border-t border-white/10 uppercase tracking-widest"
                                >
                                    See all regular updates in Hub
                                </Link>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Create Button */}
                    <Button
                        onClick={() => {
                            if (onNavigate) onNavigate("albums");
                            navigate("/dashboard?view=albums&action=create");
                        }}
                        className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full px-6 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] hover:scale-105 active:scale-95"
                    >
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
                                    <AvatarImage src={avatarUrl} className="object-cover" />
                                    <AvatarFallback className="bg-primary/20 text-primary font-bold">ME</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 bg-black/80 backdrop-blur-xl border border-white/10 text-gray-200 mt-2 animate-in fade-in-0 zoom-in-95"
                        >
                            <DropdownMenuLabel className="text-gray-400 font-normal text-xs uppercase tracking-wider">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                                className="focus:bg-primary/20 focus:text-primary cursor-pointer transition-colors"
                                onClick={() => setShowProfileModal(true)}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                                className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer transition-colors"
                                onClick={async () => {
                                    if (supabase) await supabase.auth.signOut();
                                    navigate("/");
                                }}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Profile Editor Modal */}
                    <ProfileEditorModal
                        open={showProfileModal}
                        onClose={() => setShowProfileModal(false)}
                        currentCharacterId={currentCharacterId}
                        currentAvatarUrl={avatarUrl}
                        onSaved={(charId, newAvatarUrl) => {
                            setAvatarUrl(newAvatarUrl);
                            onProfileSaved?.(charId, newAvatarUrl);
                        }}
                    />

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
                                                onClick={(e) => {
                                                    handleLinkClick(e, item);
                                                    // Close sheet if navigating within dashboard
                                                    if (onNavigate && item.view && (item.path.startsWith("/dashboard") || item.view === "home")) {
                                                        // Note: We don't have easy access to close the sheet here without more state, 
                                                        // but handleLinkClick will prevent default and we can rely on standard Link behavior for others.
                                                    }
                                                }}
                                                className={cn(
                                                    "text-lg font-medium transition-colors flex items-center gap-3",
                                                    activeView === item.view ? "text-primary" : "text-gray-400 hover:text-white"
                                                )}
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
