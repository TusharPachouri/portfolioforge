// ─── Random Theme Generator ──────────────────────────────────────────────────
// Builds a random-but-coherent portfolio: a sensibly ordered component layout
// and a color-harmonized pattern config matched to the chosen theme's
// light/dark background. Pure functions, safe on the client.

import { registry, ComponentEntry, SectionSubcategory } from "@/lib/components/registry";
import { patterns } from "@/lib/patterns/registry";
import { themes } from "@/lib/themes";
import { canUseComponent, canUseTheme, canUsePattern, isPro, FREE_COMPONENT_LIMIT } from "@/lib/gate";
import type { PatternConfig } from "@/lib/patterns/types";

/** Canonical top-to-bottom portfolio order — keeps random layouts feeling designed */
const SECTION_ORDER: SectionSubcategory[] = [
  "Hero", "About", "Stats", "Skills", "Projects", "Experience",
  "Education", "Testimonials", "Gallery", "Contact", "Footer",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function isDarkHex(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Relative luminance approximation
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 110;
}

// ─── Layout ──────────────────────────────────────────────────────────────────

/**
 * Picks a random portfolio layout: Hero and Footer anchor the page, a shuffled
 * handful of middle sections fill it, one component per subcategory (mirroring
 * the builder's own rule), everything within the user's tier and limit.
 */
export function generateRandomLayout(userRole: string): string[] {
  const sections = registry.filter(
    (c) => c.category === "section" && canUseComponent(c, userRole)
  );

  const bySub = new Map<SectionSubcategory, ComponentEntry[]>();
  for (const entry of sections) {
    const sub = entry.subcategory as SectionSubcategory;
    bySub.set(sub, [...(bySub.get(sub) ?? []), entry]);
  }

  const anchors = (["Hero", "Footer"] as SectionSubcategory[]).filter((s) => bySub.has(s));
  const middle = SECTION_ORDER.filter(
    (s) => s !== "Hero" && s !== "Footer" && bySub.has(s)
  );

  const maxTotal = isPro(userRole) ? 9 : FREE_COMPONENT_LIMIT;
  const middleCount = Math.min(middle.length, randInt(4, Math.max(4, maxTotal - anchors.length)));
  const chosen = new Set<SectionSubcategory>([...anchors, ...shuffle(middle).slice(0, middleCount)]);

  return SECTION_ORDER.filter((s) => chosen.has(s)).map((s) => pick(bySub.get(s)!).id);
}

// ─── Color scheme ────────────────────────────────────────────────────────────

/** Hue offsets that produce pleasant two-color pairings */
const HARMONIES = [30, -30, 60, 120, 180];

export interface RandomStyle {
  themeId: string;
  themeName: string;
  patternId: string;
  patternName: string;
  patternConfig: PatternConfig;
}

/**
 * Generates a random theme + pattern + harmonized color scheme:
 * a random base hue with a color-theory offset for the second color,
 * a base tint matched to the theme's light/dark background, and a
 * deliberately subtle opacity so portfolio text always stays readable.
 */
export function generateRandomStyle(userRole: string): RandomStyle {
  const theme = pick(themes.filter((t) => canUseTheme(t, userRole)));
  const pattern = pick(patterns.filter((p) => canUsePattern(p, userRole)));

  const hue = randInt(0, 359);
  const hue2 = (hue + pick(HARMONIES) + 360) % 360;
  const darkTheme = isDarkHex(theme.tokens["--pf-bg"] ?? "#ffffff");

  const config: PatternConfig = {
    c1: hslToHex(hue, randInt(65, 85), darkTheme ? randInt(45, 55) : randInt(48, 58)),
    c2: hslToHex(hue2, randInt(60, 80), darkTheme ? randInt(40, 50) : randInt(55, 65)),
    // Base stays near the theme background so foreground contrast is preserved
    baseColor: darkTheme ? hslToHex(hue, 30, 7) : hslToHex(hue, 45, 97),
    scale: randInt(60, 140),
    // Pattern alpha is applied twice in render(), so this lands subtle (~0.1–0.2 effective)
    opacity: randInt(30, 45),
    blendMode: "normal",
  };

  return {
    themeId: theme.id,
    themeName: theme.name,
    patternId: pattern.id,
    patternName: pattern.name,
    patternConfig: config,
  };
}
