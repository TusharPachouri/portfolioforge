"use client";

import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";

const SKILLS = ["Node.js", "React", "MongoDB", "TypeScript", "Next.js", "PostgreSQL"];

export default function FanCardCarousel() {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
      {/* ── Profile Card ── */}
      <div
        className="shrink-0 relative overflow-hidden"
        style={{
          width: 220,
          borderRadius: 24,
          background: "linear-gradient(145deg, #7c3aed, #4c1d95)",
          padding: "24px 20px 20px",
          color: "#fff",
          boxShadow:
            "0 40px 90px -16px rgba(124,58,237,0.45), 0 0 0 1.5px rgba(255,255,255,0.22), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        {/* Decorative circles */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute", top: -50, right: -50,
            width: 150, height: 150, borderRadius: "50%",
            background: "rgba(255,255,255,0.07)", pointerEvents: "none",
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute", bottom: -36, left: -36,
            width: 120, height: 120, borderRadius: "50%",
            background: "rgba(0,0,0,0.12)", pointerEvents: "none",
          }}
        />

        {/* Open-to-work badge */}
        <div
          style={{
            position: "absolute", top: 14, right: 14,
            fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
            background: "rgba(52,211,153,0.22)", color: "#6ee7b7",
            border: "1px solid rgba(52,211,153,0.28)",
            padding: "2px 7px", borderRadius: 999,
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
          Open
        </div>

        {/* Photo / initials fallback */}
        <div
          style={{
            width: 64, height: 64, borderRadius: "50%",
            border: "2.5px solid rgba(255,255,255,0.3)",
            marginBottom: 14, overflow: "hidden",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {!imgErr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/me.jpg"
              alt="Tushar Pachouri"
              onError={() => setImgErr(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>TP</span>
          )}
        </div>

        {/* Name */}
        <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.2, marginBottom: 3 }}>
          Tushar Pachouri
        </div>

        {/* Role */}
        <div style={{ fontSize: 11, opacity: 0.82, marginBottom: 4 }}>Product Engineer</div>

        {/* Location */}
        <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 18, display: "flex", alignItems: "center", gap: 3 }}>
          <MapPin style={{ width: 8, height: 8, flexShrink: 0 }} />
          Mathura, India
        </div>

        {/* Skill chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {["Node.js", "React", "MongoDB"].map((s) => (
            <span
              key={s}
              style={{
                fontSize: 9.5, fontWeight: 700,
                padding: "3px 8px", borderRadius: 999,
                background: "rgba(255,255,255,0.13)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* PF watermark */}
        <div
          style={{
            position: "absolute", bottom: 14, right: 14,
            fontSize: 8, fontWeight: 800, letterSpacing: "0.07em",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.16)",
            padding: "2px 7px", borderRadius: 999,
            color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
          }}
        >
          PF
        </div>
      </div>

      {/* ── Freelancer bio ── */}
      <div className="text-left">
        <p className="text-xs font-bold tracking-[0.18em] text-violet-500 uppercase mb-3">
          Available for freelance
        </p>

        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3 leading-tight">
          Tushar Pachouri
        </h3>

        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-5 max-w-xs">
          Full-stack developer and product engineer with 3+ years building scalable web apps.
          I help startups and indie founders ship polished products fast — from backend APIs
          to pixel-perfect frontends.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {SKILLS.map((s) => (
            <span
              key={s}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900/50"
            >
              {s}
            </span>
          ))}
        </div>

        <a
          href="/u/tusharpachouri"
          className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
        >
          View Portfolio <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
