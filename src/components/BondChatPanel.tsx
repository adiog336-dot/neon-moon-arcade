import { useState, useEffect, useRef } from "react";
import { Send, Lock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";

export const BondChatPanel = ({ bondId, currentUserId }: { bondId: string; currentUserId: string }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);

    // Store user IDs to Bond Codes mapping for display
    const [userCodes, setUserCodes] = useState<Record<string, string>>({});

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!supabase || !bondId) {
            setLoading(false);
            return;
        }

        const fetchMessages = async () => {
            setLoading(true);
            try {
                // 1. Fetch participants of this bond 
                const { data: bond } = await supabase
                    .from("bonds")
                    .select("user1_id, user2_id")
                    .eq("id", bondId)
                    .single();

                if (bond) {
                    // Fetch codes for participants
                    const { data: codes } = await supabase
                        .from("bond_codes")
                        .select("user_id, code")
                        .in("user_id", [bond.user1_id, bond.user2_id]);

                    if (codes) {
                        const codeMap: Record<string, string> = {};
                        codes.forEach(c => { codeMap[c.user_id] = c.code; });
                        setUserCodes(codeMap);
                    }
                }

                // 2. Fetch history
                const { data: history } = await supabase
                    .from("bond_messages")
                    .select("*")
                    .eq("bond_id", bondId)
                    .order("created_at", { ascending: true });

                if (history) setMessages(history);

            } catch (e) {
                console.error("Chat error:", e);
            } finally {
                setLoading(false);
                scrollToBottom();
            }
        };

        fetchMessages();

        // 3. Set up Realtime subscription
        const channel = supabase
            .channel(`bond_chat_${bondId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bond_messages',
                    filter: `bond_id=eq.${bondId}`
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                    setTimeout(scrollToBottom, 100);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [bondId]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !supabase || !bondId || !currentUserId) return;

        setSending(true);
        try {
            await supabase.from("bond_messages").insert({
                bond_id: bondId,
                sender_id: currentUserId,
                message: input.trim()
            });
            setInput("");
        } catch (e) {
            console.error(e);
        } finally {
            setSending(false);
            scrollToBottom();
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
                <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--blood-red))]" />
                <p className="text-xs pixel-font tracking-widest">DECRYPTING CHAT…</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-black/20 rounded-xl overflow-hidden">
            {/* Header info */}
            <div className="px-3 py-2 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[hsl(var(--blood-red))]" />
                <span className="text-[10px] font-mono text-gray-400">ENCRYPTED CHANNEL P2P</span>
            </div>

            {/* Message Area */}
            <ScrollArea className="flex-1 p-3">
                <div className="space-y-4" ref={scrollRef}>
                    {messages.length === 0 ? (
                        <div className="text-center py-10 text-xs font-mono text-gray-600">
                            NO MESSAGES YET. START SECURE COMMS.
                        </div>
                    ) : (
                        messages.map((msg, i) => {
                            const isMe = msg.sender_id === currentUserId;
                            const d = new Date(msg.created_at);
                            const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
                            const code = userCodes[msg.sender_id] || "UNKNOWN";

                            // Grouping logic simple: if previous message is same user, don't show name again
                            const showHeader = i === 0 || messages[i - 1].sender_id !== msg.sender_id;

                            return (
                                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    {showHeader && (
                                        <div className="flex items-center gap-1.5 mb-1 px-1">
                                            <span className={`text-[10px] font-bold ${isMe ? 'text-[hsl(var(--blood-red))]' : 'text-blue-400'}`}>
                                                {isMe ? 'YOU' : code}
                                            </span>
                                            <span className="text-[9px] text-gray-600 font-mono">{timeStr}</span>
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[85%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed break-words ${isMe
                                                ? 'bg-[hsl(var(--blood-red))]/20 border border-[hsl(var(--blood-red))]/30 text-white rounded-tr-sm'
                                                : 'bg-white/10 border border-white/5 text-gray-200 rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 bg-white/[0.02] border-t border-white/5">
                <div className="relative flex items-center">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Transmit message…"
                        className="bg-black/60 border-white/10 pr-10 text-sm focus-visible:ring-[hsl(var(--blood-red))]/50 text-white placeholder:text-gray-600 font-mono"
                        autoComplete="off"
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSend}
                        disabled={!input.trim() || sending}
                        className="absolute right-1 h-8 w-8 text-[hsl(var(--blood-red))] hover:text-white disabled:opacity-30 bg-transparent"
                    >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
};
