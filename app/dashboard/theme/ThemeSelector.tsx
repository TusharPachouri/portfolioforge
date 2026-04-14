"use client";

import { themes, ThemeEntry, getThemeTokenStyle } from "@/lib/themes";
import { saveTheme } from "@/lib/actions/portfolio";
import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";

interface Props {
  currentThemeId: string;
}

export default function ThemeSelector({ currentThemeId }: Props) {
  const [selected, setSelected] = useState(currentThemeId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (theme: ThemeEntry) => {
    setSelected(theme.id);
    startTransition(async () => {
      await saveTheme(theme.id);
    });
  };

  // Show hovered theme preview tokens
  const previewThemeId = hoveredId ?? selected;
  const previewTokens = getThemeTokenStyle(previewThemeId);

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900 mb-1">Theme</h2>
        <p className="text-sm text-zinc-500">Choose a visual style for your portfolio. Hover to preview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {themes.map((theme) => {
          const isSelected = selected === theme.id;
          const tokens = getThemeTokenStyle(theme.id);
          return (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme)}
              onMouseEnter={() => setHoveredId(theme.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`relative group text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-violet-500 shadow-md shadow-violet-100"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              {/* Color swatch preview */}
              <div className="flex gap-1.5 mb-3">
                <div className="h-8 w-8 rounded-lg" style={{ background: tokens["--pf-bg"], border: `1px solid ${tokens["--pf-border"]}` }} />
                <div className="h-8 w-8 rounded-lg" style={{ background: tokens["--pf-fg"] }} />
                <div className="h-8 w-8 rounded-lg" style={{ background: tokens["--pf-accent"] }} />
                <div className="h-8 w-8 rounded-lg" style={{ background: tokens["--pf-card-bg"], border: `1px solid ${tokens["--pf-card-border"]}` }} />
              </div>

              {/* Mini preview card */}
              <div className="rounded-lg p-3 mb-3" style={{
                background: tokens["--pf-bg"],
                border: `1px solid ${tokens["--pf-border"]}`,
              }}>
                <div className="h-2 w-16 rounded-full mb-2" style={{ background: tokens["--pf-fg"] }} />
                <div className="h-1.5 w-24 rounded-full mb-2" style={{ background: tokens["--pf-muted"], opacity: 0.5 }} />
                <div className="flex gap-1.5">
                  <div className="h-4 w-14 rounded" style={{ background: tokens["--pf-primary-btn-bg"] }} />
                  <div className="h-4 w-10 rounded" style={{ background: tokens["--pf-badge-bg"], border: `1px solid ${tokens["--pf-badge-border"]}` }} />
                </div>
              </div>

              <h3 className="font-semibold text-zinc-900 text-sm">{theme.name}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">{theme.description}</p>

              {isSelected && (
                <div className="absolute top-3 right-3 h-5 w-5 bg-violet-500 rounded-full flex items-center justify-center">
                  {isPending ? (
                    <Loader2 className="h-3 w-3 text-white animate-spin" />
                  ) : (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Live preview */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-900 mb-3">Live Preview</h3>
        <div
          className="rounded-2xl overflow-hidden shadow-lg"
          style={{ ...Object.fromEntries(Object.entries(previewTokens)), background: previewTokens["--pf-bg"] }}
        >
          <div className="p-8 text-center" style={{ color: previewTokens["--pf-fg"] }}>
            <div className="h-12 w-12 rounded-full mx-auto mb-4" style={{ background: previewTokens["--pf-accent"] }} />
            <h4 className="text-lg font-bold mb-1" style={{ color: previewTokens["--pf-fg"] }}>Jane Developer</h4>
            <p className="text-sm mb-4" style={{ color: previewTokens["--pf-muted"] }}>Full-stack developer building for the web</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-4 py-2 text-sm font-medium rounded-lg" style={{
                background: previewTokens["--pf-primary-btn-bg"],
                color: previewTokens["--pf-primary-btn-fg"],
              }}>Contact Me</span>
              <span className="px-4 py-2 text-sm font-medium rounded-lg" style={{
                border: `1px solid ${previewTokens["--pf-border"]}`,
                color: previewTokens["--pf-fg"],
              }}>View Work</span>
            </div>
          </div>
          <div className="px-8 pb-8 grid grid-cols-3 gap-3">
            {["React", "TypeScript", "Node.js"].map((skill) => (
              <div key={skill} className="text-center py-3 text-sm font-medium" style={{
                background: previewTokens["--pf-card-bg"],
                border: `1px solid ${previewTokens["--pf-card-border"]}`,
                color: previewTokens["--pf-fg"],
                borderRadius: previewTokens["--pf-radius"],
              }}>
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
