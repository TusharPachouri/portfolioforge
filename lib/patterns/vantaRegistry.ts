import type { VantaPatternEntry } from "./vantaTypes";

function reactSnippet(name: string, effect: string, config: Record<string, unknown>): string {
  const cfg = Object.entries(config)
    .map(([k, v]) => `        ${k}: ${typeof v === "number" ? `0x${v.toString(16).padStart(6, "0")}` : JSON.stringify(v)},`)
    .join("\n");
  const displayName = name.replace(/\s+/g, "");
  return `<!-- ── HTML embed ──────────────────────────────── -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.${effect}.min.js"></script>

<div id="hero-bg" style="width:100%;min-height:100vh;position:relative;"></div>

<script>
VANTA.${effect.toUpperCase()}({
  el: "#hero-bg",
${cfg}
})
</script>

/* ── React / Next.js ─────────────────────────────
   npm install three vanta
   ─────────────────────────────────────────────── */
"use client";
import { useEffect, useRef } from "react";

export default function ${displayName}Background({ children }) {
  const ref = useRef(null);
  const fx  = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      const THREE  = await import("three");
      const VANTA  = await import("vanta/dist/vanta.${effect}.min");
      if (cancelled || !ref.current) return;
      fx.current = VANTA.default({ el: ref.current, THREE, ${Object.entries(config).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ")} });
    }
    boot();
    return () => { cancelled = true; fx.current?.destroy(); };
  }, []);

  return <div ref={ref} style={{ minHeight: "100vh" }}>{children}</div>;
}`;
}

