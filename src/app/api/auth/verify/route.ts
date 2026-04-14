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

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return new NextResponse("Missing verification token", { status: 400 });
        }

        // 1. Find the user holding this secret token
        const user = await prisma.user.findUnique({
            where: { verifyToken: token }
        });

        if (!user) {
            return new NextResponse("Invalid or expired token", { status: 400 });
        }

        // 2. Unlock the account!
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(), // This unlocks the NextAuth gate
                verifyToken: null          // Destroy the token so it can't be reused
            }
        });

        // 3. Send them back to the login page with a success message
        // Note: We use an absolute URL here to ensure Next.js routes correctly
        return NextResponse.redirect(new URL("/login?verified=true", req.url));

    } catch (error) {
        console.error("Verification Error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}