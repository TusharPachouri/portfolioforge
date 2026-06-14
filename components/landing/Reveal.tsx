"use client";

import { useEffect, useRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger offset in ms, applied as transition-delay */
  delay?: number;
}

/**
 * Reveals children with a rise-and-fade once they scroll into view.
 * Falls back to instantly visible for reduced-motion users; a <noscript>
 * override on the page keeps content visible without JavaScript.
 */
export default function Reveal({ delay = 0, className = "", children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
