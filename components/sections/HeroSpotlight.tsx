"use client";

import { PortfolioData } from "@/types/portfolio";
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from "framer-motion";
import { Mail, ArrowRight, MapPin } from "lucide-react";
import { getSocialIcon } from "@/lib/social-icons";

interface Props { data: PortfolioData }

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroSpotlight({ data }: Props) {
  const { hero, contact } = data;
  const reduce = useReducedMotion();

  // Cursor-following spotlight
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${mx}% ${my}%, color-mix(in srgb, var(--pf-accent) 16%, transparent), transparent 62%)`;
  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const words = hero.name.split(" ");

  return (
    <section
      onPointerMove={reduce ? undefined : onMove}
      className="relative overflow-hidden py-28 px-6 text-center"
      style={{ color: "var(--pf-fg)" }}
    >
      {!reduce && (
        <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: spotlight }} />
      )}

      <div className="relative max-w-2xl mx-auto flex flex-col items-center">
        {hero.avatarUrl && (
          <motion.div
            className="mb-7 h-24 w-24 rounded-full overflow-hidden"
            style={{ border: "2px solid var(--pf-border)" }}
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.avatarUrl} alt={hero.name} className="h-full w-full object-cover" />
          </motion.div>
        )}

        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {hero.location && (
            <span className="inline-flex items-center gap-1 text-sm" style={{ color: "var(--pf-muted)" }}>
              <MapPin className="h-3.5 w-3.5" />{hero.location}
            </span>
          )}
          {hero.openToWork && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full" style={{
              background: "color-mix(in srgb, var(--pf-highlight) 15%, transparent)",
              color: "var(--pf-highlight)",
              border: "1px solid color-mix(in srgb, var(--pf-highlight) 30%, transparent)",
            }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--pf-highlight)" }} />
              Open to work
            </span>
          )}
        </motion.div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-5 leading-[1.05]">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.55, ease: EASE }}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-lg max-w-xl mb-9"
          style={{ color: "var(--pf-muted)" }}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {hero.tagline}
        </motion.p>

        <motion.div
          className="flex items-center gap-3 flex-wrap justify-center"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <a href={hero.ctaPrimary.href}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--pf-primary-btn-bg)", color: "var(--pf-primary-btn-fg)", borderRadius: "var(--pf-radius)" }}>
            <Mail className="h-4 w-4" /> {hero.ctaPrimary.label} <ArrowRight className="h-4 w-4" />
          </a>
          <a href={hero.ctaSecondary.href}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors"
            style={{ border: "1px solid var(--pf-border)", color: "var(--pf-fg)", borderRadius: "var(--pf-radius)" }}>
            {hero.ctaSecondary.label}
          </a>
          {Object.entries(contact.socials).map(([platform, url]) => (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" title={platform}
              className="inline-flex items-center justify-center h-10 w-10 transition-colors"
              style={{ border: "1px solid var(--pf-border)", color: "var(--pf-muted)", borderRadius: "var(--pf-radius)" }}>
              {getSocialIcon(platform)}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
