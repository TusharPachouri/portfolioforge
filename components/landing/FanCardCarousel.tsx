"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

/* ─── Sample portfolio profiles ──────────────────────────────────────────── */
const PROFILES = [
  { id: 1, name: "Tushar Pachouri", role: "Product Engineer",   location: "Mathura, India",    gradient: ["#7c3aed", "#4c1d95"] as const, skills: ["Node.js", "React", "MongoDB"],    initials: "TP", open: true  },
  { id: 2, name: "Sarah Kim",       role: "Full-Stack Dev",     location: "San Francisco, CA", gradient: ["#0891b2", "#0c4a6e"] as const, skills: ["React", "Node.js", "AWS"],        initials: "SK", open: true  },
  { id: 3, name: "Marcus Rivera",   role: "Frontend Engineer",  location: "New York, NY",      gradient: ["#059669", "#064e3b"] as const, skills: ["Vue", "TypeScript", "Figma"],     initials: "MR", open: false },
  { id: 4, name: "Priya Nair",      role: "ML Engineer",        location: "London, UK",        gradient: ["#db2777", "#831843"] as const, skills: ["Python", "PyTorch", "GCP"],       initials: "PN", open: true  },
  { id: 5, name: "Jordan West",     role: "DevOps Engineer",    location: "Austin, TX",        gradient: ["#d97706", "#78350f"] as const, skills: ["K8s", "Terraform", "Rust"],       initials: "JW", open: false },
  { id: 6, name: "Aiden Park",      role: "iOS Developer",      location: "Seoul, Korea",      gradient: ["#6d28d9", "#3b0764"] as const, skills: ["Swift", "SwiftUI", "Core ML"],    initials: "AP", open: true  },
  { id: 7, name: "Nadia Hassan",    role: "Data Engineer",      location: "Berlin, Germany",   gradient: ["#0e7490", "#083344"] as const, skills: ["Spark", "dbt", "Airflow"],        initials: "NH", open: false },
];

/* ─── Fan positions keyed by offset from center (-2 … +2) ───────────────── */
const FAN = {
  [-2]: { x: -168, y: 54, rotate: -13, scale: 0.72, opacity: 0.50, z: 1 },
  [-1]: { x:  -90, y: 22, rotate:  -7, scale: 0.86, opacity: 0.78, z: 3 },
  [ 0]: { x:    0, y:  0, rotate:   0, scale: 1.00, opacity: 1.00, z: 5 },
  [ 1]: { x:   90, y: 22, rotate:   7, scale: 0.86, opacity: 0.78, z: 3 },
  [ 2]: { x:  168, y: 54, rotate:  13, scale: 0.72, opacity: 0.50, z: 1 },
} as const;

