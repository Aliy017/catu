"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   DATA — 8 Portfolio items
   ═══════════════════════════════════════════════════════ */
interface PortfolioItem {
    id: number;
    title: string;
    category: string;
    desc: string;
    gradient: string;
    accent: string;
    fullDesc: string;
}

const PORTFOLIO: PortfolioItem[] = [
    {
        id: 1,
        title: "Franklin Brend Strategiyasi",
        category: "SMM",
        desc: "Brendni qayta shakllantirish va savdo hajmini 3 barobar oshirish.",
        gradient: "linear-gradient(135deg, #1e3a5f 0%, #0a0a0a 40%, #1a1a2e 100%)",
        accent: "#3B82F6",
        fullDesc: "Franklin brendining ijtimoiy tarmoqlardagi imidjini tubdan yangilash, maqsadli auditoriyani aniqlash va kontent strategiyasini ishlab chiqish. Natijada brend tanilishi 2.5 barobar oshdi va savdo hajmi sezilarli ko'paydi.",
    },
    {
        id: 2,
        title: "Rivoj-98 Ijtimoiy Tarmoqlar",
        category: "Marketing",
        desc: "Instagram va Telegram orqali faol auditoriya shakllantirish.",
        gradient: "linear-gradient(135deg, #064e3b 0%, #0a0a0a 40%, #0d1b2a 100%)",
        accent: "#10B981",
        fullDesc: "Rivoj-98 kompaniyasi uchun to'liq marketing strategiyasini yaratish — raqamli reklama, brend qo'llanma va pozitsionerlash. Instagram va Telegramda faol auditoriya shakllantirish orqali mijozlar bazasini kengaytirish.",
    },
    {
        id: 3,
        title: "Beshbola Game Club Reklama",
        category: "Marketing",
        desc: "Maqsadli reklama orqali yangi mijozlar oqimini yo'lga qo'yish.",
        gradient: "linear-gradient(135deg, #312e81 0%, #0a0a0a 40%, #1e1b4b 100%)",
        accent: "#8B5CF6",
        fullDesc: "O'yin klubi uchun marketing kampaniyasini yaratib, maqsadli reklama orqali yangi mijozlar oqimini barqaror yo'lga qo'yish. Geo-targetlash va maxsus aksiyalar orqali doimiy mijozlar bazasini shakllantirish.",
    },
    {
        id: 4,
        title: "MIG Build Video Kontent",
        category: "Performance",
        desc: "Qurilish kompaniyasi uchun premium video lavhalar ishlab chiqish.",
        gradient: "linear-gradient(135deg, #4c1d2e 0%, #0a0a0a 40%, #2a1a1a 100%)",
        accent: "#F43F5E",
        fullDesc: "MIG Build qurilish kompaniyasi uchun to'liq performance marketing strategiyasini amalga oshirish. Premium video lavhalar ishlab chiqish, raqamli reklama kampaniyalarini optimallashtirish va konversiya darajasini oshirish.",
    },
    {
        id: 5,
        title: "Texno Sifat Brend Qurish",
        category: "SMM",
        desc: "Texnologiya brendini noldan yaratish va bozorga chiqarish.",
        gradient: "linear-gradient(135deg, #164e63 0%, #0a0a0a 40%, #0c1d29 100%)",
        accent: "#06B6D4",
        fullDesc: "Texnologiya brendini noldan yaratish — logotip dizaynidan to ijtimoiy tarmoqlar strategiyasigacha. SMM orqali brendni bozorga chiqarish, kontent plan yaratish va doimiy auditoriya bilan muloqot qurish.",
    },
    {
        id: 6,
        title: "Ferton.uz SMM Boshqaruvi",
        category: "SMM",
        desc: "Kundalik kontent rejasi va auditoriya bilan muloqot.",
        gradient: "linear-gradient(135deg, #065f46 0%, #0a0a0a 40%, #0f2d1f 100%)",
        accent: "#34D399",
        fullDesc: "Ferton.uz onlayn do'koni uchun to'liq SMM boshqaruvi — kundalik kontent rejasi, stories strategiya, auditoriya bilan faol muloqot va savdo konversiyasini oshirish. Mahsulotlarni kreativ tarzda taqdim etish.",
    },
    {
        id: 7,
        title: "Le Crayon Reklama Kampaniyasi",
        category: "SMM",
        desc: "Maqsadli reklama orqali onlayn savdoni yo'lga qo'yish.",
        gradient: "linear-gradient(135deg, #3b1f7e 0%, #0a0a0a 40%, #2e1065 100%)",
        accent: "#A78BFA",
        fullDesc: "Le Crayon san'at studiyasi uchun ijtimoiy tarmoqlarda reklama kampaniyasini ishlab chiqish va amalga oshirish. Kreativ kontent, influencer marketing va maqsadli reklama orqali onlayn savdoni barqaror o'sishga olib kelish.",
    },
    {
        id: 8,
        title: "Humo Med Servis Kontent",
        category: "Marketing",
        desc: "Tibbiyot markazi uchun professional foto va video ishlab chiqish.",
        gradient: "linear-gradient(135deg, #7c2d12 0%, #0a0a0a 40%, #431407 100%)",
        accent: "#FB923C",
        fullDesc: "Humo Med Servis tibbiyot markazi uchun to'liq marketing yechimi — professional foto va video kontent ishlab chiqish, brend imidjini shakllantirish va bemorlar oqimini oshirish uchun strategiya yaratish.",
    },
];

