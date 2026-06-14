"use client";

import { useEffect, useRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** Parallax intensity — fraction of the element's distance from viewport center */
  speed?: number;
}

/**
 * Scroll parallax — offsets children vertically against the scroll direction,
 * smoothed with an rAF lerp so motion feels weighted rather than 1:1.
 * The loop sleeps once settled; disabled under prefers-reduced-motion.
 */
export default function Parallax({ speed = 0.15, className = "", children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let cur = 0;
    let target = 0;
    let running = false;

    const compute = () => {
      const r = el.getBoundingClientRect();
      // Subtract the applied transform so the measurement is stable
      const mid = r.top - cur + r.height / 2 - window.innerHeight / 2;
      target = -mid * speed;
    };

    const tick = () => {
      cur += (target - cur) * 0.1;
      el.style.transform = `translate3d(0, ${cur.toFixed(2)}px, 0)`;
      if (Math.abs(target - cur) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const wake = () => {
      compute();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
