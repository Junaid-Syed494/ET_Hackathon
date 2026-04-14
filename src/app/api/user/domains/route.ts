import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Safely initialize Prisma
const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, domains } = body;

        if (!email || !domains || domains.length === 0) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // Update the user's profile with their custom feed domains
        await prisma.user.update({
            where: { email: email },
            data: {
                selectedDomains: domains,
                isNewUser: false // They are officially onboarded!
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Save Domains Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}