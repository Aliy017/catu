"use client";
import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isIOS } from "./iosDetect";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */
interface ServiceItem {
    id: string;
    title: string;
    desc: string;
    accent: string;
    accentEnd: string;
    iconPath: string;
    span: string;      // Tailwind grid span class
}

const SERVICES: ServiceItem[] = [
    {
        id: "01",
        title: "Marketing",
        desc: "Samarali marketing kanallari va strategiyalar. Brendingizning bozordagi o'rnini mustahkamlash. Savdo hajmini barqaror oshirish.",
        accent: "#3B82F6",
        accentEnd: "#06B6D4",
        iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
        span: "md:col-span-2",
    },
    {
        id: "02",
        title: "SMM",
        desc: "Jalb qiluvchi kontent yaratish. Auditoriyangizni faol o'stirish. Ijtimoiy tarmoqlarda kuchli brend qurish.",
        accent: "#10B981",
        accentEnd: "#34D399",
        iconPath: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
        span: "md:col-span-1",
    },
    {
        id: "03",
        title: "Performance",
        desc: "Aniq natijalar va real xaridorlar. Maqsadli reklama orqali kiritilgan sarmoyadan maksimal foyda olish. Har bir so'mni samarali sarflash.",
        accent: "#8B5CF6",
        accentEnd: "#A78BFA",
        iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
        span: "md:col-span-1",
    },
    {
        id: "04",
        title: "Production",
        desc: "Premium foto va video kontent. Professional studiya sifatida ishlab chiqarish. Brendingizga mos o'ziga xos uslub yaratish.",
        accent: "#F43F5E",
        accentEnd: "#FB923C",
        iconPath: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
        span: "md:col-span-2",
    },
];

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function InteractiveServiceList() {
    const gridRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!gridRef.current) return;
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

        gsap.set(cards, { opacity: 0, y: 60, scale: 0.95 });

        const trigger = ScrollTrigger.create({
            trigger: gridRef.current,
            start: "top 85%",
            onEnter: () => {
                gsap.to(cards, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                });
            },
            once: true,
        });

        return () => trigger.kill();
    }, []);

    return (
        <div ref={gridRef} className="w-full max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
                {SERVICES.map((service, i) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        ref={(el) => { cardRefs.current[i] = el; }}
                    />
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   3D TILT CARD WITH ANIMATED GRADIENT BORDER
   ═══════════════════════════════════════════════════════ */
const ServiceCard = React.forwardRef<HTMLDivElement, { service: ServiceItem }>(
    function ServiceCard({ service }, ref) {
        const innerRef = useRef<HTMLDivElement>(null);
        const glowRef = useRef<HTMLDivElement>(null);

        const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            // Skip 3D tilt on iOS to avoid compositing layer explosion
            if (isIOS()) return;

            const card = innerRef.current;
            const glow = glowRef.current;
            if (!card || !glow) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;

            glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${service.accent}30, transparent 40%)`;
            glow.style.opacity = "1";
        }, [service.accent]);

        const handleMouseLeave = useCallback(() => {
            const card = innerRef.current;
            const glow = glowRef.current;
            if (!card || !glow) return;

            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
            glow.style.opacity = "0";
        }, []);

        return (
            <div ref={ref} className={`${service.span}`}>
                <div
                    ref={innerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="group relative h-[160px] md:h-[320px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-transform duration-200 ease-out"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* ── Animated Gradient Border (with iOS fallback) ── */}
                    <div
                        className="absolute inset-0 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        style={isIOS() ? {
                            background: `linear-gradient(135deg, ${service.accent}, ${service.accentEnd}, #000, ${service.accent})`,
                            animation: "borderGlowPulse 4s ease-in-out infinite",
                        } : {
                            background: `linear-gradient(var(--border-angle, 0deg), ${service.accent}, ${service.accentEnd}, #000, #000, ${service.accent})`,
                            animation: "rotateBorder 6s linear infinite",
                        }}
                    />

                    {/* ── Inner Card (creates the border gap) ── */}
                    <div className="absolute inset-[1px] rounded-[23px] bg-[#0a0a0a] overflow-hidden">

                        {/* Cursor-following glow */}
                        <div
                            ref={glowRef}
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-[1]"
                        />

                        {/* Decorative grid pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.04] z-0"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />

                        {/* Large decorative number watermark — desktop only */}
                        <div className="hidden md:block absolute top-6 right-10 z-[2]">
                            <span
                                className="font-[family-name:var(--font-heading)] text-[40px] md:text-[120px] font-black select-none leading-none transition-all duration-700"
                                style={{
                                    WebkitTextStroke: `1px ${service.accent}15`,
                                    color: "transparent",
                                    filter: "blur(0.5px)",
                                }}
                            >
                                {service.id}
                            </span>
                        </div>

                        {/* Accent line at top */}
                        <div
                            className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out z-[3]"
                            style={{ background: `linear-gradient(90deg, ${service.accent}, ${service.accentEnd}, transparent)` }}
                        />

                        {/* ── Content ── */}
                        <div className="relative z-[5] flex flex-col items-center justify-center h-full px-3 py-4 md:p-10 text-center">

                            {/* Icon — centered top */}
                            <div
                                className="flex shrink-0 h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                                style={{
                                    marginBottom: 'clamp(8px, 5%, 20px)',
                                    borderColor: `${service.accent}30`,
                                    background: `${service.accent}10`,
                                    color: service.accent,
                                }}
                            >
                                <svg
                                    className="w-5 h-5 md:w-7 md:h-7"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d={service.iconPath} />
                                </svg>
                            </div>

                            {/* Title — centered */}
                            <h3 className="font-[family-name:var(--font-heading)] text-base md:text-3xl font-bold uppercase text-white mb-1.5 md:mb-3 tracking-tight leading-tight">
                                {service.title}
                            </h3>

                            {/* Description — centered */}
                            <p className="font-sans text-white/50 text-[11px] md:text-base leading-relaxed group-hover:text-white/70 transition-colors duration-500 max-w-xs md:max-w-md">
                                {service.desc}
                            </p>
                        </div>

                        {/* Bottom glow reflection */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[2]"
                            style={{
                                background: `linear-gradient(to top, ${service.accent}10, transparent)`,
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
);
