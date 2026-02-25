"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  Step labels + their FINAL resting positions.
  posClass uses Tailwind arbitrary values for responsive left positioning.
  top is set via inline style (same on all devices).
*/
const STEPS = [
    { text: "Audit qilish", posClass: "left-[6%]", y: "18%" },
    { text: "Narx kelishish", posClass: "left-[55%] md:left-[75%]", y: "15%" },
    { text: "Shartnoma tuzish", posClass: "left-[4%]", y: "30%" },
    { text: "Strategiya tuzib chiqish", posClass: "left-[50%]", y: "26%" },
    { text: "Proektni ishga tushurish", posClass: "left-[6%]", y: "68%" },
    { text: "Haftalik hisobotlar", posClass: "left-[50%]", y: "76%" },
    { text: "Oylik hisobotlar", posClass: "left-[6%]", y: "88%" },
];

export default function HowWeWork() {
    const sectionRef = useRef<HTMLElement>(null);
    const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Master timeline — pinned section, scrub-driven
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: typeof window !== 'undefined' && window.innerWidth < 768 ? "+=100%" : "+=150%",
                    pin: true,
                    scrub: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.3 : 1.2,
                    anticipatePin: 1,
                },
            });

            // Each step drifts in from the right, staggered
            stepsRef.current.forEach((el, i) => {
                if (!el) return;
                tl.fromTo(
                    el,
                    { xPercent: 200, opacity: 0 },
                    {
                        xPercent: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                    },
                    i * 0.4 // stagger offset
                );
            });

            // Hold briefly at the end so all labels are visible together
            tl.to({}, { duration: 0.6 });
        }, sectionRef);

        return () => ctx.revert();
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
                <div className="flex flex-col items-center gap-6 md:gap-10">
                    <h2
                        className="font-[family-name:var(--font-heading)] text-center
                         text-3xl sm:text-5xl md:text-7xl lg:text-[100px] xl:text-[120px]
                         leading-[0.85] font-bold uppercase text-[#f5f5f5]"
                    >
                        Qanday tartibda
                    </h2>
                    <h2
                        className="font-[family-name:var(--font-heading)] text-center
                         text-3xl sm:text-5xl md:text-7xl lg:text-[100px] xl:text-[120px]
                         leading-[0.85] font-bold uppercase text-[#FF2020]"
                    >
                        ishlaymiz
                    </h2>
                </div>
            </div>

            {/* ── Floating Step Labels (all devices) ── */}
            {STEPS.map((step, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        stepsRef.current[i] = el;
                    }}
                    className={`absolute z-10 flex items-center gap-2 md:gap-3 group cursor-default ${step.posClass}`}
                    style={{ top: step.y }}
                >
                    <div
                        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#FF2020] shadow-[0_0_8px_#FF2020]
                        opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span
                        className="font-sans text-xs sm:text-sm md:text-lg lg:text-xl
                       text-[#f5f5f5]/50 uppercase whitespace-nowrap
                       group-hover:text-[#f5f5f5] transition-colors duration-300"
                    >
                        {step.text}
                    </span>
                </div>
            ))}
        </section>
    );
}
