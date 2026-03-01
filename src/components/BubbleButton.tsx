'use client';

import { useCallback } from 'react';

/* ── Premium CTA Button with floating bubbles ── */
export default function BubbleButton({
    compact = false,
    onOpen,
    label = "Ro'yxatdan o'tish"
}: {
    compact?: boolean;
    onOpen?: () => void;
    label?: string;
}) {
    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (onOpen) onOpen();
    }, [onOpen]);

    // 8 floating bubbles with randomized positions/delays
    const bubbles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        size: 4 + (i % 3) * 3,           // 4-10px
        left: 5 + i * 12,                  // spread across width
        delay: i * 0.7,                    // staggered
        duration: 3 + (i % 3),             // 3-5s
    }));

    return (
        <div className="relative inline-block group">
            {/* ── Floating bubbles ── */}
            {bubbles.map(b => (
                <span
                    key={b.id}
                    className="absolute rounded-full bg-[#FF2020] opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                        width: b.size,
                        height: b.size,
                        left: `${b.left}%`,
                        bottom: '50%',
                        filter: `blur(${b.size > 7 ? 1 : 0}px)`,
                        animation: `bubble-float ${b.duration}s ease-in-out ${b.delay}s infinite`,
                    }}
                />
            ))}

            {/* ── Glow backdrop ── */}
            <div className="absolute inset-0 rounded-full bg-[#FF2020]/20 blur-[25px] scale-110 opacity-60
                            group-hover:bg-[#FF2020]/35 group-hover:blur-[35px] group-hover:scale-125
                            transition-all duration-700 pointer-events-none" />

            {/* ── Button ── */}
            <a
                href="#contact-form"
                onClick={handleClick}
                className={`relative z-10 inline-block rounded-full
                   bg-[#FF2020] text-[#050505]
                   font-[family-name:var(--font-heading)]
                   font-bold uppercase
                   border border-[#FF2020]/60
                   hover:bg-[#f5f5f5] hover:text-[#050505] hover:border-[#f5f5f5]/40
                   hover:shadow-[0_0_40px_rgba(255,32,32,0.5)]
                   active:scale-95
                   transition-all duration-500 ease-out`}
                style={compact
                    ? { padding: 'clamp(16px, 2vw, 24px) clamp(40px, 6vw, 72px)', fontSize: 'clamp(14px, 2vw, 18px)', letterSpacing: '0.15em' }
                    : { padding: 'clamp(20px, 3vw, 40px) clamp(48px, 8vw, 96px)', fontSize: 'clamp(16px, 3vw, 30px)', letterSpacing: '0.18em' }
                }
            >
                {label}
            </a>
        </div>
    );
}
