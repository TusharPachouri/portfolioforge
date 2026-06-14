"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  to: number;
  suffix?: string;
  /** Animation length in ms */
  duration?: number;
  className?: string;
}

/**
 * Counts up to a value the first time it scrolls into view.
 * Server-renders the final value so SEO and no-JS users see real numbers,
 * and uses tabular figures so the layout never shifts mid-count.
 */
export default function CountUp({ to, suffix = "", duration = 900, className = "" }: Props) {
  const [value, setValue] = useState(to);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          setValue(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        setValue(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
      {suffix}
    </span>
  );
}
