"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import NextImage from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isIOS } from "./iosDetect";

// ScrollTrigger registered inside useEffect (non-iOS only)

const FRAME_COUNT = 98;
const INITIAL_BATCH = 8;     // First frames to show loader quickly
const BATCH_SIZE = 15;        // Background loading batch size

function getFramePath(index: number): string {
    const num = String(index).padStart(3, "0");
    return `/frames/ezgif-frame-${num}.webp`;
}

/**
 * Progressive image preloader using refs (no re-renders during background loading).
 * Phase 1: Load first INITIAL_BATCH frames → mark "loaded" (loader disappears)
 * Phase 2: Load remaining frames in background — NO state changes, NO re-renders
 */
function useProgressivePreloader(frameCount: number) {
    // Use ref for images array — avoids re-renders that break GSAP timeline
    const imgsRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null));
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const loadedCountRef = useRef(0);

    useEffect(() => {
        const imgs = imgsRef.current;

        function loadImage(index: number): Promise<void> {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = getFramePath(index + 1); // 1-indexed paths
                const onDone = () => {
                    imgs[index] = img;
                    loadedCountRef.current++;
                    setProgress(Math.floor((loadedCountRef.current / frameCount) * 100));
                    resolve();
                };
                img.onload = onDone;
                img.onerror = onDone;
            });
        }

        async function loadAll() {
            // Phase 1: Load initial batch fast
            const initialPromises: Promise<void>[] = [];
            for (let i = 0; i < Math.min(INITIAL_BATCH, frameCount); i++) {
                initialPromises.push(loadImage(i));
            }
            await Promise.all(initialPromises);
            setLoaded(true); // Loader disappears — no images state change!

            // Phase 2: Background batches — only setProgress, no images state
            for (let start = INITIAL_BATCH; start < frameCount; start += BATCH_SIZE) {
                const end = Math.min(start + BATCH_SIZE, frameCount);
                const batchPromises: Promise<void>[] = [];
                for (let i = start; i < end; i++) {
                    batchPromises.push(loadImage(i));
                }
                await Promise.all(batchPromises);
            }
        }

        loadAll();
    }, [frameCount]);

    return { imgsRef, progress, loaded };
}

