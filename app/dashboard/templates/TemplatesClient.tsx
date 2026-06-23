"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Sparkles, ArrowRight, LayoutTemplate } from "lucide-react";
import { applyTemplate } from "@/lib/actions/portfolio";
import type { PortfolioTemplate } from "@/lib/templates";

// ─── Mini portfolio thumbnail previews ───────────────────────────────────────

function MidnightProPreview() {
  return (
    <div style={{ width: 640, height: 1100, background: "#0d1117", fontFamily: "system-ui,sans-serif", position: "absolute", top: 0, left: 0 }}>
      {/* Hero */}
      <div style={{ padding: "48px 40px 36px", textAlign: "center", borderBottom: "1px solid #21262d" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#6e40c9,#a78bfa)", margin: "0 auto 12px", border: "3px solid #30363d", boxShadow: "0 0 0 4px rgba(167,139,250,0.15)" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#162032", border: "1px solid #1f6feb", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#58a6ff", marginBottom: 14 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3fb950", display: "inline-block" }} />
          Open to work
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#e6edf3", marginBottom: 6, letterSpacing: -1 }}>Your Name</div>
        <div style={{ fontSize: 14, color: "#8b949e", marginBottom: 20 }}>Software Developer · Full Stack Engineer</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ background: "linear-gradient(135deg,#6e40c9,#a78bfa)", borderRadius: 8, padding: "9px 22px", color: "white", fontSize: 13, fontWeight: 600, letterSpacing: 0.3 }}>Get in touch →</div>
          <div style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 8, padding: "9px 22px", color: "#e6edf3", fontSize: 13 }}>View projects</div>
        </div>
      </div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: "1px solid #21262d" }}>
        {[["2+", "Years Exp."], ["4+", "Projects"], ["35+", "Skills"], ["Yes", "Open to Work"]].map(([v, l], i) => (
          <div key={l} style={{ padding: "18px 10px", textAlign: "center", borderRight: i < 3 ? "1px solid #21262d" : "none" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#e6edf3" }}>{v}</div>
            <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Skills marquee */}
      <div style={{ padding: "28px 32px", borderBottom: "1px solid #21262d", overflow: "hidden" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6e7681", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Skills</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Next.js", "GraphQL", "Redis"].map((s) => (
            <div key={s} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 6, padding: "5px 11px", fontSize: 11, color: "#c9d1d9" }}>{s}</div>
          ))}
        </div>
      </div>
      {/* Projects */}
      <div style={{ padding: "28px 32px", borderBottom: "1px solid #21262d" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6e7681", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Projects</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { color: "from-violet-900 to-indigo-900" },
            { color: "from-emerald-900 to-teal-900" },
            { color: "from-rose-900 to-pink-900" },
            { color: "from-amber-900 to-orange-900" },
          ].map((p, i) => (
            <div key={i} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: 60, background: `linear-gradient(135deg, ${["#1e1b4b,#312e81", "#064e3b,#065f46", "#4c0519,#881337", "#431407,#7c2d12"][i]})` }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ height: 10, width: "70%", background: "#30363d", borderRadius: 3, marginBottom: 5 }} />
                <div style={{ height: 8, width: "90%", background: "#21262d", borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Experience */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid #21262d" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6e7681", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Experience</div>
        {[1, 2].map((i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#21262d", border: "1px solid #30363d", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#a78bfa" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ height: 10, width: "55%", background: "#c9d1d9", borderRadius: 3, marginBottom: 5 }} />
              <div style={{ height: 8, width: "40%", background: "#8b949e", borderRadius: 3, marginBottom: 8 }} />
              <div style={{ height: 8, width: "90%", background: "#21262d", borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
      {/* Contact */}
      <div style={{ padding: "24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#e6edf3", marginBottom: 8 }}>Let&apos;s work together</div>
        <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 16 }}>Open to full-time, contract &amp; freelance</div>
        <div style={{ background: "linear-gradient(135deg,#6e40c9,#a78bfa)", borderRadius: 8, padding: "10px 28px", color: "white", fontSize: 13, fontWeight: 600, display: "inline-block" }}>Send a message</div>
      </div>
    </div>
  );
}

function CleanMinimalPreview() {
  return (
    <div style={{ width: 640, height: 1100, background: "#ffffff", fontFamily: "Georgia,serif", position: "absolute", top: 0, left: 0 }}>
      {/* Hero */}
      <div style={{ padding: "48px 48px 36px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#6d28d9,#a78bfa)", marginBottom: 20, border: "3px solid white", boxShadow: "0 0 0 2px #e9d5ff" }} />
        <div style={{ fontSize: 34, fontWeight: 800, color: "#111827", marginBottom: 8, lineHeight: 1.1, letterSpacing: -1.5 }}>Your Name</div>
        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 20, fontFamily: "system-ui" }}>Designer & Frontend Engineer — Crafting experiences that matter</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: "#111827", borderRadius: 6, padding: "9px 20px", color: "white", fontSize: 12, fontWeight: 600, fontFamily: "system-ui" }}>View work →</div>
          <div style={{ background: "transparent", border: "1px solid #d1d5db", borderRadius: 6, padding: "9px 20px", color: "#374151", fontSize: 12, fontFamily: "system-ui" }}>Contact me</div>
        </div>
      </div>
      {/* About */}
      <div style={{ padding: "28px 48px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12, fontFamily: "system-ui" }}>About</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {["Building for the web since 2018", "Open to work", "Based in New York", "Available immediately"].map((h) => (
            <div key={h} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#374151", fontFamily: "system-ui" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#6d28d9", flexShrink: 0 }} />
              {h}
            </div>
          ))}
        </div>
      </div>
      {/* Skills */}
      <div style={{ padding: "28px 48px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14, fontFamily: "system-ui" }}>Skills</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {["Design", "React", "TypeScript", "CSS", "Node.js", "Figma"].map((s) => (
            <div key={s} style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 8, padding: "10px 14px", textAlign: "center", fontFamily: "system-ui" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Projects */}
      <div style={{ padding: "28px 48px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14, fontFamily: "system-ui" }}>Projects</div>
        {[["Design System", "Built a full DS in Figma + React"], ["Portfolio Builder", "Next.js · TypeScript · Tailwind"]].map(([n, d]) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f3f4f6", fontFamily: "system-ui" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{n}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{d}</div>
            </div>
            <div style={{ fontSize: 16, color: "#d1d5db" }}>→</div>
          </div>
        ))}
      </div>
      {/* Contact */}
      <div style={{ padding: "28px 48px" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Ready to build something great?</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14, fontFamily: "system-ui" }}>Let&apos;s talk about your project.</div>
        <div style={{ background: "#111827", borderRadius: 6, padding: "10px 24px", color: "white", fontSize: 12, fontWeight: 600, display: "inline-block", fontFamily: "system-ui" }}>Get in touch</div>
      </div>
    </div>
  );
}

function GradientPopPreview() {
  return (
    <div style={{ width: 640, height: 1100, background: "linear-gradient(145deg,#1e1b4b,#312e81)", fontFamily: "system-ui,sans-serif", position: "absolute", top: 0, left: 0 }}>
      {/* Hero */}
      <div style={{ padding: "48px 40px 36px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#ef4444)", margin: "0 auto 16px", border: "3px solid rgba(255,255,255,0.2)" }} />
        <div style={{ fontSize: 32, fontWeight: 800, color: "white", marginBottom: 8, letterSpacing: -1 }}>Your Name</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>Creative Engineer · Building boldly</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <div style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius: 10, padding: "10px 24px", color: "white", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}>Let&apos;s Build →</div>
          <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 24px", color: "white", fontSize: 13, backdropFilter: "blur(8px)" }}>My Work</div>
        </div>
      </div>
      {/* Skills */}
      <div style={{ padding: "20px 32px 24px", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            ["React", "#3b82f6"], ["TypeScript", "#8b5cf6"], ["Node.js", "#10b981"],
            ["Figma", "#ec4899"], ["AWS", "#f59e0b"], ["Docker", "#06b6d4"],
          ].map(([s, c]) => (
            <div key={s} style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${c}40`, borderRadius: 20, padding: "5px 14px", fontSize: 11, color: "white", fontWeight: 600 }}>
              <span style={{ color: c }}>●</span> {s}
            </div>
          ))}
        </div>
      </div>
      {/* Projects */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Featured Work</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["linear-gradient(135deg,#f59e0b,#ef4444)", "SaaS Dashboard"],
            ["linear-gradient(135deg,#8b5cf6,#ec4899)", "Design System"],
            ["linear-gradient(135deg,#10b981,#06b6d4)", "Mobile App"],
            ["linear-gradient(135deg,#3b82f6,#8b5cf6)", "Portfolio Site"],
          ].map(([bg, name]) => (
            <div key={name} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden", backdropFilter: "blur(8px)" }}>
              <div style={{ height: 56, background: bg }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 4 }}>{name}</div>
                <div style={{ height: 8, width: "80%", background: "rgba(255,255,255,0.1)", borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Experience */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Experience</div>
        {[["Senior Engineer · Startup", "2022–Present"], ["Frontend Dev · Agency", "2020–2022"]].map(([role, period]) => (
          <div key={role} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", marginBottom: 8, backdropFilter: "blur(4px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "white" }}>{role}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{period}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Contact */}
      <div style={{ padding: "24px 32px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius: 12, padding: "20px", boxShadow: "0 8px 32px rgba(245,158,11,0.3)" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 6 }}>Ready to collaborate?</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginBottom: 14 }}>Let&apos;s build something amazing together</div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "8px 20px", color: "white", fontSize: 12, fontWeight: 700, display: "inline-block", backdropFilter: "blur(4px)" }}>Drop me a line</div>
        </div>
      </div>
    </div>
  );
}

function PremiumNightPreview() {
  return (
    <div style={{ width: 640, height: 1100, background: "#07091a", fontFamily: "system-ui,sans-serif", position: "absolute", top: 0, left: 0, overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.25) 0%,transparent 65%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", top: "20%", right: "-10%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.18) 0%,transparent 65%)", filter: "blur(40px)" }} />
      {/* Navbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 56, background: "rgba(7,9,26,0.7)", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: 16, fontWeight: 900, background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>alex.dev</div>
        <div style={{ display: "flex", gap: 4 }}>
          {["About", "Projects", "Experience", "Contact"].map((l, i) => (
            <div key={l} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, color: i === 1 ? "white" : "rgba(255,255,255,0.4)", background: i === 1 ? "rgba(168,85,247,0.14)" : "transparent", border: i === 1 ? "1px solid rgba(168,85,247,0.3)" : "1px solid transparent" }}>{l}</div>
          ))}
        </div>
        <div style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: 16, padding: "6px 16px", fontSize: 10, fontWeight: 700, color: "white" }}>Hire me</div>
      </div>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "40px 40px 32px", position: "relative", zIndex: 1 }}>
        <div style={{ width: 76, height: 76, borderRadius: "50%", padding: 3, background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)", margin: "0 auto 16px", boxShadow: "0 0 36px rgba(124,58,237,0.45)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "linear-gradient(135deg,#1e1b4b,#312e81)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "white" }}>A</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 16, padding: "3px 10px", fontSize: 9, color: "#4ade80", fontWeight: 600, marginBottom: 12 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e" }} /> Open to opportunities
        </div>
        <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, background: "linear-gradient(170deg,#ffffff 40%,rgba(255,255,255,0.45) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: 10 }}>Alex Chen</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", marginBottom: 24 }}>Full-Stack Engineer · Building products people love</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <div style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: 10, padding: "9px 22px", fontSize: 12, fontWeight: 700, color: "white" }}>Get in touch →</div>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 22px", fontSize: 12, color: "rgba(255,255,255,0.7)", backdropFilter: "blur(6px)" }}>See my work</div>
        </div>
      </div>
      {/* Skills */}
      <div style={{ padding: "20px 40px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#a855f7", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 12 }}>Skills & Expertise</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[["Frontend", ["React", "Next.js", "TypeScript"]], ["Backend", ["Node.js", "Python", "Go"]], ["Cloud", ["AWS", "Docker", "K8s"]], ["Design", ["Figma", "CSS", "Motion"]]].map(([cat, items]) => (
            <div key={cat as string} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 10px 8px" }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: "#a855f7", letterSpacing: "0.15em", marginBottom: 6 }}>{cat as string}</div>
              {(items as string[]).map(s => <div key={s} style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", marginBottom: 3, background: "rgba(168,85,247,0.08)", borderRadius: 3, padding: "2px 6px", display: "inline-block", marginRight: 3 }}>{s}</div>)}
            </div>
          ))}
        </div>
      </div>
      {/* Projects */}
      <div style={{ padding: "18px 40px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#a855f7", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 12 }}>Featured Projects</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[["#1e1b4b,#4c1d95", "SaaS Dashboard"], ["#064e3b,#047857", "Mobile App"], ["#4c0519,#9f1239", "Design System"]].map(([bg, name]) => (
            <div key={name} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: 48, background: `linear-gradient(135deg,${bg})` }} />
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "white", marginBottom: 3 }}>{name}</div>
                <div style={{ height: 6, width: "75%", background: "rgba(255,255,255,0.07)", borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Experience */}
      <div style={{ padding: "16px 40px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#a855f7", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 12 }}>Experience</div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 13, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom,rgba(168,85,247,0.6),rgba(168,85,247,0.05))" }} />
          {[["Senior Engineer", "Acme Corp", "2022–Now"], ["Frontend Dev", "StartupCo", "2020–2022"]].map(([role, co, period]) => (
            <div key={role} style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(124,58,237,0.12)", border: "1.5px solid rgba(168,85,247,0.4)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#a855f7" }} />
              </div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "white" }}>{role}</span>
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{period}</span>
                </div>
                <div style={{ fontSize: 9, color: "#a855f7", fontWeight: 600 }}>{co}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Contact */}
      <div style={{ padding: "20px 40px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 280, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 68%)", filter: "blur(24px)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#a855f7", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Get in touch</div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -1, background: "linear-gradient(135deg,#fff,rgba(255,255,255,0.55))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 10 }}>Let&apos;s build something great</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)", borderRadius: 10, padding: "9px 24px", fontSize: 11, fontWeight: 700, color: "white", boxShadow: "0 6px 24px rgba(124,58,237,0.4)" }}>✉ Send an email</div>
        </div>
      </div>
    </div>
  );
}

const PREVIEW_MAP: Record<string, React.ReactNode> = {
  "midnight-pro":    <MidnightProPreview />,
  "clean-minimal":   <CleanMinimalPreview />,
  "gradient-pop":    <GradientPopPreview />,
  "premium-night":   <PremiumNightPreview />,
};

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  isActive,
  onApply,
  applying,
}: {
  template: PortfolioTemplate;
  isActive: boolean;
  onApply: () => void;
  applying: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        isActive
          ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-zinc-900 shadow-xl shadow-violet-500/20"
          : "ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-sm hover:shadow-xl"
      }`}
    >
      {/* Mini preview — scaled-down full portfolio */}
      <div className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-900" style={{ height: 220 }}>
        <div
          style={{
            position: "absolute", top: 0, left: 0,
            width: 640, height: 1100,
            transform: "scale(0.34375)", transformOrigin: "top left",
            pointerEvents: "none", userSelect: "none",
          }}
        >
          {PREVIEW_MAP[template.id]}
        </div>

        {/* Hover overlay with "Use Template" CTA */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
              }}
            >
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.2 }}
                onClick={onApply}
                disabled={applying}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-60 transition-all"
                style={{
                  background: "linear-gradient(135deg,#a855f7,#7c3aed)",
                  color: "white",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
                }}
              >
                {applying ? (
                  <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isActive ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <LayoutTemplate className="h-4 w-4" />
                )}
                {isActive ? "Applied" : "Use Template"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active badge */}
        {isActive && (
          <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            <CheckCircle2 className="h-3 w-3" /> Active
          </div>
        )}

        {/* Tier badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            template.tier === "pro"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
          }`}>
            {template.tier === "pro" ? <><Zap className="inline h-2.5 w-2.5 mr-0.5" />Pro</> : "Free"}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 bg-white dark:bg-zinc-900 flex-1">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{template.name}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{template.description}</p>
        </div>

        {/* Tags + component count */}
        <div className="flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 capitalize">
              {tag}
            </span>
          ))}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            {template.componentIds.length} sections
          </span>
        </div>

        {/* Apply button */}
        <motion.button
          type="button"
          onClick={onApply}
          disabled={applying || isActive}
          whileTap={{ scale: 0.97 }}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-default"
          style={isActive ? {
            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            color: "white",
            boxShadow: "0 0 0 2px rgba(167,139,250,0.4)",
            opacity: 1,
          } : {
            background: "linear-gradient(135deg,#a855f7,#7c3aed)",
            color: "white",
            boxShadow: "0 2px 10px rgba(124,58,237,0.35)",
          }}
        >
          {applying ? (
            <>
              <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Applying…
            </>
          ) : isActive ? (
            <><CheckCircle2 className="h-3.5 w-3.5" /> Applied</>
          ) : (
            <>Use Template <ArrowRight className="h-3.5 w-3.5" /></>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface Props {
  templates: PortfolioTemplate[];
  currentThemeId: string;
  currentComponentIds: string[];
}

export default function TemplatesClient({ templates, currentThemeId, currentComponentIds }: Props) {
  const router = useRouter();
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const isActive = (t: PortfolioTemplate) =>
    applied === t.id ||
    (applied === null &&
      t.themeId === currentThemeId &&
      t.componentIds.length === currentComponentIds.length &&
      t.componentIds.every((id, i) => currentComponentIds[i] === id));

  async function handleApply(templateId: string) {
    if (applying) return;
    setApplying(templateId);
    startTransition(async () => {
      try {
        await applyTemplate(templateId);
        setApplied(templateId);
        router.push("/dashboard");
      } finally {
        setApplying(null);
      }
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <div className="flex items-center gap-2.5 mb-1">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
            <LayoutTemplate className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Templates</h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 ml-[44px]">
          One click to apply a complete portfolio — theme, layout, and sections all set for you.
        </p>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start gap-3 p-4 rounded-xl mb-8 border"
        style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.05),rgba(124,58,237,0.05))", borderColor: "rgba(139,92,246,0.2)" }}
      >
        <Sparkles className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Templates automatically use <strong>your personalized data</strong> — name, bio, skills, projects, and experience are pulled from the details you&apos;ve already filled in. Applying a template replaces your current section order and theme.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <TemplateCard
              template={template}
              isActive={isActive(template)}
              onApply={() => handleApply(template.id)}
              applying={applying === template.id}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
