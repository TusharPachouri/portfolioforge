// ─── WebGL pattern types ──────────────────────────────────────────────────────

export type VantaEffectName =
  | "birds" | "fog" | "waves" | "clouds" | "clouds2"
  | "globe" | "net" | "cells" | "trunk" | "topology"
  | "dots" | "rings" | "halo";

export interface VantaPatternEntry {
  id: string;
  name: string;
  category: "effects";
  isPro: boolean;
  tags: string[];
  type: "vanta";
  vantaEffect: VantaEffectName;
  vantaConfig: Record<string, unknown>;
  thumbnailCss: React.CSSProperties;
  textContrast: "light" | "dark";
  toCode: () => string;
}
