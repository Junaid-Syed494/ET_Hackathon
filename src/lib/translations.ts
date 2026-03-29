export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn';

export const TRANSLATIONS: Record<LanguageCode, any> = {
    en: {
        label: "English",
        notice: "Viewing standard English feed.",
        ui: {
            liveTicker: "LIVE MARKET",
            lensTitle: "Active Intelligence Lens",
            feedTitle: "Real-Time Briefing",
            feedSubtitle: "Curated specifically for the",
            aiTitle: "ET Copilot",
            aiSubtitle: "Context-Aware Analyst",
            chatPlaceholder: "Ask about the feed...",
            waitingData: "Waiting for data ingestion...",
            runScript: "Run your Python script to populate this specific lens.",
            videoTitle: "Canvas Video Studio",
            videoBadge: "Live Engine",
            startRender: "Start Render",
            pauseRender: "Pause Render",
            elapsed: "Elapsed",
            frames: "frames",
            storyArcTitle: "Story Arc"
        },
        personas: {
            investor: "Investor Lens",
            founder: "Founder Lens",
            executive: "Executive Lens",
            student: "Academic Lens",
        },
        articles: []
    },
    hi: {
        label: "हिंदी (Hindi)",
        notice: "यह सामग्री हिंदी में अनुकूलित की गई है।",
        ui: {
            liveTicker: "लाइव मार्केट",
            lensTitle: "सक्रिय इंटेलिजेंस लेंस",
            feedTitle: "रीयल-टाइम ब्रीफिंग",
            feedSubtitle: "विशेष रूप से तैयार किया गया:",
            aiTitle: "ईटी कोपायलट",
            aiSubtitle: "संदर्भ-जागरूक विश्लेषक",
            chatPlaceholder: "फ़ीड के बारे में पूछें...",
            waitingData: "डेटा की प्रतीक्षा हो रही है...",
            runScript: "इस लेंस को आबाद करने के लिए अपनी स्क्रिप्ट चलाएं।",
            videoTitle: "कैनवस वीडियो स्टूडियो",
            videoBadge: "लाइव इंजन",
            startRender: "रेंडर शुरू करें",
            pauseRender: "रेंडर रोकें",
            elapsed: "बीता हुआ समय",
            frames: "फ्रेम",
            storyArcTitle: "स्टोरी आर्क"
        },
        personas: {
            investor: "निवेशक लेंस",
            founder: "संस्थापक लेंस",
            executive: "कार्यकारी लेंस",
            student: "शैक्षणिक लेंस",
        },
        articles: [
            {
                id: "hi-1",
                title: "RBI ने रेपो दर 6.5% पर बरकरार रखी",
                excerpt: "मौद्रिक नीति समिति ने सर्वसम्मति से बेंचमार्क रेपो दर को अपरिवर्तित रखने का निर्णय लिया है, जिससे वैश्विक बाजार की अस्थिरता की निगरानी करते हुए मुद्रास्फीति नियंत्रण को प्राथमिकता दी गई है।",
                source: "ईटी इंटेलिजेंस",
                date: "आज",
                readTime: "3 मिनट"
            },
            {
                id: "hi-2",
                title: "सेंसेक्स में 300 अंकों की भारी गिरावट",
                excerpt: "वैश्विक बाजारों से कमजोर संकेतों के बीच भारतीय शेयर बाजारों में आज गिरावट दर्ज की गई। आईटी और बैंकिंग शेयरों में सबसे ज्यादा बिकवाली का दबाव दिखा।",
                source: "ईटी मार्केट्स",
                date: "कल",
                readTime: "4 मिनट"
            },
            {
                id: "hi-3",
                title: "भारत में AI स्टार्टअप्स के लिए बंपर फंडिंग",
                excerpt: "इस तिमाही में भारतीय जनरेटिव AI स्टार्टअप्स ने रिकॉर्ड $500 मिलियन जुटाए हैं, जो पिछले साल की तुलना में 40% की वृद्धि दर्शाता है।",
                source: "टेक डेस्क",
                date: "2 दिन पहले",
                readTime: "5 मिनट"
            }
        ]
    },
    ta: { label: "தமிழ் (Tamil)", notice: "இந்த உள்ளடக்கம் தமிழிற்கு ஏற்ப மாற்றப்பட்டுள்ளது.", ui: {}, personas: {}, articles: [] },
    te: { label: "తెలుగు (Telugu)", notice: "ఈ కంటెంట్ తెలుగుకు అనుగుణంగా మార్చబడింది.", ui: {}, personas: {}, articles: [] },
    bn: { label: "বাংলা (Bengali)", notice: "এই কন্টেন্টটি বাংলায় মানিয়ে নেওয়া হয়েছে।", ui: {}, personas: {}, articles: [] }
};