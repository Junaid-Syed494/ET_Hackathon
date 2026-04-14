'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FeedDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // NEW: State to hold our database articles
    const [articles, setArticles] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    // Protect the route
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // NEW: Fetch the articles when the session loads
    useEffect(() => {
        if (session?.user) {
            const domains = (session.user as any).selectedDomains || [];
            if (domains.length > 0) {
                // Pass the domains to our API route as a comma-separated string
                fetch(`/api/feed?domains=${domains.join(',')}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.articles) setArticles(data.articles);
                        setIsFetching(false);
                    })
                    .catch(err => {
                        console.error(err);
                        setIsFetching(false);
                    });
            } else {
                setIsFetching(false);
            }
        }
    }, [session]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="animate-pulse text-gray-400">Decrypting The Brief...</div>
            </div>
        );
    }

    if (!session?.user) return null;

    const userEmail = session.user.email;
    const userDomains = (session.user as any).selectedDomains || [];

    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans flex">

            {/* SIDEBAR */}
            <aside className="w-64 border-r border-gray-800 bg-gray-950 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold text-white tracking-wider">THE<span className="text-gray-500">BRIEF</span></h1>
                </div>

                <div className="p-6 flex-grow">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Active Domains</h2>
                    <ul className="space-y-3">
                        {userDomains.map((domain: string) => (
                            <li key={domain} className="flex items-center text-sm font-medium text-gray-300 capitalize">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-3 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                {domain.replace('_', ' ')}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-6 border-t border-gray-800">
                    <div className="text-xs text-gray-500 mb-3 truncate">{userEmail}</div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded transition-colors text-sm font-medium border border-gray-800"
                    >
                        Disconnect
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="md:hidden border-b border-gray-800 p-4 flex justify-between items-center bg-gray-950">
                    <h1 className="text-lg font-bold text-white">THE<span className="text-gray-500">BRIEF</span></h1>
                    <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-xs text-gray-400">Disconnect</button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">Live Intelligence</h2>
                            <p className="text-gray-400">Curated exclusively for your active domains.</p>
                        </header>

                        {/* THE FEED ENGINE */}
                        {isFetching ? (
                            <div className="text-center py-20 text-gray-500 animate-pulse">
                                Syncing with database...
                            </div>
                        ) : articles.length === 0 ? (
                            <div className="p-8 border border-dashed border-gray-800 rounded-xl bg-gray-900/20 text-center">
                                <p className="text-gray-400">No articles found for your selected domains yet. Try triggering the Ingestion route!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {articles.map((article) => (
                                    <a
                                        key={article.id}
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-600 hover:bg-gray-900 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-black px-2 py-1 rounded">
                                                {article.topic_tag.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(article.published_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {article.summary}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}