const SPRING = { type: "spring", stiffness: 300, damping: 28, mass: 0.85 } as const;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function FanCardCarousel() {
  const [center, setCenter] = useState(0);

  const total = PROFILES.length;
  const canPrev = center > 0;
  const canNext = center < total - 1;

  const goPrev = () => canPrev && setCenter((c) => c - 1);
  const goNext = () => canNext && setCenter((c) => c + 1);

  // Visible cards: offset -2 … +2, clamped to array bounds
  const visible = PROFILES.map((p, i) => ({ ...p, offset: i - center })).filter(
    ({ offset }) => offset >= -2 && offset <= 2
  );

  return (
    <div className="relative flex flex-col items-center" role="region" aria-label="Portfolio showcase">
      {/* ── Fan of cards ─────────────────────────────────────────────────── */}
      <div className="relative h-[360px] w-full flex items-center justify-center overflow-visible">
        {visible.map(({ offset, ...profile }) => {
          const f = FAN[offset as keyof typeof FAN];
          const isCenter = offset === 0;

          return (
            <motion.div
              key={profile.id}
              animate={{ x: f.x, y: f.y, rotate: f.rotate, scale: f.scale, opacity: f.opacity }}
              transition={SPRING}
              style={{ position: "absolute", zIndex: f.z, cursor: isCenter ? "default" : "pointer" }}
              onClick={() => !isCenter && setCenter((c) => c + offset)}
              whileHover={
                !isCenter
                  ? { scale: f.scale * 1.04, opacity: Math.min(1, f.opacity + 0.12), transition: { duration: 0.15 } }
                  : undefined
              }
            >
              <PortfolioCard profile={profile} isFocused={isCenter} />
            </motion.div>
          );
        })}
      </div>

      {/* ── Navigation row ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mt-6">
        {/* Prev */}
        <motion.button
          whileHover={{ scale: canPrev ? 1.08 : 1 }}
          whileTap={{ scale: canPrev ? 0.92 : 1 }}
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous portfolio"
          className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors ${
            canPrev
              ? "cursor-pointer border-zinc-200 bg-white text-zinc-600 hover:border-violet-400 hover:text-violet-600"
              : "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-300"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Portfolio slides">
          {PROFILES.map((p, i) => (
            <motion.button
              key={p.id}
              role="tab"
              aria-selected={i === center}
              aria-label={`View ${p.name}'s portfolio`}
              onClick={() => setCenter(i)}
              animate={{ width: i === center ? 22 : 6, backgroundColor: i === center ? "#7c3aed" : "#d4d4d8" }}
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
              className="h-1.5 rounded-full cursor-pointer"
            />
          ))}
        </div>

        {/* Next */}
        <motion.button
          whileHover={{ scale: canNext ? 1.08 : 1 }}
          whileTap={{ scale: canNext ? 0.92 : 1 }}
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next portfolio"
          className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors ${
            canNext
              ? "cursor-pointer border-zinc-200 bg-white text-zinc-600 hover:border-violet-400 hover:text-violet-600"
              : "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-300"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Active profile label */}
      <motion.p
        key={center}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-3 text-sm text-zinc-500"
      >
        <span className="font-semibold text-zinc-800">{PROFILES[center].name}</span>
        {" · "}
        {PROFILES[center].role}
      </motion.p>
    </div>
  );
}

/* ─── Individual portfolio card ──────────────────────────────────────────── */
interface Profile {
  name: string;
  role: string;
  location: string;
  gradient: readonly [string, string];
  skills: string[];
  initials: string;
  open: boolean;
}

function PortfolioCard({ profile, isFocused }: { profile: Profile; isFocused: boolean }) {
  return (
    <div
      style={{
        width: 196,
        height: 296,
        borderRadius: 22,
        background: `linear-gradient(145deg, ${profile.gradient[0]}, ${profile.gradient[1]})`,
        padding: "20px 18px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        boxShadow: isFocused
          ? "0 40px 90px -16px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(255,255,255,0.22), inset 0 1px 0 rgba(255,255,255,0.15)"
          : "0 12px 36px -8px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.1)",
        transition: "box-shadow 0.3s ease",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Decorative circles */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute", top: -44, right: -44,
          width: 140, height: 140, borderRadius: "50%",
          background: "rgba(255,255,255,0.07)", pointerEvents: "none",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute", bottom: -32, left: -32,
          width: 110, height: 110, borderRadius: "50%",
          background: "rgba(0,0,0,0.12)", pointerEvents: "none",
        }}
      />

      {/* Open-to-work badge */}
      {profile.open && (
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
      )}

      {/* Avatar */}
      <div
        style={{
          width: 54, height: 54, borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          border: "2px solid rgba(255,255,255,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 800,
          marginBottom: 14, flexShrink: 0,
        }}
      >
        {profile.initials}
      </div>

      {/* Name */}
      <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.2, marginBottom: 3 }}>
        {profile.name}
      </div>

      {/* Role */}
      <div style={{ fontSize: 11, opacity: 0.82, marginBottom: 4 }}>
        {profile.role}
      </div>

      {/* Location */}
      <div style={{ fontSize: 10, opacity: 0.60, marginBottom: 18, display: "flex", alignItems: "center", gap: 3 }}>
        <MapPin style={{ width: 8, height: 8, flexShrink: 0 }} />
        {profile.location}
      </div>

      {/* Skill chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {profile.skills.map((s) => (
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

      {/* PortfolioForge watermark */}
      <div
        style={{
          position: "absolute", bottom: 14, right: 14,
          fontSize: 8, fontWeight: 800, letterSpacing: "0.07em",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.16)",
          padding: "2px 7px", borderRadius: 999,
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
        }}
      >
        PF
      </div>
    </div>
  );
}
