// ─── Theme Registry ──────────────────────────────────────────────────────────
// Pure code, no DB table. Each theme defines CSS custom properties that
// components reference via var(--pf-*) tokens.

export interface ThemeEntry {
  id: string;
  name: string;
  description: string;
  isPro: boolean;
  fonts: { sans: string; display: string };
  tokens: Record<string, string>;
}

// ─── Minimalist ──────────────────────────────────────────────────────────────

const minimalist: ThemeEntry = {
  id: "minimalist",
  name: "Minimalist",
  description: "Clean and modern. White background with near-black text and subtle accents.",
  isPro: false,
  fonts: { sans: "Inter", display: "Inter" },
  tokens: {
    "--pf-bg": "#ffffff",
    "--pf-fg": "#18181b",
    "--pf-muted": "#71717a",
    "--pf-accent": "#7c3aed",
    "--pf-accent-fg": "#ffffff",
    "--pf-border": "#e4e4e7",
    "--pf-radius": "0.75rem",
    "--pf-card-bg": "#ffffff",
    "--pf-card-border": "#f4f4f5",
    "--pf-badge-bg": "#f4f4f5",
    "--pf-badge-fg": "#3f3f46",
    "--pf-badge-border": "#e4e4e7",
    "--pf-secondary-bg": "#fafafa",
    "--pf-secondary-border": "#f4f4f5",
    "--pf-link-hover-bg": "#f4f4f5",
    "--pf-primary-btn-bg": "#18181b",
    "--pf-primary-btn-fg": "#ffffff",
    "--pf-primary-btn-hover": "#3f3f46",
    "--pf-highlight": "#10b981",
  },
};

// ─── Dark Tech ───────────────────────────────────────────────────────────────

const darkTech: ThemeEntry = {
  id: "dark-tech",
  name: "Dark Tech",
  description: "Terminal-inspired dark mode with green accents and monospace typography.",
  isPro: false,
  fonts: { sans: "JetBrains Mono", display: "JetBrains Mono" },
  tokens: {
    "--pf-bg": "#0a0a0a",
    "--pf-fg": "#e4e4e7",
    "--pf-muted": "#a1a1aa",
    "--pf-accent": "#22c55e",
    "--pf-accent-fg": "#0a0a0a",
    "--pf-border": "#27272a",
    "--pf-radius": "0.375rem",
    "--pf-card-bg": "#111111",
    "--pf-card-border": "#1e1e1e",
    "--pf-badge-bg": "#1a1a1a",
    "--pf-badge-fg": "#a1a1aa",
    "--pf-badge-border": "#27272a",
    "--pf-secondary-bg": "#111111",
    "--pf-secondary-border": "#1e1e1e",
    "--pf-link-hover-bg": "#1a1a1a",
    "--pf-primary-btn-bg": "#22c55e",
    "--pf-primary-btn-fg": "#0a0a0a",
    "--pf-primary-btn-hover": "#16a34a",
    "--pf-highlight": "#22c55e",
  },
};

// ─── Glassmorphism ───────────────────────────────────────────────────────────

const glassmorphism: ThemeEntry = {
  id: "glassmorphism",
  name: "Glassmorphism",
  description: "Dark navy with purple neon accents, frosted glass cards and blur effects.",
  isPro: false,
  fonts: { sans: "Inter", display: "Inter" },
  tokens: {
    "--pf-bg": "#0f172a",
    "--pf-fg": "#e2e8f0",
    "--pf-muted": "#94a3b8",
    "--pf-accent": "#a855f7",
    "--pf-accent-fg": "#ffffff",
    "--pf-border": "rgba(148,163,184,0.15)",
    "--pf-radius": "1rem",
    "--pf-card-bg": "rgba(30,41,59,0.6)",
    "--pf-card-border": "rgba(148,163,184,0.1)",
    "--pf-badge-bg": "rgba(30,41,59,0.5)",
    "--pf-badge-fg": "#cbd5e1",
    "--pf-badge-border": "rgba(148,163,184,0.15)",
    "--pf-secondary-bg": "rgba(15,23,42,0.8)",
    "--pf-secondary-border": "rgba(148,163,184,0.1)",
    "--pf-link-hover-bg": "rgba(30,41,59,0.4)",
    "--pf-primary-btn-bg": "#a855f7",
    "--pf-primary-btn-fg": "#ffffff",
    "--pf-primary-btn-hover": "#9333ea",
    "--pf-highlight": "#a855f7",
  },
};

// ─── Registry ────────────────────────────────────────────────────────────────

export const themes: ThemeEntry[] = [minimalist, darkTech, glassmorphism];

export function getThemeById(id: string): ThemeEntry | undefined {
  return themes.find((t) => t.id === id);
}

export function getThemeTokenStyle(themeId: string): Record<string, string> {
  const theme = getThemeById(themeId);
  if (!theme) return minimalist.tokens;
  return theme.tokens;
}

/** Build a CSS string for a theme (used by Copy CSS, public page) */
export function getThemeCss(themeId: string): string {
  const tokens = getThemeTokenStyle(themeId);
  return Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join("\n");
}
