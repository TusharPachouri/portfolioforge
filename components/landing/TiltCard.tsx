"use client";

import { useEffect, useRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** Max rotation in degrees */
  maxTilt?: number;
  /** Scale while hovered */
  hoverScale?: number;
  /** Show the specular glare highlight that follows the cursor */
  glare?: boolean;
}

/**
 * 3D tilt card — leans toward the cursor with a smoothed spring (rAF lerp),
 * casts a moving specular glare, and eases back upright on leave.
 * Desktop pointer only; inert for touch and reduced-motion users.
 */
export default function TiltCard({
  maxTilt = 7,
  hoverScale = 1.02,
  glare = true,
  className = "",
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const anim = useRef({ rx: 0, ry: 0, s: 1, tRx: 0, tRy: 0, tS: 1, raf: 0, running: false });

  useEffect(() => {
    const a = anim.current;
    return () => cancelAnimationFrame(a.raf);
  }, []);

  const enabled = () =>
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tick = () => {
    const a = anim.current;
    const el = ref.current;
    if (!el) {
      a.running = false;
      return;
    }
    a.rx += (a.tRx - a.rx) * 0.14;
    a.ry += (a.tRy - a.ry) * 0.14;
    a.s += (a.tS - a.s) * 0.14;
    el.style.transform = `perspective(900px) rotateX(${a.rx.toFixed(2)}deg) rotateY(${a.ry.toFixed(2)}deg) scale(${a.s.toFixed(3)})`;
    const settled =
      Math.abs(a.tRx - a.rx) < 0.05 && Math.abs(a.tRy - a.ry) < 0.05 && Math.abs(a.tS - a.s) < 0.002;
    if (settled) {
      if (a.tRx === 0 && a.tRy === 0 && a.tS === 1) {
        el.style.transform = "";
        a.rx = 0; a.ry = 0; a.s = 1;
      }
      a.running = false;
      return;
    }
    a.raf = requestAnimationFrame(tick);
  };

  const wake = () => {
    const a = anim.current;
    if (!a.running) {
      a.running = true;
      a.raf = requestAnimationFrame(tick);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !enabled()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const a = anim.current;
    a.tRy = (px - 0.5) * 2 * maxTilt;
    a.tRx = -(py - 0.5) * 2 * maxTilt;
    a.tS = hoverScale;
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    wake();
  };

  const onPointerLeave = () => {
    const a = anim.current;
    a.tRx = 0;
    a.tRy = 0;
    a.tS = 1;
    wake();
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`tilt-card relative ${className}`}
      {...rest}
    >
      {children}
      {glare && <div className="tilt-glare" aria-hidden="true" />}
    </div>
  );
}
