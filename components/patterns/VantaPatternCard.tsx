"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, Zap, CheckCheck, Palette } from "lucide-react";
import type { VantaPatternEntry } from "@/lib/patterns/vantaTypes";

interface Props {
  pattern: VantaPatternEntry;
  onShowCode: (code: string, name: string) => void;
  onApply?: () => void;
  isActive?: boolean;
}

export default function VantaPatternCard({ pattern, onShowCode, onApply, isActive = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<{ destroy: () => void } | null>(null);
  const [activated, setActivated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!activated || loaded) return;
    let cancelled = false;

    async function boot() {
      if (!containerRef.current) return;
      const THREE = await import("three");
      const VANTA = (await import("vanta/dist/vanta.birds.min" as string)) as {
        default: (opts: object) => { destroy: () => void };
      };
      if (cancelled || !containerRef.current) return;
      effectRef.current = VANTA.default({
        el: containerRef.current,
        THREE,
        ...pattern.vantaConfig,
      });
      if (!cancelled) setLoaded(true);
    }

    boot();
    return () => { cancelled = true; };
  }, [activated, loaded, pattern.vantaConfig]);

  useEffect(() => () => { effectRef.current?.destroy(); }, []);

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-[#0a0814] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/40 ${
        isActive
          ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#0a0814] shadow-lg"
          : "ring-1 ring-white/10 hover:ring-white/20 shadow-sm"
      }`}
    >
      {/* WebGL preview — top portion */}
      <div
        ref={containerRef}
        className="relative h-44 overflow-hidden shrink-0 cursor-crosshair"
        onMouseEnter={() => setActivated(true)}
      >
        {/* Static gradient thumbnail until WebGL loads */}
        {!loaded && (
          <div className="absolute inset-0" style={pattern.thumbnailCss} />
        )}

        {/* Bottom fade into dark card body */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a0814]/80 to-transparent pointer-events-none" />

        {/* WebGL badge */}
        <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
          <Zap className="h-2.5 w-2.5 text-yellow-400" aria-hidden="true" />
          WebGL
        </div>

        {/* Active badge */}
        {isActive && (
          <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            <CheckCheck className="h-3 w-3" /> Applied
          </span>
        )}

        {/* Hover hint */}
        {!loaded && !activated && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="text-[10px] text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              Hover to animate
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 px-4 pt-2 pb-4">
        {/* Name + badge */}
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-white truncate leading-snug">{pattern.name}</p>
          <span className="mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 capitalize">
            WebGL effect
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {onApply ? (
            <button
              type="button"
              onClick={onApply}
              aria-pressed={isActive}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold bg-violet-600 text-white hover:bg-violet-500 active:scale-[0.97] px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm shadow-violet-900/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              <Palette className="h-3.5 w-3.5 shrink-0" />
              {isActive ? "Applied" : "Apply"}
            </button>
          ) : (
            <Link
              href="/dashboard/pattern"
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold bg-violet-600 text-white hover:bg-violet-500 px-3 py-2 rounded-xl transition-colors shadow-sm shadow-violet-900/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              <Palette className="h-3.5 w-3.5 shrink-0" />
              Use
            </Link>
          )}
          <Link
            href={`/patterns/${pattern.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold bg-white/10 text-white/70 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Eye className="h-3.5 w-3.5 shrink-0" />
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
