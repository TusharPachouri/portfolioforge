"use client";

import { ExternalLink } from "lucide-react";
import DepthMapImage from "./DepthMapImage";

const SKILLS = ["Node.js", "React", "MongoDB", "TypeScript", "Next.js", "PostgreSQL"];

export default function FanCardCarousel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

      {/* ── Bio — left column ── */}
      <div className="flex flex-col items-start text-left order-2 md:order-1">
        <span className="inline-block text-[10px] font-bold tracking-[0.2em] text-violet-500 uppercase mb-5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/40">
          Available for freelance
        </span>

        <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight">
          About Me
        </h3>

        <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed mb-8">
          Full-stack developer and product engineer with 3+ years building scalable web apps.
          I help startups and indie founders ship polished products fast — from backend APIs
          to pixel-perfect frontends.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {SKILLS.map((s) => (
            <span
              key={s}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
            >
              {s}
            </span>
          ))}
        </div>

        <a
          href="/u/tusharpachouri"
          className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors shadow-lg shadow-zinc-900/10"
        >
          View Portfolio <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* ── Profile image — right column ── */}
      <div className="relative flex justify-center md:justify-center order-1 md:order-2 py-10">
        {/* Extra padding so floating cards aren't clipped by grid column edges */}
        <div className="relative">

          {/* Main image */}
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 w-[260px] h-[330px] sm:w-[320px] sm:h-[400px] lg:w-[360px] lg:h-[450px]">
            <DepthMapImage
              imageSrc="/tushar-image.png"
              depthSrc="/tushar-depth.png"
              width="100%"
              height="100%"
              intensity={0.004}
            />
          </div>

          {/* Floating card — name & role (top-right) */}
          <div className="absolute -top-7 -right-10 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-100 dark:border-zinc-700/60 shadow-xl rounded-2xl px-4 py-3.5 w-52 rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300">
            <p className="text-[9px] font-bold tracking-wider text-violet-500 uppercase mb-1.5">— Creator</p>
            <p className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">Tushar Pachouri</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Software Developer</p>
          </div>

          {/* Floating card — availability (bottom-left) */}
          <div className="absolute -bottom-7 -left-10 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-100 dark:border-zinc-700/60 shadow-xl rounded-2xl px-4 py-3.5 w-48 -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">Available Now</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
              Ready for new freelance web app projects.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
