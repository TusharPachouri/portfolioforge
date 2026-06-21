import type { PatternEntry, PatternConfig, PatternCategory } from "./types";

// ─── Helper: hex to rgba ────────────────────────────────────────────────────

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

/** Round to 2 decimals so generated CSS stays copy-paste friendly */
function px(n: number): string {
  return `${Math.round(n * 100) / 100}px`;
}

// ─── Factory: gradient-based pattern ───────────────────────────────────────

function gradientPattern(
  id: string, name: string, category: PatternCategory, tags: string[],
  bgFn: (c: PatternConfig) => string,
  textContrast: "light" | "dark" = "light",
): PatternEntry {
  return {
    id, name, category, isPro: false, tags, textContrast,
    defaults: { c1: "#7c3aed", c2: "#06b6d4", baseColor: "#ffffff", scale: 100, opacity: 100, blendMode: "normal" },
    render: (config) => ({
      background: bgFn(config),
      opacity: config.opacity / 100,
      mixBlendMode: config.blendMode as React.CSSProperties["mixBlendMode"],
    }),
    toCss: (config) =>
      `background: ${bgFn(config)};\nopacity: ${config.opacity / 100};\nmix-blend-mode: ${config.blendMode};`,
  };
}

// ─── Factory: dot/tile pattern ──────────────────────────────────────────────

function dotPattern(
  id: string, name: string, category: PatternCategory, tags: string[],
  bgFn: (c: PatternConfig) => string,
  sizeFn: (c: PatternConfig) => string,
  posFn?: (c: PatternConfig) => string,
): PatternEntry {
  return {
    id, name, category, isPro: false, tags,
    textContrast: "dark", // dot patterns have white/light base
    defaults: { c1: "#6366f1", c2: "#a855f7", baseColor: "#ffffff", scale: 40, opacity: 60, blendMode: "normal" },
    render: (config) => ({
      backgroundImage: bgFn(config),
      backgroundSize: sizeFn(config),
      ...(posFn ? { backgroundPosition: posFn(config) } : {}),
      backgroundColor: config.baseColor,
      opacity: config.opacity / 100,
      mixBlendMode: config.blendMode as React.CSSProperties["mixBlendMode"],
    }),
    toCss: (config) =>
      `background-image: ${bgFn(config)};\nbackground-size: ${sizeFn(config)};\n` +
      (posFn ? `background-position: ${posFn(config)};\n` : "") +
      `background-color: ${config.baseColor};\nopacity: ${config.opacity / 100};\nmix-blend-mode: ${config.blendMode};`,
  };
}

// ─── Factory: animated background ───────────────────────────────────────────
// Premium MOVING backgrounds (flowing gradients, vortex, drifting blobs). The
// styleFn returns the background-related CSS props plus an `animation` that
// references a keyframe defined in globals.css (pf-bg-*). Dark base by default.

