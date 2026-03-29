"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // THE BOUNCER: If they are already logged in, kick them out of the login page!
    useEffect(() => {
        if (status === "authenticated") {
            if ((session?.user as any)?.isNewUser) {
                router.push("/onboarding");
            } else {
                router.push("/");
            }
        }
    }, [status, session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        } else {
            // Force a hard reload to guarantee NextAuth pulls the freshest user data
            window.location.href = "/";
        }
    };

    // Show a blank loading screen while the bouncer checks their ID
    if (status === "loading" || status === "authenticated") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Activity className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 selection:bg-red-200 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

                {/* Header */}
                <div className="bg-slate-900 px-8 py-10 text-center">
                    <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto shadow-lg mb-4">
                        <Activity className="text-white w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight font-serif uppercase text-white leading-none mb-2">
                        ET Intelligence
                    </h1>
                    <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">
                        Enterprise Auth Terminal
                    </p>
                </div>

                {/* Form */}
                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-lg mb-6 border border-red-100 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Work Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all outline-none"
                                placeholder="analyst@firm.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Secure Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                        >
                            {loading ? "Authenticating..." : "Access Terminal"}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>

                        <p className="text-center text-xs text-slate-500 mt-6 font-medium">
                            New user? Just enter an email and password to auto-register.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}