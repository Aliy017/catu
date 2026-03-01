"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

/* ═══════════════════════════════════════════════════════
   CONTACT MODAL — Premium "Ariza qoldiring" form
   Theme: #050505 bg, #FF2020 accent, Quicksand rounded font
   ═══════════════════════════════════════════════════════ */

const GOALS = [
    "Barqaror murojaatlar oqimi kerak",
    "Savdoni oshirmoqchiman",
    "Marketingni tizimli yo'lga qo'yish kerak",
    "SMM natija bermayapti — tahlil kerak",
    "Biznesni kengaytirish / masshtablash",
    "Audit va strategiya kerak",
];

const REVENUES = [
    "200 milliondan kam",
    "200–300 million",
    "300 million+",
];

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/* ── Chevron icon ── */
function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            className={`w-[18px] h-[18px] flex-shrink-0 text-white/35 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

/* ── Custom Select Dropdown ── */
function CustomSelect({
    value,
    placeholder,
    options,
    isOpen,
    onToggle,
    onSelect,
    dropUp,
}: {
    value: string;
    placeholder: string;
    options: string[];
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (v: string) => void;
    dropUp?: boolean;
}) {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className={`w-full flex items-center justify-between
                    border rounded-[14px] md:rounded-[16px]
                    font-[family-name:var(--font-rounded)] text-[14px] md:text-[15px] font-medium
                    transition-all duration-300 text-left
                    ${value ? "text-white" : "text-white/30"}
                    ${isOpen
                        ? "border-[#FF2020]/40 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,32,32,0.15)]"
                        : "border-white/[0.10] hover:border-white/[0.20]"
                    }`}
                style={{ padding: "14px 20px" }}
            >
                <span className="truncate pr-3">{value || placeholder}</span>
                <ChevronIcon open={isOpen} />
            </button>

            {/* Dropdown panel */}
            <div
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className={`absolute left-0 right-0 z-[60]
                    bg-[#131318] border border-white/[0.12]
                    rounded-[14px] md:rounded-[16px]
                    shadow-[0_16px_48px_rgba(0,0,0,0.75)]
                    transition-all duration-200 ${dropUp ? 'origin-bottom' : 'origin-top'}
                    ${isOpen
                        ? "opacity-100 scale-y-100 pointer-events-auto"
                        : "opacity-0 scale-y-[0.92] pointer-events-none"
                    } premium-scrollbar`}
                style={{
                    ...(dropUp ? { bottom: 'calc(100% + 8px)' } : { top: 'calc(100% + 8px)' }),
                    maxHeight: '200px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    overscrollBehavior: 'contain',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <div style={{ padding: "6px" }}>
                    {options.map((opt, i) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onSelect(opt); }}
                            className={`w-full text-left
                                font-[family-name:var(--font-rounded)] text-[14px] md:text-[15px] font-medium
                                transition-colors duration-150 flex items-center gap-3
                                rounded-[10px] md:rounded-[12px]
                                ${isOpen ? 'dropdown-item-in' : ''}
                                ${value === opt
                                    ? "text-[#FF2020] bg-[#FF2020]/[0.08]"
                                    : "text-white/65 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.10]"
                                }`}
                            style={{ padding: "14px 18px", animationDelay: isOpen ? `${i * 70}ms` : '0ms' }}
                        >
                            {value === opt && (
                                <svg className="w-4 h-4 flex-shrink-0 text-[#FF2020]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            )}
                            <span>{opt}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   MAIN MODAL
   ═══════════════════════════════════════════════════════ */
export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const backdropRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [goal, setGoal] = useState("");
    const [revenue, setRevenue] = useState("");
    const [goalOpen, setGoalOpen] = useState(false);
    const [revenueOpen, setRevenueOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string; goal?: string }>({});

    /* ── Open animation ── */
    useEffect(() => {
        if (!isOpen) return;
        setGoalOpen(false);
        setRevenueOpen(false);

        if (backdropRef.current) {
            gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
        }
        if (panelRef.current) {
            gsap.fromTo(panelRef.current,
                { opacity: 0, y: 50, scale: 0.94 },
                { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.3)", delay: 0.1 }
            );
        }
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.overflow = "";
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);

    /* ── Close animation ── */
    const animateClose = useCallback(() => {
        setGoalOpen(false);
        setRevenueOpen(false);
        if (panelRef.current) {
            gsap.to(panelRef.current, { opacity: 0, y: 30, scale: 0.96, duration: 0.22, ease: "power3.in" });
        }
        if (backdropRef.current) {
            gsap.to(backdropRef.current, { opacity: 0, duration: 0.28, ease: "power2.in", delay: 0.06, onComplete: onClose });
        }
    }, [onClose]);

    /* ── ESC key ── */
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") animateClose(); };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, animateClose]);

    const closeDropdowns = useCallback(() => { setGoalOpen(false); setRevenueOpen(false); }, []);

    if (!isOpen) return null;

    /* Phone formatting: XX XXX XX XX */
    const handlePhoneChange = (val: string) => {
        const raw = val.replace(/\D/g, "");
        const d = (raw.startsWith("998") ? raw.slice(3) : raw).slice(0, 9);
        let f = "";
        if (d.length > 0) f += d.slice(0, 2);
        if (d.length > 2) f += " " + d.slice(2, 5);
        if (d.length > 5) f += " " + d.slice(5, 7);
        if (d.length > 7) f += " " + d.slice(7, 9);
        setPhone(f);
        if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: undefined }));
        if (submitError) setSubmitError("");
    };

    const handleNameChange = (val: string) => {
        setName(val);
        if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined }));
        if (submitError) setSubmitError("");
    };

    const handleGoalSelect = (val: string) => {
        setGoal(val);
        setGoalOpen(false);
        if (fieldErrors.goal) setFieldErrors(prev => ({ ...prev, goal: undefined }));
        if (submitError) setSubmitError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        // ── Client-side validation ──
        const errors: { name?: string; phone?: string; goal?: string } = {};
        if (!name.trim()) errors.name = "Ismingizni kiriting";
        const phoneDigits = phone.replace(/\s/g, "");
        if (!phoneDigits || phoneDigits.length < 9) errors.phone = "To'liq telefon raqam kiriting (9 raqam)";
        if (!goal) errors.goal = "Maqsadni tanlang";
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});
        setSubmitting(true);
        setSubmitError("");

        // UTM parametrlarni URL dan olish
        const urlParams = new URLSearchParams(window.location.search);

        try {
            // API endpoint: dev rejimda localhost:3001, production da mysayt.uz ga
            const apiUrl = process.env.NODE_ENV === "development"
                ? "http://localhost:3001/api/leads"
                : "https://mysayt.uz/api/leads";

            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    phone: phone.replace(/\s/g, ""),
                    goal,
                    revenue,
                    domain: "pimedia.uz",
                    source: urlParams.get("utm_source") || "organic",
                    utmSource: urlParams.get("utm_source") || null,
                    utmMedium: urlParams.get("utm_medium") || null,
                    utmCampaign: urlParams.get("utm_campaign") || null,
                }),
            });

            if (res.ok) {
                const data = await res.json();

                // ── Analytics conversion tracking ──
                if (data.analytics) {
                    // Meta Pixel — Lead event
                    if (data.analytics.metaPixelId && typeof window !== "undefined") {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const w = window as any;
                            if (typeof w.fbq === "function") {
                                w.fbq("track", "Lead", { content_name: goal || "Ariza", currency: "UZS" });
                            }
                        } catch { /* Meta Pixel xato */ }
                    }

                    // Yandex Metrica — reachGoal
                    if (data.analytics.yandexMetricaId && typeof window !== "undefined") {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const w = window as any;
                            const ymId = Number(data.analytics.yandexMetricaId);
                            if (typeof w.ym === "function") {
                                w.ym(ymId, "reachGoal", "lead_submit", { goal: goal || "", revenue: revenue || "" });
                            }
                        } catch { /* Yandex Metrica xato */ }
                    }

                    // Google Ads — Conversion
                    if (data.analytics.googleAdsTag && typeof window !== "undefined") {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const w = window as any;
                            if (typeof w.gtag === "function") {
                                w.gtag("event", "conversion", {
                                    send_to: data.analytics.googleAdsTag,
                                    event_category: "lead",
                                    event_label: goal || "Ariza",
                                });
                            }
                        } catch { /* Google Ads xato */ }
                    }
                }

                setSubmitted(true);
                // 3 soniyadan keyin modal yopiladi
                setTimeout(() => {
                    setSubmitted(false);
                    setName("");
                    setPhone("");
                    setGoal("");
                    setRevenue("");
                    animateClose();
                }, 3000);
            } else {
                setSubmitError("Xato yuz berdi. Qaytadan urinib ko'ring.");
            }
        } catch {
            setSubmitError("Tarmoq xatosi. Internet aloqangizni tekshiring.");
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Shared input style (inline padding) ── */
    const inputStyle = { padding: "14px 20px" };
    const inputCls = `w-full border border-white/[0.10]
        hover:border-white/[0.20] focus:border-[#FF2020]/40
        rounded-[14px] md:rounded-[16px]
        font-[family-name:var(--font-rounded)] text-[14px] md:text-[15px] font-medium text-white
        placeholder:text-white/25 outline-none transition-all duration-300`;

    return (
        <div
            ref={backdropRef}
            className="fixed inset-0 z-[9999]"
            style={{ opacity: 0 }}
            onClick={() => { closeDropdowns(); animateClose(); }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

            {/* Centering + scroll wrapper */}
            <div
                className="relative z-10 w-full h-full overflow-y-auto overscroll-contain
                            flex items-center justify-center px-5 py-8 md:px-8 md:py-12"
                onClick={(e) => { if (e.target === e.currentTarget) { closeDropdowns(); animateClose(); } }}
            >
                {/* ── Card ── */}
                <div
                    ref={panelRef}
                    onClick={(e) => { e.stopPropagation(); closeDropdowns(); }}
                    className="relative w-full max-w-[600px] my-auto"
                    style={{ opacity: 0 }}
                >
                    {/* Gradient border */}
                    <div
                        className="rounded-[24px] md:rounded-[28px] p-[1.5px]"
                        style={{
                            background: "linear-gradient(150deg, rgba(255,32,32,0.5), rgba(255,32,32,0.06) 30%, rgba(255,32,32,0.12) 50%, rgba(255,32,32,0.06) 70%, rgba(255,32,32,0.4))",
                        }}
                    >
                        <div className="relative rounded-[22.5px] md:rounded-[26.5px] bg-[#0b0b0e]" style={{ overflowX: 'clip' }}>

                            {/* Dot texture */}
                            <div className="absolute inset-0 opacity-[0.025] rounded-[inherit]"
                                style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                            />

                            {/* Top glow */}
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[320px] h-[160px] rounded-full pointer-events-none"
                                style={{ background: "radial-gradient(ellipse, rgba(255,32,32,0.08), transparent 70%)", filter: "blur(40px)" }}
                            />

                            {/* ── Close button row ── */}
                            <div className="relative z-20 flex justify-end px-5 pt-3 md:px-7 md:pt-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); animateClose(); }}
                                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full
                                               bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.16]
                                               border border-white/[0.10] hover:border-white/[0.22]
                                               text-white/40 hover:text-white
                                               transition-all duration-300"
                                    aria-label="Yopish"
                                >
                                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* ── Main content ── */}
                            <div className="relative z-[2] px-5 pb-5 pt-0 md:px-14 md:pb-10 md:pt-0">

                                {/* ── Title ── */}
                                <h2 className="font-[family-name:var(--font-rounded)] text-[26px] md:text-[32px] font-bold text-white leading-[1.15] text-center" style={{ marginBottom: "12px" }}>
                                    Ariza qoldiring
                                </h2>

                                {/* ── Subtitle ── */}
                                <p className="font-[family-name:var(--font-rounded)] text-white/35 text-[13px] md:text-[15px] leading-[1.55] font-medium text-center" style={{ marginBottom: "28px" }}>
                                    Biznesingizni rivojlantirishni baholash uchun hisob-kitob va faylni oling
                                </p>

                                {/* ── Form ── */}
                                <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="flex flex-col"
                                    style={{ maxWidth: "340px", margin: "0 auto" }}>

                                    {/* ── Inputs group ── */}
                                    <div className="flex flex-col gap-4 md:gap-5">

                                        {/* Name */}
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                            placeholder="Ismingiz"
                                            className={`${inputCls} ${fieldErrors.name ? 'border-[#FF2020]/50' : ''}`}
                                            style={inputStyle}
                                        />
                                        {fieldErrors.name && <p className="text-[#FF2020] text-[12px] font-medium" style={{ marginTop: '6px', paddingLeft: '4px' }}>{fieldErrors.name}</p>}

                                        {/* Phone */}
                                        <div className={`flex items-center border
                                            ${fieldErrors.phone ? 'border-[#FF2020]/50' : 'border-white/[0.10]'}
                                            hover:border-white/[0.20] focus-within:border-[#FF2020]/40
                                            rounded-[14px] md:rounded-[16px] overflow-hidden transition-all duration-300`}>
                                            <span style={{ paddingLeft: "20px", paddingRight: "6px" }}
                                                className="font-[family-name:var(--font-rounded)] text-[14px] md:text-[15px] font-semibold text-white/35 select-none flex-shrink-0">
                                                +998
                                            </span>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                placeholder="00 000 00 00"
                                                style={{ padding: "14px 20px 14px 6px" }}
                                                className="flex-1 bg-transparent
                                                           font-[family-name:var(--font-rounded)] text-[14px] md:text-[15px] font-medium text-white
                                                           placeholder:text-white/25 outline-none"
                                            />
                                        </div>
                                        {fieldErrors.phone && <p className="text-[#FF2020] text-[12px] font-medium" style={{ marginTop: '6px', paddingLeft: '4px' }}>{fieldErrors.phone}</p>}

                                        {/* Goal dropdown */}
                                        <CustomSelect
                                            value={goal}
                                            placeholder="Maqsadni tanlang"
                                            options={GOALS}
                                            isOpen={goalOpen}
                                            onToggle={() => { setGoalOpen((p) => !p); setRevenueOpen(false); }}
                                            onSelect={handleGoalSelect}
                                        />
                                        {fieldErrors.goal && <p className="text-[#FF2020] text-[12px] font-medium" style={{ marginTop: '6px', paddingLeft: '4px' }}>{fieldErrors.goal}</p>}
                                    </div>

                                    {/* ── Revenue section — separated with padding ── */}
                                    <div style={{ paddingTop: "32px" }}>
                                        <p className="font-[family-name:var(--font-rounded)] text-white/35 text-[13px] md:text-[14px] font-medium leading-snug"
                                            style={{ marginBottom: "16px" }}>
                                            Kompaniyangizning oylik daromadi qancha?
                                        </p>
                                        <CustomSelect
                                            value={revenue}
                                            placeholder="Tanlang"
                                            options={REVENUES}
                                            isOpen={revenueOpen}
                                            onToggle={() => { setRevenueOpen((p) => !p); setGoalOpen(false); }}
                                            onSelect={(v) => { setRevenue(v); setRevenueOpen(false); }}
                                            dropUp
                                        />
                                    </div>

                                    {/* ── Submit ── */}
                                    {submitted ? (
                                        <div className="w-full rounded-[14px] md:rounded-[16px] bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2.5"
                                            style={{ marginTop: "32px", padding: "14px 20px" }}>
                                            <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 6L9 17l-5-5" />
                                            </svg>
                                            <span className="font-[family-name:var(--font-rounded)] text-[15px] md:text-[16px] font-bold text-green-400">
                                                Ariza qabul qilindi!
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            {submitError && (
                                                <p className="text-red-400 text-[13px] font-medium text-center"
                                                    style={{ marginTop: "16px" }}>{submitError}</p>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full rounded-[14px] md:rounded-[16px]
                                                           font-[family-name:var(--font-rounded)] text-[15px] md:text-[16px] font-bold
                                                           bg-white text-[#0a0a0a]
                                                           hover:bg-[#f0f0f0] active:scale-[0.98]
                                                           transition-all duration-300
                                                           shadow-[0_2px_20px_rgba(255,255,255,0.05)]
                                                           disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{ marginTop: "32px", padding: "14px 20px" }}
                                            >
                                                {submitting ? "Yuborilmoqda..." : "Yuborish"}
                                            </button>
                                        </>
                                    )}

                                    {/* ── Privacy checkbox ── */}
                                    <label className="flex items-center justify-center gap-2.5 cursor-pointer group"
                                        style={{ marginTop: "16px" }}>
                                        <span className="w-[18px] h-[18px] md:w-5 md:h-5 rounded-[5px] md:rounded-[6px]
                                                        bg-white/10 border border-white/20
                                                        flex items-center justify-center flex-shrink-0
                                                        transition-all duration-300
                                                        group-hover:bg-white/15 group-hover:border-white/30">
                                            <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 6L9 17l-5-5" />
                                            </svg>
                                        </span>
                                        <span className="font-[family-name:var(--font-rounded)] text-white/30 text-[11px] md:text-[12px] font-medium
                                                        group-hover:text-white/40 transition-colors duration-300">
                                            Men maxfiylik siyosatiga roziman
                                        </span>
                                    </label>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
