'use client';

import { useCallback } from 'react';

/* ── Clean CTA Button — no bubbles, no particles ── */
export default function BubbleButton({ compact = false, onOpen }: { compact?: boolean; onOpen?: () => void }) {

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (onOpen) {
            onOpen();
        }
    }, [onOpen]);

    return (
        <div className="relative inline-block">
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
