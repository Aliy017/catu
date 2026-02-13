# CATU — Aggressive Luxury Agency Website

**Project Status**: v2.8 (Stable)
**Tech Stack**: Next.js 16 (App Router), Tailwind CSS v4, GSAP + ScrollTrigger, Lenis
**Design Philosophy**: "Aggressive Luxury" — Deep Black (`#050505`) & Neon Red (`#FF2020`).

---

## 1. Project Overview

This is a high-performance, scrollytelling landing page for an elite SMM Agency. It replaces standard web design with cinematic interactions, kinetic typography, and canvas-based frame sequences.

### Core Objectives
1.  **Conversion**: Turn visitors into high-ticket clients via a 10-step psychological flow.
2.  **Impression**: "WOW" factor using WebGL-like canvas sequences and particle effects.
3.  **Performance**: Optimized for mobile (battery saver mode) and standard devices.

---

## 2. Technical Architecture

### 2.1 File Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout: Fonts (Oswald/Inter), Metadata, SmoothScroll wrapper
│   ├── page.tsx         # Main Landing Page (10 Sections)
│   ├── globals.css      # Tailwind v4 Config, Custom Utilities (.box-glow, .noise-overlay)
│   └── favicon.ico      # Site Icon (mapped to logo.png in metadata)
├── components/
│   ├── HeroSequence.tsx    # Canvas Image Sequence (Scroll-scrubbed)
│   ├── KineticText.tsx     # Typography Reveal Animation
│   ├── ParticleOverlay.tsx # Interactive Background (Mouse/Scroll reactive)
│   └── SmoothScroll.tsx    # Lenis Integration (GSAP sync)
└── ...
```

### 2.2 Key Technologies

-   **Next.js 16 (Turbopack)**: React Server Components primarily, but `page.tsx` is `use client` due to heavy GSAP interactivity.
-   **Tailwind CSS v4**: Zero-runtime CSS.
    -   *Config*: Defined in `globals.css` via `@theme`.
    -   *Colors*: `--color-neon-red: #FF2020`, `--color-deep-black: #050505`.
-   **GSAP (GreenSock)**: Driver for all complex animations.
    -   `ScrollTrigger`: Pins sections, scrubs canvas, triggers reveals.
    -   `gsap.ticker`: Synced with Lenis for smooth 60fps scrolling.
-   **Canvas API**: Used in `HeroSequence.tsx` for high-performance image sequence rendering (98 JPG frames).

---

## 3. Component Deep Dive

### `HeroSequence.tsx` (Critical)
-   **Function**: Renders a 3D-like video effect by scrubbing through 98 JPG frames based on scroll position.
-   **Logic**:
    -   `useImagePreloader`: Preloads all 98 images into memory.
    -   `drawFrame(index)`: Draws the specific frame to a `<canvas>` context, maintaining aspect ratio (cover fit).
    -   **Optimization**: Draws frame 0 immediately on load. Uses a smooth opacity transition to reveal the canvas after loading.
    -   **Assets**: `public/frames/ezgif-frame-001.jpg` to `098.jpg`.

### `KineticText.tsx`
-   **Function**: Reveals text line-by-line using `overflow: hidden` and `transform: translateY(100%)`.
-   **Effect**: Staggered enter animation triggered by scroll.

### `ParticleOverlay.tsx`
-   **Function**: Renders floating red particles.
-   **Optimization**:
    -   Detects `navigator.hardwareConcurrency` (< 4) or mobile user agents.
    -   **Low Power Mode**: Reduces particle count by 50% and disables backdrop blur on weaker devices to maintain FPS.

### `page.tsx` (Main Layout)
-   **Structure**: 10 Logical Sections.
-   **Layout**: Centered container (`max-w-[1400px] mx-auto`) with generous vertical spacing (`py-28+`) to prevent visual clutter.
-   **Responsiveness**: Mobile-first. Grids expand from 1 col (base) to 2 (md) to 4 (lg).

---

## 4. Development & Workflow

### Commands
-   **Run Dev Server**: `npm run dev`
-   **Build**: `npm run build`
-   **Start Production**: `npm start`

### Customization Guide
-   **Text Content**: All text is hardcoded in `src/app/page.tsx` for easy editing.
-   **Images**: Frame sequence located in `public/frames/`. Logo in `public/logo.png`.
-   **Colors**: Change `--color-neon-red` in `src/app/globals.css` to rebrand the entire site instantly.

---

## 5. Known Behaviors / "Features"
-   **Hydration Warning**: Suppressed in `layout.tsx` (caused by browser extensions modifying the DOM).
-   **Loading Screen**: Deliberate 1000ms fade-out to ensure Canvas is painted before revealing.
-   **Design constraints**: No Navbar Logo (Minimalist choice), Right-aligned Menu.

---

## 6. Message to Gemini 3 AI
*bu loyiha allaqachon mukammal darajada optimizatsiya qilingan (v2.8). Agar kodga o'zgartirish kiritmoqchi bo'lsangiz, iltimos, avval `HeroSequence.tsx` ichidagi animatsiya logikasini buzmaslikka e'tibor bering. Barcha animatsiyalar `GSAP Context` ichida tozalanishi (`revert()`) shart.*
