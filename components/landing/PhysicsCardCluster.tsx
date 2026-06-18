"use client";

import { useEffect, useRef } from "react";
import { Sparkles, Download, FileCode, FileText, Eye, Hand, Check, Zap, TrendingUp } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
 *  PhysicsCardCluster
 *  Premium hero visual — glassmorphic UI cards driven by a spring-physics system:
 *  • mouse parallax by depth layer
 *  • grab-and-throw dragging with inertia and an underdamped spring return
 *  • idle bobbing stays on the compositor (CSS), physics runs in one rAF loop
 *    that sleeps once every card settles
 *  Decorative only (aria-hidden); fully static under prefers-reduced-motion.
 * ──────────────────────────────────────────────────────────────────────────── */

interface CardSpec {
  id: string;
  pos: React.CSSProperties; // top/left/right + width + zIndex
  rotate: number;           // resting rotation in deg
  depth: number;            // parallax multiplier (higher = closer to viewer)
  float: { dur: number; delay: number };
  card: React.CSSProperties; // visual container styles
  node: React.ReactNode;
}

const label: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const glassLight: React.CSSProperties = {
  background: "rgba(255,255,255,0.66)",
  backdropFilter: "blur(22px) saturate(180%)",
  WebkitBackdropFilter: "blur(22px) saturate(180%)",
  color: "#27272a",
};
const glassDark: React.CSSProperties = {
  background: "rgba(18,16,28,0.74)",
  backdropFilter: "blur(22px) saturate(180%)",
  WebkitBackdropFilter: "blur(22px) saturate(180%)",
  color: "#fafafa",
};

