"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, BrainCircuit } from "lucide-react";
import { useSession } from "next-auth/react";

const QUESTIONS = [
    {
        question: "What is your primary focus when reading the news?",
        options: [
            { text: "Market movements, ROI, and capital allocation.", trait: "investor" },
            { text: "Venture capital, product scaling, and startup trends.", trait: "founder" },
            { text: "Corporate strategy, compliance, and enterprise AI.", trait: "executive" },
            { text: "Skill building, hiring trends, and tech education.", trait: "student" },
        ]
    },
    {
        question: "How do you prefer your data presented?",
        options: [
            { text: "Yield curves and quantitative metrics.", trait: "investor" },
            { text: "Growth charts and competitor analysis.", trait: "founder" },
            { text: "High-level summaries and operational metrics.", trait: "executive" },
            { text: "Deep-dive tutorials and foundational explanations.", trait: "student" },
        ]
    },
    {
        question: "What is your ultimate end goal?",
        options: [
            { text: "Maximize portfolio returns.", trait: "investor" },
            { text: "Achieve product-market fit or an exit.", trait: "founder" },
            { text: "Optimize company efficiency and navigate policy.", trait: "executive" },
            { text: "Land a top-tier role in the tech industry.", trait: "student" },
        ]
    }
];

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // THE BOUNCER: Protect the quiz page
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login"); // Kick out unauthorized users
        } else if (status === "authenticated") {
            // If they are NOT a new user, kick them to the dashboard
            if (!(session?.user as any)?.isNewUser) {
                router.push("/");
            }
        }
    }, [status, session, router]);

    const handleSelect = async (trait: string) => {
        const newAnswers = [...answers, trait];
        setAnswers(newAnswers);

        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsProcessing(true);

            const counts = newAnswers.reduce((acc, val) => {
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const winningPersona = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

            try {
                const res = await fetch("/api/onboarding", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ persona: winningPersona }),
                });

                if (res.ok) {
                    // THE HACKATHON TRICK: Hard reload to the dashboard!
                    // This clears React's memory cache and forces NextAuth to pull the fresh "isNewUser: false" from the DB.
                    window.location.href = "/";
                } else {
                    console.error("Failed to save persona");
                    setIsProcessing(false);
                }
            } catch (error) {
                console.error("API error", error);
                setIsProcessing(false);
            }
        }
    };

    // Show a blank loading screen while the bouncer checks their ID
    if (status === "loading" || status === "unauthenticated" || (status === "authenticated" && !(session?.user as any)?.isNewUser)) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Activity className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 selection:bg-red-200 p-4 font-sans text-slate-100">
            <div className="w-full max-w-2xl bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden relative">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1.5 bg-slate-700 w-full">
                    <div
                        className="h-full bg-red-500 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                    />
                </div>

                <div className="p-10 md:p-14">
                    {isProcessing ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="relative">
                                <BrainCircuit className="w-16 h-16 text-red-500 animate-pulse" />
                                <div className="absolute inset-0 border-4 border-red-500/30 rounded-full animate-ping" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold font-serif mb-2">Analyzing Profile...</h2>
                                <p className="text-slate-400">Calibrating your intelligence feed.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-10">
                                <Activity className="w-6 h-6 text-red-500" />
                                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                                    Terminal Calibration {currentStep + 1}/{QUESTIONS.length}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-10 leading-tight">
                                {QUESTIONS[currentStep].question}
                            </h2>

                            <div className="space-y-4">
                                {QUESTIONS[currentStep].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(option.trait)}
                                        className="w-full text-left p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-slate-500 transition-all group flex items-center justify-between"
                                    >
                                        <span className="text-lg font-medium text-slate-200 group-hover:text-white">
                                            {option.text}
                                        </span>
                                        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-red-400 transition-colors transform group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}