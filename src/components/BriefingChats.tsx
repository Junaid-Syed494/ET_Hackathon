"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { TRANSLATIONS, LanguageCode } from "@/lib/translations";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface BriefingChatsProps {
    activePersona?: string;
    currentArticles?: any[];
    activeLang?: LanguageCode;
}

const BriefingChats: React.FC<BriefingChatsProps> = ({
    activePersona = "investor",
    currentArticles = [],
    activeLang = 'en'
}) => {
    const t = TRANSLATIONS[activeLang]?.ui || TRANSLATIONS['en'].ui;

    // Set the initial greeting based on the language
    const initialGreeting = activeLang === 'hi'
        ? 'मैं ईटी इंटेलिजेंस एआई हूं। मैं आपके वर्तमान फ़ीड का विश्लेषण कर रहा हूं। आप किस विशिष्ट बाजार गतिशीलता पर विस्तृत जानकारी चाहेंगे?'
        : 'I am the ET Intelligence AI. I am analyzing your current feed. What specific market movements would you like a deep briefing on?';

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: initialGreeting,
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Reset chat if language changes to keep it consistent
    useEffect(() => {
        setMessages([{ id: Date.now().toString(), role: 'assistant', content: initialGreeting }]);
    }, [activeLang, initialGreeting]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const contextHeadlines = currentArticles.map(a => a.title || "Untitled Article").slice(0, 5);

            const response = await fetch('/api/briefing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
                    persona: activePersona,
                    contextHeadlines: contextHeadlines,
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');
            const data = await response.json();

            setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.content }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: activeLang === 'hi' ? 'सर्वर से संपर्क टूट गया है। कृपया पुनः प्रयास करें।' : 'Connection lost to the servers. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full bg-white rounded-2xl">
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Bot className="w-6 h-6 text-red-400" />
                        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm">{t.aiTitle || 'ET Copilot'}</h2>
                        <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">{t.aiSubtitle || 'Context-Aware Analyst'}</p>
                    </div>
                </div>
                <Sparkles className="w-4 h-4 text-slate-500" />
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-slate-900 text-white rounded-br-sm'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce delay-100" />
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce delay-200" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.chatPlaceholder || 'Ask about the feed...'}
                        className="flex-1 bg-slate-100 border-transparent rounded-xl pl-4 pr-12 py-3 text-sm text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200 transition-all outline-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BriefingChats;