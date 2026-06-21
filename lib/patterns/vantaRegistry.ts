import type { VantaPatternEntry } from "./vantaTypes";

const BIRDS_CONFIG = {
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
  scale: 1.0,
  scaleMobile: 1.0,
  backgroundColor: 0x080814,
  backgroundAlpha: 1,
  color1: 0x7c3aed,
  color2: 0x6366f1,
  colorMode: "varianceGradient",
  quantity: 4,
  birdSize: 1.2,
  wingSpan: 30,
  speedLimit: 4,
  separation: 20,
  alignment: 20,
  cohesion: 20,
};

export const vantaPatterns: VantaPatternEntry[] = [
  {
    id: "vanta-birds",
    name: "Birds",
    category: "effects",
    isPro: false,
    tags: ["birds", "vanta", "3d", "webgl", "animated", "flocking", "three.js"],
    type: "vanta",
    vantaEffect: "birds",
    vantaConfig: BIRDS_CONFIG,
    thumbnailCss: {
      background:
        "radial-gradient(ellipse at 35% 65%, rgba(124,58,237,0.85) 0%, rgba(99,102,241,0.55) 35%, #080814 72%)",
    },
    textContrast: "light",
    toCode: () => `<!-- ── HTML embed ──────────────────────────────────────── -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js"></script>

<div id="hero-bg" style="width:100%;min-height:100vh;position:relative;"></div>

<script>
VANTA.BIRDS({
  el: "#hero-bg",
  mouseControls: true,
  touchControls: true,
  backgroundColor: 0x080814,
  color1: 0x7c3aed,
  color2: 0x6366f1,
  colorMode: "varianceGradient",
  quantity: 4,
  birdSize: 1.2,
  wingSpan: 30,
  speedLimit: 4,
})
</script>

/* ── React / Next.js ─────────────────────────────────────────
   npm install three vanta
   ────────────────────────────────────────────────────────── */
"use client";
import { useEffect, useRef } from "react";

export default function BirdsBackground({ children }) {
  const ref = useRef(null);
  const effect = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      const THREE = await import("three");
      const VANTA = await import("vanta/dist/vanta.birds.min");
      if (cancelled || !ref.current) return;
      effect.current = VANTA.default({
        el: ref.current, THREE,
        backgroundColor: 0x080814,
        color1: 0x7c3aed, color2: 0x6366f1,
        colorMode: "varianceGradient",
        quantity: 4, birdSize: 1.2,
        wingSpan: 30, speedLimit: 4,
      });
    }
    boot();
    return () => { cancelled = true; effect.current?.destroy(); };
  }, []);

  return <div ref={ref} style={{ minHeight: "100vh" }}>{children}</div>;
}`,
  },
];

export function getVantaPatternById(id: string): VantaPatternEntry | undefined {
  return vantaPatterns.find((p) => p.id === id);
}
