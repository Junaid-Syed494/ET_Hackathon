"use client";

import { useState, useEffect } from "react";
import ArticleCard from "@/components/ArticleCard";
import BriefingChats from "@/components/BriefingChats";
import VideoStudio from "@/components/VideoStudio";
import StoryArc from "@/components/StoryArc";
import { Newspaper, Briefcase, GraduationCap, Building2, TrendingUp, Globe } from "lucide-react";

// Assuming you placed the translations in lib/translations
import { TRANSLATIONS, LanguageCode } from "@/lib/translations";

const personas = [
    { id: "investor", label: "Investor", icon: TrendingUp },
    { id: "founder", label: "Founder", icon: Briefcase },
    { id: "student", label: "Student", icon: GraduationCap },
    { id: "executive", label: "Executive", icon: Building2 },
];

export default function Newsroom() {
    const [activePersona, setActivePersona] = useState("investor");
    const [activeLang, setActiveLang] = useState<LanguageCode>("en");
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

        fetchPersonalizedFeed();
    }, [activePersona]);

    return (
        <main className="min-h-screen bg-slate-50 pb-16">
            {/* Masthead */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-red-600 p-2 rounded flex items-center justify-center">
                            <Newspaper className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter">ET INTELLIGENCE</h1>
                    </div>

                    {/* Vernacular / Language Switcher */}
                    <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <select
                            value={activeLang}
                            onChange={(e) => setActiveLang(e.target.value as LanguageCode)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2 outline-none cursor-pointer"
                        >
                            {(Object.keys(TRANSLATIONS) as LanguageCode[]).map((lang) => (
                                <option key={lang} value={lang}>
                                    {TRANSLATIONS[lang].label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Vernacular Notice Banner */}
                {activeLang !== 'en' && (
                    <div className="bg-red-50 border-b border-red-100 px-4 py-2 text-center text-sm font-medium text-red-800 transition-all">
                        {TRANSLATIONS[activeLang].notice}
                    </div>
                )}
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Sidebar - Persona Switcher */}
                <aside className="lg:col-span-3 space-y-6">
                    <div className="sticky top-28">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Your Persona
                        </h3>
                        <div className="flex flex-col gap-2">
                            {personas.map((p) => {
                                const Icon = p.icon;
                                const isActive = activePersona === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => setActivePersona(p.id)}
                                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl border transition-all ${isActive
                                            ? "bg-red-600 text-white border-red-600 shadow-md transform scale-[1.02]"
                                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 mr-3" />
                                        {p.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Center Column - Main Feed Content */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                        <h2 className="text-3xl font-bold font-serif">Personalized Feed</h2>
                        <span className="text-sm font-semibold text-slate-600 capitalize bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            {activePersona} View
                        </span>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-6 border rounded-xl bg-white space-y-4 shadow-sm">
                                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                                    <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
                                    <div className="h-20 w-full bg-slate-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : articles.length > 0 ? (
                        <div className="grid gap-6">
                            {articles.map((article: any, index: number) => (
                                <ArticleCard key={article.id || index} article={article} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500 bg-white border rounded-xl shadow-sm">
                            No articles found. Make sure your ingestion script has run!
                        </div>
                    )}
                </div>

                {/* Right Sidebar - AI Briefing Chat */}
                <div className="lg:col-span-4">
                    <div className="sticky top-28">
                        <BriefingChats />
                    </div>
                </div>

                {/* Bottom Section - Story Arc & Video Studio */}
                <div className="lg:col-span-12 mt-12 pt-12 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold font-serif">Deep Dive Features</h2>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Interactive Elements
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <StoryArc />
                        <VideoStudio />
                    </div>
                </div>

            </div>
        </main>
    );
}