import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        // 1. Security Check
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Get the Render ID from the URL query (e.g., /api/video/status?id=12345)
        const url = new URL(req.url);
        const renderId = url.searchParams.get("id");

        if (!renderId) {
            return NextResponse.json({ error: "Missing render ID" }, { status: 400 });
        }

        // 3. Ask Creatomate for the status
        const response = await fetch(`https://api.creatomate.com/v1/renders/${renderId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.CREATOMATE_API_KEY}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
        }

        // 4. Return the status and the video URL if it's finished
        return NextResponse.json({
            status: data.status, // "planned", "rendering", "succeeded", or "failed"
            url: data.url || null, // The final .mp4 link!
        });

    } catch (error) {
        console.error("Status Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}