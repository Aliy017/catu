"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

    // Phase 1 refs
    const titleWorkRef = useRef<HTMLHeadingElement>(null);
    const listWorkRef = useRef<HTMLDivElement>(null);

    // Phase 2 refs
    const titleDontRef = useRef<HTMLHeadingElement>(null);
    const listDontRef = useRef<HTMLDivElement>(null);

    // Shared refs

    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {

            // Set initial states immediately (before any scroll)
            gsap.set(titleWorkRef.current, { y: "100vh", opacity: 0, scale: 0.7 });

            gsap.set(glowRef.current, { opacity: 0, scale: 0.3 });
            gsap.set(titleDontRef.current, { y: 60, opacity: 0, scale: 0.9 });

            if (listWorkRef.current) {
                gsap.set(listWorkRef.current.children, { y: 50, opacity: 0 });
            }
            if (listDontRef.current) {
                gsap.set(listDontRef.current.children, { y: 50, opacity: 0 });
                gsap.set(listDontRef.current, { visibility: "hidden" });
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: typeof window !== 'undefined' && window.innerWidth < 768 ? "+=200%" : "+=350%",
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                },
            });

            /* ═══════════════════════════════════════════
               PHASE 1: Title rises from bottom of viewport
               ═══════════════════════════════════════════ */
            // Title slides UP from bottom of screen → center
            tl.to(
                titleWorkRef.current,
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "power3.out",
                },
                0
            );

            // Red glow fades in behind
            tl.to(
                glowRef.current,
                { opacity: 0.2, scale: 1, duration: 2, ease: "power2.out" },
                0.5
            );



            /* ═══════════════════════════════════════════
               PHASE 2: List items stagger in one by one
               ═══════════════════════════════════════════ */
            if (listWorkRef.current) {
                tl.to(
                    listWorkRef.current.children,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.2,
                        ease: "power3.out",
                    },
                    2.5
                );
            }

            /* ═══════════════════════════════════════════
               PAUSE — hold for reading
               ═══════════════════════════════════════════ */
            tl.to({}, { duration: 2 }, 4.5);

            /* ═══════════════════════════════════════════
               PHASE 3: Cross-fade to "ishlamaymiz"
               ═══════════════════════════════════════════ */
            // Fade out + slide up ishlaymiz title
            tl.to(
                titleWorkRef.current,
                { y: -80, opacity: 0, duration: 1.2, ease: "power2.in" },
                6.5
            );
            // Fade out list items (fast stagger)
            if (listWorkRef.current) {
                tl.to(
                    listWorkRef.current.children,
                    { y: -30, opacity: 0, stagger: 0.06, duration: 0.4, ease: "power2.in" },
                    6.5
                );
            }

            // Glow dims and shifts color feel
            tl.to(
                glowRef.current,
                { opacity: 0.06, duration: 1 },
                7
            );



            // Show ishlamaymiz list container
            tl.set(listDontRef.current, { visibility: "visible" }, 7.5);

            // Fade in ishlamaymiz title from below
            tl.to(
                titleDontRef.current,
                { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
                7.5
            );

            // Stagger in ishlamaymiz list items
            if (listDontRef.current) {
                tl.to(
                    listDontRef.current.children,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.2,
                        ease: "power3.out",
                    },
                    8.2
                );
            }

            /* ═══════════════════════════════════════════
               PAUSE — hold for reading
               ═══════════════════════════════════════════ */
            tl.to({}, { duration: 2 }, 10);

            /* ═══════════════════════════════════════════
               PHASE 4: Everything fades out
               ═══════════════════════════════════════════ */
            tl.to(
                titleDontRef.current,
                { y: -60, opacity: 0, duration: 1, ease: "power2.in" },
                12
            );
            if (listDontRef.current) {
                tl.to(
                    listDontRef.current.children,
                    { opacity: 0, y: -20, stagger: 0.04, duration: 0.4, ease: "power2.in" },
                    12
                );
            }
            tl.to(
                glowRef.current,
                { opacity: 0, duration: 1 },
                12.2
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative h-screen w-full bg-[#050505] overflow-hidden"
        >
            {/* ── Ambient glow ── */}
            <div
                ref={glowRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                           w-[500px] h-[500px] md:w-[700px] md:h-[700px]
                           rounded-full blur-[150px] opacity-0
                           bg-[#FF2020] pointer-events-none z-0"
            />

            {/* ── Depth vignette ── */}
            <div className="absolute inset-0 pointer-events-none z-30
                           bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-50" />

            {/* ── Content ── */}
            <div
                ref={contentRef}
                className="relative h-full flex flex-col items-center justify-center z-20 px-6"
            >
                {/* ═══ "ISHLAYMIZ" TITLE ═══ */}
                <h2
                    ref={titleWorkRef}
                    className="absolute font-[family-name:var(--font-heading)]
                               text-[22px] sm:text-5xl md:text-7xl lg:text-[90px]
                               font-bold uppercase text-[#f5f5f5] text-center leading-[0.9] whitespace-nowrap
                               will-change-transform
                               top-[28%] sm:top-[25%] md:top-[22%]"
                >
                    Biz kimlar bilan{" "}
                    <span className="text-[#FF2020] drop-shadow-[0_0_30px_rgba(255,32,32,0.4)]">
                        ishlaymiz
                    </span>
                </h2>

                {/* ═══ "ISHLAMAYMIZ" TITLE (absolute, same visual position) ═══ */}
                <h2
                    ref={titleDontRef}
                    className="absolute font-[family-name:var(--font-heading)]
                               text-[22px] sm:text-5xl md:text-7xl lg:text-[90px]
                               font-bold uppercase text-[#f5f5f5] text-center leading-[0.9] whitespace-nowrap
                               will-change-transform
                               top-[28%] sm:top-[25%] md:top-[22%]"
                >
                    Biz kimlar bilan{" "}
                    <span className="text-[#f5f5f5]/30">ishlamaymiz</span>
                </h2>


                {/* ═══ "ISHLAYMIZ" LIST ═══ */}
                <div
                    ref={listWorkRef}
                    className="absolute flex flex-col items-center gap-5 md:gap-7 max-w-lg
                               top-[45%] sm:top-[42%] md:top-[40%]"
                >
                    {WORK_WITH.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 md:gap-4"
                        >
                            <span className="w-[6px] h-[6px] md:w-2 md:h-2 rounded-full bg-[#FF2020]
                                           shadow-[0_0_12px_rgba(255,32,32,0.6)] flex-shrink-0" />
                            <span className="font-sans
                                           text-sm sm:text-base md:text-lg
                                           text-[#f5f5f5]/70 leading-relaxed">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ═══ "ISHLAMAYMIZ" LIST ═══ */}
                <div
                    ref={listDontRef}
                    className="invisible absolute flex flex-col items-center gap-5 md:gap-7 max-w-lg
                               top-[45%] sm:top-[42%] md:top-[40%]"
                >
                    {DONT_WORK_WITH.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 md:gap-4"
                        >
                            <span className="w-[6px] h-[6px] md:w-2 md:h-2 rounded-full bg-[#f5f5f5]/15 flex-shrink-0" />
                            <span className="font-sans
                                           text-sm sm:text-base md:text-lg
                                           text-[#f5f5f5]/30 leading-relaxed">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
