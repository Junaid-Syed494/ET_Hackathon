"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import BriefingChats from "@/components/BriefingChats";
import VideoStudio from "@/components/VideoStudio";
import StoryArc from "@/components/StoryArc";
import { Briefcase, GraduationCap, Building2, TrendingUp, Globe, Activity, LogOut } from "lucide-react";

import { TRANSLATIONS, LanguageCode } from "@/lib/translations";

const personasList = [
    { id: "investor", icon: TrendingUp },
    { id: "founder", icon: Briefcase },
    { id: "executive", icon: Building2 },
    { id: "student", icon: GraduationCap },
];

export default function Newsroom() {
    // 1. All standard state hooks
    const [activePersona, setActivePersona] = useState("investor");
    const [activeLang, setActiveLang] = useState<LanguageCode>("en");
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 2. NextAuth hooks
    const { data: session, status } = useSession();
    const router = useRouter();

    const t = TRANSLATIONS[activeLang].ui || TRANSLATIONS['en'].ui;
    const pNames = TRANSLATIONS[activeLang].personas || TRANSLATIONS['en'].personas;
    const displayArticles = activeLang === 'en' ? articles : (TRANSLATIONS[activeLang].articles || []);

    // 3. Bouncer useEffect
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            if ((session?.user as any)?.isNewUser) {
                router.push("/onboarding");
            } else if ((session?.user as any)?.persona) {
                setActivePersona((session.user as any).persona);
            }
        }
    }, [status, session, router]);

    // 4. Fetch Feed useEffect 
    useEffect(() => {
        async function fetchPersonalizedFeed() {
            setLoading(true);
            try {
                const res = await fetch(`/api/feed?persona=${activePersona}`);
                const data = await res.json();
                setArticles(data.articles || []);
            } catch (error) {
                console.error("Failed to fetch feed:", error);
            } finally {
                setLoading(false);
            }
        }
        // Only fetch if we are actually authenticated
        if (status === "authenticated") {
            fetchPersonalizedFeed();
        }
    }, [activePersona, status]);

    // 5. EARLY RETURNS GO LAST (After all hooks)
    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <Activity className="w-8 h-8 text-red-500" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verifying Credentials...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-red-200">
            {/* Ticker translated */}
            <div className="bg-slate-900 text-slate-300 text-xs font-mono py-1.5 overflow-hidden whitespace-nowrap border-b border-slate-800">
                <div className="animate-marquee inline-block">
                    <span className="mx-4 font-bold text-white">{t.liveTicker}:</span>
                    <span className="mx-4"><span className="text-green-400">▲ NIFTY 50</span> 22,450.15 (+1.2%)</span>
                    <span className="mx-4"><span className="text-red-400">▼ SENSEX</span> 73,892.40 (-0.3%)</span>
                    <span className="mx-4"><span className="text-green-400">▲ RELIANCE</span> 2,940.50 (+2.1%)</span>
                    <span className="mx-4"><span className="text-green-400">▲ HDFCBANK</span> 1,450.20 (+0.8%)</span>
                    <span className="mx-4"><span className="text-red-400">▼ INFY</span> 1,420.75 (-1.1%)</span>
                    <span className="mx-4 font-bold text-white">{t.liveTicker}:</span>
                    <span className="mx-4"><span className="text-green-400">▲ NIFTY 50</span> 22,450.15 (+1.2%)</span>
                    <span className="mx-4"><span className="text-red-400">▼ SENSEX</span> 73,892.40 (-0.3%)</span>
                </div>
            </div>

            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600 p-1.5 rounded-sm flex items-center justify-center shadow-sm">
                            <Activity className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight font-serif uppercase leading-none">ET Intelligence</h1>
                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">AI-Powered Terminal</span>
                        </div>
                    </div>

                    {/* Right Side: Language & Logout */}
                    <div className="flex items-center space-x-4">
                        {/* Vernacular Engine */}
                        <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                            <Globe className="w-4 h-4 text-slate-500" />
                            <select
                                value={activeLang}
                                onChange={(e) => setActiveLang(e.target.value as LanguageCode)}
                                className="bg-transparent text-slate-700 text-sm font-medium focus:outline-none cursor-pointer"
                            >
                                {(Object.keys(TRANSLATIONS) as LanguageCode[]).map((lang) => (
                                    <option key={lang} value={lang}>
                                        {TRANSLATIONS[lang].label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sign Out Button */}
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full uppercase tracking-widest transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {activeLang !== 'en' && (
                    <div className="bg-red-50/80 backdrop-blur-sm border-b border-red-100 px-4 py-1.5 text-center text-xs font-semibold text-red-800 tracking-wide">
                        {TRANSLATIONS[activeLang].notice}
                    </div>
                )}
            </header>

            <div className="max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-12 gap-10">
                <aside className="xl:col-span-3 flex flex-col gap-8">
                    <div className="sticky top-28 space-y-8">
                        <div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                {t.lensTitle}
                            </h3>
                            <div className="flex flex-col gap-1.5">
                                {personasList.map((p) => {
                                    const Icon = p.icon;
                                    const isActive = activePersona === p.id;
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => setActivePersona(p.id)}
                                            className={`flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive
                                                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 translate-x-1"
                                                : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                                            {pNames[p.id as keyof typeof pNames]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Pass activeLang to StoryArc */}
                        <div className="bg-white p-0 rounded-xl border-none shadow-sm hidden xl:block">
                            <StoryArc activePersona={activePersona} activeLang={activeLang} />
                        </div>
                    </div>
                </aside>

                <div className="xl:col-span-5 space-y-6">
                    <div className="flex items-end justify-between border-b-2 border-slate-900 pb-4">
                        <div>
                            <h2 className="text-3xl font-black font-serif tracking-tight">{t.feedTitle}</h2>
                            <p className="text-sm text-slate-500 mt-1">{t.feedSubtitle} <span className="font-bold text-slate-800 capitalize">{pNames[activePersona as keyof typeof pNames]}</span>.</p>
                        </div>
                    </div>

                    {loading && activeLang === 'en' ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-6 border border-slate-100 rounded-xl bg-white space-y-4">
                                    <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                                    <div className="h-8 w-3/4 bg-slate-100 rounded animate-pulse" />
                                    <div className="h-24 w-full bg-slate-100 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : displayArticles.length > 0 ? (
                        <div className="grid gap-6">
                            {displayArticles.map((article: any, index: number) => (
                                <ArticleCard key={article.id || index} article={article} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6 text-slate-500 bg-white border border-dashed border-slate-300 rounded-xl">
                            <Activity className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="font-medium text-slate-900">{t.waitingData}</p>
                            <p className="text-sm mt-1">{t.runScript}</p>
                        </div>
                    )}
                </div>

                <div className="xl:col-span-4 flex flex-col gap-6">
                    <div className="sticky top-28 space-y-6">
                        <div className="shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-200 bg-white">
                            {/* Pass activeLang to Chat */}
                            <BriefingChats
                                activePersona={activePersona}
                                currentArticles={displayArticles}
                                activeLang={activeLang}
                            />
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Pass activeLang to Video Studio */}
                            <VideoStudio activeLang={activeLang} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}