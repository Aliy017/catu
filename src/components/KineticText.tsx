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
}

export default function KineticText({
    lines,
    className = "",
    centered = false,
}: KineticTextProps) {
    const { isLowPower } = useLowPower();
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current || isLowPower) return;

        const ctx = gsap.context(() => {
            const inners = lineRefs.current.map(el => el?.querySelector(".kinetic-inner")).filter(Boolean);

            gsap.fromTo(
                inners,
                {
                    yPercent: 100,
                    opacity: 0,
                },
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power4.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                        end: "bottom 50%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [lines, isLowPower]);

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`}>
            {lines.map((line, index) => (
                <div
                    key={index}
                    ref={(el) => {
                        lineRefs.current[index] = el;
                    }}
                    className="overflow-hidden"
                >
                    <div className={`kinetic-inner font-[family-name:var(--font-heading)] 
                                     text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 
                                     font-bold uppercase leading-[1.1] tracking-tight 
                                     ${centered ? 'text-center w-full mx-auto' : 'text-center md:text-left'}`}
                        style={isLowPower ? { opacity: 1, transform: 'none' } : undefined}
                    >
                        {line}
                    </div>
                </div>
            ))}
        </div>
    );
}
