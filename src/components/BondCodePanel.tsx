import { useState, useEffect } from "react";
import { Copy, Plus, Users, Search, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export const BondCodePanel = () => {
    const [bondCode, setBondCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // For sending a request
    const [friendCode, setFriendCode] = useState("");
    const [sendLoading, setSendLoading] = useState(false);
    const [sendMsg, setSendMsg] = useState<{ text: string; error: boolean } | null>(null);

    useEffect(() => {
        const fetchCode = async () => {
            try {
                if (!supabase) return;
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Try fetching the bond code
                const { data, error } = await supabase
                    .from("bond_codes")
                    .select("code")
                    .eq("user_id", user.id)
                    .single();

                if (data?.code) {
                    setBondCode(data.code);
                } else {
                    // Generate one if it doesn't exist (fallback safety)
                    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                    const { data: newRow, error: insertError } = await supabase
                        .from("bond_codes")
                        .insert({ user_id: user.id, code: newCode })
                        .select("code")
                        .single();

                    if (newRow?.code) {
                        setBondCode(newRow.code);
                    }
                }
            } catch (err) {
                console.error("Error fetching bond code:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCode();
    }, []);

    const copyCode = () => {
        if (!bondCode) return;
        navigator.clipboard.writeText(bondCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendRequest = async () => {
        const code = friendCode.trim().toUpperCase();
        if (!code || !supabase) return;

        setSendLoading(true);
        setSendMsg(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not logged in");

            if (code === bondCode) {
                setSendMsg({ text: "You cannot add yourself.", error: true });
                return;
            }

            // 1. Find user_id for this bond code
            const { data: targetCodeData, error: targetCodeError } = await supabase
                .from("bond_codes")
                .select("user_id")
                .eq("code", code)
                .single();

            if (targetCodeError || !targetCodeData) {
                setSendMsg({ text: "Bond Code not found.", error: true });
                return;
            }

            const targetUserId = targetCodeData.user_id;

            // 2. Check if a request already exists between these two users
            const { data: existingReq, error: reqErr } = await supabase
                .from("bond_requests")
                .select("id, status")
                .or(`and(from_user.eq.${user.id},to_user.eq.${targetUserId}),and(from_user.eq.${targetUserId},to_user.eq.${user.id})`)
                .maybeSingle();

            if (existingReq) {
                if (existingReq.status === 'pending') {
                    setSendMsg({ text: "A request is already pending.", error: true });
                } else if (existingReq.status === 'accepted') {
                    setSendMsg({ text: "You are already bonded.", error: true });
                }
                return;
            }

            // 3. Check if a bond already exists directly
            const u1 = user.id < targetUserId ? user.id : targetUserId;
            const u2 = user.id < targetUserId ? targetUserId : user.id;

            const { data: existingBond } = await supabase
                .from("bonds")
                .select("id")
                .eq("user1_id", u1)
                .eq("user2_id", u2)
                .maybeSingle();

            if (existingBond) {
                setSendMsg({ text: "You are already bonded.", error: true });
                return;
            }

            // 4. Send request
            const { error: insertError } = await supabase
                .from("bond_requests")
                .insert({
                    from_user: user.id,
                    to_user: targetUserId,
                    status: 'pending'
                });

            if (insertError) throw insertError;

            setSendMsg({ text: "Bond Request Sent!", error: false });
            setFriendCode("");

        } catch (err: any) {
            console.error("Send request error:", err);
            setSendMsg({ text: "Failed to send request.", error: true });
        } finally {
            setSendLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--blood-red))]" />
            </div>
        );
    }

    return (
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 bg-black/40 space-y-6">

            {/* My Code Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[hsl(var(--blood-red))]" />
                    <h3 className="text-sm font-bold tracking-tight text-white/90 pixel-font">MY BOND CODE</h3>
                </div>

                <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-2 pl-4">
                    <span className="flex-1 font-mono text-xl tracking-widest text-[hsl(var(--blood-red))] font-bold py-1">
                        {bondCode || "NO_CODE"}
                    </span>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={copyCode}
                        className="bg-white/5 hover:bg-white/10 text-white rounded-lg h-10 w-10 flex-shrink-0"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
                <p className="text-xs text-gray-500">Share this code with a friend so they can send you a Bond Request.</p>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Add Friend Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-white/90 pixel-font flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" /> FIND COLLABORATOR
                </h3>

                <div className="space-y-3">
                    <div className="relative">
                        <Input
                            value={friendCode}
                            onChange={(e) => setFriendCode(e.target.value.toUpperCase().slice(0, 6))}
                            placeholder="ENTER 6-DIGIT CODE"
                            className="bg-black/50 border-white/10 font-mono tracking-widest text-center text-lg uppercase h-12 focus-visible:ring-[hsl(var(--blood-red))]/50"
                            maxLength={6}
                        />
                    </div>

                    <Button
                        onClick={handleSendRequest}
                        disabled={friendCode.length < 6 || sendLoading}
                        className="w-full bg-[hsl(var(--blood-red))] hover:bg-red-700 text-white font-bold h-10"
                    >
                        {sendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "SEND BOND REQUEST"}
                    </Button>

                    {sendMsg && (
                        <p className={`text-xs text-center py-1 flex items-center justify-center gap-1.5 ${sendMsg.error ? "text-red-400" : "text-green-400"}`}>
                            {sendMsg.error ? <AlertCircle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                            {sendMsg.text}
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
};
