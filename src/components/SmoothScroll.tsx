"use client";

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLowPower } from "./LowPowerContext";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
    children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    const { isLowPower } = useLowPower();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // When LOW is on, skip Lenis setup
        if (isLowPower) return;

        const lenis = new Lenis({
            duration: 1.4,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;

        lenis.on("scroll", ScrollTrigger.update);

        const tickerCallback = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(tickerCallback);
            lenisRef.current = null;
        };
    }, [isLowPower]);

    return <>{children}</>;
}
