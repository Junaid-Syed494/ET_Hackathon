"use client";

import { useEffect, useRef } from "react";
import { X, Activity, Sparkles } from "lucide-react";

interface VisualModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: any;
}

export default function VisualModal({ isOpen, onClose, article }: VisualModalProps) {
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        // Initialize speech synthesis
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
        }

        // If modal opens, start talking
        if (isOpen && article && synthRef.current) {
            synthRef.current.cancel(); // Stop any previous audio

            // We will have the AI read the title, pause, then the summary
            const textToRead = `${article.title}... ... ${article.summary || "No summary available."}`;
            const utterance = new SpeechSynthesisUtterance(textToRead);

            utterance.rate = 0.95; // Slight anchor-man pacing
            utterance.pitch = 1.0;

            // Try to grab an English voice
            const voices = synthRef.current.getVoices();
            const englishVoice = voices.find(v => v.lang.includes('en-') && (v.name.includes('Google') || v.name.includes('Natural')));
            if (englishVoice) utterance.voice = englishVoice;

            // Close the modal automatically when the audio finishes!
            utterance.onend = () => {
                onClose();
            };

            synthRef.current.speak(utterance);
        }

        // Cleanup: Stop talking if they manually close the modal
        return () => {
            if (synthRef.current) synthRef.current.cancel();
        };
    }, [isOpen, article, onClose]);

    if (!isOpen || !article) return null;

    // A sleek default image if the article doesn't have one
    const imageUrl = article.imageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Dark blurry backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Video Player Container */}
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* The "Video" Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center animate-ken-burns opacity-60"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />

                {/* Cinematic Overlays & Text */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 bg-gradient-to-t from-black via-black/50 to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-600 p-1.5 rounded-md flex items-center justify-center">
                            <Activity className="text-white w-4 h-4 animate-pulse" />
                        </div>
                        <span className="text-red-500 font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                            Live Intelligence Briefing
                        </span>
                    </div>

                    <h2 className="text-white text-3xl sm:text-4xl font-black font-serif leading-tight mb-4 max-w-3xl">
                        {article.title}
                    </h2>

                    {/* Subtitles faking the voiceover */}
                    <div className="max-w-3xl border-l-4 border-red-500 pl-4">
                        <p className="text-slate-200 text-lg leading-relaxed line-clamp-3">
                            {article.summary}
                        </p>
                    </div>
                </div>

                {/* Audio Visualizer Graphic (Purely aesthetic) */}
                <div className="absolute top-6 left-6 flex items-center gap-2 z-20 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-xs font-medium tracking-wide">Synthesizing Audio</span>
                    <div className="flex gap-1 ml-2 items-center h-3">
                        <div className="w-1 bg-purple-400 h-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 bg-purple-400 h-1/2 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1 bg-purple-400 h-3/4 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}