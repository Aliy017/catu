'use client';

import { useEffect, useState, useCallback } from 'react';

export default function ScrollArrow() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (dismissed) return;

        let timer: ReturnType<typeof setTimeout>;
        let scrolledPast = false;

        const resetTimer = () => {
            clearTimeout(timer);
            setVisible(false);
            timer = setTimeout(() => {
                if (!scrolledPast) setVisible(true);
            }, 3000);
        };

        const handleScroll = () => {
            // Hide arrow once user scrolls past 20% of viewport
            if (window.scrollY > window.innerHeight * 0.2) {
                scrolledPast = true;
                setVisible(false);
                setDismissed(true);
            } else {
                scrolledPast = false;
                resetTimer();
            }
        };

        const handleInteraction = () => {
            if (!scrolledPast) resetTimer();
        };

        // Start initial 3-second timer
        timer = setTimeout(() => setVisible(true), 3000);

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('touchstart', handleInteraction, { passive: true });
        window.addEventListener('mousemove', handleInteraction, { passive: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('mousemove', handleInteraction);
        };
    }, [dismissed]);

    // Re-show if user scrolls back to top
    useEffect(() => {
        if (!dismissed) return;
        const handleScrollTop = () => {
            if (window.scrollY < 50) {
                setDismissed(false);
            }
        };
        window.addEventListener('scroll', handleScrollTop, { passive: true });
        return () => window.removeEventListener('scroll', handleScrollTop);
    }, [dismissed]);

    const handleClick = useCallback(() => {
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        setDismissed(true);
        setVisible(false);
    }, []);

    if (dismissed && !visible) return null;

    return (
        <button
            onClick={handleClick}
            aria-label="Pastga aylantirish"
            className={`fixed z-50 right-4 md:right-8 bottom-8 md:bottom-12
                       transition-all duration-1000 ease-out cursor-pointer
                       ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            style={{ outline: 'none', border: 'none', background: 'none' }}
        >
            {/* Outer glow ring */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-full border border-[#FF2020]/30 animate-ping"
                    style={{ animationDuration: '2.5s' }} />

                {/* Glass circle */}
                <div className="absolute inset-0 rounded-full 
                                bg-[#FF2020]/10 backdrop-blur-sm
                                border border-[#FF2020]/40
                                shadow-[0_0_20px_rgba(255,32,32,0.15)]" />

                {/* Chevron arrow — animated bounce */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="relative z-10 w-5 h-5 md:w-6 md:h-6 scroll-arrow-bounce"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(255,32,32,0.5))' }}
                >
                    {/* Double chevron for premium look */}
                    <path
                        d="M7 8L12 13L17 8"
                        stroke="#FF2020"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-40"
                    />
                    <path
                        d="M7 13L12 18L17 13"
                        stroke="#FF2020"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </button>
    );
}
