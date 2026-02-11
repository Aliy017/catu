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
            lineRefs.current.forEach((lineEl) => {
                if (!lineEl) return;
                const inner = lineEl.querySelector(".kinetic-inner");
                if (!inner) return;

                gsap.fromTo(
                    inner,
                    {
                        yPercent: 100,
                        opacity: 0,
                    },
                    {
                        yPercent: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: lineEl,
                            start: "top 85%",
                            end: "top 50%",
                            scrub: 1,
                        },
                    }
                );
            });
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
                    <div className="kinetic-inner font-[family-name:var(--font-heading)] text-4xl md:text-7xl lg:text-8xl xl:text-9xl font-bold uppercase leading-[1.05] tracking-tight">
                        {line}
                    </div>
                </div>
            ))}
        </div>
    );
}
