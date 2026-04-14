"use client";

import { useState, useEffect } from "react";
import { X, Activity, Loader2, PlayCircle, Download } from "lucide-react";

interface VisualModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: any;
}

export default function VisualModal({ isOpen, onClose, article }: VisualModalProps) {
    const [appState, setAppState] = useState<"idle" | "initializing" | "rendering" | "success" | "error">("idle");
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Reset state if modal closes
    useEffect(() => {
        if (!isOpen) {
            setAppState("idle");
            setVideoUrl(null);
        }
    }, [isOpen]);

    const generateVideo = async () => {
        setAppState("initializing");

        try {
            // 1. Send article to our backend to start the render
            const res = await fetch("/api/video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: article.title,
                    summary: article.summary,
                    imageUrl: article.imageUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.renderId) {
                throw new Error("Failed to start render");
            }

            setAppState("rendering");
            pollStatus(data.renderId);

        } catch (error) {
            console.error(error);
            setAppState("error");
        }
    };

    const pollStatus = (renderId: string) => {
        // 2. The Polling Engine: Check status every 5 seconds
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/video/status?id=${renderId}`);
                const data = await res.json();

                if (data.status === "succeeded") {
                    clearInterval(interval);
                    setVideoUrl(data.url);
                    setAppState("success");
                } else if (data.status === "failed") {
                    clearInterval(interval);
                    setAppState("error");
                }
                // If "planned" or "rendering", it just waits and loops again.
            } catch (error) {
                clearInterval(interval);
                setAppState("error");
            }
        }, 5000); // 5000ms = 5 seconds
    };

    if (!isOpen || !article) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* STATE: IDLE (Waiting for user to confirm) */}
                {appState === "idle" && (
                    <div className="text-center p-8 z-10">
                        <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                            <PlayCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-3 font-serif">Generate AI Reel</h2>
                        <p className="text-slate-400 text-sm mb-8">
                            Convert this intelligence briefing into a ready-to-share, vertical video format using our cloud rendering engine.
                        </p>
                        <button
                            onClick={generateVideo}
                            className="w-full bg-white text-black hover:bg-slate-200 font-bold py-3.5 rounded-xl transition-colors"
                        >
                            Start Generation
                        </button>
                    </div>
                )}

                {/* STATE: INITIALIZING & RENDERING */}
                {(appState === "initializing" || appState === "rendering") && (
                    <div className="text-center p-8 z-10 flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-6" />
                        <h2 className="text-white text-xl font-bold mb-2">
                            {appState === "initializing" ? "Parsing Briefing..." : "Rendering in Cloud..."}
                        </h2>
                        <p className="text-slate-400 text-sm animate-pulse">
                            This usually takes 30-60 seconds. <br /> Please don't close this window.
                        </p>
                    </div>
                )}

                {/* STATE: ERROR */}
                {appState === "error" && (
                    <div className="text-center p-8 z-10">
                        <Activity className="w-12 h-12 text-red-500 mx-auto mb-6" />
                        <h2 className="text-white text-xl font-bold mb-2">Generation Failed</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            Our servers are currently experiencing high load. Please try again later.
                        </p>
                        <button
                            onClick={() => setAppState("idle")}
                            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* STATE: SUCCESS (The Video Player!) */}
                {appState === "success" && videoUrl && (
                    <div className="absolute inset-0 w-full h-full bg-black group">
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-cover"
                        />
                        {/* Download overlay on hover */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                                href={videoUrl}
                                download
                                target="_blank"
                                className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-all text-sm font-medium"
                            >
                                <Download className="w-4 h-4" /> Download Reel
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}