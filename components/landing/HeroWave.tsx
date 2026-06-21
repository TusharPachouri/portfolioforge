"use client";
import { useEffect, useRef } from "react";

export default function HeroWave() {
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef  = useRef<HTMLDivElement>(null);
  const leftRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const t = Math.min(window.scrollY / 750, 1); // 0 → 1 over first 750 px

      if (centerRef.current) {
        centerRef.current.style.transform = `translate(-50%, -52%) scale(${1 + t * 0.55})`;
        centerRef.current.style.opacity   = String(1 - t * 0.75);
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translateX(${t * 130}px) scale(${1 + t * 0.45})`;
        rightRef.current.style.opacity   = String(1 - t * 0.8);
      }
      if (leftRef.current) {
        leftRef.current.style.transform = `translateX(${-t * 130}px) scale(${1 + t * 0.45})`;
        leftRef.current.style.opacity   = String(1 - t * 0.8);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
    >
      {/* Center — large violet bloom */}
      <div
        ref={centerRef}
        className="absolute top-[42%] left-1/2 w-[1000px] h-[750px] rounded-full"
        style={{
          transform: "translate(-50%, -52%)",
          background:
            "radial-gradient(ellipse at 50% 48%, rgba(139,92,246,0.20) 0%, rgba(99,102,241,0.11) 42%, rgba(96,165,250,0.06) 65%, transparent 80%)",
          filter: "blur(72px)",
          willChange: "transform, opacity",
        }}
      />

      {/* Right — soft blue drift */}
      <div
        ref={rightRef}
        className="absolute -right-48 top-0 w-[560px] h-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(96,165,250,0.16) 0%, transparent 70%)",
          filter: "blur(64px)",
          willChange: "transform, opacity",
        }}
      />

      {/* Left — purple accent */}
      <div
        ref={leftRef}
        className="absolute -left-48 bottom-0 w-[560px] h-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(167,139,250,0.14) 0%, transparent 70%)",
          filter: "blur(64px)",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
