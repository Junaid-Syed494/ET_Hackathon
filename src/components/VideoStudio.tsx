"use client";

import { Play, Sparkles } from "lucide-react";

export default function VideoStudio({ activeLang }: { activeLang: string }) {
    return (
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-center flex flex-col items-center justify-center h-full min-h-[300px] shadow-xl relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-red-500/10 p-4 rounded-full mb-5 border border-red-500/20">
                    <Play className="w-8 h-8 text-red-500 fill-current" />
                </div>

                <h3 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Visual Studio Upgraded
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed max-w-[250px]">
                    Intelligence briefings are now natively integrated.
                    <br /><br />
                    Click <strong className="text-white">"Experience Visually"</strong> on any article to instantly launch your cinematic AI broadcast.
                </p>
            </div>
        </div>
    );
}