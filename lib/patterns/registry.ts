import type { PatternEntry, PatternConfig } from "./types";

// ─── Helper: hex to rgba ────────────────────────────────────────────────────

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

// ─── Gradient Patterns (12) ─────────────────────────────────────────────────

function gradientPattern(
  id: string, name: string, tags: string[],
  bgFn: (c: PatternConfig) => string,
): PatternEntry {
  return {
    id, name, category: "gradient", isPro: false, tags,
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

const gradientPatterns: PatternEntry[] = [
  gradientPattern("gradient-linear-down", "Linear — Down", ["linear", "vertical"],
    (c) => `linear-gradient(180deg, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c2, c.opacity)})`),

  gradientPattern("gradient-linear-right", "Linear — Right", ["linear", "horizontal"],
    (c) => `linear-gradient(90deg, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c2, c.opacity)})`),

  gradientPattern("gradient-diagonal", "Diagonal", ["diagonal", "angled"],
    (c) => `linear-gradient(135deg, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c2, c.opacity)})`),

  gradientPattern("gradient-radial-center", "Radial — Center", ["radial", "center"],
    (c) => `radial-gradient(circle at center, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c2, c.opacity)})`),

  gradientPattern("gradient-radial-corner", "Radial — Corner", ["radial", "corner"],
    (c) => `radial-gradient(circle at top left, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c2, c.opacity)})`),

  gradientPattern("gradient-conic", "Conic", ["conic", "spiral"],
    (c) => `conic-gradient(from 0deg, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c2, c.opacity)}, ${hexToRgba(c.c1, c.opacity)})`),

  gradientPattern("gradient-sunset", "Sunset", ["sunset", "warm", "orange"],
    (c) => `linear-gradient(135deg, ${hexToRgba(c.c1, c.opacity)} 0%, ${hexToRgba(c.c2, c.opacity)} 50%, ${hexToRgba(c.c1, c.opacity)} 100%)`),

  gradientPattern("gradient-aurora", "Aurora", ["aurora", "northern-lights"],
    (c) => `linear-gradient(160deg, ${hexToRgba(c.c1, c.opacity)} 0%, ${hexToRgba(c.c2, c.opacity)} 40%, ${hexToRgba(c.c1, c.opacity)} 70%, ${hexToRgba(c.c2, c.opacity)} 100%)`),

  gradientPattern("gradient-mesh", "Mesh Blend", ["mesh", "organic"],
    (c) => `radial-gradient(at 20% 30%, ${hexToRgba(c.c1, c.opacity)} 0%, transparent 50%), radial-gradient(at 80% 70%, ${hexToRgba(c.c2, c.opacity)} 0%, transparent 50%)`),

  gradientPattern("gradient-spotlight", "Spotlight", ["spotlight", "focus"],
    (c) => `radial-gradient(ellipse at center, ${hexToRgba(c.c1, c.opacity)} 0%, ${hexToRgba(c.c2, c.opacity)} 70%)`),

  gradientPattern("gradient-stripe", "Striped", ["stripe", "lines"],
    (c) => `repeating-linear-gradient(45deg, ${hexToRgba(c.c1, c.opacity)}, ${hexToRgba(c.c1, c.opacity)} ${c.scale / 10}px, ${hexToRgba(c.c2, c.opacity)} ${c.scale / 10}px, ${hexToRgba(c.c2, c.opacity)} ${c.scale / 5}px)`),

  gradientPattern("gradient-wave", "Wave", ["wave", "flowing"],
    (c) => `linear-gradient(180deg, ${hexToRgba(c.c1, c.opacity)} 0%, ${hexToRgba(c.c2, c.opacity)} 30%, ${hexToRgba(c.c1, c.opacity)} 60%, ${hexToRgba(c.c2, c.opacity)} 100%)`),
];

// ─── Dot Patterns (8) ───────────────────────────────────────────────────────

function dotPattern(
  id: string, name: string, tags: string[],
  bgFn: (c: PatternConfig) => string,
  sizeFn: (c: PatternConfig) => string,
): PatternEntry {
  return {
    id, name, category: "dots", isPro: false, tags,
    defaults: { c1: "#6366f1", c2: "#a855f7", baseColor: "#ffffff", scale: 40, opacity: 60, blendMode: "normal" },
    render: (config) => ({
      backgroundImage: bgFn(config),
      backgroundSize: sizeFn(config),
      backgroundColor: config.baseColor,
      opacity: config.opacity / 100,
      mixBlendMode: config.blendMode as React.CSSProperties["mixBlendMode"],
    }),
    toCss: (config) =>
      `background-image: ${bgFn(config)};\nbackground-size: ${sizeFn(config)};\nbackground-color: ${config.baseColor};\nopacity: ${config.opacity / 100};\nmix-blend-mode: ${config.blendMode};`,
  };
}

const dotPatterns: PatternEntry[] = [
  dotPattern("dots-small", "Dots — Small", ["dots", "small", "polka"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px)`,
    (c) => `${c.scale / 4}px ${c.scale / 4}px`),

  dotPattern("dots-medium", "Dots — Medium", ["dots", "medium"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1.5px, transparent 1.5px)`,
    (c) => `${c.scale / 2.5}px ${c.scale / 2.5}px`),

  dotPattern("dots-large", "Dots — Large", ["dots", "large"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 2.5px, transparent 2.5px)`,
    (c) => `${c.scale / 2}px ${c.scale / 2}px`),

  dotPattern("dots-grid", "Dot Grid", ["dots", "grid", "matrix"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px), radial-gradient(${hexToRgba(c.c2, c.opacity)} 1px, transparent 1px)`,
    (c) => `${c.scale / 3}px ${c.scale / 3}px`),

  dotPattern("dots-diagonal", "Dots — Diagonal", ["dots", "diagonal"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px)`,
    (c) => {
      const s = c.scale / 3;
      return `${s}px ${s}px`;
    }),

  dotPattern("dots-stagger", "Dots — Staggered", ["dots", "stagger", "offset"],
    (c) => {
      const s = c.scale / 3;
      return `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px), radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px)`;
    },
    (c) => `${c.scale / 3}px ${c.scale / 3}px`),

  dotPattern("dots-gradient", "Gradient Dots", ["dots", "gradient", "fade"],
    (c) => `radial-gradient(${hexToRgba(c.c1, c.opacity)} 1px, transparent 1px), linear-gradient(180deg, ${hexToRgba(c.c2, c.opacity * 0.3)} 0%, transparent 100%)`,
    (c) => `${c.scale / 3}px ${c.scale / 3}px`),

  dotPattern("dots-crosshatch", "Crosshatch Dots", ["dots", "crosshatch", "cross"],
    (c) => {
      const dot = hexToRgba(c.c1, c.opacity);
      return `radial-gradient(${dot} 1px, transparent 1px), radial-gradient(${dot} 1px, transparent 1px)`;
    },
    (c) => `${c.scale / 4}px ${c.scale / 4}px`),
];

// ─── Full Registry ──────────────────────────────────────────────────────────

export const patterns: PatternEntry[] = [...gradientPatterns, ...dotPatterns];

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
