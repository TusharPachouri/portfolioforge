// ─── Vanta.js pattern types ──────────────────────────────────────────────────

export interface VantaPatternEntry {
  id: string;
  name: string;
  category: "effects";
  isPro: boolean;
  tags: string[];
  type: "vanta";
  /** Which vanta effect file to import */
  vantaEffect: "birds";
  /** Config object passed directly to VANTA.<EFFECT>() */
  vantaConfig: Record<string, unknown>;
  /** Static CSS fallback shown before the WebGL canvas loads */
  thumbnailCss: React.CSSProperties;
  /** Whether this pattern needs light or dark text placed over it (Vanta is always dark bg) */
  textContrast: "light" | "dark";
  /** Returns the embed snippet (HTML + React) */
  toCode: () => string;
}