export const vantaPatterns: VantaPatternEntry[] = [
  {
    id: "vanta-birds-vivid",
    name: "Vivid Birds",
    category: "effects",
    isPro: false,
    tags: ["birds", "3d", "webgl", "animated", "colorful", "flocking"],
    type: "vanta",
    vantaEffect: "birds",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x0d1020, backgroundAlpha: 1,
      color1: 0xff2d78, color2: 0xffc300,
      colorMode: "lerpGradient", quantity: 5,
      birdSize: 1.6, wingSpan: 28, speedLimit: 5,
      separation: 22, alignment: 18, cohesion: 20,
    },
    thumbnailCss: {
      background: "radial-gradient(ellipse at 40% 55%, rgba(255,45,120,0.75) 0%, rgba(255,195,0,0.45) 45%, #0d1020 80%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("VividBirds", "birds", { backgroundColor: 0x0d1020, color1: 0xff2d78, color2: 0xffc300, colorMode: "lerpGradient", quantity: 5, birdSize: 1.6, wingSpan: 28, speedLimit: 5 }),
  },

  {
    id: "vanta-birds",
    name: "Birds",
    category: "effects",
    isPro: false,
    tags: ["birds", "3d", "webgl", "animated", "flocking"],
    type: "vanta",
    vantaEffect: "birds",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x080814, backgroundAlpha: 1,
      color1: 0x7c3aed, color2: 0x6366f1,
      colorMode: "varianceGradient", quantity: 4,
      birdSize: 1.2, wingSpan: 30, speedLimit: 4,
      separation: 20, alignment: 20, cohesion: 20,
    },
    thumbnailCss: {
      background: "radial-gradient(ellipse at 35% 65%, rgba(124,58,237,0.85) 0%, rgba(99,102,241,0.55) 35%, #080814 72%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Birds", "birds", { backgroundColor: 0x080814, color1: 0x7c3aed, color2: 0x6366f1, colorMode: "varianceGradient", quantity: 4, birdSize: 1.2, wingSpan: 30, speedLimit: 4 }),
  },

  {
    id: "vanta-fog",
    name: "Fog",
    category: "effects",
    isPro: false,
    tags: ["fog", "3d", "webgl", "animated", "atmospheric"],
    type: "vanta",
    vantaEffect: "fog",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      highlightColor: 0xff6030, midtoneColor: 0x443a4a,
      lowlightColor: 0x110e1a, baseColor: 0x19161d,
      blurFactor: 0.6, speed: 1.5, zoom: 1.0,
    },
    thumbnailCss: {
      background: "radial-gradient(ellipse at 40% 50%, rgba(255,96,48,0.7) 0%, rgba(68,58,74,0.6) 40%, #110e1a 80%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Fog", "fog", { highlightColor: 0xff6030, midtoneColor: 0x443a4a, lowlightColor: 0x110e1a, baseColor: 0x19161d, blurFactor: 0.6, speed: 1.5 }),
  },

  {
    id: "vanta-waves",
    name: "Waves",
    category: "effects",
    isPro: false,
    tags: ["waves", "ocean", "3d", "webgl", "animated"],
    type: "vanta",
    vantaEffect: "waves",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      color: 0x005588, shininess: 40, waveHeight: 15,
      waveSpeed: 1.0, zoom: 1.0,
    },
    thumbnailCss: {
      background: "linear-gradient(160deg, #003b5c 0%, #005588 40%, #0077aa 80%, #0099cc 100%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Waves", "waves", { color: 0x005588, shininess: 40, waveHeight: 15, waveSpeed: 1.0 }),
  },

  {
    id: "vanta-clouds",
    name: "Clouds",
    category: "effects",
    isPro: false,
    tags: ["clouds", "sky", "3d", "webgl", "animated"],
    type: "vanta",
    vantaEffect: "clouds",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      skyColor: 0x68b8d7, cloudColor: 0xadc1de,
      cloudShadowColor: 0x183550, sunColor: 0xff9919,
      sunGlareColor: 0xff6633, sunlightX: 0.75, sunlightY: -0.25,
      speed: 1.0,
    },
    thumbnailCss: {
      background: "linear-gradient(180deg, #68b8d7 0%, #adc1de 50%, #d4e5f0 100%)",
    },
    textContrast: "dark",
    toCode: () => reactSnippet("Clouds", "clouds", { skyColor: 0x68b8d7, cloudColor: 0xadc1de, cloudShadowColor: 0x183550, sunColor: 0xff9919, sunGlareColor: 0xff6633, speed: 1.0 }),
  },

  {
    id: "vanta-clouds2",
    name: "Clouds 2",
    category: "effects",
    isPro: false,
    tags: ["clouds", "sky", "purple", "3d", "webgl", "animated"],
    type: "vanta",
    vantaEffect: "clouds2",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x7000ff, speed: 1.0, size: 1.5,
    },
    thumbnailCss: {
      background: "linear-gradient(160deg, #5500cc 0%, #7000ff 40%, #9933ff 100%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Clouds2", "clouds2", { backgroundColor: 0x7000ff, speed: 1.0, size: 1.5 }),
  },

  {
    id: "vanta-globe",
    name: "Globe",
    category: "effects",
    isPro: false,
    tags: ["globe", "3d", "webgl", "animated", "sphere"],
    type: "vanta",
    vantaEffect: "globe",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x0a0a14, color: 0x3399ff, color2: 0x0055aa,
      size: 1.0,
    },
    thumbnailCss: {
      background: "radial-gradient(circle at 50% 50%, rgba(51,153,255,0.4) 0%, rgba(0,85,170,0.3) 35%, #0a0a14 70%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Globe", "globe", { backgroundColor: 0x0a0a14, color: 0x3399ff, color2: 0x0055aa, size: 1.0 }),
  },

  {
    id: "vanta-net",
    name: "Net",
    category: "effects",
    isPro: false,
    tags: ["net", "network", "3d", "webgl", "animated", "nodes"],
    type: "vanta",
    vantaEffect: "net",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x0a0a14, color: 0x9b59b6,
      points: 10, maxDistance: 20, spacing: 17,
    },
    thumbnailCss: {
      background: "radial-gradient(ellipse at 50% 50%, rgba(155,89,182,0.3) 0%, rgba(100,50,140,0.2) 50%, #0a0a14 80%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Net", "net", { backgroundColor: 0x0a0a14, color: 0x9b59b6, points: 10, maxDistance: 20, spacing: 17 }),
  },

  {
    id: "vanta-cells",
    name: "Cells",
    category: "effects",
    isPro: false,
    tags: ["cells", "organic", "3d", "webgl", "animated"],
    type: "vanta",
    vantaEffect: "cells",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x0a0a14, color1: 0x7c3aed, color2: 0x10b981,
      size: 2.5, speed: 1.0,
    },
    thumbnailCss: {
      background: "radial-gradient(ellipse at 30% 70%, rgba(124,58,237,0.5) 0%, rgba(16,185,129,0.3) 50%, #0a0a14 80%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Cells", "cells", { backgroundColor: 0x0a0a14, color1: 0x7c3aed, color2: 0x10b981, size: 2.5, speed: 1.0 }),
  },

  {
    id: "vanta-trunk",
    name: "Trunk",
    category: "effects",
    isPro: false,
    tags: ["trunk", "tree", "lines", "2d", "webgl", "animated"],
    type: "vanta",
    vantaEffect: "trunk",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x1a0a2e, color: 0xff44aa,
    },
    thumbnailCss: {
      background: "radial-gradient(ellipse at 20% 80%, rgba(255,68,170,0.4) 0%, rgba(100,20,120,0.3) 40%, #1a0a2e 80%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Trunk", "trunk", { backgroundColor: 0x1a0a2e, color: 0xff44aa }),
  },

  {
    id: "vanta-topology",
    name: "Topology",
    category: "effects",
    isPro: false,
    tags: ["topology", "terrain", "2d", "webgl", "animated"],
    type: "vanta",
    vantaEffect: "topology",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x0d0d0d, color: 0x00cc88,
    },
    thumbnailCss: {
      background: "radial-gradient(ellipse at 50% 100%, rgba(0,204,136,0.35) 0%, rgba(0,120,80,0.2) 40%, #0d0d0d 75%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Topology", "topology", { backgroundColor: 0x0d0d0d, color: 0x00cc88 }),
  },

  {
    id: "vanta-dots",
    name: "Dots",
    category: "effects",
    isPro: false,
    tags: ["dots", "particles", "3d", "webgl", "animated"],
    type: "vanta",
    vantaEffect: "dots",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x07070e, color: 0xff7700, color2: 0x7c3aed,
      showLines: true,
    },
    thumbnailCss: {
      background: "radial-gradient(ellipse at 50% 50%, rgba(255,119,0,0.3) 0%, rgba(124,58,237,0.2) 50%, #07070e 80%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Dots", "dots", { backgroundColor: 0x07070e, color: 0xff7700, color2: 0x7c3aed, showLines: true }),
  },

  {
    id: "vanta-rings",
    name: "Rings",
    category: "effects",
    isPro: false,
    tags: ["rings", "circles", "3d", "webgl", "animated"],
    type: "vanta",
    vantaEffect: "rings",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x000022, color: 0x7c3aed, backgroundAlpha: 1.0,
    },
    thumbnailCss: {
      background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.5) 0%, rgba(80,30,160,0.3) 40%, #000022 75%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Rings", "rings", { backgroundColor: 0x000022, color: 0x7c3aed }),
  },

  {
    id: "vanta-halo",
    name: "Halo",
    category: "effects",
    isPro: false,
    tags: ["halo", "glow", "3d", "webgl", "animated"],
    type: "vanta",
    vantaEffect: "halo",
    vantaConfig: {
      mouseControls: true, touchControls: true, gyroControls: false,
      minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0,
      backgroundColor: 0x0a0a14, baseColor: 0x7c3aed,
      size: 2.5, amplitudeFactor: 0.5, xOffset: 0, yOffset: 0,
    },
    thumbnailCss: {
      background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.6) 0%, rgba(80,30,160,0.4) 30%, #0a0a14 65%)",
    },
    textContrast: "light",
    toCode: () => reactSnippet("Halo", "halo", { backgroundColor: 0x0a0a14, baseColor: 0x7c3aed, size: 2.5, amplitudeFactor: 0.5 }),
  },
];

export function getVantaPatternById(id: string): VantaPatternEntry | undefined {
  return vantaPatterns.find((p) => p.id === id);
}
