"use client";

import { useEffect } from "react";

/**
 * AnalyticsScripts — sayt konfiguratsiyasidan Meta Pixel, Yandex Metrica,
 * Google Ads skriptlarini dinamik yuklaydi.
 * 
 * Admin panelda sayt uchun IDlarni kiritganingizda,
 * bu komponent ularni avtomatik ravishda sahifaga qo'shadi.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN || "pimedia.uz";

export default function AnalyticsScripts() {
    useEffect(() => {
        async function loadAnalytics() {
            try {
                const res = await fetch(`${BACKEND_URL}/api/site-config?domain=${SITE_DOMAIN}`);
                if (!res.ok) return;
                const config = await res.json();

                // ═══════ META PIXEL ═══════
                if (config.metaPixelId) {
                    const pixelId = config.metaPixelId;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const w = window as any;
                    if (!w.fbq) {
                        const n = (w.fbq = function (...args: unknown[]) {
                            n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
                        });
                        if (!w._fbq) w._fbq = n;
                        n.push = n;
                        n.loaded = true;
                        n.version = "2.0";
                        n.queue = [];

                        const script = document.createElement("script");
                        script.async = true;
                        script.src = "https://connect.facebook.net/en_US/fbevents.js";
                        document.head.appendChild(script);
                    }
                    w.fbq("init", pixelId);
                    w.fbq("track", "PageView");
                }

                // ═══════ YANDEX METRICA ═══════
                if (config.yandexId) {
                    const ymId = Number(config.yandexId);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const w = window as any;
                    if (!w.ym) {
                        w.ym = function (...args: unknown[]) {
                            (w.ym.a = w.ym.a || []).push(args);
                        };
                        w.ym.l = Date.now();

                        const script = document.createElement("script");
                        script.async = true;
                        script.src = "https://mc.yandex.ru/metrika/tag.js";
                        document.head.appendChild(script);
                    }
                    w.ym(ymId, "init", {
                        clickmap: true,
                        trackLinks: true,
                        accurateTrackBounce: true,
                        webvisor: true,
                    });
                }

                // ═══════ GOOGLE ADS / GTAG ═══════
                if (config.googleAdsTag) {
                    const gtagId = config.googleAdsTag.split("/")[0]; // AW-XXXXXXX
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const w = window as any;
                    if (!w.gtag) {
                        w.dataLayer = w.dataLayer || [];
                        w.gtag = function (...args: unknown[]) {
                            w.dataLayer.push(args);
                        };
                        w.gtag("js", new Date());

                        const script = document.createElement("script");
                        script.async = true;
                        script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
                        document.head.appendChild(script);
                    }
                    w.gtag("config", gtagId);
                }
            } catch {
                // Analytics yuklanmasa — sayt ishlashiga ta'sir qilmaydi
            }
        }

        loadAnalytics();
    }, []);

    return null; // UI yo'q — faqat skriptlar yuklaydi
}
