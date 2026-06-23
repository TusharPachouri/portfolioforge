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
    let cancelled = false;

    async function boot() {
      if (!containerRef.current) return;
      const { mountVanta } = await import("@/lib/patterns/vantaLoader");
      const fx = await mountVanta(containerRef.current, pattern.vantaEffect, pattern.vantaConfig);
      if (cancelled) { fx?.destroy(); return; }
      effectRef.current = fx;
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
