"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Layers, Zap } from "lucide-react";
import MockupDemo from "@/components/landing/MockupDemo";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial:  { opacity: 0, y: 28 },
  animate:  { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

const AVATARS = [
  { bg: "bg-orange-100",  emoji: "👩‍💻", cls: "w-12 h-12 -rotate-12 hover:rotate-0",            border: "border-white dark:border-[#191919]" },
  { bg: "bg-blue-100",    emoji: "👨‍🎨", cls: "w-12 h-12 rotate-6 hover:rotate-0",               border: "border-white dark:border-[#191919]" },
  { bg: "bg-violet-100",  emoji: "🤖",   cls: "w-14 h-14 z-10 scale-110 hover:scale-125",         border: "border-white dark:border-[#191919]" },
  { bg: "bg-emerald-100", emoji: "⚡️",  cls: "w-12 h-12 -rotate-6 hover:rotate-0",              border: "border-white dark:border-[#191919]" },
  { bg: "bg-pink-100",    emoji: "✨",   cls: "w-12 h-12 rotate-12 hover:rotate-0",               border: "border-white dark:border-[#191919]" },
];

export default function HeroContent() {
  return (
    <>
      {/* ── Hero text section ─────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-4 max-w-5xl mx-auto text-center relative">

        {/* Avatar bubbles — stagger */}
        <motion.div
          className="flex items-center justify-center mb-8 relative z-10"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          <div className="flex -space-x-3">
            {AVATARS.map(({ bg, emoji, cls, border }) => (
              <motion.div
                key={emoji}
                variants={{ hidden: { opacity: 0, y: -16, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1 } }}
                transition={{ duration: 0.5, ease }}
                className={`rounded-full border-2 ${border} ${bg} flex items-center justify-center shadow-sm transform transition-transform cursor-pointer ${cls}`}
                style={{ fontSize: emoji === "🤖" ? "1.5rem" : "1.25rem" }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="pf-page-text text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] relative z-10"
          style={{ color: "var(--pf-page-fg)" }}
          {...fadeUp(0.25)}
        >
          Where developers and AI{" "}
          <br className="hidden sm:block" />
          <span className="relative inline-block px-3 mx-1">
            <span className="relative z-10" style={{ color: "#18181b" }}>Ship</span>
            <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg -z-10 transform -rotate-2" />
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          </span>{" "}
          portfolios.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="pf-page-text text-lg sm:text-xl max-w-2xl mx-auto mb-8 font-medium"
          style={{ color: "var(--pf-page-muted)" }}
          {...fadeUp(0.45)}
        >
          Capture context, find beautiful components, and automate your portfolio creation with AI built for developers.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10"
          {...fadeUp(0.6)}
        >
          <Link
            href="/components"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-colors shadow-sm text-sm sm:text-base"
          >
            Get PortfolioForge free
          </Link>
          <Link
            href="/preview"
            className="w-full sm:w-auto text-blue-600 dark:text-blue-400 hover:underline px-6 py-3 font-semibold transition-colors text-sm sm:text-base"
          >
            Request a demo →
          </Link>
        </motion.div>
      </section>

      {/* ── Mockup section ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 relative mb-24 z-10">
        {/* Floating deco icons */}
        <motion.div
          className="absolute -top-6 -left-4 sm:-left-12 z-20 animate-bounce"
          style={{ animationDuration: "3.5s" }}
          initial={{ opacity: 0, y: -20, rotate: -20 }}
          animate={{ opacity: 1, y: 0, rotate: -12 }}
          transition={{ duration: 0.7, delay: 0.55, type: "spring", bounce: 0.4 }}
        >
          <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700">
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/3 -right-4 sm:-right-12 z-20 animate-bounce"
          style={{ animationDuration: "4.2s" }}
          initial={{ opacity: 0, x: 20, rotate: 20 }}
          animate={{ opacity: 1, x: 0, rotate: 12 }}
          transition={{ duration: 0.7, delay: 0.7, type: "spring", bounce: 0.4 }}
        >
          <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700">
            <Layers className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 -left-6 sm:-left-16 z-20 animate-bounce"
          style={{ animationDuration: "3.8s" }}
          initial={{ opacity: 0, x: -20, rotate: -10 }}
          animate={{ opacity: 1, x: 0, rotate: -6 }}
          transition={{ duration: 0.7, delay: 0.85, type: "spring", bounce: 0.4 }}
        >
          <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700">
            <Zap className="w-6 h-6 text-violet-500" />
          </div>
        </motion.div>

        {/* MockupDemo */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
        >
          <MockupDemo />
        </motion.div>
      </section>
    </>
  );
}
