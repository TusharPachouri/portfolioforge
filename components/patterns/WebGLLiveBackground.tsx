"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { VantaEffectName } from "@/lib/patterns/vantaTypes";

interface Props {
  effect: VantaEffectName;
  config: Record<string, unknown>;
  name: string;
  onClear: () => void;
}

export default function WebGLLiveBackground({ effect, config, name, onClear }: Props) {
  const bgRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!bgRef.current) return;
      const { mountVanta } = await import("@/lib/patterns/vantaLoader");
      const fx = await mountVanta(bgRef.current, effect, config);
      if (cancelled) { fx?.destroy(); return; }
      fxRef.current = fx;
    }
    boot();
    return () => {
      cancelled = true;
      fxRef.current?.destroy();
    };
  }, [effect, config]);

  return (
    <>
      {/* Full-page fixed WebGL canvas */}
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />

      {/* Frosted overlay so text stays readable */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 1, background: "rgba(255,255,255,0.15)", pointerEvents: "none" }}
      />

      {/* Clear pill */}
      <div
        style={{ position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 50 }}
      >
        <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-2xl border border-white/10">
          <span className="text-violet-300">{name}</span>
          <span className="text-zinc-500 text-xs">WebGL active</span>
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear WebGL background"
            className="ml-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
