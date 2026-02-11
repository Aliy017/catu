"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface KineticTextProps {
    lines: string[];
    className?: string;
}

export default function KineticText({
    lines,
    className = "",
}: KineticTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

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
                    stagger: 0.1, // Stagger effect
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                        end: "bottom 50%", // More reasonable range
                        toggleActions: "play none none reverse", // Play once, reverse if scrolled back up
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [lines]);

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
                    <div className="kinetic-inner font-[family-name:var(--font-heading)] text-2xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold uppercase leading-[1.1] tracking-tight">
                        {line}
                    </div>
                </div>
            ))}
        </div>
    );
}
