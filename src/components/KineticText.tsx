"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLowPower } from "./LowPowerContext";

gsap.registerPlugin(ScrollTrigger);

interface KineticTextProps {
    lines: string[];
    className?: string;
    centered?: boolean;
    autoPlay?: boolean;
}

export default function KineticText({
    lines,
    className = "",
    centered = false,
    autoPlay = false,
}: KineticTextProps) {
    const { isLowPower } = useLowPower();
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current || isLowPower || autoPlay) return;

        // Only use GSAP for scroll-triggered (non-autoPlay) instances
        const ctx = gsap.context(() => {
            const inners = lineRefs.current.map(el => el?.querySelector(".kinetic-inner")).filter(Boolean);

            gsap.fromTo(
                inners,
                { yPercent: 100, opacity: 0 },
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power4.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [lines, isLowPower, autoPlay]);

    return (
        <div ref={containerRef} className={className}>
            {lines.map((line, index) => (
                <div
                    key={index}
                    ref={(el) => { lineRefs.current[index] = el; }}
                    className="overflow-hidden py-[2px]"
                >
                    <div
                        className={`kinetic-inner font-[family-name:var(--font-heading)] 
                                     text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl 
                                     font-bold uppercase leading-[1.15] tracking-tight
                                     ${centered ? 'text-center w-full mx-auto' : 'text-center md:text-left'}`}
                        style={
                            isLowPower
                                ? { opacity: 1, transform: 'none' }
                                : autoPlay
                                    ? {
                                        animation: `kinetic-rise 0.7s cubic-bezier(0.22,1,0.36,1) ${index * 0.08}s both`,
                                    }
                                    : { opacity: 0, transform: 'translateY(100%)' }
                        }
                    >
                        {line}
                    </div>
                </div>
            ))}
        </div>
    );
}
