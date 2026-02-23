"use client";

import { useState, useEffect, useRef } from "react";
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
    const [displayedSegments, setDisplayedSegments] = useState<TextSegment[]>([]);
    const [typingDone, setTypingDone] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasStarted = useRef(false);

    const totalChars = segments.reduce((acc, seg) => acc + seg.text.length, 0);

    useEffect(() => {
        // LOW POWER → show full text immediately
        if (isLowPower) {
            setDisplayedSegments(segments);
            setTypingDone(true);
            return;
        }

        if (!containerRef.current) return;

        // If typing already completed, don't restart
        if (hasStarted.current) return;

        const updateText = (count: number) => {
            let remaining = count;
            const newSegments: TextSegment[] = [];

            for (const segment of segments) {
                if (remaining <= 0) break;

                if (remaining >= segment.text.length) {
                    newSegments.push(segment);
                    remaining -= segment.text.length;
                } else {
                    newSegments.push({
                        ...segment,
                        text: segment.text.substring(0, remaining),
                    });
                    remaining = 0;
                }
            }
            setDisplayedSegments(newSegments);
        };

        const startTyping = () => {
            const progress = { val: 0 };

            gsap.to(progress, {
                val: totalChars,
                duration: speed,
                delay: delay,
                ease: "none",
                onUpdate: () => {
                    const currentCount = Math.floor(progress.val);
                    updateText(currentCount);
                },
                onComplete: () => {
                    setTypingDone(true);
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
    }, [segments, totalChars, speed, delay, isLowPower]);

    return (
        <div ref={containerRef} className={className}>
            <span className="inline transition-all duration-300 ease-out">
                {displayedSegments.map((seg, i) => (
                    <span key={i} className={seg.className}>
                        {seg.text}
                    </span>
                ))}
            </span>
            {!typingDone && (
                <span
                    className="inline-block w-[2px] h-[0.85em] bg-[#FF2020] ml-1 align-middle rounded-full"
                    style={{ animation: "cursorBlink 0.8s ease-in-out infinite" }}
                />
            )}
        </div>
    );
}
