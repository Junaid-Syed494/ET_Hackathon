"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

const VideoStudio = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animRef = useRef<number | null>(null);

    // Use a ref to track the animation frame silently without triggering re-renders
    const frameRef = useRef<number>(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [displayFrame, setDisplayFrame] = useState(0);

    // We keep a ref of isPlaying so drawFrame always knows the current state
    // without needing it in the dependency array
    const isPlayingRef = useRef(isPlaying);
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        ctx.fillStyle = '#f8fafc'; // slate-50
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw moving element based on frameRef
        const xPos = (frameRef.current * 2) % canvas.width;

        ctx.fillStyle = '#ef4444'; // red-500
        ctx.beginPath();
        ctx.arc(xPos, canvas.height / 2, 30, 0, Math.PI * 2);
        ctx.fill();

        // Draw Text
        ctx.fillStyle = '#0f172a'; // slate-900
        ctx.font = 'bold 24px system-ui';
        ctx.fillText(`Rendering Frame: ${frameRef.current}`, 20, 40);

        // Animation loop logic
        if (isPlayingRef.current) {
            frameRef.current += 1;
            setDisplayFrame(frameRef.current); // Update the UI counter safely
            animRef.current = requestAnimationFrame(drawFrame);
        }
    }, []); // Empty dependency array prevents the infinite loop!

    // Handle Play/Pause
    useEffect(() => {
        if (isPlaying) {
            animRef.current = requestAnimationFrame(drawFrame);
        } else {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        }

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [isPlaying, drawFrame]);

    // Initial draw so the canvas isn't blank on load
    useEffect(() => {
        drawFrame();
    }, [drawFrame]);

    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Canvas Video Studio</h2>
                <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-md">Live Engine</span>
            </div>

            <div className="relative w-full aspect-video bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={450}
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="w-full mt-4 flex justify-between items-center">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${isPlaying ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                >
                    {isPlaying ? 'Pause Render' : 'Start Render'}
                </button>
                <span className="text-sm font-mono text-slate-500">
                    Elapsed: {displayFrame} frames
                </span>
            </div>
        </div>
    );
};

export default VideoStudio;