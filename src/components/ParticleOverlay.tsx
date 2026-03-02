"use client";

import { useEffect, useRef, useState } from "react";

/*
  ParticleOverlay — lightweight floating particles
  ▸ Uses IntersectionObserver: animates ONLY when canvas is visible
  ▸ Pauses requestAnimationFrame when scrolled away → 0% GPU usage
  ▸ Resumes smoothly when scrolled back → no restart, continues flow
*/

const PARTICLE_COUNT = 35; // light count for mobile
const SPEED = 0.3;

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
}

function createParticles(w: number, h: number): Particle[] {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED * 0.6,
        radius: 0.6 + Math.random() * 1.2,
        opacity: 0.08 + Math.random() * 0.12,
    }));
}

export default function ParticleOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animIdRef = useRef<number>(0);
    const visibleRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        // Size canvas
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (particlesRef.current.length === 0) {
                particlesRef.current = createParticles(canvas.width, canvas.height);
            }
        };
        resize();
        window.addEventListener("resize", resize);

        // Animation loop
        const draw = () => {
            if (!visibleRef.current) {
                animIdRef.current = 0;
                return; // Stop loop when not visible
            }

            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            particlesRef.current.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 32, 32, ${p.opacity})`;
                ctx.fill();
            });

            animIdRef.current = requestAnimationFrame(draw);
        };

        // IntersectionObserver — pause/resume
        const observer = new IntersectionObserver(
            ([entry]) => {
                visibleRef.current = entry.isIntersecting;
                if (entry.isIntersecting && !animIdRef.current) {
                    animIdRef.current = requestAnimationFrame(draw);
                }
            },
            { threshold: 0.05 }
        );
        observer.observe(canvas);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", resize);
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-10"
            style={{ opacity: 0.5 }}
            aria-hidden="true"
        />
    );
}
