"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSequence from "@/components/HeroSequence";
import ParticleOverlay from "@/components/ParticleOverlay";
import KineticText from "@/components/KineticText";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════════════ */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-4 md:px-16 py-3 md:py-4 flex items-center justify-between
                    bg-[#050505]/80 backdrop-blur-md border-b border-[#f5f5f5]/5">
      <a
        href="#contact"
        className="font-[family-name:var(--font-heading)] text-xs md:text-base uppercase tracking-[0.2em] px-6 md:px-8 py-3 md:py-4
                   border border-[#FF2020] bg-[#FF2020]/10 text-[#FF2020]
                   hover:bg-[#FF2020] hover:text-[#050505] hover:shadow-[0_0_20px_rgba(255,32,32,0.4)]
                   transition-all duration-400 rounded-sm"
      >
        Bog&apos;lanish
      </a>
    </nav>
  );
}

/* (Counter hook removed — not used in v2) */

/* ══════════════════════════════════════════════════════
   PARTNER LOGO (placeholder circle)
   ══════════════════════════════════════════════════════ */
function PartnerCircle({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-3 group">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#FF2020]/20 bg-[#0a0a0a]
                      flex items-center justify-center group-hover:border-[#FF2020]/60
                      group-hover:shadow-[0_0_20px_rgba(255,32,32,0.15)] transition-all duration-500">
        <span className="font-[family-name:var(--font-heading)] text-sm md:text-base font-bold text-[#f5f5f5]/40 group-hover:text-[#FF2020] transition-colors duration-500">
          {name}
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SERVICE CARD
   ══════════════════════════════════════════════════════ */
function ServiceCard({ number, title }: { number: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { yPercent: 30, opacity: 0 }, {
        yPercent: 0, opacity: 1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 55%", scrub: 1 },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="group relative p-8 md:p-10 border border-[#FF2020]/15 bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f]
                               hover:border-[#FF2020]/50 transition-all duration-500 rounded-sm">
      <div className="absolute top-4 right-4 font-[family-name:var(--font-heading)] text-5xl font-bold text-[#FF2020]/8 group-hover:text-[#FF2020]/15 transition-colors duration-500">
        {number}
      </div>
      <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold uppercase text-[#f5f5f5] relative z-10">
        {title}
      </h3>
      <div className="mt-4 h-[1px] w-0 bg-[#FF2020] group-hover:w-full transition-all duration-700" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PROCESS STEP
   ══════════════════════════════════════════════════════ */
function ProcessStep({ step, title }: { step: number; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { yPercent: 20, opacity: 0 }, {
        yPercent: 0, opacity: 1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="flex items-center gap-5 group">
      <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#FF2020]/30 bg-[#050505]
                      flex items-center justify-center group-hover:bg-[#FF2020] group-hover:border-[#FF2020] transition-all duration-500">
        <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#FF2020] group-hover:text-[#050505] transition-colors duration-500">
          {step}
        </span>
      </div>
      <span className="font-[family-name:var(--font-heading)] text-lg md:text-xl uppercase text-[#f5f5f5]/80 group-hover:text-[#f5f5f5] transition-colors duration-300">
        {title}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SECTOR CARD
   ══════════════════════════════════════════════════════ */
function SectorCard({ title }: { title: string }) {
  return (
    <div className="group p-8 md:p-10 border border-[#FF2020]/15 bg-[#0a0a0a]
                    hover:border-[#FF2020]/50 hover:bg-[#0f0f0f] transition-all duration-500 rounded-sm text-center">
      <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold uppercase text-[#f5f5f5]">
        {title}
      </h3>
      <div className="mt-4 mx-auto h-[1px] w-0 bg-[#FF2020] group-hover:w-16 transition-all duration-700" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   RESULT CARD
   ══════════════════════════════════════════════════════ */
function ResultCard({ nisha, vazifa, ishlar, kpi }: { nisha: string; vazifa: string; ishlar: string; kpi: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { yPercent: 30, opacity: 0, scale: 0.97 }, {
        yPercent: 0, opacity: 1, scale: 1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 55%", scrub: 1 },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="p-6 md:p-8 border border-[#FF2020]/15 bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-sm
                               hover:border-[#FF2020]/40 transition-all duration-500">
      <div className="space-y-3">
        {[
          { label: "Nisha", value: nisha },
          { label: "Vazifa", value: vazifa },
          { label: "Qilingan ishlar", value: ishlar },
          { label: "KPI natija", value: kpi },
        ].map((item) => (
          <div key={item.label}>
            <span className="font-[family-name:var(--font-body)] text-xs tracking-[0.2em] text-[#FF2020]/60 uppercase">{item.label}</span>
            <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/70 mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════ */
export default function Home() {
  /* Fade-in refs */
  const fadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(el, { yPercent: 15, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  /* Marquee for section 9 */
  const marqueeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!marqueeRef.current) return;
    const ctx = gsap.context(() => {
      const marquee = marqueeRef.current;
      if (!marquee) return;
      gsap.to(marquee, {
        xPercent: -50,
        ease: "none",
        duration: 25,
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050505]">
      <ParticleOverlay />
      <Navbar />

      {/* ═══════ HERO — CANVAS IMAGE SEQUENCE ═══════ */}
      <HeroSequence />

      {/* ═══════ 1-QISM — ASOSIY SARLAVHA ═══════ */}
      <section className="relative z-20 py-24 md:py-48 px-6 md:px-20 lg:px-32">
        <KineticText
          lines={["NATIJA", "BO'LMAGUNCHA", "XIZMAT", "QILAMIZ."]}
          className="mb-10"
        />
        <div ref={(el) => { fadeRefs.current[0] = el; }} className="mt-12 md:mt-16 max-w-2xl">
          <p className="font-[family-name:var(--font-body)] text-base md:text-lg text-[#f5f5f5]/50 leading-relaxed">
            Bizneslarni ijtimoiy tarmoqlarda sotuvlarini barqaror o&apos;sishiga yordam beramiz.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href="#contact" className="inline-block text-center px-6 md:px-8 py-3 md:py-4 bg-[#FF2020] text-[#050505]
                       font-[family-name:var(--font-heading)] text-xs md:text-sm font-bold uppercase tracking-[0.15em]
                       hover:bg-[#f5f5f5] transition-colors duration-500 box-glow">
              Audit tekshiruvi olish
            </a>
            <a href="#results" className="inline-block text-center px-6 md:px-8 py-3 md:py-4 border border-[#FF2020]/40 text-[#FF2020]
                       font-[family-name:var(--font-heading)] text-xs md:text-sm font-bold uppercase tracking-[0.15em]
                       hover:bg-[#FF2020] hover:text-[#050505] transition-all duration-500">
              Natijalar
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ 2-QISM — HAMKORLAR LOGOSI ═══════ */}
      <section className="relative z-20 py-20 md:py-40 px-6 md:px-20 lg:px-32">
        <div ref={(el) => { fadeRefs.current[1] = el; }}>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-5xl lg:text-6xl font-bold uppercase text-[#f5f5f5] mb-4">
            Biz bilan ishlagan <span className="text-[#FF2020]">hamkorlar</span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/40 mb-10 md:mb-16 max-w-xl">
            Biz turli sohalardagi bizneslar bilan samarali hamkorlik qilganmiz.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 md:gap-8">
            {["01", "02", "03", "04", "05", "06", "07", "08"].map((n) => (
              <PartnerCircle key={n} name={n} />
            ))}
          </div>
        </div>
        <div className="mt-20 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/30 to-transparent" />
      </section>

      {/* ═══════ 3-QISM — BIZ KIMLAR BILAN ISHLAYMIZ ═══════ */}
      <section className="relative z-20 py-20 md:py-40 px-6 md:px-20 lg:px-32">
        <div ref={(el) => { fadeRefs.current[2] = el; }}>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-5xl lg:text-6xl font-bold uppercase text-[#f5f5f5] mb-4">
            Biz kimlar bilan <span className="text-[#FF2020]">ishlaymiz</span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/40 mb-10 md:mb-14 max-w-xl">
            SMM orqali savdolarini oshirmoqchi bo&apos;lganlar bilan ishlaymiz.
          </p>

          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            {/* ISHLAYMIZ */}
            <div className="p-6 md:p-8 border border-[#FF2020]/20 bg-[#0a0a0a] rounded-sm">
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-[#FF2020] mb-6">
                ✓ Biz kimlar bilan ishlaymiz
              </h3>
              <ul className="space-y-3">
                {[
                  "O'sishni xohlaydigan biznes egalari",
                  "Reklama budjeti ajrata oladiganlar",
                  "KPI asosida ishlashga tayyorlar",
                  "Uzoq muddatli hamkorlik istovchilar",
                  "Strategiyani qadrlaydigan rahbarlar",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#FF2020] mt-0.5">●</span>
                    <span className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/70">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* ISHLAMAYMIZ */}
            <div className="p-6 md:p-8 border border-[#f5f5f5]/10 bg-[#0a0a0a] rounded-sm">
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-[#f5f5f5]/40 mb-6">
                ✕ Biz kimlar bilan ishlamaymiz
              </h3>
              <ul className="space-y-3">
                {[
                  "SMM ni qutqaruvchi deb bilganlar",
                  "0 budjet bilan natija kutuvchilar",
                  "1 haftada mo'jiza kutadiganlar",
                  "Strategiyasiz ishlamoqchi bo'lganlar",
                  "Hisob-kitobsiz reklama qilishni xohlovchilar",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#f5f5f5]/20 mt-0.5">●</span>
                    <span className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/30">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 4-QISM — BIZ ISHLAYDIGAN SOHALAR ═══════ */}
      <section className="relative z-20 py-20 md:py-40 px-6 md:px-20 lg:px-32">
        <div ref={(el) => { fadeRefs.current[3] = el; }}>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-5xl lg:text-6xl font-bold uppercase text-[#f5f5f5] mb-4 md:mb-6">
            Biz ishlaydigan <span className="text-[#FF2020]">sohalar</span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/40 mb-10 md:mb-14 max-w-xl">
            Har bir soha uchun alohida strategiya va yondashuv ishlab chiqamiz.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <SectorCard title="Tibbiyot" />
            <SectorCard title="Chakana savdo" />
            <SectorCard title="Navastroykalar" />
            <SectorCard title="Ishlab chiqarish" />
          </div>
        </div>
        <div className="mt-20 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/30 to-transparent" />
      </section>

      {/* ═══════ 5-QISM — UCHRASHUV BELGILASH ═══════ */}
      <section id="contact" className="relative z-20 py-24 md:py-44 px-6 md:px-20 lg:px-32">
        <div ref={(el) => { fadeRefs.current[4] = el; }} className="max-w-3xl mx-auto text-center">
          <KineticText
            lines={["HAMKORLIK UCHUN", "UCHRASHUV", "BELGILAYMIZMI?"]}
          />
          <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/40 mt-6 md:mt-8 mb-8 md:mb-10">
            Qisqa registratsiya qoldiring — biznesingizni tahlil qilib, aniq reja beramiz.
          </p>
          <a href="#contact-form" className="inline-block px-10 md:px-20 py-5 md:py-8 bg-[#FF2020] text-[#050505]
                     font-[family-name:var(--font-heading)] text-lg md:text-2xl font-bold uppercase tracking-[0.15em] md:tracking-[0.2em]
                     hover:bg-[#f5f5f5] transition-colors duration-500 box-glow-strong">
            Ro&apos;yxatdan o&apos;tish
          </a>
        </div>
      </section>

      {/* ═══════ 6-QISM — QANDAY TARTIBDA ISHLAYMIZ ═══════ */}
      <section className="relative z-20 py-20 md:py-40 px-6 md:px-20 lg:px-32">
        <div ref={(el) => { fadeRefs.current[5] = el; }}>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-5xl lg:text-6xl font-bold uppercase text-[#f5f5f5] mb-8 md:mb-12">
            Qanday tartibda <span className="text-[#FF2020]">ishlaymiz</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-6">
              <ProcessStep step={1} title="Audit qilish" />
              <ProcessStep step={2} title="Narx kelishish" />
              <ProcessStep step={3} title="Shartnoma tuzish" />
              <ProcessStep step={4} title="Strategiya tuzib chiqish" />
            </div>
            <div className="space-y-6">
              <ProcessStep step={5} title="Proektni ishga tushurish" />
              <ProcessStep step={6} title="Haftalik hisobotlar" />
              <ProcessStep step={7} title="Oylik hisobotlar" />
            </div>
          </div>
        </div>
        <div className="mt-20 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/30 to-transparent" />
      </section>

      {/* ═══════ 7-QISM — NATIJALAR ═══════ */}
      <section id="results" className="relative z-20 py-20 md:py-40 px-6 md:px-20 lg:px-32">
        <div ref={(el) => { fadeRefs.current[6] = el; }}>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-5xl lg:text-6xl font-bold uppercase text-[#f5f5f5] mb-4">
            <span className="text-[#FF2020]">Natijalar</span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/40 mb-10 md:mb-14 max-w-xl">
            Har bir loyiha bo&apos;yicha qilgan ishlarimiz va erishilgan natijalar.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <ResultCard
              nisha="Tibbiyot klinikasi"
              vazifa="Ijtimoiy tarmoqlarda bemor oqimini oshirish"
              ishlar="SMM strategiya, kontent ishlab chiqish, maqsadli reklama"
              kpi="Oyiga +120% murojaat o'sishi"
            />
            <ResultCard
              nisha="Chakana savdo do'koni"
              vazifa="Online savdolarni ko'paytirish"
              ishlar="Instagram kontenti, Reels, influencer marketing"
              kpi="3 oyda savdo +85%"
            />
            <ResultCard
              nisha="Qurilish kompaniyasi"
              vazifa="Brend tanilishini oshirish"
              ishlar="Brend strategiya, SMM, performance reklama"
              kpi="6 oyda 2M+ qamrov"
            />
          </div>
        </div>
      </section>

      {/* ═══════ 8-QISM — XIZMATLAR ═══════ */}
      <section className="relative z-20 py-20 md:py-40 px-6 md:px-20 lg:px-32">
        <div ref={(el) => { fadeRefs.current[7] = el; }}>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-5xl lg:text-6xl font-bold uppercase text-[#f5f5f5] mb-8 md:mb-12">
            <span className="text-[#FF2020]">Xizmatlar</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <ServiceCard number="01" title="Strategiya ishlab chiqish" />
            <ServiceCard number="02" title="Marketing" />
            <ServiceCard number="03" title="SMM" />
            <ServiceCard number="04" title="Performance" />
            <ServiceCard number="05" title="Production" />
          </div>
        </div>
        <div className="mt-20 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/30 to-transparent" />
      </section>

      {/* ═══════ 9-QISM — HAMKORLAR CAROUSEL (infinite marquee) ═══════ */}
      <section className="relative z-20 py-20 md:py-40 overflow-hidden">
        <div className="px-6 md:px-20 lg:px-32 mb-8 md:mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-5xl lg:text-6xl font-bold uppercase text-[#f5f5f5] mb-4">
            <span className="text-[#FF2020]">Hamkorlarimiz</span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/40">
            Biz bilan ishlagan kompaniyalar.
          </p>
        </div>
        <div className="relative w-full overflow-hidden">
          <div ref={marqueeRef} className="flex items-center gap-4 md:gap-12 w-max">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex items-center gap-4 md:gap-12">
                {["BREND A", "BREND B", "BREND C", "BREND D", "BREND E", "BREND F", "BREND G", "BREND H", "BREND I", "BREND J"].map((name, i) => (
                  <div key={`${setIdx}-${i}`}
                    className="flex-shrink-0 px-5 md:px-8 py-3 md:py-4 border border-[#FF2020]/10 bg-[#0a0a0a] rounded-sm
                                  font-[family-name:var(--font-heading)] text-xs md:text-base uppercase tracking-[0.1em] md:tracking-[0.15em] text-[#f5f5f5]/30">
                    {name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 10-QISM — FINAL CTA ═══════ */}
      <section className="relative z-20 py-28 md:py-56 px-6 md:px-20 lg:px-32 text-center">
        <div ref={(el) => { fadeRefs.current[8] = el; }}>
          <KineticText lines={["SMM ORQALI", "BIZNESINGIZNI", "O'STIRISHGA", "TAYYORMISIZ?"]} />
          <div className="mt-8 md:mt-12">
            <a href="#contact" className="group relative inline-block px-8 md:px-16 py-4 md:py-6 bg-[#FF2020] text-[#050505]
                       font-[family-name:var(--font-heading)] text-sm md:text-xl font-bold uppercase tracking-[0.15em] md:tracking-[0.2em]
                       hover:bg-[#f5f5f5] transition-colors duration-500 box-glow-strong">
              <span className="relative z-10">Hamkorlik uchun</span>
              <div className="absolute inset-0 bg-[#FF2020] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative z-20 py-8 md:py-12 px-6 md:px-20 lg:px-32 border-t border-[#FF2020]/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <Image src="/logo.png" alt="Pi MEDIA" width={60} height={38} className="brightness-110 w-[50px] md:w-[60px]" />
          <div className="flex items-center gap-4 md:gap-8">
            {["INSTAGRAM", "TELEGRAM", "LINKEDIN"].map((platform) => (
              <a key={platform} href="#"
                className="font-[family-name:var(--font-body)] text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] text-[#f5f5f5]/40
                            hover:text-[#FF2020] transition-colors duration-300">
                {platform}
              </a>
            ))}
          </div>
          <div className="font-[family-name:var(--font-body)] text-[10px] md:text-xs text-[#f5f5f5]/20 tracking-wider">
            © 2026 BARCHA HUQUQLAR HIMOYALANGAN
          </div>
        </div>
      </footer>
    </main>
  );
}
