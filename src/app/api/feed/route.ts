import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const persona = searchParams.get('persona') || 'investor';

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Missing Supabase keys in .env file");
        }

        // Fetch the latest articles from Supabase
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: articles, error: dbError } = await supabase
            .from('Article')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(20);

        if (dbError) throw dbError;
        if (!articles || articles.length === 0) {
            return NextResponse.json({ articles: [] });
        }

        // SIMULATED AI PERSONALIZATION
        // This perfectly mimics AI curation without the paywall
        const personalizedFeed = articles.map(article => {
            let insight = "A key update affecting broader market trends.";

            if (persona === 'investor') {
                insight = "Critical data point for evaluating portfolio risk and upcoming market shifts.";
            } else if (persona === 'founder') {
                insight = "Strategic industry movement that could impact startup funding or competitor positioning.";
            } else if (persona === 'student') {
                insight = "Excellent case study on real-world business dynamics and market evolution.";
            } else if (persona === 'executive') {
                insight = "High-level market signal necessary for strategic planning and resource allocation.";
            }

            return {
                ...article,
                ai_insight: insight
            };
        }).slice(0, 5); // Return the top 5 personalized articles

        return NextResponse.json({ articles: personalizedFeed });

    } catch (error: any) {
        console.error("🔥 API ROUTE ERROR:", error.message);
        return NextResponse.json(
            { error: error.message, articles: [] },
            { status: 500 }
        );
    }
}