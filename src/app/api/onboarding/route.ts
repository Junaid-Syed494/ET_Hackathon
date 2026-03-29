import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@prisma/client";

// Initialize Prisma with the V7 Postgres Adapter
const connectionString = "postgresql://postgres:ET_Intelligence%402026@db.skzugjsmnimzituwlfxd.supabase.co:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
    try {
        // 1. Verify the user is actually logged in
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Get the calculated persona from the frontend
        const body = await req.json();
        const { persona } = body;

        // 3. Update the user in the Supabase database
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                persona: persona,
                isNewUser: false, // They have completed onboarding!
            },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Onboarding DB Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}