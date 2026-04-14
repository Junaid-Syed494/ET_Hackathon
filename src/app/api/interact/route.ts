import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@prisma/client";

// Ensure the %40 is used for the @ symbol in the password
const connectionString = "postgresql://postgres:ET_Intelligence%402026@db.skzugjsmnimzituwlfxd.supabase.co:5432/postgres";

export async function POST(req: Request) {
    // Initialize connection inside the route
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any)?.id) {
            await prisma.$disconnect(); // Hang up the connection!
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { articleId, actionType } = body;

        // Save the interaction
        const interaction = await prisma.interaction.create({
            data: {
                userId: (session.user as any).id,
                articleId: articleId,
                actionType: actionType,
            }
        });

        await prisma.$disconnect(); // Hang up the connection!
        return NextResponse.json({ success: true, interaction });

    } catch (error) {
        console.error("Interaction DB Error:", error);
        await prisma.$disconnect(); // Hang up the connection even if it crashes!
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}