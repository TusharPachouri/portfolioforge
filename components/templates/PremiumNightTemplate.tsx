"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ExternalLink, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";
import { getSocialIcon } from "@/lib/social-icons";

// ─── Constants ────────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const NAV_LINKS = [
  { id: "about",      label: "About"      },
  { id: "projects",   label: "Projects"   },
  { id: "experience", label: "Experience" },
  { id: "contact",    label: "Contact"    },
];

const PROJECT_GRADIENTS = [
  "linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%)",
  "linear-gradient(135deg,#064e3b 0%,#047857 100%)",
  "linear-gradient(135deg,#4c0519 0%,#9f1239 100%)",
  "linear-gradient(135deg,#431407 0%,#92400e 100%)",
  "linear-gradient(135deg,#0c4a6e 0%,#0369a1 100%)",
  "linear-gradient(135deg,#1c1917 0%,#44403c 100%)",
];


// ─── Helpers ──────────────────────────────────────────────────────────────────

function reveal(delay = 0) {
  return {
    initial:     { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0  },
    viewport:    { once: true, amount: 0.25 } as const,
    transition:  { duration: 0.6, delay, ease },
  };
}

function SectionLabel({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div {...reveal()} style={{ marginBottom: 48 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a855f7", marginBottom: 10 }}>
        {eyebrow}
      </p>
      <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#f1f5f9", lineHeight: 1.1 }}>
        {title}
      </h2>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PremiumNightTemplate({ data }: { data: PortfolioData }) {
  const { hero, skills, projects, experience, education, contact } = data;

  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Navbar scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight active nav link
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const allIds = ["hero", ...NAV_LINKS.map((l) => l.id)];
    allIds.forEach((id) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25, rootMargin: "-80px 0px -50% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    setMenuOpen(false);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  }

  // ── Navbar ─────────────────────────────────────────────────────────────────
  const Navbar = (
    <motion.header
      animate={{
        backgroundColor: scrolled ? "rgba(7,9,18,0.88)" : "rgba(0,0,0,0)",
        borderBottomColor: scrolled ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0)",
        backdropFilter: scrolled ? "blur(18px) saturate(1.4)" : "blur(0px)",
      }}
      transition={{ duration: 0.35 }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: "1px solid rgba(0,0,0,0)" }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
          onClick={() => scrollTo("hero")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 900, fontSize: 17, letterSpacing: "-0.04em" }}
        >
          <span style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {hero.name.split(" ")[0]}
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>
            .dev
          </span>
        </motion.button>

        {/* Desktop links */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          style={{ display: "flex", alignItems: "center", gap: 2 }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map(({ id, label }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{
                  position: "relative", padding: "7px 14px", background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  color: active ? "#ffffff" : "rgba(255,255,255,0.45)",
                  transition: "color 0.2s",
                  borderRadius: 8,
                }}
              >
                {active && (
                  <motion.span
                    layoutId="pnt-nav-pill"
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                      borderRadius: 8, background: "rgba(168,85,247,0.14)",
                      border: "1px solid rgba(168,85,247,0.28)",
                    }}
                    transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
                  />
                )}
                <span style={{ position: "relative" }}>{label}</span>
              </button>
            );
          })}
        </motion.nav>

        {/* Right CTA + mobile toggle */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <motion.a
            href={`mailto:${contact.email}`}
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(168,85,247,0.4)" }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 20, background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white", textDecoration: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            Hire me
          </motion.a>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ display: "none", padding: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, cursor: "pointer", color: "white" }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            <div style={{ width: 16, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ display: "block", height: 1.5, background: "currentColor", borderRadius: 1, transformOrigin: "center", transform: menuOpen ? "translateY(5.5px) rotate(45deg)" : "none", transition: "transform 0.2s" }} />
              <span style={{ display: "block", height: 1.5, background: "currentColor", borderRadius: 1, opacity: menuOpen ? 0 : 1, transition: "opacity 0.15s" }} />
              <span style={{ display: "block", height: 1.5, background: "currentColor", borderRadius: 1, transformOrigin: "center", transform: menuOpen ? "translateY(-5.5px) rotate(-45deg)" : "none", transition: "transform 0.2s" }} />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(7,9,18,0.96)", backdropFilter: "blur(18px)" }}
          >
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
              {NAV_LINKS.map(({ id, label }) => (
                <button key={id} onClick={() => scrollTo(id)} style={{ textAlign: "left", padding: "12px 0", background: "none", border: "none", fontSize: 15, fontWeight: 500, color: activeSection === id ? "#a855f7" : "rgba(255,255,255,0.6)", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );

  return (
    <div style={{ background: "#07091a", color: "white", minHeight: "100vh", fontFamily: "'Inter',system-ui,sans-serif", overflowX: "hidden" }}>
      {/* Global responsive helpers */}
      <style>{`
        .pnt-hidden-mobile { display: flex !important; }
        .pnt-show-mobile   { display: none  !important; }
        @media (max-width: 640px) {
          .pnt-hidden-mobile { display: none  !important; }
          .pnt-show-mobile   { display: flex  !important; }
        }
      `}</style>

      {/* Ambient gradient orbs (fixed, behind everything) */}
      <div aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <motion.div animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "-20%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)", filter: "blur(60px)" }} />
        <motion.div animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{ position: "absolute", top: "25%", right: "-15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.13) 0%,transparent 65%)", filter: "blur(60px)" }} />
        <motion.div animate={{ x: [0, 20, 0], y: [0, 25, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 8 }}
          style={{ position: "absolute", bottom: "5%", left: "35%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%)", filter: "blur(60px)" }} />
      </div>

      {Navbar}

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section
          ref={(el) => { sectionRefs.current.hero = el; }}
          style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", textAlign: "center" }}
        >
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease }}
            style={{ position: "relative", marginBottom: 28 }}
          >
            <div style={{ width: 108, height: 108, borderRadius: "50%", padding: 3, background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)", boxShadow: "0 0 48px rgba(124,58,237,0.45)" }}>
              {hero.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hero.avatarUrl} alt={hero.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "linear-gradient(135deg,#1e1b4b,#312e81)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900 }}>
                  {hero.name?.[0] ?? "P"}
                </div>
              )}
            </div>
            {hero.openToWork && (
              <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ position: "absolute", bottom: 6, right: 6, width: 18, height: 18, borderRadius: "50%", background: "#22c55e", border: "2.5px solid #07091a", boxShadow: "0 0 10px rgba(34,197,94,0.7)" }} />
            )}
          </motion.div>

          {/* Open-to-work badge */}
          {hero.openToWork && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: "4px 14px", fontSize: 11, color: "#4ade80", fontWeight: 600, marginBottom: 24, letterSpacing: "0.05em" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              Open to opportunities
            </motion.div>
          )}

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            style={{ fontSize: "clamp(2.8rem, 9vw, 5.5rem)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 20, background: "linear-gradient(170deg,#ffffff 40%,rgba(255,255,255,0.45) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {hero.name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease }}
            style={{ fontSize: "clamp(1rem, 2.4vw, 1.2rem)", color: "rgba(255,255,255,0.45)", maxWidth: 560, lineHeight: 1.65, marginBottom: 12, margin: "0 auto 12px" }}
          >
            {hero.tagline}
          </motion.p>

          {/* Location */}
          {hero.location && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.28)", marginBottom: 40, marginTop: 8 }}>
              <MapPin size={12} /> {hero.location}
            </motion.div>
          )}

          {/* CTA row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.48, ease }}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
            <motion.a
              href={hero.ctaPrimary?.href ?? `mailto:${contact.email}`}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 36px rgba(124,58,237,0.55)" }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 30px", borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", cursor: "pointer" }}
            >
              {hero.ctaPrimary?.label ?? "Get in touch"} <ArrowRight size={16} />
            </motion.a>
            <motion.button
              onClick={() => scrollTo("projects")}
              whileHover={{ scale: 1.04, borderColor: "rgba(168,85,247,0.5)" }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 30px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 600, backdropFilter: "blur(8px)", cursor: "pointer" }}
            >
              {hero.ctaSecondary?.label ?? "See my work"}
            </motion.button>
          </motion.div>

          {/* Socials */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
            style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            {Object.entries(contact.socials ?? {}).filter(([, v]) => v).map(([key, url]) => (
              <motion.a key={key} href={url as string} target="_blank" rel="noopener noreferrer"
                whileHover={{ y: -3, color: "#a855f7" }}
                style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s", cursor: "pointer" }}>
                {getSocialIcon(key, "h-4 w-4")}
              </motion.a>
            ))}
            {contact.email && (
              <motion.a href={`mailto:${contact.email}`} whileHover={{ y: -3, color: "#a855f7" }}
                style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s", cursor: "pointer" }}>
                <Mail size={17} />
              </motion.a>
            )}
          </motion.div>

          {/* Scroll cue */}
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            onClick={() => scrollTo("about")}
            style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", padding: 8 }}>
            <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <ChevronDown size={22} />
            </motion.div>
          </motion.button>
        </section>

        {/* ── ABOUT / SKILLS ──────────────────────────────────────────────────── */}
        <section
          id="about"
          ref={(el) => { sectionRefs.current.about = el; }}
          style={{ padding: "96px 24px", maxWidth: 1120, margin: "0 auto" }}
        >
          <SectionLabel eyebrow="About me" title="Skills & Expertise" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
            {(skills?.categories ?? []).map((cat, i) => (
              <motion.div key={cat.name} {...reveal(i * 0.07)}
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 20px 18px", backdropFilter: "blur(8px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#a855f7,#ec4899)" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", textTransform: "uppercase", letterSpacing: "0.18em" }}>{cat.name}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {cat.items.map((skill) => (
                    <motion.span key={skill}
                      whileHover={{ background: "rgba(168,85,247,0.2)", borderColor: "rgba(168,85,247,0.4)" }}
                      style={{ fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 6, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.15)", color: "rgba(255,255,255,0.7)", transition: "all 0.2s", cursor: "default" }}>
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PROJECTS ────────────────────────────────────────────────────────── */}
        <section
          ref={(el) => { sectionRefs.current.projects = el; }}
          style={{ padding: "0 24px 96px", maxWidth: 1120, margin: "0 auto" }}
        >
          <SectionLabel eyebrow="Work" title="Featured Projects" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
            {(projects ?? []).slice(0, 6).map((project, i) => (
              <motion.article key={project.name ?? i} {...reveal(i * 0.07)}
                whileHover={{ y: -6, borderColor: "rgba(168,85,247,0.4)", boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, overflow: "hidden", transition: "border-color 0.25s, box-shadow 0.25s" }}>
                {/* Image / gradient banner */}
                <div style={{ position: "relative", height: 148, overflow: "hidden" }}>
                  {project.imageUrl
                    ? /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={project.imageUrl} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", background: PROJECT_GRADIENTS[i % PROJECT_GRADIENTS.length] }} />
                  }
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 64, background: "linear-gradient(to top,rgba(7,9,26,0.9),transparent)" }} />
                  {project.featured && (
                    <div style={{ position: "absolute", top: 12, left: 12, fontSize: 9, fontWeight: 800, color: "#a855f7", background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 4, padding: "3px 7px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      Featured
                    </div>
                  )}
                </div>
                {/* Body */}
                <div style={{ padding: "16px 20px 20px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 6, letterSpacing: "-0.02em" }}>{project.name}</h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {project.description}
                  </p>
                  {/* Tech stack */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                    {(project.techStack ?? []).slice(0, 5).map((t) => (
                      <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}>{t}</span>
                    ))}
                  </div>
                  {/* Links */}
                  <div style={{ display: "flex", gap: 14 }}>
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#a855f7", textDecoration: "none", letterSpacing: "0.02em" }}>
                        <ExternalLink size={11} /> Live demo
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
                        {getSocialIcon("github", "h-3 w-3")} Source
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ──────────────────────────────────────────────────────── */}
        <section
          ref={(el) => { sectionRefs.current.experience = el; }}
          style={{ padding: "0 24px 96px", maxWidth: 760, margin: "0 auto" }}
        >
          <SectionLabel eyebrow="Career" title="Experience" />
          <div style={{ position: "relative" }}>
            {/* Timeline spine */}
            <div style={{ position: "absolute", left: 19, top: 8, bottom: 8, width: 1, background: "linear-gradient(to bottom, rgba(168,85,247,0.7) 0%, rgba(168,85,247,0.05) 100%)" }} />

            {(experience ?? []).map((exp, i) => (
              <motion.div key={`${exp.company}-${i}`} {...reveal(i * 0.1)}
                style={{ display: "flex", gap: 26, marginBottom: i < (experience?.length ?? 0) - 1 ? 36 : 0 }}>
                {/* Node */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(124,58,237,0.12)", border: "1.5px solid rgba(168,85,247,0.45)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, boxShadow: "0 0 0 6px rgba(124,58,237,0.05)" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)" }} />
                </div>
                {/* Content */}
                <div style={{ flex: 1, paddingTop: 6, paddingBottom: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{exp.role}</h3>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500, whiteSpace: "nowrap" }}>{exp.period}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#a855f7", fontWeight: 600, marginBottom: 8 }}>{exp.company}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── EDUCATION ───────────────────────────────────────────────────────── */}
        {(education ?? []).length > 0 && (
          <section style={{ padding: "0 24px 96px", maxWidth: 1120, margin: "0 auto" }}>
            <SectionLabel eyebrow="Background" title="Education" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {(education ?? []).map((edu, i) => (
                <motion.div key={`${edu.school}-${i}`} {...reveal(i * 0.1)}
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px 24px 20px", backdropFilter: "blur(8px)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 16 }}>🎓</span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4, letterSpacing: "-0.02em" }}>{edu.degree}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>{edu.school}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{edu.period}</p>
                  {edu.notes && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8, lineHeight: 1.5 }}>{edu.notes}</p>}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── CONTACT ─────────────────────────────────────────────────────────── */}
        <section
          ref={(el) => { sectionRefs.current.contact = el; }}
          style={{ padding: "0 24px 80px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease }}
            style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}
          >
            {/* Glowing bg */}
            <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.16) 0%,transparent 68%)", filter: "blur(32px)", pointerEvents: "none" }} />

            <div style={{ position: "relative" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a855f7", marginBottom: 16 }}>Get in touch</p>
              <h2 style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 16, background: "linear-gradient(135deg,#ffffff 0%,rgba(255,255,255,0.55) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>
                Let&apos;s build something great
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, marginBottom: 44, maxWidth: 460, margin: "0 auto 44px" }}>
                {hero.openToWork
                  ? "I'm currently open for new roles and freelance projects. Send me a message and let's talk."
                  : "I occasionally take on select projects. Reach out and let's see if there's a fit."}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
                <motion.a
                  href={`mailto:${contact.email}`}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 48px rgba(124,58,237,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", cursor: "pointer" }}>
                  <Mail size={16} /> Send an email
                </motion.a>
              </div>
              {/* Socials row */}
              <div style={{ display: "flex", gap: 18, justifyContent: "center" }}>
                {Object.entries(contact.socials ?? {}).filter(([, v]) => v).map(([key, url]) => (
                  <motion.a key={key} href={url as string} target="_blank" rel="noopener noreferrer"
                    whileHover={{ y: -3, color: "#a855f7" }}
                    style={{ color: "rgba(255,255,255,0.28)", textDecoration: "none", transition: "color 0.2s", cursor: "pointer" }}>
                    {getSocialIcon(key, "h-4 w-4")}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px", textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.18)" }}>
          Built with{" "}
          <span style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>
            PortfolioForge
          </span>
          {" · "}
          {hero.name}
        </footer>

      </div>
    </div>
  );
}
