"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSequence from "@/components/HeroSequence";
import ParticleOverlay from "@/components/ParticleOverlay";
import KineticText from "@/components/KineticText";

gsap.registerPlugin(ScrollTrigger);

/* ── Counter Animation Hook ── */
function useCounterAnimation(
  ref: React.RefObject<HTMLSpanElement | null>,
  target: number,
  suffix: string = ""
) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = Math.floor(counter.value) + suffix;
        },
      });
    });

    return () => ctx.revert();
  }, [ref, target, suffix]);
}

/* ── Service Card ── */
function ServiceCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { yPercent: 40, opacity: 0, scale: 0.95 },
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative flex-shrink-0 w-[85vw] md:w-[400px] p-8 md:p-10 border border-[#FF2020]/20
                 bg-gradient-to-br from-[#0a0a0a] to-[#111] rounded-sm
                 hover:border-[#FF2020]/60 transition-colors duration-500"
    >
      <div className="absolute top-4 right-4 font-[family-name:var(--font-heading)] text-6xl md:text-7xl font-bold text-[#FF2020]/10 group-hover:text-[#FF2020]/20 transition-colors duration-500">
        {number}
      </div>
      <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold uppercase text-[#f5f5f5] mb-4 relative z-10">
        {title}
      </h3>
      <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/60 leading-relaxed relative z-10">
        {description}
      </p>
      <div className="mt-6 h-[1px] w-0 bg-[#FF2020] group-hover:w-full transition-all duration-700" />
    </div>
  );
}

/* ── Main Page ── */
export default function Home() {
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);
  const stat4Ref = useRef<HTMLSpanElement>(null);

  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesWrapRef = useRef<HTMLDivElement>(null);

  useCounterAnimation(stat1Ref, 150, "+");
  useCounterAnimation(stat2Ref, 50, "M+");
  useCounterAnimation(stat3Ref, 340, "%");
  useCounterAnimation(stat4Ref, 12, "+");

  /* Horizontal Scroll for Services */
  useEffect(() => {
    if (!servicesRef.current || !servicesWrapRef.current) return;

    const ctx = gsap.context(() => {
      const scrollWidth =
        servicesWrapRef.current!.scrollWidth - window.innerWidth + 100;

      gsap.to(servicesWrapRef.current, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  /* Fade-in sections */
  const fadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { yPercent: 20, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050505]">
      {/* Particle Overlay */}
      <ParticleOverlay />

      {/* ═══════ HERO ═══════ */}
      <HeroSequence />

      {/* ═══════ KIRISH SO'ZI ═══════ */}
      <section className="relative z-20 py-32 md:py-48 px-6 md:px-16 lg:px-24">
        <KineticText
          lines={["MEN TRENDLARGA", "ERGASHMAYMAN.", "MEN ULARNI", "YARATAMAN."]}
          className="mb-8"
        />
        <div
          ref={(el) => { fadeRefs.current[0] = el; }}
          className="mt-12 max-w-2xl"
        >
          <p className="font-[family-name:var(--font-body)] text-base md:text-lg text-[#f5f5f5]/50 leading-relaxed">
            Har bir brendning o&apos;z hikoyasi bor. Ko&apos;pchilik uni noto&apos;g&apos;ri aytib beradi.
            Men viral lahzalarni yarataman, shafqatsiz strategiyalar ishlab chiqaman
            va shunchaki kuzatib turmaydigan — balki muxlisga aylanadigan auditoriyalar quraman.
          </p>
        </div>
      </section>

      {/* ═══════ STATISTIKA ═══════ */}
      <section className="relative z-20 py-24 md:py-40 px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { ref: stat1Ref, label: "BRENDLAR QURILGAN" },
            { ref: stat2Ref, label: "QAMROV HOSIL QILINGAN" },
            { ref: stat3Ref, label: "O'RTACHA ROI" },
            { ref: stat4Ref, label: "YILLIK TAJRIBA" },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <span
                ref={stat.ref}
                className="block font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl font-bold text-[#FF2020] text-glow"
              >
                0
              </span>
              <span className="block mt-2 font-[family-name:var(--font-body)] text-xs md:text-sm tracking-[0.3em] text-[#f5f5f5]/40 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Ajratuvchi chiziq */}
        <div className="mt-20 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF2020]/40 to-transparent" />
      </section>

      {/* ═══════ KINETIK IQTIBOS ═══════ */}
      <section className="relative z-20 py-32 md:py-48 px-6 md:px-16 lg:px-24">
        <KineticText
          lines={[
            "IJTIMOIY TARMOQ",
            "BU PLATFORMA",
            "EMAS.",
            "BU — QUROL.",
          ]}
        />
      </section>

      {/* ═══════ XIZMATLAR — GORIZONTAL SCROLL ═══════ */}
      <section ref={servicesRef} className="relative z-20 overflow-hidden">
        <div
          ref={servicesWrapRef}
          className="flex items-center gap-8 px-6 md:px-16 lg:px-24 h-screen"
        >
          {/* Bo'lim sarlavhasi */}
          <div className="flex-shrink-0 w-[85vw] md:w-[500px]">
            <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl font-bold uppercase text-[#f5f5f5] leading-[0.95]">
              NIMA
              <br />
              <span className="text-[#FF2020]">QILAMAN</span>
            </h2>
            <div className="mt-6 h-[2px] w-24 bg-[#FF2020]" />
          </div>

          <ServiceCard
            number="01"
            title="BREND STRATEGIYA"
            description="To'liq brend arxitekturasi. Shovqinni yorib o'tadigan va auditoriyani abadiy eslab qoladigan identifikatsiya tizimlari."
          />
          <ServiceCard
            number="02"
            title="KONTENT URUSHI"
            description="Viral kontent quvurlari. Har bir post — rejalashtirilgan zarba. Lentalarni egallash va maksimal ishtirokni ta'minlash uchun yaratilgan."
          />
          <ServiceCard
            number="03"
            title="PULLI REKLAMA"
            description="Meta, TikTok, Google bo'ylab aniq maqsadli kampaniyalar. Maksimal ROI, minimal isrof. Har bir so'm ishlaydi."
          />
          <ServiceCard
            number="04"
            title="JAMOA QURISH"
            description="Obunachilarni muxlislarga aylantiring. Brendingiz atrofida fanatik sadoqat yaratadigan ishtirok strategiyalari."
          />
          <ServiceCard
            number="05"
            title="ANALITIKA VA O'SISH"
            description="Ma'lumotlarga asoslangan qarorlar. Real vaqt panellari, A/B testlash va to'xtovsiz o'sishni ta'minlaydigan growth hacking."
          />
        </div>
      </section>

      {/* ═══════ MANIFEST ═══════ */}
      <section className="relative z-20 py-32 md:py-48 px-6 md:px-16 lg:px-24">
        <div
          ref={(el) => { fadeRefs.current[1] = el; }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="mb-8 inline-block px-4 py-1 border border-[#FF2020]/30 rounded-full">
            <span className="font-[family-name:var(--font-body)] text-xs tracking-[0.4em] text-[#FF2020] uppercase">
              MANIFEST
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl lg:text-6xl font-bold uppercase text-[#f5f5f5] leading-[1.1] mb-8">
            O&apos;rtamiyonalik — dushman.
            <br />
            <span className="text-[#FF2020]">Mukammallik — standart.</span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-base md:text-lg text-[#f5f5f5]/40 leading-relaxed max-w-2xl mx-auto">
            Kontentga cho&apos;kkan dunyoda o&apos;rtacha bo&apos;lish — ko&apos;rinmas bo&apos;lish bilan teng.
            Men o&apos;rtacha bo&apos;lishni rad etadigan brendlar bilan ishlayman.
            Birgalikda biz imperiyalar quramiz.
          </p>
        </div>
      </section>

      {/* ═══════ YAKUNIY KINETIK ═══════ */}
      <section className="relative z-20 py-32 md:py-48 px-6 md:px-16 lg:px-24">
        <KineticText lines={["BIRINCHI.", "OXIRGI.", "YAGONA."]} />
      </section>

      {/* ═══════ CTA BO'LIMI ═══════ */}
      <section className="relative z-20 py-40 md:py-56 px-6 md:px-16 lg:px-24 text-center">
        <div ref={(el) => { fadeRefs.current[2] = el; }}>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-8xl font-bold uppercase text-[#f5f5f5] mb-6">
            HUKMRONLIKKA
            <br />
            <span className="text-[#FF2020] text-glow">TAYYORMISIZ?</span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-[#f5f5f5]/40 mb-12 tracking-wide">
            Keling, dunyo e&apos;tiborsiz qoldirolmaydigan narsa yarataylik.
          </p>
          <a
            href="mailto:hello@pimedia.uz"
            className="group relative inline-block px-12 md:px-16 py-5 md:py-6 bg-[#FF2020] text-[#050505]
                       font-[family-name:var(--font-heading)] text-lg md:text-xl font-bold uppercase tracking-[0.2em]
                       hover:bg-[#f5f5f5] transition-colors duration-500
                       box-glow-strong"
          >
            <span className="relative z-10">BOG&apos;LANISH</span>
            <div className="absolute inset-0 bg-[#FF2020] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          </a>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative z-20 py-12 px-6 md:px-16 lg:px-24 border-t border-[#FF2020]/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Image src="/logo.png" alt="Pi MEDIA" width={80} height={50} className="brightness-110" />
          <div className="flex items-center gap-8">
            {["INSTAGRAM", "TELEGRAM", "LINKEDIN"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="font-[family-name:var(--font-body)] text-xs tracking-[0.3em] text-[#f5f5f5]/40
                           hover:text-[#FF2020] transition-colors duration-300"
              >
                {platform}
              </a>
            ))}
          </div>
          <div className="font-[family-name:var(--font-body)] text-xs text-[#f5f5f5]/20 tracking-wider">
            © 2026 BARCHA HUQUQLAR HIMOYALANGAN
          </div>
        </div>
      </footer>
    </main>
  );
}
