export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn';

export const TRANSLATIONS: Record<LanguageCode, { notice: string; label: string }> = {
    en: {
        label: "English",
        notice: "Viewing standard English feed.",
    },
    hi: {
        label: "हिंदी (Hindi)",
        notice: "यह सामग्री हिंदी में अनुकूलित की गई है। (Content adapted for Hindi)",
    },
    ta: {
        label: "தமிழ் (Tamil)",
        notice: "இந்த உள்ளடக்கம் தமிழிற்கு ஏற்ப மாற்றப்பட்டுள்ளது.",
    },
    te: {
        label: "తెలుగు (Telugu)",
        notice: "ఈ కంటెంట్ తెలుగుకు అనుగుణంగా మార్చబడింది.",
    },
    bn: {
        label: "বাংলা (Bengali)",
        notice: "এই কন্টেন্টটি বাংলায় মানিয়ে নেওয়া হয়েছে।",
    }
};