export default function HeroSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { imgsRef, progress, loaded } = useProgressivePreloader(FRAME_COUNT);
    const frameIndexRef = useRef({ value: 0 });
    const lastDrawnRef = useRef(-1); // Track last successfully drawn frame

    const drawFrame = useCallback(
        (index: number) => {
            const canvas = canvasRef.current;
            const imgs = imgsRef.current;
            if (!canvas || !imgs.length) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const clampedIndex = Math.min(Math.max(0, Math.floor(index)), imgs.length - 1);

            // Find the best available frame: requested frame, or nearest loaded one
            let img = imgs[clampedIndex];
            if (!img || !img.complete || img.naturalWidth === 0) {
                // Search for nearest loaded frame (prefer backwards, then forwards)
                let bestIdx = -1;
                for (let offset = 1; offset < imgs.length; offset++) {
                    const back = clampedIndex - offset;
                    const fwd = clampedIndex + offset;
                    if (back >= 0 && imgs[back]?.complete && imgs[back]!.naturalWidth > 0) {
                        bestIdx = back;
                        break;
                    }
                    if (fwd < imgs.length && imgs[fwd]?.complete && imgs[fwd]!.naturalWidth > 0) {
                        bestIdx = fwd;
                        break;
                    }
                }
                if (bestIdx < 0) return; // No frames loaded at all
                img = imgs[bestIdx]!;
            }

            // Skip redraw if same frame to save CPU
            if (lastDrawnRef.current === clampedIndex && img === imgs[clampedIndex]) return;
            lastDrawnRef.current = clampedIndex;

            /* DPR-aware canvas — limit to 1 on iOS or mobile to avoid retina overhead */
            const ios = isIOS();
            const isMobile = ios || window.innerWidth < 768;
            const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
            const w = window.innerWidth;
            const h = window.innerHeight;

            // Only resize canvas when dimensions actually change
            if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                canvas.style.width = w + "px";
                canvas.style.height = h + "px";
            }

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            /* High-quality rendering */
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = ios ? "medium" : "high";

            /* Clean render — no heavy ctx.filter for performance */

            const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
            const x = (w - img.naturalWidth * scale) / 2;
            const y = (h - img.naturalHeight * scale) / 2;

            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
        },
        [imgsRef]
    );

    useEffect(() => {
        if (!loaded || !containerRef.current || !canvasRef.current || !overlayRef.current) return;

        // Force draw immediately
        requestAnimationFrame(() => drawFrame(0));
        const timer = setTimeout(() => drawFrame(0), 100);

        // ─── iOS: No GSAP ScrollTrigger — just show first frame ───
        if (isIOS()) {
            return () => clearTimeout(timer);
        }

        // ─── Non-iOS: Full GSAP pin + scrub timeline ───
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                pin: ".hero-pinned-wrapper",
                pinSpacing: false,
                invalidateOnRefresh: true,
            },
        });

        tl.to(frameIndexRef.current, {
            value: FRAME_COUNT - 1,
            ease: "none",
            onUpdate: () => {
                lastDrawnRef.current = -1;
                drawFrame(frameIndexRef.current.value);
            },
        });

        const handleResize = () => {
            lastDrawnRef.current = -1;
            ScrollTrigger.refresh();
            drawFrame(frameIndexRef.current.value);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(timer);
            tl.kill();
            window.removeEventListener("resize", handleResize);
        };
    }, [loaded, drawFrame]);

    const iosDevice = typeof window !== 'undefined' && isIOS();

    return (
        <div ref={containerRef} className="relative" style={{ height: iosDevice ? "100vh" : "200vh" }}>
            {/* ═══════ LUXURY PREMIUM LOADING SCREEN ═══════ */}
            <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]
                transition-all duration-[1500ms] ease-[cubic-bezier(0.19,1,0.22,1)]
                ${loaded ? "opacity-0 pointer-events-none scale-110 blur-lg" : "opacity-100 scale-100 blur-0"}`}>

                {/* Ambient floating orbs */}
                <div className="absolute top-[20%] left-[15%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[#FF2020]/[0.08] blur-[80px] md:blur-[120px]"
                    style={{ animation: "orb-float-1 8s ease-in-out infinite" }} />
                <div className="absolute bottom-[15%] right-[10%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-[#FF2020]/[0.05] blur-[60px] md:blur-[100px]"
                    style={{ animation: "orb-float-2 10s ease-in-out infinite" }} />
                <div className="absolute top-[50%] left-[60%] w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full bg-[#FF2020]/[0.04] blur-[70px] md:blur-[90px]"
                    style={{ animation: "orb-float-3 12s ease-in-out infinite" }} />

                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,32,32,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,32,32,0.3) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />

                {/* Scan line effect */}
                <div className="loader-scan-line absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF2020]/40 to-transparent z-20" />

                {/* Center content */}
                <div className="relative z-10 flex flex-col items-center">

                    {/* Logo with spinning ring */}
                    <div className="relative mb-12 md:mb-16">
                        {/* Outer spinning ring */}
                        <div className="loader-ring absolute top-1/2 left-1/2 w-[160px] h-[160px] md:w-[220px] md:h-[220px]
                            border border-[#FF2020]/20 rounded-full"
                            style={{ borderTopColor: "rgba(255,32,32,0.6)", borderRightColor: "rgba(255,32,32,0.3)" }} />

                        {/* Inner ring (counter-spin) */}
                        <div className="absolute top-1/2 left-1/2 w-[140px] h-[140px] md:w-[190px] md:h-[190px]
                            -translate-x-1/2 -translate-y-1/2 border border-[#FF2020]/10 rounded-full"
                            style={{ animation: "loader-ring-spin 6s linear infinite reverse", borderBottomColor: "rgba(255,32,32,0.4)" }} />

                        {/* Logo */}
                        <div className="relative">
                            <NextImage
                                src="/logo.png"
                                alt="Pi MEDIA"
                                width={300}
                                height={188}
                                className="loader-logo-breathe w-[120px] md:w-[160px]"
                                priority
                            />
                        </div>
                    </div>

                    {/* Progress section */}
                    <div className="flex flex-col items-center w-[240px] md:w-[320px]">

                        {/* Premium progress bar */}
                        <div className="relative h-[3px] w-full bg-white/[0.04] overflow-hidden rounded-full mb-5">
                            {/* Track glow */}
                            <div className="absolute inset-0 rounded-full"
                                style={{ boxShadow: "inset 0 0 10px rgba(255,32,32,0.05)" }} />
                            {/* Fill */}
                            <div className="loader-progress-bar absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }} />
                            {/* Leading dot */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-white shadow-[0_0_10px_#FF2020,0_0_20px_#FF2020] transition-all duration-500"
                                style={{ left: `calc(${Math.min(progress, 98)}% - 3px)`, opacity: progress > 0 ? 1 : 0 }} />
                        </div>

                        {/* Percentage & status row */}
                        <div className="flex items-center justify-between w-full mb-3">
                            <div className="flex items-center gap-1.5">
                                {/* Pulsing dots */}
                                <span className="loader-dot w-[3px] h-[3px] rounded-full bg-[#FF2020]" />
                                <span className="loader-dot w-[3px] h-[3px] rounded-full bg-[#FF2020]" />
                                <span className="loader-dot w-[3px] h-[3px] rounded-full bg-[#FF2020]" />
                            </div>

                            {/* Percentage */}
                            <span className="loader-pct font-[family-name:var(--font-heading)] text-base md:text-lg text-[#FF2020] font-bold tabular-nums tracking-wide">
                                {progress}<span className="text-[#FF2020]/50 text-[10px] md:text-xs ml-0.5">%</span>
                            </span>
                        </div>

                        {/* Loading text with letter expansion */}
                        <span className="loader-text-expand font-[family-name:var(--font-heading)] text-[9px] md:text-[11px] tracking-[0.3em] text-white/30 uppercase">
                            YUKLANMOQDA
                        </span>
                    </div>

                    {/* Decorative bottom line */}
                    <div className="mt-10 md:mt-14 w-[100px] md:w-[140px] h-[1px] bg-gradient-to-r from-transparent via-[#FF2020]/30 to-transparent" />
                </div>
            </div>

            {/* Pinned wrapper — always visible but behind loader initially */}
            <div className="hero-pinned-wrapper w-full h-screen relative">
                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ imageRendering: "crisp-edges" }}
                />

                {/* Gradient + Text Overlay — inside the pinned wrapper, fixed positioning for stability */}
                <div ref={overlayRef} className="pointer-events-none absolute inset-0 w-full h-full z-10"
                    style={{ willChange: "auto" }}>
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#050505] to-transparent" />
                    <div className="absolute left-0 w-full px-6 md:px-16 z-20 flex flex-col items-start gap-4 md:gap-5"
                        style={{ bottom: "clamp(48px, 8vh, 80px)" }}>
                        <span className="font-[family-name:var(--font-heading)] text-[#f5f5f5]/40 text-xs sm:text-sm md:text-lg lg:text-2xl font-medium tracking-[0.15em] md:tracking-[0.2em] uppercase">
                            IJTIMOIY TARMOQ MUTAXASSISI
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
