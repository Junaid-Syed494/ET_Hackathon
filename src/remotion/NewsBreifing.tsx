import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Img } from "remotion";

// These are the inputs our video will accept
export interface NewsBriefingProps {
    title: string;
    summary: string;
    imageUrl: string;
}

export const NewsBriefing: React.FC<NewsBriefingProps> = ({ title, summary, imageUrl }) => {
    const frame = useCurrentFrame();

    // Animations calculated frame-by-frame
    // 1. Zoom the background image from scale 1 to 1.15 over 300 frames (10 seconds)
    const imageScale = interpolate(frame, [0, 300], [1, 1.15]);

    // 2. Fade the text in between frames 15 and 45
    const textOpacity = interpolate(frame, [15, 45], [0, 1], { extrapolateRight: "clamp" });

    // 3. Slide the text up from 50px to 0px
    const textY = interpolate(frame, [15, 45], [50, 0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "black", fontFamily: "sans-serif" }}>
            {/* Background Image */}
            <AbsoluteFill style={{ transform: `scale(${imageScale})` }}>
                <Img
                    src={imageUrl}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
                />
            </AbsoluteFill>

            {/* Text Overlay */}
            <AbsoluteFill
                style={{
                    justifyContent: "flex-end",
                    padding: "60px",
                    opacity: textOpacity,
                    transform: `translateY(${textY}px)`
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
                    <span style={{ color: '#ef4444', fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px' }}>
                        Breaking Update
                    </span>
                </div>

                <h1 style={{ color: "white", fontSize: "72px", fontWeight: "900", margin: "0 0 20px 0", lineHeight: 1.1 }}>
                    {title}
                </h1>

                <p style={{ color: "#cbd5e1", fontSize: "32px", borderLeft: "8px solid #ef4444", paddingLeft: "30px", margin: 0, lineHeight: 1.4, maxWidth: "80%" }}>
                    {summary}
                </p>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};