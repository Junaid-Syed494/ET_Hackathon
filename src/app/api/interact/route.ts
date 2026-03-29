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
        // 1. Check if the user is logged in
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any)?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { articleId, actionType } = body;

        // 2. Save the interaction to the database
        const interaction = await prisma.interaction.create({
            data: {
                userId: (session.user as any).id,
                articleId: articleId,
                actionType: actionType, // Will be "LIKE" or "SHARE"
            }
        });

        return NextResponse.json({ success: true, interaction });
    } catch (error) {
        console.error("Interaction DB Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}