/* Bento grid spans */
const GRID_SPANS = [
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
];

/* ═══════════════════════════════════════════════════════
   EXPANDED MODAL — Premium Luxury
   ═══════════════════════════════════════════════════════ */
function ExpandedModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const revealRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        if (!modalRef.current || !contentRef.current) return;

        gsap.fromTo(modalRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: "power2.out" }
        );
        gsap.fromTo(contentRef.current,
            { scale: 0.8, opacity: 0, y: 50, rotateX: 8 },
            { scale: 1, opacity: 1, y: 0, rotateX: 0, duration: 0.6, ease: "back.out(1.2)", delay: 0.15 }
        );

        const reveals = revealRefs.current.filter(Boolean) as HTMLElement[];
        gsap.fromTo(reveals,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.35 }
        );

        document.body.style.overflow = "hidden";
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") animateClose(); };
        window.addEventListener("keydown", handleKey);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const animateClose = useCallback(() => {
        if (modalRef.current && contentRef.current) {
            gsap.to(contentRef.current, { scale: 0.92, opacity: 0, y: 30, duration: 0.3, ease: "power3.in" });
            gsap.to(modalRef.current, { opacity: 0, duration: 0.35, ease: "power2.in", delay: 0.1, onComplete: onClose });
        } else {
            onClose();
        }
    }, [onClose]);

    const setReveal = (i: number) => (el: HTMLElement | null) => { revealRefs.current[i] = el; };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 select-none"
            onClick={animateClose}
            style={{ opacity: 0, perspective: "1200px" }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

            {/* Animated gradient border */}
            <div
                ref={contentRef}
                className="relative w-full max-w-[92vw] md:max-w-3xl min-h-[45vh] md:min-h-[450px] max-h-[90vh] rounded-[32px] md:rounded-[40px] p-[1.5px] flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                style={{
                    opacity: 0,
                    background: `linear-gradient(135deg, ${item.accent}80, transparent 40%, ${item.accent}40, transparent 70%, ${item.accent}60)`,
                }}
            >
                {/* Inner card */}
                <div className="relative flex-1 flex flex-col rounded-[inherit] overflow-hidden min-h-0 bg-[#060608]">
                    {/* BG layers */}
                    <div className="absolute inset-0 z-0" style={{ background: item.gradient, opacity: 0.6 }} />
                    <div
                        className="absolute inset-0 z-[1] opacity-[0.05]"
                        style={{
                            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                        }}
                    />



                    {/* Glow orbs */}
                    <div
                        className="absolute top-0 right-0 w-[300px] h-[300px] z-[2] rounded-full pointer-events-none"
                        style={{ background: `radial-gradient(ellipse, ${item.accent}20, transparent 70%)`, filter: "blur(40px)", transform: "translate(30%, -30%)" }}
                    />
                    <div
                        className="absolute bottom-0 left-0 w-[200px] h-[200px] z-[2] rounded-full pointer-events-none"
                        style={{ background: `radial-gradient(ellipse, ${item.accent}15, transparent 70%)`, filter: "blur(30px)", transform: "translate(-20%, 20%)" }}
                    />

                    {/* ── Scrollable Content ── */}
                    <div className="relative z-[5] flex-1 px-6 py-12 md:px-16 md:py-16 flex flex-col justify-center overflow-y-auto">

                        {/* Title — centered, smaller, normal font */}
                        <h2 ref={setReveal(0)} className="font-[family-name:var(--font-rounded)] text-[22px] md:text-3xl font-bold text-white leading-tight text-center mb-4 md:mb-6 mt-auto">
                            {item.title}
                        </h2>

                        {/* Accent line — full width under title, thin */}
                        <div ref={setReveal(1)}
                            className="h-[1px] w-full max-w-[200px] mx-auto mb-6 md:mb-10 rounded-full"
                            style={{
                                background: `linear-gradient(90deg, transparent, ${item.accent}80, transparent)`,
                            }}
                        />

                        {/* Full description — centered */}
                        <p ref={setReveal(2)} className="font-[family-name:var(--font-rounded)] text-white/80 text-[15px] md:text-lg leading-[1.8] md:leading-[2.0] text-center mb-auto font-medium">
                            {item.fullDesc}
                        </p>

                        {/* Category badge — bottom center */}
                        <div ref={setReveal(3)} className="mt-8 md:mt-12 text-center">
                            <span
                                className="inline-block px-5 py-2.5 md:px-6 md:py-3 text-[11px] md:text-xs uppercase tracking-widest font-bold rounded-2xl border"
                                style={{
                                    borderColor: `${item.accent}40`,
                                    background: `${item.accent}12`,
                                    color: item.accent,
                                    boxShadow: `0 0 20px ${item.accent}20`
                                }}
                            >
                                {item.category}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function SpotlightResults() {
    const gridRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [expandedItem, setExpandedItem] = useState<PortfolioItem | null>(null);

    useEffect(() => {
        if (!gridRef.current) return;
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
        gsap.set(cards, { y: 60, opacity: 0, scale: 0.95 });

        let trigger: ScrollTrigger;
        const timer = setTimeout(() => {
            trigger = ScrollTrigger.create({
                trigger: gridRef.current,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(cards, {
                        y: 0, opacity: 1, scale: 1,
                        duration: 0.8, stagger: 0.1, ease: "power3.out",
                    });
                },
            });
        }, 500);

        return () => { clearTimeout(timer); trigger?.kill(); };
    }, []);

    return (
        <>
            <div ref={gridRef} className="w-full max-w-[1400px] mx-auto select-none">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 auto-rows-[140px] md:auto-rows-[200px]">
                    {PORTFOLIO.map((item, i) => (
                        <PortfolioCard
                            key={item.id}
                            item={item}
                            index={i}
                            ref={(el) => { cardRefs.current[i] = el; }}
                            onExpand={() => setExpandedItem(item)}
                        />
                    ))}
                </div>
            </div>

            {expandedItem && (
                <ExpandedModal
                    item={expandedItem}
                    onClose={() => setExpandedItem(null)}
                />
            )}
        </>
    );
}

