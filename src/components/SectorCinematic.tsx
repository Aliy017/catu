"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

interface SectorItem {
    id: string;
    title: string;
    subtitle: string;
    desc: string;
    gradient: string;
    imgSrc: string;
}

const SECTORS: SectorItem[] = [
    {
        id: "01",
        title: "TIBBIYOT",
        subtitle: "HEALTHCARE",
        desc: "Klinikalar va shifokorlar brendi",
        gradient: "from-emerald-900/40 via-black to-black",
        imgSrc: "/industries/medical.webp"
    },
    {
        id: "02",
        title: "CHAKANA SAVDO",
        subtitle: "RETAIL",
        desc: "Do'konlar va savdo tarmoqlari",
        gradient: "from-blue-900/40 via-black to-black",
        imgSrc: "/industries/appliance.webp"
    },
    {
        id: "03",
        title: "O'QUV MARKAZLAR",
        subtitle: "EDUCATION",
        desc: "Xususiy maktablar va kurslar",
        gradient: "from-amber-900/40 via-black to-black",
        imgSrc: "/industries/education.webp"
    },
    {
        id: "04",
        title: "QURILISH",
        subtitle: "CONSTRUCTION",
        desc: "Developerlar va qurilish kompaniyalari",
        gradient: "from-red-900/40 via-black to-black",
        imgSrc: "/industries/construction.webp"
    }
];

export default function SectorCinematic() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="w-full flex justify-center">
            <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 px-4 md:px-0">
                {SECTORS.map((sector) => (
                    <CinematicCard key={sector.id} sector={sector} />
                ))}
            </div>
        </div>
    );
}

function CinematicCard({ sector }: { sector: SectorItem }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!cardRef.current || !descRef.current) return;
        const desc = descRef.current;
        const mm = gsap.matchMedia();
        mm.add("(max-width: 767px)", () => {
            gsap.set(desc, { yPercent: 100 });
            gsap.to(desc, {
                yPercent: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
            });
        });
        return () => mm.revert();
    }, []);

    return (
        /* ── Premium Frame Wrapper ── */
        <div
            ref={cardRef}
            className="group relative rounded-2xl p-[2px] bg-gradient-to-br from-[#FF2020]/40 via-white/10 to-[#FF2020]/20
                        hover:from-[#FF2020]/70 hover:via-white/20 hover:to-[#FF2020]/40
                        transition-all duration-700 ease-out
                        shadow-[0_0_20px_rgba(255,32,32,0.08)]
                        hover:shadow-[0_0_40px_rgba(255,32,32,0.15)]"
        >
            {/* Inner card — sits inside the gradient border */}
            <div className="relative h-[280px] md:h-[480px] w-full overflow-hidden rounded-[14px] bg-[#0a0a0a] cursor-pointer">
                {/* Background gradient layer */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sector.gradient} opacity-40 group-hover:opacity-60 
                                transition-opacity duration-1000 ease-in-out`} />

                {/* Subtle texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                        backgroundSize: '16px 16px'
                    }}
                />

                {/* Zooming image */}
                <div className="absolute inset-0 scale-100 group-hover:scale-110 transition-transform duration-[2000ms] ease-out">
                    <Image
                        src={sector.imgSrc}
                        alt={sector.title}
                        fill
                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={parseInt(sector.id) <= 2}
                    />
                </div>

                {/* Content — Glass Card at Bottom */}
                <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 z-10">
                    <div className={`bg-black/80 border border-white/10 rounded-xl p-4 md:p-6
                                    translate-y-2 group-hover:translate-y-0 transition-transform duration-500
                                    flex flex-col items-center text-center`}>
                        <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-4xl font-bold uppercase text-white mb-2 tracking-tighter">
                            {sector.title}
                        </h3>
                        <p ref={descRef} className="font-[family-name:var(--font-body)] text-white/80 text-sm md:text-lg leading-snug">
                            {sector.desc}
                        </p>
                    </div>
                </div>

                {/* Corner accent glow */}
                <div className="absolute bottom-0 right-0 w-20 h-20 md:w-28 md:h-28
                                bg-gradient-to-tl from-[#FF2020]/10 to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-bl-2xl" />

                {/* Top-left corner accent */}
                <div className="absolute top-0 left-0 w-16 h-16 md:w-20 md:h-20
                                bg-gradient-to-br from-white/5 to-transparent
                                opacity-0 group-hover:opacity-60 transition-opacity duration-700 rounded-tr-2xl" />
            </div>
        </div>
    );
}
