import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { BondCodePanel } from "@/components/BondCodePanel";
import { Users, UserPlus, Check, X, ShieldAlert, Loader2, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export const CollabsPage = () => {
    const [activeView, setActiveView] = useState("collabs");

    // Data State
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [bonds, setBonds] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            // Fetch Pending Requests (received)
            // JOIN with profiles or auth is tricky without full access, 
            // In a real app we'd need a view, but we'll fetch the bonding code as the "username" proxy for now.
            const { data: reqs } = await supabase
                .from("bond_requests")
                .select("id, from_user, created_at, status")
                .eq("to_user", user.id)
                .eq("status", "pending")
                .order("created_at", { ascending: false });

            // Enhance requests with sender's bond_code as display name workaround
            if (reqs && reqs.length > 0) {
                const senders = reqs.map(r => r.from_user);
                const { data: codes } = await supabase
                    .from("bond_codes")
                    .select("user_id, code")
                    .in("user_id", senders);

                const enriched = reqs.map(req => {
                    const c = codes?.find(cd => cd.user_id === req.from_user);
                    return { ...req, senderCode: c?.code || 'Unknown' };
                });
                setPendingRequests(enriched);
            } else {
                setPendingRequests([]);
            }

            // Fetch Active Bonds
            const { data: activeBonds } = await supabase
                .from("bonds")
                .select("*")
                .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
                .order("created_at", { ascending: false });

            if (activeBonds && activeBonds.length > 0) {
                // Get the partner's id for each bond
                const partnerIds = activeBonds.map(b => b.user1_id === user.id ? b.user2_id : b.user1_id);
                // Fetch partner bond codes
                const { data: pCodes } = await supabase
                    .from("bond_codes")
                    .select("user_id, code")
                    .in("user_id", partnerIds);

                const enrichedBonds = activeBonds.map(bond => {
                    const pId = bond.user1_id === user.id ? bond.user2_id : bond.user1_id;
                    const c = pCodes?.find(cd => cd.user_id === pId);
                    return { ...bond, partnerId: pId, partnerCode: c?.code || 'Unknown' };
                });
                setBonds(enrichedBonds);
            } else {
                setBonds([]);
            }

        } catch (err) {
            console.error("Error fetching collabs data:", err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Listen for requests (Basic auto-refresh setup)
        // A production app would use Supabase Realtime here.
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAccept = async (requestId: string, senderId: string) => {
        if (!supabase || !userId) return;
        try {
            // Update request status
            await supabase.from("bond_requests").update({ status: 'accepted' }).eq("id", requestId);

            // Insert into bonds (ensure u1 < u2)
            const u1 = userId < senderId ? userId : senderId;
            const u2 = userId < senderId ? senderId : userId;

            await supabase.from("bonds").insert({ user1_id: u1, user2_id: u2 });

            fetchData(); // Refresh list
        } catch (e) {
            console.error(e);
        }
    };

    const handleReject = async (requestId: string) => {
        if (!supabase) return;
        try {
            await supabase.from("bond_requests").delete().eq("id", requestId);
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,rgba(0,0,0,1)_100%)] opacity-50" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            </div>

            <Navbar activeView={activeView} onNavigate={setActiveView} />

            <div className="relative z-10 pt-28 pb-12 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen flex flex-col">

                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                        COLLABORATION <span className="text-[hsl(var(--blood-red))]">HUB</span>
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm pixel-font tracking-widest uppercase">
                        Manage your bonds and connection requests.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">

                    {/* Left: Find & My Code */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <BondCodePanel />

                        <div className="glass-panel p-5 rounded-2xl border border-[hsl(var(--blood-red))]/20 bg-black/40 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--blood-red))]/5 to-transparent pointer-events-none" />
                            <ShieldAlert className="w-8 h-8 text-[hsl(var(--blood-red))] mb-3 opacity-80" />
                            <h4 className="text-sm font-bold tracking-wider mb-2 text-white">WHAT IS A BOND?</h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-mono">
                                Forming a bond allows two users to unlock a unified Workspace experience.
                                Once bonded, you'll be able to see each other's music libraries, listen together,
                                and unlock the encrypted Chat terminal.
                            </p>
                        </div>
                    </div>

                    {/* Right: Requests & Active Bonds */}
                    <div className="lg:col-span-8 flex flex-col gap-6 h-[70vh]">

                        {/* Pending Requests */}
                        <div className="glass-panel rounded-3xl border border-white/10 bg-black/60 flex flex-col max-h-[40%] overflow-hidden">
                            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UserPlus className="w-5 h-5 text-yellow-500" />
                                    <h2 className="text-sm font-bold tracking-tight text-white/90 pixel-font">INCOMING REQUESTS</h2>
                                </div>
                                {pendingRequests.length > 0 && (
                                    <span className="bg-[hsl(var(--blood-red))] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {pendingRequests.length}
                                    </span>
                                )}
                            </div>
                            <ScrollArea className="flex-1 p-2">
                                {loadingData ? (
                                    <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-500" /></div>
                                ) : pendingRequests.length === 0 ? (
                                    <div className="text-center py-8 text-xs font-mono text-gray-500">NO PENDING REQUESTS</div>
                                ) : (
                                    <div className="space-y-2">
                                        {pendingRequests.map(req => (
                                            <div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between hover:bg-white/[0.08] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full border border-white/20 bg-black flex items-center justify-center font-mono text-xs text-white overflow-hidden">
                                                        <img src="https://i.pravatar.cc/100" alt="avatar" className="w-full h-full object-cover opacity-60" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white tracking-widest">{req.senderCode}</p>
                                                        <p className="text-[10px] text-gray-400">wants to bond</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="icon"
                                                        onClick={() => handleAccept(req.id, req.from_user)}
                                                        className="h-8 w-8 bg-green-500/20 hover:bg-green-500 hover:text-white text-green-400 rounded-full transition-all border border-green-500/50"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleReject(req.id)}
                                                        className="h-8 w-8 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Active Bonds */}
                        <div className="glass-panel flex-1 rounded-3xl border border-white/10 bg-black/60 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
                                <Users className="w-5 h-5 text-blue-400" />
                                <h2 className="text-sm font-bold tracking-tight text-white/90 pixel-font">ACTIVE BONDS</h2>
                            </div>
                            <ScrollArea className="flex-1 p-4">
                                {loadingData ? (
                                    <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-500" /></div>
                                ) : bonds.length === 0 ? (
                                    <div className="text-center py-12 flex flex-col items-center gap-3 text-gray-500">
                                        <Users className="w-12 h-12 opacity-50" />
                                        <div className="text-xs font-mono uppercase tracking-widest">No active bonds yet</div>
                                        <div className="text-[10px] font-mono">Share your bond code to start collaborating</div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {bonds.map(bond => (
                                            <div key={bond.id} className="relative group bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden transition-all hover:bg-white/[0.08] hover:border-[hsl(var(--blood-red))]/50">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-[hsl(var(--blood-red))]/10 rounded-bl-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="w-12 h-12 rounded-xl border border-white/20 bg-black overflow-hidden relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                                        {/* Placeholder animated image for bond */}
                                                        <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${bond.partnerCode}`} alt="avatar" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-400 font-mono tracking-wider mb-1">PARTNER</p>
                                                        <p className="text-lg font-bold text-white tracking-widest">{bond.partnerCode}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex gap-2 relative z-10">
                                                    <Button
                                                        className="flex-1 h-8 bg-black/50 border border-white/10 hover:border-white/30 text-xs text-white"
                                                        onClick={() => window.location.href = '/workspace'}
                                                    >
                                                        <Play className="w-3 h-3 mr-2" /> Enter Workspace
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
