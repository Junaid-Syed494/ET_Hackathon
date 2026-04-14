import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Safely initialize Prisma with the Pooler & SSL
const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const domainsParam = url.searchParams.get("domains");

        if (!domainsParam) {
            return NextResponse.json({ articles: [] });
        }

        const domainsArray = domainsParam.split(",");

        // The Smart Fetch: Only grab articles that match the user's chosen domains
        const articles = await prisma.article.findMany({
            where: {
                topic_tag: {
                    in: domainsArray
                }
            },
            orderBy: {
                published_at: 'desc' // Newest articles first
            },
            take: 30 // Don't overwhelm the browser, just grab the latest 30
        });

        return NextResponse.json({ articles });

    } catch (error) {
        console.error("Feed Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
    }
}