"use client";

import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  /** How far the element leans toward the cursor, in px */
  strength?: number;
  className?: string;
}

/**
 * Magnetic hover wrapper — the child leans toward the cursor and springs
 * back on leave. Desktop pointer only; inert for touch and reduced motion.
 */
export default function Magnetic({ children, strength = 6, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const isEnabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !isEnabled()) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2 * strength;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2 * strength;
    el.style.transition = "transform 0.15s ease-out";
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    // Springy return with a slight overshoot
    el.style.transition = "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
