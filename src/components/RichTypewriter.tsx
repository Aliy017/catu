"use client";

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLowPower } from "./LowPowerContext";

gsap.registerPlugin(ScrollTrigger);

interface TextSegment {
    text: string;
    className?: string;
}

interface RichTypewriterProps {
    segments: TextSegment[];
    speed?: number;
    delay?: number;
    className?: string;
}

export default function RichTypewriter({
    segments,
    speed = 3,
    delay = 0,
    className = "",
}: RichTypewriterProps) {
    const { isLowPower } = useLowPower();
    const containerRef = useRef<HTMLDivElement>(null);
    const hasStarted = useRef(false);

    // Pre-build flat character array with segment info
    const chars = useMemo(() => {
        const result: { char: string; segIndex: number }[] = [];
        segments.forEach((seg, si) => {
            for (const ch of seg.text) {
                result.push({ char: ch, segIndex: si });
            }
        });
        return result;
    }, [segments]);

    // Render all spans up front (hidden), then reveal via DOM — NO setState
    useEffect(() => {
        if (!containerRef.current || isLowPower) return;

        const spans = containerRef.current.querySelectorAll<HTMLSpanElement>(".tw-char");
        const cursor = containerRef.current.querySelector<HTMLSpanElement>(".tw-cursor");

        if (!spans.length) return;

        // Hide all chars initially
        spans.forEach(s => { s.style.opacity = "0"; });

        const startTyping = () => {
            const progress = { val: 0 };

            gsap.to(progress, {
                val: spans.length,
                duration: speed,
                delay: delay,
                ease: "none",
                onUpdate: () => {
                    const count = Math.floor(progress.val);
                    // Only reveal newly visible chars (no re-render)
                    for (let i = 0; i < count; i++) {
                        if (spans[i].style.opacity === "0") {
                            spans[i].style.opacity = "1";
                        }
                    }
                },
                onComplete: () => {
                    // Show all remaining and hide cursor
                    spans.forEach(s => { s.style.opacity = "1"; });
                    if (cursor) cursor.style.display = "none";
                },
            });
        };

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top 85%",
                onEnter: () => {
                    if (!hasStarted.current) {
                        hasStarted.current = true;
                        startTyping();
                    }
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [chars, speed, delay, isLowPower]);

    // LOW POWER — show all text immediately
    if (isLowPower) {
        return (
            <div ref={containerRef} className={className}>
                {segments.map((seg, i) => (
                    <span key={i} className={seg.className}>{seg.text}</span>
                ))}
            </div>
        );
    }

    return (
        <div ref={containerRef} className={className}>
            <span className="inline">
                {chars.map((c, i) => (
                    <span
                        key={i}
                        className={`tw-char ${segments[c.segIndex].className || ""}`}
                        style={{ opacity: 0, transition: "none" }}
                    >
                        {c.char}
                    </span>
                ))}
            </span>
            <span
                className="tw-cursor inline-block w-[2px] h-[0.85em] bg-[#FF2020] ml-1 align-middle rounded-full"
                style={{ animation: "cursorBlink 0.8s ease-in-out infinite" }}
            />
        </div>
    );
}
