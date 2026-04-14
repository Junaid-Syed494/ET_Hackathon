'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

// The High-Value Intelligence Domains
const AVAILABLE_DOMAINS = [
    { id: "startups", label: "Startups & VC", icon: "🚀" },
    { id: "ai", label: "Artificial Intelligence", icon: "🧠" },
    { id: "geopolitics", label: "Geopolitics", icon: "🌍" },
    { id: "indian_markets", label: "Indian Markets", icon: "📈" },
    { id: "frugal_innovation", label: "Frugal Innovation", icon: "💡" },
    { id: "corporate", label: "Corporate Strategy", icon: "🏢" },
    { id: "science", label: "Deep Science", icon: "🔬" },
    { id: "psychology", label: "Psychology", icon: "👤" },
    { id: "gaming", label: "Gaming & Esports", icon: "🎮" },
    { id: "sports", label: "Sports Business", icon: "⚽" },
    { id: "tech", label: "Consumer Tech", icon: "📱" },
    { id: "politics", label: "Global Politics", icon: "🏛️" }
];

export default function OnboardingPage() {
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Fetch the logged-in user's session securely
    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            if (session?.user?.email) {
                setUserEmail(session.user.email);
            } else {
                router.push('/login'); // Kick them out if not logged in
            }
        };
        fetchSession();
    }, [router]);

    const toggleDomain = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleComplete = async () => {
        if (selected.length < 3) return; // Force them to pick at least 3
        setIsSaving(true);

        try {
            const res = await fetch('/api/user/domains', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, domains: selected })
            });

            if (res.ok) {
                router.push('/feed'); // Send them to their custom feed!
            }
        } catch (error) {
            console.error("Failed to save domains");
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-gray-800">
            <div className="max-w-4xl mx-auto mt-12">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Calibrate your terminal.
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Select at least 3 intelligence domains to construct your custom feed.
                    </p>
                </div>

                {/* The Domain Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                    {AVAILABLE_DOMAINS.map((domain) => {
                        const isSelected = selected.includes(domain.id);
                        return (
                            <button
                                key={domain.id}
                                onClick={() => toggleDomain(domain.id)}
                                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${isSelected
                                    ? 'border-white bg-gray-900 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                    : 'border-gray-800 bg-black hover:border-gray-600 hover:bg-gray-900/50'
                                    }`}
                            >
                                <span className="text-3xl mb-3">{domain.icon}</span>
                                <span className="text-sm font-semibold text-center">{domain.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* The Action Bar */}
                <div className="flex flex-col items-center border-t border-gray-800 pt-8">
                    <p className="text-sm text-gray-500 mb-4">
                        {selected.length} / 3 minimum selected
                    </p>
                    <button
                        onClick={handleComplete}
                        disabled={selected.length < 3 || isSaving}
                        className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${selected.length >= 3
                            ? 'bg-white text-black hover:bg-gray-200 shadow-lg cursor-pointer'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isSaving ? "Initializing Feed..." : "Construct My Feed"}
                    </button>
                </div>
            </div>
        </div>
    );
}