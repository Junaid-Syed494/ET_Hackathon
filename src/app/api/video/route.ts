import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, summary, imageUrl } = body;

        if (!title || !summary) {
            return NextResponse.json({ error: "Missing article data" }, { status: 400 });
        }

        // 1. DYNAMIC STOCK VIDEO SEARCH (PEXELS)
        // We use a basic keyword from the title, or fallback to "technology"
        const searchQuery = title.split(" ")[0] || "technology";
        let dynamicBackgroundVideoUrl = imageUrl; // Fallback to article image if video fails

        try {
            const pexelsRes = await fetch(`https://api.pexels.com/videos/search?query=${searchQuery}&per_page=1&orientation=portrait`, {
                headers: { Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || "" }
            });
            const pexelsData = await pexelsRes.json();

            if (pexelsData.videos && pexelsData.videos.length > 0) {
                const videoFiles = pexelsData.videos[0].video_files;
                // Grab the best quality vertical video
                const hdVideo = videoFiles.find((file: any) => file.quality === "hd") || videoFiles[0];
                dynamicBackgroundVideoUrl = hdVideo.link;
            }
        } catch (err) {
            console.warn("Pexels fetch failed, falling back to static image", err);
        }

        // 2. SEND TO CREATOMATE
        const creatomatePayload = {
            template_id: process.env.CREATOMATE_TEMPLATE_ID,
            modifications: {
                // We inject the dynamic Pexels .mp4 link we just found!
                "News-Image": dynamicBackgroundVideoUrl,
                "Background": imageUrl,
                "Voiceover": summary
            }
        };

        const response = await fetch("https://api.creatomate.com/v1/renders", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.CREATOMATE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(creatomatePayload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Creatomate Error:", data);
            return NextResponse.json({ error: "Failed to initiate render" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            renderId: data[0].id,
            status: data[0].status
        });

    } catch (error) {
        console.error("Video Generation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}