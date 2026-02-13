"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  Step labels + their FINAL resting positions (% of the viewport).
  Distributed around the central heading so nothing overlaps it.
  Left/Right alternating for visual balance.
*/
const STEPS = [
    { text: "Audit qilish", x: "6%", y: "12%" },
    { text: "Narx kelishish", x: "72%", y: "8%" },
    { text: "Shartnoma tuzish", x: "4%", y: "34%" },
    { text: "Strategiya tuzib chiqish", x: "68%", y: "62%" },
    { text: "Proektni ishga tushurish", x: "6%", y: "68%" },
    { text: "Haftalik hisobotlar", x: "74%", y: "82%" },
    { text: "Oylik hisobotlar", x: "12%", y: "88%" },
];

export default function HowWeWork() {
    const sectionRef = useRef<HTMLElement>(null);
    const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const mm = gsap.matchMedia();

        /* ════════ DESKTOP (md+) ════════ */
        mm.add("(min-width: 768px)", () => {
            // Master timeline — pinned section, scrub-driven
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%",          // 3× viewport worth of scroll while pinned
                    pin: true,
                    scrub: 1.5,            // smooth inertia feel
                    anticipatePin: 1,
                },
            });

            // Each step drifts in from the right, staggered
            stepsRef.current.forEach((el, i) => {
                if (!el) return;
                tl.fromTo(
                    el,
                    { xPercent: 250, opacity: 0 },
                    {
                        xPercent: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power3.out",
                    },
                    i * 0.5 // stagger offset
                );
            });

            // Hold briefly at the end so all labels are visible together
            tl.to({}, { duration: 0.8 });
        });

        /* ════════ MOBILE (<md) ════════ */
        mm.add("(max-width: 767px)", () => {
            // Simple stagger fade-in on mobile (no pin, no horizontal drift)
            stepsRef.current.forEach((el) => {
                if (!el) return;
                gsap.from(el, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                    },
                });
            });
        });

        return () => mm.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative h-screen w-full bg-[#050505] overflow-hidden"
        >
            {/* ── Subtle depth gradients ── */}
            <div className="absolute inset-0 pointer-events-none z-30
                      bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-30" />

            {/* ── Central Heading — always visible, never moves ── */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-4">
                <h2
                    className="font-[family-name:var(--font-heading)] text-center
                     text-4xl sm:text-6xl md:text-7xl lg:text-[100px] xl:text-[120px]
                     leading-[0.85] font-bold uppercase text-[#f5f5f5]"
                >
                    Qanday tartibda
                    <br />
                    <span className="text-[#FF2020]">ishlaymiz</span>
                </h2>
            </div>

            {/* ── Floating Step Labels (Desktop — absolute positioned) ── */}
            {STEPS.map((step, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        stepsRef.current[i] = el;
                    }}
                    className="absolute z-10 hidden md:flex items-center gap-3 group cursor-default"
                    style={{ left: step.x, top: step.y }}
                >
                    <div
                        className="w-2 h-2 rounded-full bg-[#FF2020] shadow-[0_0_8px_#FF2020]
                        opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span
                        className="font-[family-name:var(--font-body)] text-lg lg:text-xl
                       text-[#f5f5f5]/50 tracking-[0.12em] uppercase whitespace-nowrap
                       group-hover:text-[#f5f5f5] transition-colors duration-300"
                    >
                        {step.text}
                    </span>
                </div>
            ))}

            {/* ── Mobile Fallback — simple vertical list below heading ── */}
            <div className="absolute inset-x-0 bottom-12 flex flex-col items-center gap-4 md:hidden px-6">
                {STEPS.map((step, i) => (
                    <div
                        key={`m-${i}`}
                        ref={(el) => {
                            // On mobile, reuse stepsRef for the fade-in animation
                            if (typeof window !== "undefined" && window.innerWidth < 768) {
                                stepsRef.current[i] = el;
                            }
                        }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF2020]" />
                        <span className="font-[family-name:var(--font-body)] text-sm text-[#f5f5f5]/40 tracking-widest uppercase">
                            {step.text}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
