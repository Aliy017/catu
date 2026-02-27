"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleOverlay from "@/components/ParticleOverlay";
import KineticText from "@/components/KineticText";
import { isIOS } from "@/components/iosDetect";
import BubbleButton from "@/components/BubbleButton";


// ⚡ Dynamic imports — below-fold heavy components (lazy load for speed)
const HowWeWork = dynamic(() => import("@/components/HowWeWork"), { ssr: false });
const InteractiveServiceList = dynamic(() => import("@/components/InteractiveServiceList"), { ssr: false });
const SpotlightResults = dynamic(() => import("@/components/SpotlightResults"), { ssr: false });
const SectorCinematic = dynamic(() => import("@/components/SectorCinematic"), { ssr: false });
const WhoWeWorkWith = dynamic(() => import("@/components/WhoWeWorkWith"), { ssr: false });
const ContactModal = dynamic(() => import("@/components/ContactModal"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// ─── iOS: Kill ALL GSAP activity ───
// 1. ScrollTrigger.disable() — removes global scroll/resize listeners
// 2. gsap.ticker.sleep() — stops the requestAnimationFrame loop
// Without this, GSAP's ticker runs ~60fps even with no animations,
// consuming CPU and competing with iOS native scroll.
if (typeof window !== 'undefined' && isIOS()) {
  ScrollTrigger.disable();
  gsap.ticker.sleep();
}

/* ══════════════════════════════════════════════════════
   NAVBAR — appears after hero, sticks to top
   ══════════════════════════════════════════════════════ */
function Navbar({ onOpenContact }: { onOpenContact: () => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const navLinks = [
    { label: "Hamkorlar", href: "#partners" },
    { label: "Natijalar", href: "#results" },
    { label: "Ro'yxatdan o'tish", href: "#contact" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50"
    >
      <div className={`border-b border-[#f5f5f5]/5 ${isMobile ? "bg-[#050505]/95" : "bg-[#050505]/85 backdrop-blur-md"}`}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-3 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Pi MEDIA"
              width={150}
              height={95}
              className="brightness-110 w-[80px] md:w-[120px]"
            />
          </a>

          {/* Nav links */}
          <div className="flex items-center gap-4 md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.href === "#contact" ? (e: React.MouseEvent) => { e.preventDefault(); onOpenContact(); } : undefined}
                className="nav-link-shimmer font-[family-name:var(--font-body)] text-[10px] md:text-sm font-medium uppercase tracking-wider
                           hover:text-[#FF2020] transition-all duration-300 cursor-pointer py-3"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}



/* ══════════════════════════════════════════════════════
   PARTNER LOGO (placeholder circle)
   ══════════════════════════════════════════════════════ */
const partnerLogos = [
  { src: "/partners/01.webp", alt: "Franklin", bg: "bg-white", cover: true },
  { src: "/partners/02.webp", alt: "Rivoj-98", bg: "bg-white" },
  { src: "/partners/03.webp", alt: "Beshbola Game Club", bg: "bg-white", cover: true },
  { src: "/partners/04.webp", alt: "MIG Build", bg: "bg-white" },
  { src: "/partners/05.webp", alt: "Texno sifat", bg: "bg-black", cover: true },
  { src: "/partners/06.webp", alt: "Ferton.uz", bg: "bg-[#111]" },
  { src: "/partners/07.webp", alt: "Le Crayon", bg: "bg-white", scale: "scale-150" },
  { src: "/partners/08.webp", alt: "Humo Med Servis", bg: "bg-white" },
];





/* ══════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════ */
export default function Home() {
  /* Contact modal state */
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  /* Fade-in refs — iOS uses IntersectionObserver, others use GSAP ScrollTrigger */
  const fadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const partnerGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isIOS()) {
      // ─── iOS: Lightweight IntersectionObserver (no GSAP scroll listeners) ───
      const observers: IntersectionObserver[] = [];

      fadeRefs.current.forEach((el) => {
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
              obs.disconnect();
            }
          });
        }, { threshold: 0.15 });
        obs.observe(el);
        observers.push(obs);
      });

      if (partnerGridRef.current) {
        const items = Array.from(partnerGridRef.current.children) as HTMLElement[];
        items.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(40px) scale(0.9)';
          item.style.transition = `opacity 0.6s ease-out ${i * 0.08}s, transform 0.6s ease-out ${i * 0.08}s`;
        });
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              items.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
              });
              obs.disconnect();
            }
          });
        }, { threshold: 0.1 });
        obs.observe(partnerGridRef.current);
        observers.push(obs);
      }

      return () => observers.forEach(obs => obs.disconnect());
    }

    // ─── Non-iOS: GSAP ScrollTrigger (deferred) ───
    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        fadeRefs.current.forEach((el) => {
          if (!el) return;
          gsap.fromTo(el, { yPercent: 15, opacity: 0 }, {
            yPercent: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          });
        });
      });
    }, 300);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  /* Partner logo stagger — non-iOS only */
  useEffect(() => {
    if (isIOS() || !partnerGridRef.current) return;
    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const items = partnerGridRef.current!.children;
        gsap.fromTo(items,
          { y: 60, scale: 0.5, opacity: 0 },
          {
            y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.4)",
            stagger: 0.1,
            scrollTrigger: { trigger: partnerGridRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });
    }, 300);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  /* Final batch refresh — non-iOS only */
  useEffect(() => {
    if (isIOS()) return;
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);





  return (
    <main className="relative min-h-screen bg-[#050505]">
      <ParticleOverlay />
      <Navbar onOpenContact={openContact} />

      {/* ═══════ 1-QISM — ASOSIY SARLAVHA ═══════ */}
      <section
        className="relative z-20 pb-[5vh] md:pb-[50vh] px-6 md:px-12 max-w-[1400px] mx-auto"
        style={{ paddingTop: '80px' }}
      >
        <KineticText
          lines={["NATIJA", "BO'LMAGUNCHA", "XIZMAT", "QILAMIZ."]}
          className="mb-10"
          autoPlay
        />
      </section>

      {/* ═══════ 2-QISM — HAMKORLAR LOGOSI ═══════ */}
      <section id="partners" style={{ scrollMarginTop: 100 }} className="relative z-30 mt-[5vh] md:mt-[40vh] pt-[8vh] pb-[15vh] md:pt-[80vh] md:pb-[50vh] min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto bg-[#050505]">
        <div ref={(el) => { fadeRefs.current[1] = el; }}>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl lg:text-7xl font-bold uppercase text-[#f5f5f5] mb-4 md:mb-6 text-center">
            Biz bilan ishlagan <span className="text-[#FF2020]">hamkorlar</span>
          </h2>
          <div className="flex justify-center w-full mb-16 md:mb-24">
            <p className="font-[family-name:var(--font-body)] text-lg md:text-2xl max-w-3xl leading-relaxed text-center text-sweep-red">
              Biz turli sohalardagi bizneslar bilan <span className="font-semibold">samarali hamkorlik</span> qilganmiz.
            </p>
          </div>
          <div className="h-[10vh]" />
          <div ref={partnerGridRef} className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-10 md:gap-x-6 md:gap-y-12">
            {partnerLogos.map((logo, i) => (
              <div key={i} className="flex flex-col items-center group">
                {/* Red blur glow behind logo */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#FF2020]/25 blur-[20px] scale-105
                                  group-hover:bg-[#FF2020]/50 group-hover:blur-[30px] group-hover:scale-115
                                  transition-all duration-700 ease-out" />
                  <div
                    className={`relative w-20 h-20 md:w-28 md:h-28 rounded-full border border-[#FF2020]/40 ${logo.bg}
                                overflow-hidden
                                group-hover:border-[#FF2020]/70
                                shadow-[0_0_15px_rgba(255,32,32,0.25)]
                                group-hover:shadow-[0_0_40px_rgba(255,32,32,0.4)] transition-all duration-500`}
                    style={{ clipPath: 'circle(50%)' }}
                  >
                    <div className={`absolute ${logo.cover ? 'inset-0' : 'inset-2 md:inset-3'}`}>
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        sizes="(max-width: 768px) 80px, 112px"
                        className={`${logo.cover ? 'object-cover' : 'object-contain'} ${logo.scale || ''}`}
                      />
                    </div>
                  </div>
                </div>
                <span style={{ marginTop: 12 }} className="font-[family-name:var(--font-heading)] text-[10px] md:text-sm font-semibold uppercase tracking-wider text-[#f5f5f5]/60
                                  text-center whitespace-normal leading-tight max-w-[90px] md:max-w-[120px]">
                  {logo.alt}
                </span>
                <div className="mt-1.5 h-[2px] w-14 md:w-24 bg-gradient-to-r from-transparent via-[#FF2020]/60 to-transparent rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '40vh' }} className="text-center">
          <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-5xl lg:text-6xl font-bold uppercase mb-[5vh]">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white from-30% to-[#FF2020]">
              Biz butun O'zbekiston bo'ylab
            </span>{" "}
            <span className="text-[#FF2020] md:text-transparent md:bg-clip-text md:bg-gradient-to-b md:from-white md:from-30% md:to-[#FF2020]">
              ishlaymiz
            </span>
          </h3>
          <div className="hidden md:block h-[5vh]" />
          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/50 to-transparent" />
        </div>
      </section>

      {/* ═══════ 3-QISM — BIZ KIMLAR BILAN ISHLAYMIZ (SCROLL ANIMATED) ═══════ */}
      <WhoWeWorkWith />

      {/* ═══════ 4-QISM — BIZ ISHLAYDIGAN SOHALAR ═══════ */}
      <section className="relative z-30 py-[30vh] md:py-[50vh] min-h-screen flex flex-col justify-center items-center px-6 md:px-12 max-w-[1400px] mx-auto bg-[#050505]">
        <div ref={(el) => { fadeRefs.current[3] = el; }} className="w-full">
          <h2 style={{ marginBottom: '3vh' }} className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl lg:text-7xl font-bold uppercase text-[#f5f5f5] text-center">
            Biz ishlaydigan <span className="text-[#FF2020]">sohalar</span>
          </h2>
          <div style={{ marginBottom: '10vh' }} className="flex justify-center w-full">
            <p className="font-[family-name:var(--font-body)] text-lg md:text-2xl max-w-3xl leading-relaxed text-center text-sweep-red">
              Har bir soha uchun alohida strategiya va yondashuv ishlab chiqamiz.
            </p>
          </div>
          <SectorCinematic />
        </div>
        <div className="mt-[20vh] h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/30 to-transparent" />
      </section>


      {/* ═══════ 5-QISM — QANDAY TARTIBDA ISHLAYMIZ ═══════ */}
      <HowWeWork />

      {/* ── Red section divider ── */}
      <div className="w-full flex justify-center py-4 md:py-8">
        <div className="w-[80%] md:w-[60%] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #FF2020, transparent)' }} />
      </div>
      <div className="h-[30vh]" />

      {/* ═══════ 6-QISM — NATIJALAR ═══════ */}
      <section id="results" style={{ scrollMarginTop: 100 }} className="relative z-30 py-[30vh] md:py-[50vh] min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto bg-[#050505]">
        <div ref={(el) => { fadeRefs.current[6] = el; }}>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl lg:text-7xl font-bold uppercase text-[#f5f5f5] mb-6 md:mb-8 text-center">
            <span className="text-[#FF2020]">Natijalar</span>
          </h2>
          <div style={{ marginBottom: '5vh' }} className="flex justify-center w-full">
            <p className="font-[family-name:var(--font-body)] text-lg md:text-2xl max-w-3xl leading-relaxed text-center text-sweep-red">
              Loyihalarimizdan namunalar — kartalarni bosing yoki bosib turing!
            </p>
          </div>
          <SpotlightResults />
        </div>
      </section>

      {/* Red divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-[20vh] md:py-[40vh]">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/50 to-transparent" />
      </div>

      {/* ═══════ 7-QISM — XIZMATLAR ═══════ */}
      <div className="h-[30vh]" />
      <section className="relative z-30 py-[30vh] md:py-[50vh] min-h-screen flex flex-col justify-center items-center px-6 md:px-12 max-w-[1400px] mx-auto bg-[#050505]">
        <div ref={(el) => { fadeRefs.current[7] = el; }} className="w-full">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl lg:text-7xl font-bold uppercase text-[#f5f5f5] mb-4 md:mb-6 text-center">
            <span className="text-[#FF2020]">Xizmatlar</span>
          </h2>
          <div style={{ marginBottom: '8vh' }} className="flex justify-center w-full">
            <p className="font-[family-name:var(--font-body)] text-lg md:text-2xl max-w-3xl leading-relaxed text-center text-sweep-red">
              Biznesingizni o&apos;stirish uchun barcha kerakli xizmatlar bir joyda.
            </p>
          </div>
          <div className="w-full">
            <InteractiveServiceList />
          </div>
        </div>
        <div className="mt-[20vh] h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/30 to-transparent" />
      </section>

      {/* ═══════ UCHRASHUV BELGILASH ═══════ */}
      <section id="contact" style={{ scrollMarginTop: 100 }} className="relative z-30 py-[30vh] md:py-[50vh] min-h-screen flex flex-col justify-center items-center px-6 md:px-12 max-w-[1400px] mx-auto bg-[#050505]">
        <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">
          <KineticText
            lines={["HAMKORLIK UCHUN", "UCHRASHUV", "BELGILAYMIZMI?"]}
            centered
          />
          <div style={{ height: '20px' }} />
          <p
            className="font-[family-name:var(--font-body)] text-xl md:text-3xl mt-8 md:mt-12 leading-relaxed"
            style={{ animation: 'subtitle-pulse 3s ease-in-out infinite alternate' }}
          >
            Qisqa registratsiya qoldiring — biznesingizni tahlil qilib, aniq reja beramiz.
          </p>

          {/* Spacer */}
          <div style={{ height: '120px' }} />

          <BubbleButton onOpen={openContact} />
        </div>
      </section>

      {/* ═══════ HAMKORLARIMIZ (alohida section) ═══════ */}
      {/* Mobile spacer */}
      <div className="block md:hidden" style={{ height: '80px' }} />
      {/* Desktop spacer */}
      <div className="hidden md:block" style={{ height: '400px' }} />

      <section className="relative z-20 py-[20vh] md:py-[30vh] flex flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-12 max-w-[1400px] mx-auto mb-12 md:mb-20">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-4xl lg:text-5xl font-bold uppercase text-[#f5f5f5] mb-6 text-center">
            <span className="text-[#f5f5f5]">Hamkorlarimiz</span>
          </h2>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex items-center gap-4 md:gap-12 w-max animate-nav-marquee hover:pause">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex items-center gap-4 md:gap-12">
                {["Franklin", "Rivoj-98", "Beshbola Game Club", "MIG Build", "Texno sifat", "Ferton.uz", "Le Crayon", "Humo Med Servis"].map((name, i) => (
                  <div key={`${setIdx}-${i}`}
                    className="flex-shrink-0 px-6 md:px-10 py-4 md:py-5 border border-[#FF2020]/10 bg-[#0a0a0a] rounded-sm
                                  font-[family-name:var(--font-heading)] text-base md:text-2xl uppercase tracking-[0.1em] md:tracking-[0.15em] text-[#f5f5f5]/30">
                    {name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Red divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-[20vh] md:py-[40vh]">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/50 to-transparent" />
      </div>



      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative z-20 py-16 md:py-24 px-6 md:px-20 lg:px-32">
        <div className="max-w-[1400px] mx-auto">
          {/* Top divider */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/20 to-transparent mb-12 md:mb-16" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
            {/* Logo — Left aligned on desktop */}
            <div className="flex-1 flex justify-center md:justify-start">
              <Image src="/logo.png" alt="Pi MEDIA" width={180} height={114} className="brightness-110 w-[140px] md:w-[150px]" />
            </div>

            {/* Social Links — Center aligned on desktop */}
            <div className="flex items-center gap-6 md:gap-10">
              {/* Facebook */}
              <a href="https://www.facebook.com/profile.php?id=61579192721658"
                target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-[#FF2020] group-hover:scale-110 transition-colors duration-300">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-[family-name:var(--font-body)] text-[8px] md:text-[10px] tracking-[0.2em] text-[#f5f5f5]/30 group-hover:text-[#FF2020]/60 transition-colors duration-300 uppercase">Facebook</span>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/pi_media_agency?igsh=YzZrZG4wNTF5bXNi"
                target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-[#FF2020] group-hover:scale-110 transition-colors duration-300">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span className="font-[family-name:var(--font-body)] text-[8px] md:text-[10px] tracking-[0.2em] text-[#f5f5f5]/30 group-hover:text-[#FF2020]/60 transition-colors duration-300 uppercase">Instagram</span>
              </a>

              {/* Telegram */}
              <a href="https://t.me/pimedia_agency"
                target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-all duration-300"
                aria-label="Telegram"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-[#FF2020] group-hover:scale-110 transition-colors duration-300">
                  <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span className="font-[family-name:var(--font-body)] text-[8px] md:text-[10px] tracking-[0.2em] text-[#f5f5f5]/30 group-hover:text-[#FF2020]/60 transition-colors duration-300 uppercase">Telegram</span>
              </a>

              {/* Location */}
              <a href="https://maps.app.goo.gl/LAoGPmze23ZtZSPN8?g_st=ac"
                target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-all duration-300"
                aria-label="Joylashuv"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-[#FF2020] group-hover:scale-110 transition-colors duration-300">
                  <path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
                </svg>
                <span className="font-[family-name:var(--font-body)] text-[8px] md:text-[10px] tracking-[0.2em] text-[#f5f5f5]/30 group-hover:text-[#FF2020]/60 transition-colors duration-300 uppercase">Manzil</span>
              </a>
            </div>

            {/* Made by — Right aligned on desktop */}
            <div className="flex-1 flex justify-center md:justify-end">
              <a href="https://t.me/notience" target="_blank" rel="noopener noreferrer"
                className="font-[family-name:var(--font-mono)] text-[10px] md:text-xs text-white/60 tracking-wider hover:text-white transition-colors duration-300">
                Made by: <span className="text-white border-b border-white pb-0.5 text-sm md:text-base font-bold mx-1">Ξ B ム</span> team
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════ CONTACT MODAL ═══════ */}
      <ContactModal isOpen={contactOpen} onClose={closeContact} />
    </main>
  );
}
