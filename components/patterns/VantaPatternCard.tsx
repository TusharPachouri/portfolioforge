"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, Zap, CheckCheck, Palette } from "lucide-react";
import { motion } from "framer-motion";
import type { VantaPatternEntry } from "@/lib/patterns/vantaTypes";

interface Props {
  pattern: VantaPatternEntry;
  onShowCode: (code: string, name: string) => void;
  onApply?: () => void;
  isActive?: boolean;
}

export default function VantaPatternCard({ pattern, onShowCode, onApply, isActive = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef    = useRef<{ destroy: () => void } | null>(null);
  const [activated, setActivated] = useState(false);
  const [loaded, setLoaded]       = useState(false);

  useEffect(() => { if (isActive) setActivated(true); }, [isActive]);

  useEffect(() => {
    if (!activated || loaded) return;
    let cancelled = false;
    async function boot() {
      if (!containerRef.current) return;
      const { mountVanta } = await import("@/lib/patterns/vantaLoader");
      const fx = await mountVanta(containerRef.current, pattern.vantaEffect, pattern.vantaConfig);
      if (cancelled) { fx?.destroy(); return; }
      effectRef.current = fx;
      if (!cancelled) setLoaded(true);
    }
    boot();
    return () => { cancelled = true; };
  }, [activated, loaded, pattern.vantaConfig, pattern.vantaEffect]);

  useEffect(() => () => { effectRef.current?.destroy(); }, []);

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-[#0a0814] transition-shadow duration-200 ${
        isActive
          ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#0a0814] shadow-lg shadow-violet-500/30"
          : "ring-1 ring-white/10 hover:ring-violet-500/30 shadow-sm hover:shadow-xl hover:shadow-violet-900/40"
      }`}
    >
      {/* WebGL preview */}
      <div
        ref={containerRef}
        className="relative h-44 overflow-hidden shrink-0 cursor-crosshair"
        onMouseEnter={() => setActivated(true)}
      >
        {!loaded && <div className="absolute inset-0" style={pattern.thumbnailCss} />}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a0814]/80 to-transparent pointer-events-none" />

        {/* WebGL badge */}
        <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
          <Zap className="h-2.5 w-2.5 text-yellow-400" aria-hidden="true" />
          WebGL
        </div>

        {isActive && (
          <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-violet-500/40">
            <CheckCheck className="h-3 w-3" /> Applied
          </span>
        )}

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
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-white truncate leading-snug">{pattern.name}</p>
          <span className="mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 capitalize">
            WebGL Effect
          </span>
        </div>

        {/* Premium buttons */}
        <div className="flex gap-2">
          {onApply ? (
            <motion.button
              type="button"
              onClick={onApply}
              aria-pressed={isActive}
              whileTap={{ scale: 0.95 }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 transition-all"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)"
                  : "linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)",
                color: "#fff",
                boxShadow: isActive
                  ? "0 0 0 2px rgba(167,139,250,0.4), 0 4px 16px rgba(109,40,217,0.6)"
                  : "0 2px 10px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <Palette className="h-3.5 w-3.5 shrink-0" />
              {isActive ? "Applied" : "Apply"}
            </motion.button>
          ) : (
            <Link
              href="/dashboard/pattern"
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)",
                color: "#fff",
                boxShadow: "0 2px 10px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <Palette className="h-3.5 w-3.5 shrink-0" />
              Use
            </Link>
          )}

          <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
            <Link
              href={`/patterns/${pattern.id}`}
              className="w-full inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(4px)",
              }}
            >
              <Eye className="h-3.5 w-3.5 shrink-0" />
              Preview
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
