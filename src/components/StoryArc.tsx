"use client";

import React from 'react';
import { Activity, Clock, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { TRANSLATIONS, LanguageCode } from "@/lib/translations";

interface StoryArcProps {
    activePersona?: string;
    activeLang?: LanguageCode;
}

// English Data
const ARC_DATA_EN: Record<string, any> = {
    investor: {
        title: "RBI Monetary Policy", status: "Active Impact",
        events: [
            { id: 1, date: "Today, 10:00 AM", title: "Rates Held at 6.5%", desc: "MPC unanimously decides to keep the repo rate unchanged.", isLive: true, icon: AlertCircle },
            { id: 2, date: "Yesterday", title: "Inflation Core Cools", desc: "CPI data shows core inflation dropping to 4.2% YoY.", isLive: false, icon: TrendingUp },
        ]
    },
    founder: {
        title: "Seed Funding Climate", status: "Developing",
        events: [
            { id: 1, date: "Today", title: "AI Startups Buck Trend", desc: "Generative AI infrastructure rounds see 40% valuation premiums.", isLive: true, icon: Zap },
            { id: 2, date: "Last Week", title: "Q1 VC Deployment", desc: "Overall early-stage funding remains tight, down 12% quarter-over-quarter.", isLive: false, icon: Activity },
        ]
    },
    executive: {
        title: "Enterprise AI Integration", status: "Critical Trend",
        events: [
            { id: 1, date: "Today", title: "Copilot ROI Metrics", desc: "Early adopters report 15% efficiency gains in software engineering.", isLive: true, icon: TrendingUp },
            { id: 2, date: "Last Week", title: "Data Privacy Frameworks", desc: "New local compliance rules drafted for enterprise LLM hosting.", isLive: false, icon: AlertCircle },
        ]
    },
    student: {
        title: "Tech Hiring Landscape", status: "Shifting",
        events: [
            { id: 1, date: "Today", title: "AI Skills Premium", desc: "Entry-level roles requiring prompt engineering see 20% salary bumps.", isLive: true, icon: Zap },
            { id: 2, date: "Last Week", title: "Campus Placements", desc: "Core engineering roles hold steady, while consulting sees a dip.", isLive: false, icon: Activity },
        ]
    }
};

// Hindi Data
const ARC_DATA_HI: Record<string, any> = {
    investor: {
        title: "RBI मौद्रिक नीति", status: "सक्रिय प्रभाव",
        events: [
            { id: 1, date: "आज, सुबह 10:00 बजे", title: "दरें 6.5% पर स्थिर", desc: "MPC ने सर्वसम्मति से रेपो दर को अपरिवर्तित रखने का निर्णय लिया।", isLive: true, icon: AlertCircle },
            { id: 2, date: "कल", title: "मुद्रास्फीति में कमी", desc: "CPI डेटा से पता चलता है कि मुख्य मुद्रास्फीति 4.2% तक गिर गई है।", isLive: false, icon: TrendingUp },
        ]
    },
    founder: {
        title: "स्टार्टअप फंडिंग", status: "विकासशील",
        events: [
            { id: 1, date: "आज", title: "AI स्टार्टअप्स में उछाल", desc: "जेनरेटिव एआई राउंड में 40% वैल्यूएशन प्रीमियम देखा गया।", isLive: true, icon: Zap },
            { id: 2, date: "पिछले सप्ताह", title: "Q1 VC डिप्लॉयमेंट", desc: "शुरुआती चरण की फंडिंग कुल मिलाकर 12% कम रही।", isLive: false, icon: Activity },
        ]
    },
    executive: {
        title: "एंटरप्राइज़ AI एकीकरण", status: "महत्वपूर्ण रुझान",
        events: [
            { id: 1, date: "आज", title: "कोपायलट ROI मेट्रिक्स", desc: "सॉफ्टवेयर इंजीनियरिंग में 15% दक्षता लाभ की रिपोर्ट।", isLive: true, icon: TrendingUp },
            { id: 2, date: "पिछले सप्ताह", title: "डेटा गोपनीयता", desc: "एंटरप्राइज़ LLM के लिए नए स्थानीय अनुपालन नियम।", isLive: false, icon: AlertCircle },
        ]
    },
    student: {
        title: "टेक हायरिंग परिदृश्य", status: "बदलते रुझान",
        events: [
            { id: 1, date: "आज", title: "AI कौशल प्रीमियम", desc: "प्रॉम्प्ट इंजीनियरिंग कौशल वाले रोल्स में 20% वेतन वृद्धि।", isLive: true, icon: Zap },
            { id: 2, date: "पिछले सप्ताह", title: "कैंपस प्लेसमेंट", desc: "कोर इंजीनियरिंग रोल्स स्थिर, कंसल्टिंग में गिरावट।", isLive: false, icon: Activity },
        ]
    }
};

const StoryArc: React.FC<StoryArcProps> = ({ activePersona = "investor", activeLang = 'en' }) => {
    const t = TRANSLATIONS[activeLang]?.ui || TRANSLATIONS['en'].ui;

    // Select the right dataset based on language
    const dataset = activeLang === 'hi' ? ARC_DATA_HI : ARC_DATA_EN;
    const currentArc = dataset[activePersona.toLowerCase()] || dataset['investor'];

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between border-b border-slate-800">
                <div>
                    <h2 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-400" />
                        {t.storyArcTitle || 'Story Arc'}: {currentArc.title}
                    </h2>
                </div>
                <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse">
                    {currentArc.status}
                </span>
            </div>

            <div className="p-6">
                <div className="relative border-l-2 border-slate-100 ml-3 md:ml-4 space-y-8">
                    {currentArc.events.map((event: any) => {
                        const Icon = event.icon;
                        return (
                            <div key={event.id} className="relative pl-8 group">
                                <span className={`absolute -left-[17px] top-1 flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white transition-all duration-300 ${event.isLive
                                        ? 'bg-red-50 text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                        : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                                    }`}>
                                    <Icon className={`w-4 h-4 ${event.isLive ? 'animate-pulse' : ''}`} />
                                </span>

                                <div className="flex flex-col transform transition-transform duration-300 group-hover:translate-x-1">
                                    <span className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${event.isLive ? 'text-red-500' : 'text-slate-400'
                                        }`}>
                                        {event.date}
                                    </span>
                                    <h3 className={`text-base font-bold mb-1 ${event.isLive ? 'text-slate-900' : 'text-slate-700'
                                        }`}>
                                        {event.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {event.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StoryArc;