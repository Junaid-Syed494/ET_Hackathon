'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        if (!isLogin) {
            // --- REGISTRATION FLOW ---
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Registration failed");
                }

                setMessage("Success! Check your email for the verification link.");
                // Clear the form
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } catch (err: any) {
                setError(err.message);
            }
        } else {
            // --- LOGIN FLOW ---
            try {
                const res = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (res?.error) {
                    setError(res.error);
                } else {
                    // Send them to the domain picker!
                    router.push('/onboarding');
                    router.refresh();
                }
            } catch (err) {
                setError("An unexpected error occurred");
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans text-gray-200">
            <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">The Brief</h1>
                    <p className="text-sm text-gray-400 mt-2">
                        {isLogin ? "Sign in to your terminal" : "Apply for terminal access"}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded bg-red-900/50 border border-red-500 text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 rounded bg-green-900/50 border border-green-500 text-green-200 text-sm text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-black border border-gray-700 rounded focus:ring-1 focus:ring-white focus:border-white transition-colors outline-none text-white"
                            placeholder="founder@startup.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-black border border-gray-700 rounded focus:ring-1 focus:ring-white focus:border-white transition-colors outline-none text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-black border border-gray-700 rounded focus:ring-1 focus:ring-white focus:border-white transition-colors outline-none text-white"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-semibold py-2.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Processing..." : (isLogin ? "Access Terminal" : "Register")}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    {isLogin ? (
                        <p>
                            New user?{' '}
                            <button onClick={() => { setIsLogin(false); setError(''); setMessage(''); }} className="text-white hover:underline">
                                Apply here.
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button onClick={() => { setIsLogin(true); setError(''); setMessage(''); }} className="text-white hover:underline">
                                Sign in.
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}