/* ═══════════════════════════════════════════════════════
   PORTFOLIO CARD — long-press to expand, tap to toggle desc
   ═══════════════════════════════════════════════════════ */
const LONG_PRESS_MS = 500;

const PortfolioCard = React.forwardRef<HTMLDivElement, {
    item: PortfolioItem;
    index: number;
    onExpand: () => void;
}>(
    function PortfolioCard({ item, index, onExpand }, ref) {
        const [isOpen, setIsOpen] = useState(false);
        const innerRef = useRef<HTMLDivElement>(null);
        const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
        const didLongPress = useRef(false);
        const touchMoved = useRef(false);

        const startPress = useCallback((e: React.TouchEvent | React.MouseEvent) => {
            // Prevent text selection on long press
            if ("touches" in e) touchMoved.current = false;
            didLongPress.current = false;
            pressTimer.current = setTimeout(() => {
                didLongPress.current = true;
                if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                    navigator.vibrate(30);
                }
                onExpand();
            }, LONG_PRESS_MS);
        }, [onExpand]);

        const cancelPress = useCallback(() => {
            if (pressTimer.current) {
                clearTimeout(pressTimer.current);
                pressTimer.current = null;
            }
        }, []);

        const handleTouchMove = useCallback(() => {
            touchMoved.current = true;
            cancelPress();
        }, [cancelPress]);

        const handleClick = useCallback(() => {
            if (didLongPress.current || touchMoved.current) {
                didLongPress.current = false;
                touchMoved.current = false;
                return;
            }
            setIsOpen((prev) => !prev);
        }, []);

        useEffect(() => {
            return () => { if (pressTimer.current) clearTimeout(pressTimer.current); };
        }, []);

        const handleMouseMove = useCallback((e: React.MouseEvent) => {
            if (!innerRef.current) return;
            const rect = innerRef.current.getBoundingClientRect();
            innerRef.current.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
            innerRef.current.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
        }, []);

        return (
            <div ref={ref} className={`${GRID_SPANS[index]} relative`}>
                <div
                    ref={innerRef}
                    onClick={handleClick}
                    onMouseDown={startPress}
                    onMouseUp={cancelPress}
                    onMouseLeave={cancelPress}
                    onTouchStart={startPress}
                    onTouchEnd={cancelPress}
                    onTouchCancel={cancelPress}
                    onTouchMove={handleTouchMove}
                    onMouseMove={handleMouseMove}
                    onContextMenu={(e) => e.preventDefault()}
                    className="group relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/15 transition-all duration-500 select-none"
                >
                    {/* BG gradient */}
                    <div
                        className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110"
                        style={{ background: item.gradient }}
                    />
                    {/* Texture */}
                    <div
                        className="absolute inset-0 z-[1] opacity-[0.06]"
                        style={{
                            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    />
                    {/* Mouse glow */}
                    <div
                        className="absolute inset-0 z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: `radial-gradient(300px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${item.accent}20, transparent 60%)` }}
                    />
                    {/* Dark gradient */}
                    <div className="absolute inset-0 z-[3] bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Category tag — bottom-left */}
                    <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 z-[4]">
                        <span
                            className="inline-block px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] uppercase tracking-widest font-bold rounded-md border backdrop-blur-sm"
                            style={{
                                borderColor: `${item.accent}40`,
                                background: `${item.accent}15`,
                                color: item.accent,
                            }}
                        >
                            {item.category}
                        </span>
                    </div>

                    {/* Accent line on hover */}
                    <div
                        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out z-[6]"
                        style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }}
                    />

                    {/* Title + expandable description — centered */}
                    <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center px-3 md:px-5 text-center">
                        <h3 className="font-[family-name:var(--font-rounded)] text-[13px] md:text-xl font-bold text-white leading-tight select-none">
                            {item.title}
                        </h3>
                        <div
                            className="h-[1px] w-full mt-1.5 md:mt-2 rounded-full"
                            style={{ background: `linear-gradient(90deg, transparent, ${item.accent}60, transparent)` }}
                        />

                        <div
                            className="overflow-hidden transition-all duration-500 ease-out"
                            style={{ maxHeight: isOpen ? "120px" : "0px", opacity: isOpen ? 1 : 0 }}
                        >

                            <p className="font-[family-name:var(--font-rounded)] text-white/80 font-medium text-[10px] md:text-sm leading-relaxed mt-2">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
