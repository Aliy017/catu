"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import NextImage from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 98;

function getFramePath(index: number): string {
    const num = String(index).padStart(3, "0");
    return `/frames/ezgif-frame-${num}.jpg`;
}

function useImagePreloader(frameCount: number) {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const imgs: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                loadedCount++;
                setProgress(Math.floor((loadedCount / frameCount) * 100));
                if (loadedCount === frameCount) {
                    setImages(imgs);
                    setLoaded(true);
                }
            };
            img.onerror = () => {
                loadedCount++;
                setProgress(Math.floor((loadedCount / frameCount) * 100));
                if (loadedCount === frameCount) {
                    setImages(imgs);
                    setLoaded(true);
                }
            };
            imgs.push(img);
        }
    }, [frameCount]);

    return { images, progress, loaded };
}

export default function HeroSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { images, progress, loaded } = useImagePreloader(FRAME_COUNT);
    const frameIndexRef = useRef({ value: 0 });

    const drawFrame = useCallback(
        (index: number) => {
            const canvas = canvasRef.current;
            if (!canvas || !images.length) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const clampedIndex = Math.min(Math.max(0, Math.floor(index)), images.length - 1);
            const img = images[clampedIndex];
            if (!img || !img.complete || img.naturalWidth === 0) return;

            /* DPR-aware canvas for sharper rendering on Retina displays */
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            ctx.scale(dpr, dpr);

            /* High-quality rendering */
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            /* Boost contrast & brightness slightly for a premium look */
            ctx.filter = "contrast(1.08) brightness(1.05) saturate(1.1)";

            const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
            const x = (w - img.naturalWidth * scale) / 2;
            const y = (h - img.naturalHeight * scale) / 2;

            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);

            /* Reset filter */
            ctx.filter = "none";
        },
        [images]
    );

    useEffect(() => {
        if (!loaded || !containerRef.current || !canvasRef.current || !overlayRef.current) return;

        drawFrame(0);

        /* Pin the canvas AND the overlay together inside the container */
        const tween = gsap.to(frameIndexRef.current, {
            value: FRAME_COUNT - 1,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                onUpdate: () => {
                    drawFrame(frameIndexRef.current.value);
                },
            },
        });

        /* Pin the wrapper that holds both canvas+overlay */
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: ".hero-pinned-wrapper",
            pinSpacing: false,
        });

        const handleResize = () => drawFrame(frameIndexRef.current.value);
        window.addEventListener("resize", handleResize);

        return () => {
            tween.kill();
            window.removeEventListener("resize", handleResize);
        };
    }, [loaded, drawFrame]);

    return (
        <div ref={containerRef} className="relative" style={{ height: "200vh" }}>
            {/* Loading Screen */}
            {!loaded && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
                    <NextImage src="/logo.png" alt="Pi MEDIA" width={120} height={75} className="mb-4 brightness-110 w-[100px] md:w-[120px]" priority />
                    <div className="mb-6 font-[family-name:var(--font-body)] text-sm text-[#f5f5f5]/40 tracking-[0.3em]">
                        YUKLANMOQDA...
                    </div>
                    <div className="relative h-[2px] w-64 bg-[#1a1a1a] overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-[#FF2020] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="mt-4 font-[family-name:var(--font-body)] text-sm text-[#f5f5f5]/50 tracking-widest">
                        {progress}%
                    </div>
                </div>
            )}

            {/* Pinned wrapper — canvas + text overlay pinned together */}
            <div className="hero-pinned-wrapper w-full h-screen" style={{ display: loaded ? "block" : "none" }}>
                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                />

                {/* Gradient + Text Overlay — inside the pinned wrapper, so it unpins with canvas */}
                <div ref={overlayRef} className="pointer-events-none absolute inset-0 w-full h-full z-10">
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#050505] to-transparent" />
                    <div className="absolute bottom-10 md:bottom-16 left-0 w-full px-4 md:px-16 z-20 flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-6">
                        <NextImage src="/logo.png" alt="Pi MEDIA" width={200} height={125} className="brightness-110 drop-shadow-[0_0_30px_rgba(255,32,32,0.3)] w-[100px] md:w-[160px] lg:w-[200px]" priority />
                        <span className="font-[family-name:var(--font-heading)] text-[#f5f5f5]/50 text-sm md:text-xl lg:text-3xl font-medium tracking-[0.1em] md:tracking-[0.15em] uppercase sm:mb-2">
                            IJTIMOIY TARMOQ MUTAXASSISI
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
