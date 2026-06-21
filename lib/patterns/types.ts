// ─── Pattern Types & Config Schema ──────────────────────────────────────────

export type PatternCategory = "animated" | "gradient" | "geometric" | "effects" | "decorative";

export interface PatternConfig {
  c1: string;        // primary color (hex)
  c2: string;        // secondary color (hex)
  baseColor: string;  // background base color (hex)
  scale: number;      // size/frequency (10–200)
  opacity: number;    // pattern opacity (0–100)
  blendMode: BlendMode;
}

export type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "soft-light";

export const BLEND_MODES: BlendMode[] = ["normal", "multiply", "screen", "overlay", "soft-light"];

export const SAFE_BLEND_MODES: BlendMode[] = ["normal", "multiply", "screen"];

export interface PatternEntry {
  id: string;
  name: string;
  category: PatternCategory;
  isPro: boolean;
  tags: string[];
  defaults: PatternConfig;
  /** Whether this pattern needs light or dark text placed over it */
  textContrast: "light" | "dark";
  render: (config: PatternConfig) => React.CSSProperties;
  toCss: (config: PatternConfig) => string;
}

/** Validate a PatternConfig object */
export function validatePatternConfig(config: unknown): PatternConfig | null {
  if (!config || typeof config !== "object") return null;
  const c = config as Record<string, unknown>;

  const hexRe = /^#[0-9a-fA-F]{6}$/;

  if (typeof c.c1 !== "string" || !hexRe.test(c.c1)) return null;
  if (typeof c.c2 !== "string" || !hexRe.test(c.c2)) return null;
  if (typeof c.baseColor !== "string" || !hexRe.test(c.baseColor)) return null;
  if (typeof c.scale !== "number" || c.scale < 10 || c.scale > 200) return null;
  if (typeof c.opacity !== "number" || c.opacity < 0 || c.opacity > 100) return null;
  if (typeof c.blendMode !== "string" || !BLEND_MODES.includes(c.blendMode as BlendMode)) return null;

  return {
    c1: c.c1,
    c2: c.c2,
    baseColor: c.baseColor,
    scale: Math.round(c.scale),
    opacity: Math.round(c.opacity),
    blendMode: c.blendMode as BlendMode,
  };
}

export const DEFAULT_PATTERN_CONFIG: PatternConfig = {
  c1: "#7c3aed",
  c2: "#06b6d4",
  baseColor: "#ffffff",
  scale: 100,
  opacity: 100,
  blendMode: "normal",
};