const CARDS: CardSpec[] = [
  // ── 1. AI generation (hero card) ──
  {
    id: "ai",
    pos: { top: "3%", left: "4%", width: 280, zIndex: 8 },
    rotate: -5,
    depth: 1.2,
    float: { dur: 3.8, delay: 0 },
    card: {
      background: "linear-gradient(140deg, #7c3aed 0%, #8b5cf6 45%, #c084fc 100%)",
      color: "#fff",
      padding: "20px 18px",
    },
    node: (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ display: "flex", height: 24, width: 24, alignItems: "center", justifyContent: "center", borderRadius: 8, background: "rgba(255,255,255,0.2)" }}>
              <Sparkles size={13} />
            </span>
            <span style={{ ...label, opacity: 0.92 }}>Gemini AI</span>
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}>LIVE</span>
        </div>
        <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.22)", marginBottom: 8, overflow: "hidden", position: "relative" }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: 4,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
            backgroundSize: "200% 100%", animation: "pc-shimmer 1.8s linear infinite",
          }} />
        </div>
        <div style={{ fontSize: 11.5, opacity: 0.82, marginBottom: 14 }}>Structuring your portfolio…</div>
        <div style={{ background: "rgba(255,255,255,0.16)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,0.18)" }}>
          <div style={{ position: "relative", width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#c4b5fd,#f0abfc)", flexShrink: 0 }}>
            <span style={{ position: "absolute", right: -2, bottom: -2, height: 15, width: 15, borderRadius: "50%", background: "#34d399", border: "2px solid #8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={8} color="#fff" strokeWidth={3.5} />
            </span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>Tushar P.</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>Product Engineer · SF</div>
          </div>
        </div>
      </>
    ),
  },

  // ── 2. Component browser ──
  {
    id: "browser",
    pos: { top: "0%", right: "1%", width: 246, zIndex: 6 },
    rotate: 4,
    depth: 0.7,
    float: { dur: 4.2, delay: 150 },
    card: { ...glassLight, padding: "16px 16px 14px", border: "1px solid rgba(255,255,255,0.6)" },
    node: (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ ...label, color: "#7c3aed" }}>27+ Sections</span>
          <span style={{ fontSize: 16, lineHeight: 1, color: "#a1a1aa" }}>⌘K</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { name: "Hero", from: "#ede9fe", to: "#ddd6fe", accent: "#7c3aed" },
            { name: "Projects", from: "#fef3c7", to: "#fde68a", accent: "#d97706" },
            { name: "Gallery", from: "#dbeafe", to: "#bfdbfe", accent: "#2563eb" },
            { name: "Contact", from: "#dcfce7", to: "#bbf7d0", accent: "#16a34a" },
          ].map((c) => (
            <div key={c.name} style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})`, borderRadius: 12, padding: "10px 10px", border: "1px solid rgba(255,255,255,0.7)" }}>
              <div style={{ width: 22, height: 5, borderRadius: 3, background: c.accent, opacity: 0.55, marginBottom: 8 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#3f3f46" }}>{c.name}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },

  // ── 3. Live preview (dark glass) ──
  {
    id: "preview",
    pos: { top: "36%", left: "-3%", width: 272, zIndex: 5 },
    rotate: 3,
    depth: 0.95,
    float: { dur: 4.6, delay: 300 },
    card: { ...glassDark, padding: "16px 16px", border: "1px solid rgba(255,255,255,0.08)" },
    node: (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Eye size={12} style={{ color: "#c084fc" }} />
            <span style={{ ...label, color: "#a1a1aa" }}>Live Preview</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <span style={{ height: 7, width: 7, borderRadius: "50%", background: "#f87171" }} />
            <span style={{ height: 7, width: 7, borderRadius: "50%", background: "#fbbf24" }} />
            <span style={{ height: 7, width: 7, borderRadius: "50%", background: "#34d399" }} />
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 12px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: "62%", height: 8, borderRadius: 3, background: "linear-gradient(90deg,#a78bfa,#f0abfc)", marginBottom: 8 }} />
          <div style={{ width: "85%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)", marginBottom: 5 }} />
          <div style={{ width: "48%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 7 }}>
            <div style={{ width: 56, height: 20, borderRadius: 7, background: "linear-gradient(90deg,#7c3aed,#a855f7)" }} />
            <div style={{ width: 56, height: 20, borderRadius: 7, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "#a1a1aa" }}>
          Previewing with your data
          <span style={{ animation: "pc-blink 1s step-end infinite", color: "#c084fc", fontWeight: 700 }}>▍</span>
        </div>
      </>
    ),
  },

  // ── 4. Pricing ──
  {
    id: "pricing",
    pos: { top: "31%", right: "-2%", width: 230, zIndex: 9 },
    rotate: -4,
    depth: 1.35,
    float: { dur: 3.4, delay: 450 },
    card: { background: "linear-gradient(140deg, #fffbeb 0%, #fef3c7 100%)", border: "1px solid #fde68a", color: "#78350f", padding: "16px 16px" },
    node: (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ ...label, color: "#b45309" }}>Pricing</span>
          <TrendingUp size={13} color="#d97706" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Free</span>
            <span style={{ fontSize: 11.5, color: "#a16207" }}>3 sections</span>
          </div>
          <div style={{ height: 1, background: "#fde68a" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 800 }}>
              <Zap size={11} fill="#d97706" color="#d97706" /> Pro
            </span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#b45309" }}>Unlimited ✨</span>
          </div>
        </div>
        <div style={{ marginTop: 13, display: "flex", alignItems: "center", gap: 7, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#a16207" }}>Upgrade</span>
          <div style={{ width: 36, height: 18, borderRadius: 999, background: "linear-gradient(90deg,#f59e0b,#d97706)", position: "relative", boxShadow: "0 1px 4px rgba(217,119,6,0.4)" }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, right: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </div>
      </>
    ),
  },

  // ── 5. Tech stack (dark glass) ──
  {
    id: "stack",
    pos: { top: "62%", right: "4%", width: 232, zIndex: 4 },
    rotate: 6,
    depth: 0.5,
    float: { dur: 4, delay: 650 },
    card: { ...glassDark, padding: "16px 16px", border: "1px solid rgba(255,255,255,0.08)" },
    node: (
      <>
        <span style={{ ...label, color: "#a1a1aa", display: "block", marginBottom: 12 }}>Built with</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            { name: "Next.js", bg: "rgba(255,255,255,0.08)", color: "#fafafa" },
            { name: "shadcn/ui", bg: "rgba(255,255,255,0.08)", color: "#fafafa" },
            { name: "Gemini AI", bg: "rgba(99,102,241,0.25)", color: "#c7d2fe" },
            { name: "Tailwind", bg: "rgba(20,184,166,0.22)", color: "#5eead4" },
            { name: "Drizzle", bg: "rgba(34,197,94,0.2)", color: "#86efac" },
          ].map((t) => (
            <span key={t.name} style={{ fontSize: 10.5, fontWeight: 600, padding: "5px 11px", borderRadius: 999, background: t.bg, color: t.color, border: "1px solid rgba(255,255,255,0.1)", whiteSpace: "nowrap" }}>
              {t.name}
            </span>
          ))}
        </div>
      </>
    ),
  },

  // ── 6. Export ──
  {
    id: "export",
    pos: { top: "67%", left: "12%", width: 252, zIndex: 7 },
    rotate: 7,
    depth: 1.05,
    float: { dur: 3.6, delay: 800 },
    card: { ...glassLight, padding: "16px 16px", border: "1px solid rgba(255,255,255,0.6)" },
    node: (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
          <Download size={13} color="#7c3aed" />
          <span style={{ ...label, color: "#7c3aed" }}>Export</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#52525b" }}>
            <FileCode size={13} color="#7c3aed" /> index.tsx
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#52525b" }}>
            <FileText size={13} color="#a855f7" /> globals.css
          </div>
        </div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "#fff",
          background: "linear-gradient(90deg, #7c3aed, #a855f7)",
          borderRadius: 12, padding: "9px 0", textAlign: "center",
          boxShadow: "0 6px 18px -4px rgba(124,58,237,0.5)",
        }}>
          Download as ZIP
        </div>
      </>
    ),
  },
];

interface SpringState {
  x: number; y: number;
  vx: number; vy: number;
  tx: number; ty: number;
  rot: number;
  dragging: boolean;
  grabDX: number; grabDY: number;
  lastT: number; lastX: number; lastY: number;
}

export default function PhysicsCardCluster() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const states: SpringState[] = CARDS.map(() => ({
      x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, rot: 0,
      dragging: false, grabDX: 0, grabDY: 0, lastT: 0, lastX: 0, lastY: 0,
    }));

    let raf = 0;
    let running = false;
    let lastTime = 0;

    const apply = (i: number) => {
      const el = itemRefs.current[i];
      if (!el) return;
      const s = states[i];
      el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${(CARDS[i].rotate + s.rot).toFixed(2)}deg)`;
    };

    const step = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.034) : 0.016;
      lastTime = now;
      let active = false;

      states.forEach((s, i) => {
        if (s.dragging) {
          active = true;
        } else {
          // Underdamped spring toward target — gives natural overshoot on release
          const k = 110, damping = 13;
          s.vx += (k * (s.tx - s.x) - damping * s.vx) * dt;
          s.vy += (k * (s.ty - s.y) - damping * s.vy) * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          if (Math.abs(s.tx - s.x) > 0.1 || Math.abs(s.ty - s.y) > 0.1 || Math.abs(s.vx) > 1 || Math.abs(s.vy) > 1) {
            active = true;
          } else {
            s.x = s.tx; s.y = s.ty; s.vx = 0; s.vy = 0;
          }
        }
        // Velocity-based tilt, eased so cards lean into their motion
        const tiltTarget = Math.max(-8, Math.min(8, s.vx * 0.02));
        s.rot += (tiltTarget - s.rot) * Math.min(1, dt * 10);
        if (Math.abs(s.rot) > 0.05) active = true;
        else s.rot = 0;
        apply(i);
      });

      if (active) {
        raf = requestAnimationFrame(step);
      } else {
        running = false;
        lastTime = 0;
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        lastTime = 0;
        raf = requestAnimationFrame(step);
      }
    };

    // ── Mouse parallax by depth ──
    const onMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      states.forEach((s, i) => {
        if (!s.dragging) {
          s.tx = nx * 20 * CARDS[i].depth;
          s.ty = ny * 14 * CARDS[i].depth;
        }
      });
      wake();
    };
    const onLeave = () => {
      states.forEach((s) => {
        if (!s.dragging) { s.tx = 0; s.ty = 0; }
      });
      wake();
    };
    if (finePointer) {
      container.addEventListener("pointermove", onMove);
      container.addEventListener("pointerleave", onLeave);
    }

    // ── Grab-and-throw dragging ──
    const cleanups: (() => void)[] = [];
    if (finePointer) {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = states[i];
        const down = (e: PointerEvent) => {
          if (e.button !== 0) return;
          el.setPointerCapture(e.pointerId);
          s.dragging = true;
          s.grabDX = e.clientX - s.x;
          s.grabDY = e.clientY - s.y;
          s.lastT = performance.now();
          s.lastX = e.clientX;
          s.lastY = e.clientY;
          el.classList.add("pc-dragging");
          wake();
        };
        const move = (e: PointerEvent) => {
          if (!s.dragging) return;
          const now = performance.now();
          const dt = Math.max((now - s.lastT) / 1000, 0.001);
          const vMax = 1400; // clamp throw speed so releases stay controlled
          s.vx = Math.max(-vMax, Math.min(vMax, (e.clientX - s.lastX) / dt));
          s.vy = Math.max(-vMax, Math.min(vMax, (e.clientY - s.lastY) / dt));
          s.lastT = now;
          s.lastX = e.clientX;
          s.lastY = e.clientY;
          s.x = e.clientX - s.grabDX;
          s.y = e.clientY - s.grabDY;
        };
        const up = (e: PointerEvent) => {
          if (!s.dragging) return;
          s.dragging = false;
          el.classList.remove("pc-dragging");
          try { el.releasePointerCapture(e.pointerId); } catch { /* already released */ }
          wake(); // carried velocity + spring = inertia and snap-back
        };
        el.addEventListener("pointerdown", down);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);
        cleanups.push(() => {
          el.removeEventListener("pointerdown", down);
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerup", up);
          el.removeEventListener("pointercancel", up);
        });
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      if (finePointer) {
        container.removeEventListener("pointermove", onMove);
        container.removeEventListener("pointerleave", onLeave);
      }
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes pc-float { from { transform: translateY(-7px); } to { transform: translateY(7px); } }
        @keyframes pc-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pc-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .pc-cluster {
          position: relative;
          width: 100%;
          height: 580px;
        }
        .pc-item {
          position: absolute;
          will-change: transform;
          user-select: none;
          -webkit-user-select: none;
          touch-action: pan-y;
        }
        @media (pointer: fine) {
          .pc-item { cursor: grab; }
          .pc-item.pc-dragging { cursor: grabbing; z-index: 30 !important; }
        }
        .pc-float { animation: pc-float ease-in-out infinite alternate; }
        .pc-dragging .pc-float { animation-play-state: paused; }

        .pc-card {
          position: relative;
          border-radius: 20px;
          box-shadow:
            0 28px 70px -18px rgba(76, 29, 149, 0.40),
            0 12px 32px -12px rgba(0,0,0,0.16),
            inset 0 1px 0 rgba(255,255,255,0.22);
          transition: box-shadow 0.35s ease;
        }
        /* Gradient hairline border that works on any card background */
        .pc-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(140deg, rgba(255,255,255,0.7), rgba(255,255,255,0.04) 42%, rgba(168,85,247,0.4));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .pc-item:hover .pc-card,
        .pc-dragging .pc-card {
          box-shadow:
            0 40px 90px -18px rgba(76, 29, 149, 0.55),
            0 16px 44px -12px rgba(0,0,0,0.22),
            inset 0 1px 0 rgba(255,255,255,0.3);
        }
        .pc-hint { display: none; }
        @media (pointer: fine) {
          .pc-hint { display: inline-flex; align-items: center; gap: 6px; }
        }

        @media (max-width: 768px) {
          .pc-cluster { height: 480px; transform: scale(0.85); transform-origin: top center; }
        }
        @media (max-width: 480px) {
          .pc-cluster { height: 430px; transform: scale(0.75); }
        }
      `}</style>

      <div ref={containerRef} className="pc-cluster" aria-hidden="true">
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="pc-item"
            style={{ ...card.pos, transform: `rotate(${card.rotate}deg)` }}
          >
            <div
              className="pc-float"
              style={{ animationDuration: `${card.float.dur}s`, animationDelay: `${card.float.delay}ms` }}
            >
              <div className="pc-card" style={card.card}>
                {card.node}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="pc-hint justify-center w-full text-xs text-zinc-400 mt-2 motion-reduce:hidden">
        <Hand className="h-3.5 w-3.5" aria-hidden="true" />
        Grab a card — they have real physics
      </p>
    </>
  );
}
