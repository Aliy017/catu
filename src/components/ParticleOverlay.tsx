"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    alpha: number;
    decay: number;
    color: string;
}

function isLowEndDevice(): boolean {
    if (typeof navigator === "undefined") return false;
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
    return cores <= 4 || isMobile;
}

export default function ParticleOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);
    const [isLowPower, setIsLowPower] = useState(false);
    const maxParticles = useRef(120);

    const spawnBurst = useCallback(
        (x: number, y: number) => {
            const burstCount = isLowPower ? 12 : 22;
            for (let i = 0; i < burstCount; i++) {
                if (particlesRef.current.length >= maxParticles.current) {
                    particlesRef.current.shift();
                }
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2 + 0.8;
                const reds = ["#FF2020", "#FF4040", "#CC0000", "#FF6060", "#FF1010"];
                particlesRef.current.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 0.5,
                    radius: Math.random() * 2.5 + 0.8,
                    alpha: 0.9,
                    decay: Math.random() * 0.004 + 0.002,
                    color: reds[Math.floor(Math.random() * reds.length)],
                });
            }
        },
        [isLowPower]
    );

    useEffect(() => {
        const lowEnd = isLowEndDevice();
        setIsLowPower(lowEnd);
        maxParticles.current = lowEnd ? 60 : 120;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        /* Only spawn on desktop click */
        const handleClick = (e: MouseEvent) => {
            spawnBurst(e.clientX, e.clientY);
        };

        window.addEventListener("click", handleClick);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.01);

            for (const p of particlesRef.current) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05;
                p.vx *= 0.98;
                p.alpha -= p.decay;

                ctx.save();
                ctx.globalAlpha = p.alpha;

                if (!isLowPower) {
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = p.color;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener("click", handleClick);
            window.removeEventListener("resize", resize);
        };
    }, [spawnBurst, isLowPower]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-50"
            style={{ mixBlendMode: "screen" }}
        />
    );
}
