import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import gngGif from "@/assets/gng.gif";
import CRTOverlay from "@/components/CRTOverlay";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!supabase) {
            toast({
                title: "Configuration Error",
                description: "Supabase is not configured. Please check your environment variables.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                toast({
                    title: "Success",
                    description: "Check your email for the confirmation link.",
                });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast({
                    title: "Logged in",
                    description: "Welcome back to the arcade!",
                });
                navigate("/");
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            {/* Background GIF */}
            <div className="absolute inset-0 z-0">
                <img
                    src={gngGif}
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" /> {/* Darken background for readability */}
            </div>

            <CRTOverlay />

            {/* Glassmorphism Modal */}
            <div
                className="relative z-10 w-full max-w-[420px] backdrop-blur-md bg-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.1)] transition-all animate-float"
                style={{
                    /* Pixel-styled faceted corners */
                    clipPath: "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
            >
                <div className="mt-4 mb-10 text-center">
                    <h1 className="pixel-font text-3xl text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                        {isSignUp ? "SIGNUP" : "LOGIN"}
                    </h1>
                </div>

                <form onSubmit={handleAuth} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-white/80 pixel-font text-[10px] uppercase block tracking-widest">
                            Email_Input
                        </label>
                        <Input
                            type="email"
                            placeholder="USER@NEONMOON.XYZ"
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 h-12 pixel-font text-xs focus-visible:ring-primary/50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-white/80 pixel-font text-[10px] uppercase block tracking-widest">
                            Password_Hash
                        </label>
                        <Input
                            type="password"
                            placeholder="********"
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 h-12 pixel-font text-xs focus-visible:ring-primary/50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-background pixel-font text-sm h-14 shadow-lg hover:translate-y-[-2px] active:translate-y-[1px] transition-all disabled:grayscale"
                    >
                        {loading ? "PROCESSING..." : isSignUp ? "EXEC_REGISTER" : "EXEC_LOGIN"}
                    </Button>
                </form>

                <div className="mt-10 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-white/50 pixel-font text-[10px] hover:text-white transition-colors flex flex-col items-center gap-2 mx-auto"
                    >
                        <span className="uppercase tracking-widest">
                            {isSignUp ? "SWITCH TO LOGIN" : "NEED ACCESS?"}
                        </span>
                        <div className="h-[1px] w-0 group-hover:w-full bg-primary transition-all duration-300" />
                    </button>

                    {/* Status Indicators */}
                    <div className="mt-8 flex justify-center gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-primary/40 animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Auth;

