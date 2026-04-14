import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Initialize the RSS Parser
const parser = new Parser();

// 1. YOUR DATA SOURCES (The free RSS Feeds)
const RSS_FEEDS = [
    "https://techcrunch.com/feed/", // Global Tech & Startups
    "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", // Indian Markets
    "https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms" // Indian Tech & Startups
];

// 2. THE DICTIONARY (Updated to match The Brief's custom domains!)
const keywordRules = {
    startups: ["startup", "venture capital", "seed round", "pitch", "bootstrapped", "founder", "funding"],
    ai: ["ai", "artificial intelligence", "machine learning", "llm", "openai", "chatgpt", "algorithm"],
    indian_markets: ["sensex", "nifty", "indian market", "nse", "bse", "rbi", "rupee", "stocks"],
    tech: ["tech", "software", "hardware", "apple", "google", "microsoft", "smartphone", "app"],
    corporate: ["enterprise", "corporate", "merger", "acquisition", "board", "leadership", "ceo"],
    geopolitics: ["geopolitics", "diplomacy", "international relations", "foreign policy", "global"],
    frugal_innovation: ["jugaad", "frugal", "innovation", "grassroots", "cost-effective"],
    science: ["science", "research", "physics", "biology", "space", "discovery"],
    psychology: ["psychology", "mental health", "behavior", "neuroscience", "cognitive"],
    gaming: ["gaming", "esports", "playstation", "xbox", "nintendo", "video games"],
    sports: ["sports", "cricket", "football", "ipl", "bcci", "fifa", "athlete"],
    politics: ["politics", "election", "parliament", "government", "policy", "minister"]
};

// 3. THE SCANNER
function autoTagArticle(title: string, summary: string): string {
    const textToSearch = (title + " " + summary).toLowerCase();
    for (const [tag, keywords] of Object.entries(keywordRules)) {
        for (const keyword of keywords) {
            if (textToSearch.includes(keyword.toLowerCase())) {
                return tag;
            }
        }
    }
    return "tech"; // Default fallback updated to match a valid domain
}

export async function GET(req: Request) {
    // SECURITY GATE: Upgraded for Vercel Cron
    const url = new URL(req.url);
    const secretParam = url.searchParams.get("secret");
    const authHeader = req.headers.get("authorization");

    // Check for the local test key OR the secure production Cron Secret
    const isLocalTest = secretParam === "super_secret_cron_key_123";
    const isProductionCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isLocalTest && !isProductionCron) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Prisma 7 Connection with explicit SSL
    const connectionString = process.env.DATABASE_URL || "postgresql://postgres.skzugjsmnimzituwlfxd:ET_Intelligence%402026@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    let addedCount = 0;

    try {
        // Loop through your chosen news outlets
        for (const feedUrl of RSS_FEEDS) {
            const feed = await parser.parseURL(feedUrl);

            // Grab the 5 most recent articles from each feed
            const recentArticles = feed.items.slice(0, 5);

            for (const item of recentArticles) {
                if (!item.title || !item.link) continue;

                const rawSummary = item.contentSnippet || item.content || "No summary available.";
                const cleanSummary = rawSummary.replace(/<[^>]*>?/gm, '').substring(0, 300);

                const assignedTag = autoTagArticle(item.title, cleanSummary);
                const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date();

                // Save it to Supabase safely
                await prisma.article.upsert({
                    where: { link: item.link },
                    update: {}, // Ignore if we already saved it
                    create: {
                        title: item.title,
                        summary: cleanSummary,
                        link: item.link,
                        published_at: publishedDate,
                        topic_tag: assignedTag
                    }
                });
                addedCount++;
            }
        }

        await prisma.$disconnect();
        return NextResponse.json({
            status: "success",
            message: `Ingestion complete. Processed ${addedCount} articles.`
        });

    } catch (error) {
        console.error("Ingestion Error:", error);
        await prisma.$disconnect();
        return NextResponse.json({ error: "Failed to ingest news" }, { status: 500 });
    }
}