import TopNav from "@/components/dashboard/TopNav";
import QuickActions from "@/components/dashboard/QuickActions";
import ProjectsGrid from "@/components/dashboard/ProjectsGrid";
import RecentTracks from "@/components/dashboard/RecentTracks";
import FogBackground from "@/components/FogBackground";
import { Moon } from "lucide-react";

const Dashboard = () => {
    return (
        <div className="relative min-h-screen bg-[hsl(var(--studio-dark))] text-white">
            <TopNav />

            <main className="relative">
                {/* HERO STUDIO SECTION (Dark) - Sticky Reveal */}
                <section className="sticky top-0 h-[70vh] flex flex-col items-center justify-center pt-24 pb-32 overflow-hidden px-4 z-0">
                    <FogBackground />

                    {/* Decorative Studio Elements */}
                    <div className="absolute top-[20%] left-[10%] opacity-20 hidden lg:block">
                        <div className="w-32 h-48 bg-zinc-800 border-4 border-zinc-700 rounded-lg shadow-2xl flex flex-col items-center p-4">
                            <div className="w-20 h-20 rounded-full border-4 border-zinc-600 mb-4" />
                            <div className="w-16 h-1 bg-zinc-600 rounded mb-2" />
                            <div className="w-16 h-1 bg-zinc-600 rounded" />
                        </div>
                    </div>
                    <div className="absolute top-[20%] right-[10%] opacity-20 hidden lg:block">
                        <div className="w-32 h-48 bg-zinc-800 border-4 border-zinc-700 rounded-lg shadow-2xl flex flex-col items-center p-4">
                            <div className="w-20 h-20 rounded-full border-4 border-zinc-600 mb-4" />
                            <div className="w-16 h-1 bg-zinc-600 rounded mb-2" />
                            <div className="w-16 h-1 bg-zinc-600 rounded" />
                        </div>
                    </div>

                    {/* Moon */}
                    <div className="absolute top-32 left-[15%] text-yellow-200/40">
                        <Moon className="w-16 h-16 fill-current blur-[2px]" />
                    </div>

                    {/* Studio Terminal Panel */}
                    <div className="relative z-10 w-full max-w-4xl">
                        <QuickActions />
                    </div>
                </section>

                {/* CONTENT AREA WRAPPER - Overlays the sticky hero */}
                <div className="relative z-10 shadow-[0_-15px_60px_rgba(0,0,0,0.8)]">
                    {/* WAVY TRANSITION DIVIDER */}
                    <div className="wavy-transition" />

                    {/* CONTENT AREA (Parchment) */}
                    <section className="bg-parchment pt-16 pb-24 px-4 min-h-screen">
                        <div className="dashboard-container space-y-24">
                            {/* Welcome Text on Parchment */}
                            <div className="max-w-3xl space-y-4">
                                <h2 className="pixel-font text-2xl sm:text-3xl text-parchment-dark leading-relaxed uppercase tracking-widest border-b-4 border-black/10 pb-4">
                                    CREATIVE_SUITE <br /> v2.0 WORKING_ENV
                                </h2>
                                <p className="text-zinc-600 font-mono text-sm leading-relaxed max-w-xl">
                                    System initialized. Projects and tracks loaded via secure link.
                                    Atmosphere stabilization: 100%. Moonlight levels optimal for production.
                                </p>
                            </div>

                            {/* Projects & Tracks Grid on Parchment */}
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
                                <div className="xl:col-span-12">
                                    <ProjectsGrid />
                                </div>
                                <div className="xl:col-span-12">
                                    <RecentTracks />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer Branding (Dark) */}
            <footer className="relative z-10 py-12 bg-black border-t-8 border-[hsl(var(--retro-red))]">
                <div className="dashboard-container flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[hsl(var(--retro-red))] border-2 border-white" />
                        <span className="pixel-font text-[10px] text-white uppercase tracking-[0.3em]">DENSTEY 28 // MUSIC_WORKSPACE</span>
                    </div>
                    <div className="flex gap-8 text-[9px] pixel-font tracking-widest uppercase text-white/50">
                        <a href="#" className="hover:text-[hsl(var(--retro-red))] transition-colors">PROJECTS</a>
                        <a href="#" className="hover:text-[hsl(var(--retro-red))] transition-colors">FILES</a>
                        <a href="#" className="hover:text-[hsl(var(--retro-red))] transition-colors">ABOUT</a>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Dashboard;
