"use client";

import { useEffect, useRef } from "react";
import { vantaPatterns } from "@/lib/patterns/vantaRegistry";

interface Props {
  patternId: string;
  className?: string;
}

export default function VantaPageBackground({
  patternId,
  className = "fixed inset-0 pointer-events-none z-[-1]",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<{ destroy: () => void } | null>(null);

  const pattern = vantaPatterns.find((p) => p.id === patternId);

  useEffect(() => {
    if (!pattern) return;
    const config = pattern.vantaConfig;
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
        ...config,
      });
    }

    boot();
    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, [pattern]);

  if (!pattern) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
    />
  );
}
