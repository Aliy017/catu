'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useLowPower } from './LowPowerContext';

/* ── Bubble data ─────────────────────────────────── */
interface BubbleData {
    id: number;
    left: number;   // % from container left
    top: number;    // % from container top
    size: number;   // px
    anim: number;   // which keyframe variant (0-3)
    dur: number;    // animation duration (s)
    delay: number;  // animation delay (s)
    opacity: number;
}

function makeBubbles(count: number): BubbleData[] {
    const arr: BubbleData[] = [];
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        // Elliptical distribution — wider than tall (button shape)
        const rx = 54 + Math.random() * 16;
        const ry = 65 + Math.random() * 45;
        arr.push({
            id: i,
            left: 50 + Math.cos(angle) * rx,
            top: 50 + Math.sin(angle) * ry,
            size: 3 + Math.random() * 7,
            anim: i % 4,
            dur: 3 + Math.random() * 3,
            delay: Math.random() * 2,
            opacity: 0.25 + Math.random() * 0.35,
        });
    }
    return arr;
}

/* ── Component ───────────────────────────────────── */
export default function BubbleButton({ compact = false, onOpen }: { compact?: boolean; onOpen?: () => void }) {
    const { isLowPower } = useLowPower();
    const [bubbles, setBubbles] = useState<BubbleData[]>([]);
    const [imploding, setImploding] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isLowPower) {
            // Defer setState to avoid synchronous call inside effect
            queueMicrotask(() => setBubbles([]));
            return;
        }
        const mobile = window.innerWidth < 768;
        const count = compact
            ? (mobile ? 6 : 10)
            : (mobile ? 8 : 14);
        queueMicrotask(() => setBubbles(makeBubbles(count)));
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [isLowPower, compact]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setImploding(true);
        timerRef.current = setTimeout(() => {
            setImploding(false);
            // Open contact modal
            if (onOpen) {
                onOpen();
            }
        }, 900);
    }, [onOpen]);

    return (
        <div className="relative inline-block">
            {/* ── Floating bubbles ── */}
            {bubbles.map((b) => (
                <span
                    key={b.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: b.size,
                        height: b.size,
                        left: imploding ? '50%' : `${b.left}%`,
                        top: imploding ? '50%' : `${b.top}%`,
                        backgroundColor: '#FF2020',
                        opacity: imploding ? 0 : b.opacity,
                        transform: imploding
                            ? 'translate(-50%,-50%) scale(0)'
                            : 'translate(-50%,-50%)',
                        transition: imploding
                            ? `left ${0.35 + b.id * 0.03}s cubic-bezier(.6,.05,.4,.95),
                 top ${0.35 + b.id * 0.03}s cubic-bezier(.6,.05,.4,.95),
                 opacity ${0.3 + b.id * 0.02}s ease,
                 transform ${0.3 + b.id * 0.03}s cubic-bezier(.6,.05,.4,.95)`
                            : 'left 1s ease, top 1s ease, opacity 0.6s ease',
                        animation: imploding
                            ? 'none'
                            : `bubble-drift-${b.anim} ${b.dur}s ${b.delay}s ease-in-out infinite`,
                        boxShadow: `0 0 ${b.size + 4}px rgba(255,32,32,${b.opacity * 0.6})`,
                    }}
                />
            ))}

            <a
                href="#contact-form"
                onClick={handleClick}
                className={`relative z-10 inline-block
                   bg-[#FF2020] text-[#050505]
                   font-[family-name:var(--font-heading)]
                   font-bold uppercase
                   hover:bg-[#f5f5f5] transition-colors duration-500
                   box-glow-strong
                   ${compact
                        ? 'px-16 sm:px-20 md:px-32 py-6 sm:py-8 md:py-10 text-base sm:text-lg md:text-2xl tracking-[0.12em] md:tracking-[0.18em]'
                        : 'px-12 sm:px-20 md:px-64 py-6 sm:py-10 md:py-20 text-lg sm:text-2xl md:text-6xl tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em]'
                    }`}
            >
                Ro&apos;yxatdan o&apos;tish
            </a>
        </div>
    );
}