function styleToCss(props: React.CSSProperties): string {
  return Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: ${v};`)
    .join("\n");
}

function animPattern(
  id: string, name: string, tags: string[],
  styleFn: (c: PatternConfig) => React.CSSProperties,
): PatternEntry {
  return {
    id, name, category: "animated", isPro: false, tags,
    textContrast: "light", // animated patterns use a dark base (#0a0a14)
    defaults: { c1: "#7c3aed", c2: "#22d3ee", baseColor: "#0a0a14", scale: 100, opacity: 100, blendMode: "normal" },
    render: (config) => ({
      ...styleFn(config),
      opacity: config.opacity / 100,
      mixBlendMode: config.blendMode as React.CSSProperties["mixBlendMode"],
    }),
    toCss: (config) =>
      styleToCss({
        ...styleFn(config),
        opacity: config.opacity / 100,
        mixBlendMode: config.blendMode as React.CSSProperties["mixBlendMode"],
      }) + "\n\n/* Animations use @keyframes (pf-bg-pan / pf-bg-float / pf-bg-spin / pf-bg-hue)\n   and @property --pf-bg-angle from the global stylesheet. */",
  };
}

// ─── Full Registry ──────────────────────────────────────────────────────────

export const patterns: PatternEntry[] = [

  // ── Animated backgrounds (5) — premium moving gradients, featured first ─────

  // Aurora Flow — two colors drift diagonally, forever
  animPattern("anim-aurora", "Aurora Flow", ["animated", "gradient", "aurora", "flowing", "premium", "moving"],
    (c) => ({
      background: `linear-gradient(125deg, ${c.c1}, ${c.c2}, ${c.c1}, ${c.c2})`,
      backgroundSize: "300% 300%",
      animation: "pf-bg-pan 16s ease infinite",
    })),

  // Vortex — a conic gradient slowly twirls
  animPattern("anim-vortex", "Vortex", ["animated", "vortex", "twirl", "conic", "spin", "moving"],
    (c) => ({
      background: `conic-gradient(from var(--pf-bg-angle, 0deg) at 50% 50%, ${c.c1}, ${c.c2}, ${c.c1}, ${c.c2}, ${c.c1})`,
      animation: "pf-bg-spin 24s linear infinite",
    })),

  // Liquid Mesh — soft blobs float and morph across the canvas
  animPattern("anim-liquid", "Liquid Mesh", ["animated", "mesh", "blobs", "liquid", "floating", "moving"],
    (c) => ({
      backgroundColor: c.baseColor,
      backgroundImage:
        `radial-gradient(42% 42% at 25% 30%, ${c.c1} 0%, transparent 60%), ` +
        `radial-gradient(46% 46% at 78% 68%, ${c.c2} 0%, transparent 60%), ` +
        `radial-gradient(38% 38% at 55% 52%, ${c.c1}aa 0%, transparent 60%)`,
      backgroundSize: "200% 200%",
      animation: "pf-bg-float 20s ease-in-out infinite",
    })),

  // Spectrum Shift — a gradient that continuously cycles its hue
  animPattern("anim-spectrum", "Spectrum Shift", ["animated", "spectrum", "hue", "rainbow", "color", "moving"],
    (c) => ({
      background: `linear-gradient(135deg, ${c.c1}, ${c.c2})`,
      animation: "pf-bg-hue 14s linear infinite",
    })),

  // Nebula — deep layered glow with a slow drift
  animPattern("anim-nebula", "Nebula", ["animated", "nebula", "space", "glow", "depth", "moving"],
    (c) => ({
      backgroundColor: c.baseColor,
      backgroundImage:
        `radial-gradient(60% 55% at 20% 25%, ${c.c1}cc 0%, transparent 55%), ` +
        `radial-gradient(55% 60% at 82% 75%, ${c.c2}cc 0%, transparent 55%), ` +
        `radial-gradient(70% 60% at 60% 40%, ${c.c1}77 0%, transparent 60%)`,
      backgroundSize: "200% 200%",
      animation: "pf-bg-float 26s ease-in-out infinite",
    })),

  // ── Gradients ────────────────────────────────────────────────────────────────
  gradientPattern("gradient-radial-center", "Radial — Center", "gradient", ["radial", "center"],
    (c) => `radial-gradient(circle at center, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c2, c.opacity)})`),

  gradientPattern("gradient-radial-corner", "Radial — Corner", "gradient", ["radial", "corner"],
    (c) => `radial-gradient(circle at top left, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c2, c.opacity)})`),

  gradientPattern("gradient-sunset", "Sunset", "gradient", ["sunset", "warm", "orange"],
    (c) => `linear-gradient(135deg, ${hexToRgba(c.c1, c.opacity)} 0%, ${hexToRgba(c.c2, c.opacity)} 50%, ${hexToRgba(c.c1, c.opacity)} 100%)`),

  // ── Effects (4) ────────────────────────────────────────────────────────────
  gradientPattern("gradient-aurora", "Aurora", "effects", ["aurora", "northern-lights"],
    (c) => `linear-gradient(160deg, ${hexToRgba(c.c1, c.opacity)} 0%, ${hexToRgba(c.c2, c.opacity)} 40%, ${hexToRgba(c.c1, c.opacity)} 70%, ${hexToRgba(c.c2, c.opacity)} 100%)`),

  gradientPattern("gradient-mesh", "Mesh Blend", "effects", ["mesh", "organic", "blur"],
    (c) => `radial-gradient(at 20% 30%, ${hexToRgba(c.c1, c.opacity)} 0%, transparent 50%), radial-gradient(at 80% 70%, ${hexToRgba(c.c2, c.opacity)} 0%, transparent 50%)`),

  gradientPattern("gradient-spotlight", "Spotlight", "effects", ["spotlight", "focus", "glow"],
    (c) => `radial-gradient(ellipse at center, ${hexToRgba(c.c1, c.opacity)} 0%, ${hexToRgba(c.c2, c.opacity)} 70%)`),

  dotPattern("dots-gradient", "Gradient Dots", "effects", ["dots", "gradient", "fade"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px), linear-gradient(180deg, ${hexToRgba(c.c2, c.opacity * 0.3)} 0%, transparent 100%)`,
    (c) => `${px(c.scale / 3)} ${px(c.scale / 3)}`),

  // ── Decorative (3) ─────────────────────────────────────────────────────────
  gradientPattern("gradient-conic", "Conic", "decorative", ["conic", "spiral", "swirl"],
    (c) => `conic-gradient(from 0deg, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c2, c.opacity)}, ${hexToRgba(c.c1, c.opacity)})`),

  gradientPattern("gradient-stripe", "Striped", "decorative", ["stripe", "lines", "pattern"],
    (c) => `repeating-linear-gradient(45deg, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c1, c.opacity)} ${px(c.scale / 10)}, ${hexToRgba(c.c2, c.opacity)} ${px(c.scale / 10)}, ${hexToRgba(c.c2, c.opacity)} ${px(c.scale / 5)})`),

  gradientPattern("gradient-wave", "Wave", "decorative", ["wave", "flowing", "ripple"],
    (c) => `linear-gradient(180deg, ${hexToRgba(c.c1, c.opacity)} 0%, ${hexToRgba(c.c2, c.opacity)} 30%, ${hexToRgba(c.c1, c.opacity)} 60%, ${hexToRgba(c.c2, c.opacity)} 100%)`),

  // ── Geometric (7) ──────────────────────────────────────────────────────────
  dotPattern("dots-small", "Dots — Small", "geometric", ["dots", "small", "polka"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px)`,
    (c) => `${px(c.scale / 4)} ${px(c.scale / 4)}`),

  dotPattern("dots-medium", "Dots — Medium", "geometric", ["dots", "medium"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1.5px, transparent 1.5px)`,
    (c) => `${px(c.scale / 2.5)} ${px(c.scale / 2.5)}`),

  dotPattern("dots-large", "Dots — Large", "geometric", ["dots", "large"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 2.5px, transparent 2.5px)`,
    (c) => `${px(c.scale / 2)} ${px(c.scale / 2)}`),

  // Two-tone grid: second (c2) layer offset by half a cell so both colors show
  dotPattern("dots-grid", "Dot Grid", "geometric", ["dots", "grid", "matrix"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px), radial-gradient(${hexToRgba(c.c2, c.opacity)} 1px, transparent 1px)`,
    (c) => `${px(c.scale / 3)} ${px(c.scale / 3)}`,
    (c) => `0 0, ${px(c.scale / 6)} ${px(c.scale / 6)}`),

  // Rectangular cells + quarter offset produce slanted rows of dots
  dotPattern("dots-diagonal", "Dots — Diagonal", "geometric", ["dots", "diagonal", "offset"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px), radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px)`,
    (c) => `${px(c.scale / 2)} ${px(c.scale / 4)}`,
    (c) => `0 0, ${px(c.scale / 4)} ${px(c.scale / 8)}`),

  // Classic staggered polka: second layer offset by half a cell
  dotPattern("dots-stagger", "Dots — Staggered", "geometric", ["dots", "stagger", "alternating"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px), radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px)`,
    (c) => `${px(c.scale / 3)} ${px(c.scale / 3)}`,
    (c) => `0 0, ${px(c.scale / 6)} ${px(c.scale / 6)}`),

  // Dense half-offset weave using both colors
  dotPattern("dots-crosshatch", "Crosshatch", "geometric", ["dots", "crosshatch", "cross", "grid"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px), radial-gradient(${hexToRgba(c.c2, c.opacity)} 1px, transparent 1px)`,
    (c) => `${px(c.scale / 4)} ${px(c.scale / 4)}`,
    (c) => `0 0, ${px(c.scale / 8)} ${px(c.scale / 8)}`),
];

// ─── Utilities ──────────────────────────────────────────────────────────────

export function getPatternById(id: string): PatternEntry | undefined {
  return patterns.find((p) => p.id === id);
}

export function getPatternsByCategory(category: PatternEntry["category"]): PatternEntry[] {
  return patterns.filter((p) => p.category === category);
}

export function searchPatterns(query: string): PatternEntry[] {
  const q = query.toLowerCase();
  return patterns.filter(
    (p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
  );
}
