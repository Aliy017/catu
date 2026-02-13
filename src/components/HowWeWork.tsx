"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
    "Audit qilish",
    "Narx kelishish",
    "Shartnoma tuzish",
    "Strategiya tuzib chiqish",
    "Proektni ishga tushurish",
    "Haftalik hisobotlar",
    "Oylik hisobotlar",
];

/* Desktop floating label positions (md+ only) */
const DESKTOP_POS = [
    { posClass: "left-[6%]", y: "10%" },
    { posClass: "left-[60%]", y: "8%" },
    { posClass: "left-[4%]", y: "32%" },
    { posClass: "left-[55%]", y: "70%" },
    { posClass: "left-[6%]", y: "66%" },
    { posClass: "left-[72%]", y: "80%" },
    { posClass: "left-[10%]", y: "88%" },
];

export default function HowWeWork() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const desktopRef = useRef<HTMLDivElement>(null);
    const desktopStepsRef = useRef<(HTMLDivElement | null)[]>([]);
    const mobileStepsRef = useRef<(HTMLDivElement | null)[]>([]);
    const mobileLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;

        const mm = gsap.matchMedia();

        /* ════════════════════════════════════════
           DESKTOP (md+) — Pinned + Floating Labels
           ════════════════════════════════════════ */
        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: desktopRef.current,
                    start: "top top",
                    end: "+=150%",
                    pin: true,
                    scrub: 1.2,
                    anticipatePin: 1,
                },
            });

            desktopStepsRef.current.forEach((el, i) => {
                if (!el) return;
                tl.fromTo(
                    el,
                    { xPercent: 200, opacity: 0 },
                    { xPercent: 0, opacity: 1, duration: 1, ease: "power3.out" },
                    i * 0.4
                );
            });

            tl.to({}, { duration: 0.6 });
        });

        /* ════════════════════════════════════════
           MOBILE (<md) — Timeline Reveal
           ════════════════════════════════════════ */
        mm.add("(max-width: 767px)", () => {
            // Animate the connecting line growing downward
            if (mobileLineRef.current) {
                gsap.fromTo(
                    mobileLineRef.current,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: mobileLineRef.current,
                            start: "top 80%",
                            end: "bottom 30%",
                            scrub: 0.8,
                        },
                    }
                );
            }

            // Each step slides up + fades in
            mobileStepsRef.current.forEach((el) => {
                if (!el) return;
                gsap.fromTo(
                    el,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 88%",
                        },
                    }
                );
            });
        });

        return () => mm.revert();
    }, []);

    return (
        <div ref={wrapperRef}>
            {/* ═══════════════════════════════════════════
          DESKTOP VERSION — Pinned Floating Labels
          ═══════════════════════════════════════════ */}
            <section
                ref={desktopRef}
                className="relative h-screen w-full bg-[#050505] overflow-hidden hidden md:block"
            >
                {/* Depth gradient */}
                <div className="absolute inset-0 pointer-events-none z-30
                        bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-30" />

                {/* Central Heading */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-4">
                    <h2
                        className="font-[family-name:var(--font-heading)] text-center
                       text-7xl lg:text-[100px] xl:text-[120px]
                       leading-[0.85] font-bold uppercase text-[#f5f5f5]"
                    >
                        Qanday tartibda
                        <br />
                        <span className="block mt-8 text-[#FF2020]">ishlaymiz</span>
                    </h2>
                </div>

                {/* Floating Step Labels */}
                {STEPS.map((text, i) => (
                    <div
                        key={i}
                        ref={(el) => { desktopStepsRef.current[i] = el; }}
                        className={`absolute z-10 flex items-center gap-3 group cursor-default ${DESKTOP_POS[i].posClass}`}
                        style={{ top: DESKTOP_POS[i].y }}
                    >
                        <div className="w-2 h-2 rounded-full bg-[#FF2020] shadow-[0_0_8px_#FF2020]
                            opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="font-[family-name:var(--font-body)] text-lg lg:text-xl
                             text-[#f5f5f5]/50 tracking-[0.12em] uppercase whitespace-nowrap
                             group-hover:text-[#f5f5f5] transition-colors duration-300">
                            {text}
                        </span>
                    </div>
                ))}
            </section>

            {/* ═══════════════════════════════════════════
          MOBILE VERSION — Premium Numbered Timeline
          ═══════════════════════════════════════════ */}
            <section className="relative w-full bg-[#050505] py-24 px-6 md:hidden overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[300px] h-[300px] rounded-full bg-[#FF2020]/[0.03] blur-[100px] pointer-events-none" />

                {/* Heading */}
                <h2
                    className="font-[family-name:var(--font-heading)] text-center
                     text-[32px] sm:text-[42px]
                     leading-[0.9] font-bold uppercase text-[#f5f5f5] mb-16"
                >
                    Qanday tartibda
                    <br />
                    <span className="block mt-4 text-[#FF2020]">ishlaymiz</span>
                </h2>

                {/* Timeline Container */}
                <div className="relative max-w-[320px] mx-auto">
                    {/* Vertical connecting line (animated) */}
                    <div
                        ref={mobileLineRef}
                        className="absolute left-[19px] top-0 bottom-0 w-[1px] origin-top"
                        style={{
                            background: "linear-gradient(to bottom, #FF2020 0%, rgba(255,32,32,0.2) 70%, transparent 100%)",
                        }}
                    />

                    {/* Steps */}
                    <div className="flex flex-col gap-12">
                        {STEPS.map((text, i) => (
                            <div
                                key={`m-${i}`}
                                ref={(el) => { mobileStepsRef.current[i] = el; }}
                                className="flex items-start gap-5 group"
                            >
                                {/* Number circle */}
                                <div
                                    className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full
                             border border-[#FF2020]/40 bg-[#050505]
                             flex items-center justify-center
                             group-hover:border-[#FF2020] group-hover:shadow-[0_0_20px_rgba(255,32,32,0.25)]
                             transition-all duration-500"
                                >
                                    <span className="font-[family-name:var(--font-heading)] text-xs font-bold text-[#FF2020]/80
                                   group-hover:text-[#FF2020] transition-colors duration-500">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* Step content */}
                                <div className="pt-2">
                                    <span
                                        className="font-[family-name:var(--font-body)] text-[15px] leading-relaxed
                               text-[#f5f5f5]/60 tracking-[0.06em] uppercase
                               group-hover:text-[#f5f5f5] transition-colors duration-300"
                                    >
                                        {text}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
            </section>
        </div>
    );
}
