"use client";

import { useState, useTransition, useCallback } from "react";
import { patterns, getPatternById } from "@/lib/patterns/registry";
import { PatternConfig, PatternCategory, BLEND_MODES, DEFAULT_PATTERN_CONFIG } from "@/lib/patterns/types";
import { savePattern, toggleFavourite } from "@/lib/actions/portfolio";
import {
  Search, Heart, Check, Copy, Loader2, X,
} from "lucide-react";

interface Props {
  currentPatternId: string | null;
  currentConfig: PatternConfig | null;
  initialFavourites: string[];
}

const CATEGORIES: { id: PatternCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "gradient", label: "Gradients" },
  { id: "geometric", label: "Geometric" },
  { id: "effects", label: "Effects" },
  { id: "decorative", label: "Decorative" },
];

export default function PatternPicker({ currentPatternId, currentConfig, initialFavourites }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(currentPatternId);
  const [config, setConfig] = useState<PatternConfig>(currentConfig ?? DEFAULT_PATTERN_CONFIG);
  const [category, setCategory] = useState<PatternCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [favourites, setFavourites] = useState<Set<string>>(new Set(initialFavourites));
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [favLimitHit, setFavLimitHit] = useState(false);

  // Filter patterns
  const filtered = patterns.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
  });

  // Selected pattern entry
  const selectedPattern = selectedId ? getPatternById(selectedId) : null;

  // Preview style (pure client-side — instant updates)
  const previewStyle = selectedPattern
    ? selectedPattern.render(config)
    : {};

  // Update config helper (for sliders and color pickers)
  const updateConfig = useCallback((key: keyof PatternConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  // Apply pattern
  const handleApply = () => {
    startTransition(async () => {
      await savePattern(selectedId, selectedId ? config : null);
      setSaved(true);
    });
  };

  // Remove pattern
  const handleRemove = () => {
    setSelectedId(null);
    startTransition(async () => {
      await savePattern(null, null);
      setSaved(true);
    });
  };

  // Copy CSS
  const handleCopyCss = async () => {
    if (!selectedPattern) return;
    const css = selectedPattern.toCss(config);
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions / insecure context) — leave button state unchanged
    }
  };

  // Toggle favourite
  const handleFavourite = (patternId: string) => {
    const next = new Set(favourites);
    if (next.has(patternId)) {
      next.delete(patternId);
      setFavLimitHit(false);
    } else {
      if (next.size >= 10) {
        setFavLimitHit(true); // free tier limit
        return;
      }
      next.add(patternId);
    }
    setFavourites(next);

    // Background sync — optimistic
    startTransition(async () => {
      try {
        await toggleFavourite(patternId);
      } catch {
        // Revert on failure
        setFavourites(favourites);
      }
    });
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900 mb-1">Background Pattern</h2>
        <p className="text-sm text-zinc-500">Add a background pattern to your portfolio.</p>
      </div>

      {/* Category tabs + search */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex bg-zinc-100 rounded-lg p-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                category === cat.id
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patterns..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Pattern grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {filtered.map((pattern) => {
              const isSelected = selectedId === pattern.id;
              const isFav = favourites.has(pattern.id);
              const preview = pattern.render(pattern.defaults);
              return (
                <div
                  key={pattern.id}
                  className={`relative group aspect-square rounded-xl border-2 transition-all overflow-hidden ${
                    isSelected
                      ? "border-violet-500 shadow-md ring-2 ring-violet-200"
                      : "border-zinc-200 hover:border-zinc-400 focus-within:border-zinc-400"
                  }`}
                >
                  {/* Select pattern — covers the whole card */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(pattern.id);
                      setConfig(pattern.defaults);
                      setSaved(false);
                    }}
                    aria-label={`${pattern.name}, Free`}
                    aria-pressed={isSelected}
                    className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500"
                  >
                    {/* Pattern thumbnail */}
                    <span className="absolute inset-0" style={{
                      ...preview,
                      backgroundColor: pattern.defaults.baseColor,
                    }} />

                    {/* Name overlay */}
                    <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 text-left">
                      <span className="block text-white text-[11px] font-medium truncate">{pattern.name}</span>
                    </span>
                  </button>

                  {/* Selection check */}
                  {isSelected && (
                    <div className="pointer-events-none absolute top-1.5 right-1.5 h-5 w-5 bg-violet-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" aria-hidden="true" />
                    </div>
                  )}

                  {/* Favourite toggle — sibling, not nested, so the markup stays valid */}
                  <button
                    type="button"
                    onClick={() => handleFavourite(pattern.id)}
                    aria-label={isFav ? `Remove ${pattern.name} from favourites` : `Add ${pattern.name} to favourites`}
                    aria-pressed={isFav}
                    className={`absolute top-1 left-1 z-10 h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-violet-500 ${
                      isFav
                        ? "bg-red-500 text-white"
                        : "bg-white/80 text-zinc-500 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
          {favLimitHit && (
            <p role="alert" className="text-xs text-amber-600 mt-3">
              Favourite limit reached — you can save up to 10 patterns on the free plan.
            </p>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              <p className="text-sm">No patterns found</p>
            </div>
          )}
        </div>

        {/* Customization panel */}
        {selectedPattern && (
          <div className="w-full lg:w-72 shrink-0">
            {/* Live preview */}
            <div
              className="relative h-[280px] rounded-xl overflow-hidden mb-4 shadow-inner"
              aria-hidden="true"
              style={{
                ...previewStyle,
                backgroundColor: config.baseColor,
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-3">
                <p className="text-white text-xs font-medium">{selectedPattern.name}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4 bg-white border border-zinc-200 rounded-xl p-4">
              <h3 className="font-semibold text-zinc-900 text-sm">Customize</h3>

              {/* Primary color */}
              <div className="flex items-center justify-between">
                <label htmlFor="pattern-c1" className="text-xs text-zinc-500">Primary</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">{config.c1}</span>
                  <input
                    id="pattern-c1"
                    type="color"
                    value={config.c1}
                    onChange={(e) => updateConfig("c1", e.target.value)}
                    className="h-7 w-7 rounded-md border border-zinc-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* Secondary color */}
              <div className="flex items-center justify-between">
                <label htmlFor="pattern-c2" className="text-xs text-zinc-500">Secondary</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">{config.c2}</span>
                  <input
                    id="pattern-c2"
                    type="color"
                    value={config.c2}
                    onChange={(e) => updateConfig("c2", e.target.value)}
                    className="h-7 w-7 rounded-md border border-zinc-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* Base color */}
              <div className="flex items-center justify-between">
                <label htmlFor="pattern-base" className="text-xs text-zinc-500">Base</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">{config.baseColor}</span>
                  <input
                    id="pattern-base"
                    type="color"
                    value={config.baseColor}
                    onChange={(e) => updateConfig("baseColor", e.target.value)}
                    className="h-7 w-7 rounded-md border border-zinc-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* Scale slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="pattern-scale" className="text-xs text-zinc-500">Scale</label>
                  <span className="text-xs text-zinc-500">{config.scale}</span>
                </div>
                <input
                  id="pattern-scale"
                  type="range"
                  min={10}
                  max={200}
                  value={config.scale}
                  onChange={(e) => updateConfig("scale", Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-violet-500"
                />
              </div>

              {/* Opacity slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="pattern-opacity" className="text-xs text-zinc-500">Opacity</label>
                  <span className="text-xs text-zinc-500">{config.opacity}%</span>
                </div>
                <input
                  id="pattern-opacity"
                  type="range"
                  min={0}
                  max={100}
                  value={config.opacity}
                  onChange={(e) => updateConfig("opacity", Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-violet-500"
                />
              </div>

              {/* Blend mode */}
              <div>
                <label htmlFor="pattern-blend" className="text-xs text-zinc-500 block mb-1">Blend Mode</label>
                <select
                  id="pattern-blend"
                  value={config.blendMode}
                  onChange={(e) => updateConfig("blendMode", e.target.value)}
                  className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
                >
                  {BLEND_MODES.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleApply}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                  ) : saved ? (
                    <><Check className="h-3.5 w-3.5" /> Applied!</>
                  ) : (
                    "Apply Pattern"
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCss}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-zinc-200 text-zinc-600 py-2 rounded-xl text-xs font-medium hover:bg-zinc-50 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <><Check className="h-3 w-3 text-emerald-500" /> Copied!</>
                    ) : (
                      <><Copy className="h-3 w-3" /> Copy CSS</>
                    )}
                  </button>

                  <button
                    onClick={handleRemove}
                    className="flex items-center gap-1.5 border border-zinc-200 text-zinc-400 px-3 py-2 rounded-xl text-xs font-medium hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
