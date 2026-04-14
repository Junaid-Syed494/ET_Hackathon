import 'dotenv/config'; // Loads your environment variables safely
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Prisma 7 requires the explicit adapter connection
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:ET_Intelligence%402026@db.skzugjsmnimzituwlfxd.supabase.co:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 1. THE DICTIONARY: Add your trigger words here
const keywordRules = {
    investor: ["market", "finance", "crypto", "roi", "sensex", "nifty", "stocks", "dividend", "revenue"],
    founder: ["startup", "venture capital", "scaling", "founder", "seed round", "pitch", "launch", "bootstrapped"],
    executive: ["enterprise", "ai", "corporate", "compliance", "merger", "acquisition", "board", "leadership"],
    student: ["academic", "education", "hiring", "skills", "technology", "university", "campus", "internship", "exams"]
};

// 2. THE SCANNER: The function that reads the text and assigns the tag
function autoTagArticle(title: string, summary: string): string {
    // Combine title and summary and convert to lowercase for easy searching
    const textToSearch = (title + " " + summary).toLowerCase();

    // Loop through the dictionary
    for (const [tag, keywords] of Object.entries(keywordRules)) {
        for (const keyword of keywords) {
            // If we find a keyword, immediately return that tag
            if (textToSearch.includes(keyword.toLowerCase())) {
                return tag;
            }
        }
    }
    // If absolutely no keywords match, fall back to a default tag
    return "technology";
}

// 3. THE DATABASE PUSH: Save it safely using Prisma
async function runIngestion() {
    console.log("🚀 Starting News Ingestion Engine...");

    // NOTE: This is dummy data. You will replace this array with the actual 
    // data you scrape or fetch from your news APIs/RSS feeds.
    const incomingNews = [
        {
            title: "Tech Giants Announce Massive Hiring Drive for New Grads",
            summary: "Major technology firms are shifting focus to campus recruitment to secure top engineering talent.",
            link: "https://example.com/news/1",
            published_at: new Date()
        },
        {
            title: "Seed Funding Plummets in Q3, Forcing Founders to Pivot",
            summary: "Venture capital has dried up, leaving early-stage startups scrambling to find profitable revenue models.",
            link: "https://example.com/news/2",
            published_at: new Date()
        }
    ];

    for (const article of incomingNews) {
        // Run the text through our scanner
        const assignedTag = autoTagArticle(article.title, article.summary);

        try {
            // Upsert is magic: It creates the article, but if the link already exists, it ignores it!
            await prisma.article.upsert({
                where: { link: article.link },
                update: {}, // Do nothing if it already exists
                create: {
                    title: article.title,
                    summary: article.summary,
                    link: article.link,
                    published_at: article.published_at,
                    topic_tag: assignedTag
                }
            });
            console.log(`✅ Saved & Tagged [${assignedTag.toUpperCase()}]: ${article.title.substring(0, 30)}...`);
        } catch (error) {
            console.error(`❌ Failed to save: ${article.title}`, error);
        }
    }

    console.log("🏁 Ingestion Complete.");
    await prisma.$disconnect();
}

// Execute the function
runIngestion();