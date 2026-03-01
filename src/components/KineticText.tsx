"use client";

import { useEffect, useRef } from "react";
import { useLowPower } from "./LowPowerContext";

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

    useEffect(() => {
        if (!containerRef.current || isLowPower || autoPlay) return;

        // Observe the CONTAINER (not the hidden children)
        const container = containerRef.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    container.classList.add('kinetic-container-visible');
                    observer.unobserve(container);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(container);
        return () => observer.disconnect();
    }, [isLowPower, autoPlay]);

    return (
        <div ref={containerRef} className={`${className} kinetic-container`}>
            {lines.map((line, index) => (
                <div key={index} className="overflow-hidden py-[2px]">
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
                                    : {
                                        transitionDelay: `${index * 0.1}s`,
                                    }
                        }
                    >
                        {line}
                    </div>
                </div>
            ))}
        </div>
    );
}
