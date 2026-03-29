"use client";

import { useState } from "react";
import { Heart, Share2, ExternalLink, Clock, Play } from "lucide-react";
import VisualModal from "./VisualModal"; // <-- Import our new Modal

interface ArticleCardProps {
    article: any;
    index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false); // Modal State

    const handleInteract = async (actionType: "LIKE" | "SHARE") => {
        if (actionType === "LIKE") setIsLiked(!isLiked);
        if (actionType === "SHARE") {
            setIsShared(true);
            if (article.link) navigator.clipboard.writeText(article.link);
        }

        try {
            await fetch('/api/interact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    articleId: article.id || article.link || `fallback-id-${index}`,
                    actionType: actionType
                })
            });
        } catch (error) {
            console.error(`Failed to record ${actionType}`);
        }
    };

    return (
        <>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-red-500 bg-red-50 px-2.5 py-1 rounded-sm">
                        {article.source || article.topic_tag || "Market Update"}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime || "3 min read"}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-red-600 transition-colors">
                    {article.title}
                </h3>

                <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                    {article.summary || article.excerpt}
                </p>

                {/* Interactive Actions Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleInteract("LIKE")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isLiked
                                ? 'bg-red-50 text-red-500'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            {isLiked ? 'Liked' : 'Like'}
                        </button>

                        <button
                            onClick={() => handleInteract("SHARE")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isShared
                                ? 'bg-green-50 text-green-600'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <Share2 className="w-4 h-4" />
                            {isShared ? 'Copied!' : 'Share'}
                        </button>
                    </div>

                    <a
                        href={article.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-red-600 uppercase tracking-wide transition-colors"
                    >
                        Full Story <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* THE NEW BUTTON: Shows up nicely at the bottom of the card */}
                <button
                    onClick={() => setIsVideoOpen(true)}
                    className="w-full mt-5 bg-slate-900 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-sm"
                >
                    <Play className="w-4 h-4 fill-current" />
                    Experience Visually
                </button>
            </div>

            {/* Render the modal outside the card layout flow */}
            <VisualModal
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                article={article}
            />
        </>
    );
}