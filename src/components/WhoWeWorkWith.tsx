"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isIOS } from "./iosDetect";

// ScrollTrigger registered inside useEffect (non-iOS only)

const WORK_WITH = [
    "O'sishni xohlaydigan biznes egalari",
    "Reklama budjeti ajrata oladiganlar",
    "KPI asosida ishlashga tayyorlar",
    "Uzoq muddatli hamkorlik istovchilar",
    "Strategiyani qadrlaydigan rahbarlar",
];

const DONT_WORK_WITH = [
    "SMM ni qutqaruvchi deb bilganlar",
    "0 budjet bilan natija kutuvchilar",
    "1 haftada mo\u2019jiza kutadiganlar",
    "Strategiyasiz ishlamoqchi bo\u2019lganlar",
    "Hisob-kitobsiz reklama qilishni xohlovchilar",
];

export default function WhoWeWorkWith() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleWorkRef = useRef<HTMLHeadingElement>(null);
    const listWorkRef = useRef<HTMLDivElement>(null);
    const titleDontRef = useRef<HTMLHeadingElement>(null);
    const listDontRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const [ios, setIos] = useState(false);
    useEffect(() => { setIos(isIOS()); }, []);

    useEffect(() => {
        if (!sectionRef.current || !ios) return;

        // ─── iOS: IntersectionObserver for card + item reveals ───
        const cards = sectionRef.current.querySelectorAll('.ios-card-reveal');

        // Cards: slide up + fade in
        const cardObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    // Trigger child items
                    el.querySelectorAll('.ios-item-reveal').forEach((item) => {
                        (item as HTMLElement).style.opacity = '1';
                        (item as HTMLElement).style.transform = 'translateX(0)';
                    });
                    cardObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        cards.forEach(card => {
            (card as HTMLElement).style.opacity = '0';
            (card as HTMLElement).style.transform = 'translateY(40px)';
            (card as HTMLElement).style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
            cardObs.observe(card);
        });

        return () => cardObs.disconnect();
    }, [ios]);

    useEffect(() => {
        if (!sectionRef.current || ios) return;

        // ─── Android / Desktop: GSAP pin timeline ───
        let ctx: gsap.Context;
        const timer = setTimeout(() => {
            gsap.registerPlugin(ScrollTrigger);
            ctx = gsap.context(() => {
                gsap.set(titleWorkRef.current, { y: "100vh", opacity: 0, scale: 0.7 });
                gsap.set(glowRef.current, { opacity: 0, scale: 0.3 });
                gsap.set(titleDontRef.current, { y: 60, opacity: 0, scale: 0.9 });
                if (listWorkRef.current) gsap.set(listWorkRef.current.children, { y: 50, opacity: 0 });
                if (listDontRef.current) {
                    gsap.set(listDontRef.current.children, { y: 50, opacity: 0 });
                    gsap.set(listDontRef.current, { visibility: "hidden" });
                }

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: typeof window !== 'undefined' && window.innerWidth < 768 ? "+=80%" : "+=180%",
                        pin: true,
                        scrub: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.2 : 0.8,
                        anticipatePin: 1,
                    },
                });

                // Section 1: "ishlaymiz" — appear fast
                tl.to(titleWorkRef.current, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }, 0);
                tl.to(glowRef.current, { opacity: 0.2, scale: 1, duration: 1.5, ease: "power2.out" }, 0.3);
                if (listWorkRef.current) {
                    tl.to(listWorkRef.current.children, { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: "power3.out" }, 1.5);
                }
                tl.to({}, { duration: 0.5 }, 2.8);
                // Section 1: exit
                tl.to(titleWorkRef.current, { y: -60, opacity: 0, duration: 0.8, ease: "power2.in" }, 3.3);
                if (listWorkRef.current) {
                    tl.to(listWorkRef.current.children, { y: -20, opacity: 0, stagger: 0.04, duration: 0.3, ease: "power2.in" }, 3.3);
                }
                tl.to(glowRef.current, { opacity: 0.06, duration: 0.6 }, 3.5);
                // Section 2: "ishlamaymiz" — enter immediately
                tl.set(listDontRef.current, { visibility: "visible" }, 4);
                tl.to(titleDontRef.current, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, 4);
                if (listDontRef.current) {
                    tl.to(listDontRef.current.children, { y: 0, opacity: 1, duration: 0.4, stagger: 0.12, ease: "power3.out" }, 4.5);
                }
                tl.to({}, { duration: 0.5 }, 6);
                // Section 2: exit
                tl.to(titleDontRef.current, { y: -40, opacity: 0, duration: 0.8, ease: "power2.in" }, 6.5);
                if (listDontRef.current) {
                    tl.to(listDontRef.current.children, { y: -15, opacity: 0, stagger: 0.04, duration: 0.3, ease: "power2.in" }, 6.5);
                }
                tl.to(glowRef.current, { opacity: 0, duration: 0.6 }, 6.8);
            }, sectionRef);
        }, 500);

        return () => { clearTimeout(timer); ctx?.revert(); };
    }, [ios]);

    // ─── iOS: premium card-based layout with scroll animations ───
    if (ios) {
        return (
            <section ref={sectionRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    background: '#050505',
                    overflow: 'hidden',
                    paddingTop: 100,
                    paddingBottom: 260,
                }}>
                {/* Background glow */}
                <div ref={glowRef}
                    style={{
                        position: 'absolute',
                        top: '30%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400, height: 400,
                        borderRadius: '50%',
                        background: 'rgba(255,32,32,0.06)',
                        filter: 'blur(120px)',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }} />

                {/* Container — always centered */}
                <div style={{
                    position: 'relative',
                    zIndex: 20,
                    width: '100%',
                    maxWidth: 540,
                    margin: '0 auto',
                    paddingLeft: 20,
                    paddingRight: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>

                    {/* ═══ CARD 1: Biz kimlar bilan ISHLAYMIZ ═══ */}
                    <div className="ios-card-reveal" style={{
                        width: '100%',
                        background: 'linear-gradient(160deg, rgba(255,32,32,0.08) 0%, rgba(10,10,10,0.98) 50%, rgba(255,32,32,0.03) 100%)',
                        border: '1px solid rgba(255,32,32,0.15)',
                        borderRadius: 28,
                        padding: '44px 32px',
                        marginBottom: 28,
                    }}>
                        <h2 ref={titleWorkRef}
                            className="font-[family-name:var(--font-heading)]"
                            style={{
                                fontSize: 22, fontWeight: 800,
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                lineHeight: 1.2,
                                marginBottom: 36, marginTop: 0,
                            }}>
                            <span style={{ color: '#f5f5f5' }}>Biz kimlar bilan </span>
                            <span style={{ color: '#FF2020', textShadow: '0 0 40px rgba(255,32,32,0.5)' }}>ishlaymiz</span>
                        </h2>
                        <div ref={listWorkRef} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {WORK_WITH.map((item, i) => (
                                <div key={i} className="ios-item-reveal"
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: 14,
                                        opacity: 0, transform: 'translateX(-20px)',
                                        transition: `opacity 0.5s ease-out ${i * 100 + 200}ms, transform 0.5s ease-out ${i * 100 + 200}ms`,
                                    }}>
                                    <span style={{
                                        width: 24, height: 24, minWidth: 24,
                                        borderRadius: '50%',
                                        background: 'rgba(255,32,32,0.12)',
                                        border: '1.5px solid rgba(255,32,32,0.35)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, color: '#FF2020', fontWeight: 700,
                                        marginTop: 2,
                                    }}>✓</span>
                                    <span className="font-sans" style={{
                                        fontSize: 15, color: 'rgba(245,245,245,0.85)',
                                        lineHeight: 1.7, letterSpacing: 0.2,
                                    }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ═══ CARD 2: Biz kimlar bilan ISHLAMAYMIZ ═══ */}
                    <div className="ios-card-reveal" style={{
                        width: '100%',
                        background: 'linear-gradient(160deg, rgba(255,255,255,0.02) 0%, rgba(10,10,10,0.98) 50%, rgba(255,255,255,0.01) 100%)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 28,
                        padding: '44px 32px',
                    }}>
                        <h2 ref={titleDontRef}
                            className="font-[family-name:var(--font-heading)]"
                            style={{
                                fontSize: 22, fontWeight: 800,
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                lineHeight: 1.2,
                                marginBottom: 36, marginTop: 0,
                            }}>
                            <span style={{ color: '#f5f5f5' }}>Biz kimlar bilan </span>
                            <span style={{ color: 'rgba(245,245,245,0.2)' }}>ishlamaymiz</span>
                        </h2>
                        <div ref={listDontRef} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {DONT_WORK_WITH.map((item, i) => (
                                <div key={i} className="ios-item-reveal"
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: 14,
                                        opacity: 0, transform: 'translateX(-20px)',
                                        transition: `opacity 0.5s ease-out ${i * 100 + 200}ms, transform 0.5s ease-out ${i * 100 + 200}ms`,
                                    }}>
                                    <span style={{
                                        width: 24, height: 24, minWidth: 24,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1.5px solid rgba(255,255,255,0.08)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, color: 'rgba(245,245,245,0.15)', fontWeight: 700,
                                        marginTop: 2,
                                    }}>✕</span>
                                    <span className="font-sans" style={{
                                        fontSize: 15, color: 'rgba(245,245,245,0.2)',
                                        lineHeight: 1.7, letterSpacing: 0.2,
                                    }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        );
    }

    // ─── Android / Desktop: original h-screen layout ───
    return (
        <section ref={sectionRef} className="relative h-screen w-full bg-[#050505] overflow-hidden">
            <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[300px] h-[300px] md:w-[700px] md:h-[700px] rounded-full blur-[80px] md:blur-[150px] opacity-0
                bg-[#FF2020] pointer-events-none z-0" />
            <div className="absolute inset-0 pointer-events-none z-30
                bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-50" />
            <div ref={contentRef} className="relative h-full flex flex-col items-center justify-center z-20 px-6">
                <h2 ref={titleWorkRef} className="absolute font-[family-name:var(--font-heading)]
                    text-[22px] sm:text-5xl md:text-7xl lg:text-[90px] font-bold uppercase text-[#f5f5f5] text-center leading-[0.9] whitespace-nowrap
                    will-change-transform top-[28%] sm:top-[25%] md:top-[22%]">
                    Biz kimlar bilan{" "}
                    <span className="text-[#FF2020] drop-shadow-[0_0_30px_rgba(255,32,32,0.4)]">ishlaymiz</span>
                </h2>
                <h2 ref={titleDontRef} className="absolute font-[family-name:var(--font-heading)]
                    text-[22px] sm:text-5xl md:text-7xl lg:text-[90px] font-bold uppercase text-[#f5f5f5] text-center leading-[0.9] whitespace-nowrap
                    will-change-transform top-[28%] sm:top-[25%] md:top-[22%]">
                    Biz kimlar bilan <span className="text-[#f5f5f5]/30">ishlamaymiz</span>
                </h2>
                <div ref={listWorkRef} className="absolute flex flex-col items-center gap-5 md:gap-7 max-w-lg top-[45%] sm:top-[42%] md:top-[40%]">
                    {WORK_WITH.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 md:gap-4">
                            <span className="w-[6px] h-[6px] md:w-2 md:h-2 rounded-full bg-[#FF2020] shadow-[0_0_12px_rgba(255,32,32,0.6)] flex-shrink-0" />
                            <span className="font-sans text-sm sm:text-base md:text-lg text-[#f5f5f5]/70 leading-relaxed">{item}</span>
                        </div>
                    ))}
                </div>
                <div ref={listDontRef} className="invisible absolute flex flex-col items-center gap-5 md:gap-7 max-w-lg top-[45%] sm:top-[42%] md:top-[40%]">
                    {DONT_WORK_WITH.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 md:gap-4">
                            <span className="w-[6px] h-[6px] md:w-2 md:h-2 rounded-full bg-[#f5f5f5]/15 flex-shrink-0" />
                            <span className="font-sans text-sm sm:text-base md:text-lg text-[#f5f5f5]/30 leading-relaxed">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
