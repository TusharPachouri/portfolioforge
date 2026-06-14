"use client";

import { useEffect, useRef } from "react";
import { Sparkles, Download, FileCode, FileText, Check, Square, Eye, Hand } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
 *  PhysicsCardCluster
 *  Hero visual — floating UI cards driven by a small spring-physics system:
 *  • mouse parallax by depth layer
 *  • grab-and-throw dragging with inertia and an underdamped spring return
 *  • idle bobbing stays on the compositor (CSS), physics runs in one rAF
 *    loop that goes to sleep whenever every card has settled
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
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const CARDS: CardSpec[] = [
  {
    id: "ai",
    pos: { top: "6%", left: "8%", width: 232, zIndex: 7 },
    rotate: -5,
    depth: 1.15,
    float: { dur: 3.8, delay: 0 },
    card: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
      color: "#fff",
      padding: "18px 16px",
    },
    node: (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <Sparkles size={14} style={{ opacity: 0.9 }} />
          <span style={{ ...label, letterSpacing: "0.06em", opacity: 0.85 }}>Gemini AI</span>
        </div>
        <div style={{ height: 3, borderRadius: 4, background: "rgba(255,255,255,0.2)", marginBottom: 14, overflow: "hidden", position: "relative" }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: 4,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "pc-shimmer 2s linear infinite",
          }} />
        </div>
        <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 10 }}>Structuring your data…</div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, backdropFilter: "blur(8px)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #c4b5fd, #e9d5ff)", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>Tushar M.</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>Product Engineer</div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "browser",
    pos: { top: "2%", right: "4%", width: 210, zIndex: 6 },
    rotate: 4,
    depth: 0.7,
    float: { dur: 4.2, delay: 150 },
    card: { background: "#ffffff", border: "1px solid #e4e4e7", padding: "14px 14px 12px" },
    node: (
      <>
        <div style={{ ...label, color: "#71717a", marginBottom: 10 }}>Browse 27+ sections</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[
            { name: "Button", bg: "#f0fdf4", accent: "#22c55e" },
            { name: "Card", bg: "#faf5ff", accent: "#a855f7" },
            { name: "Badge", bg: "#fefce8", accent: "#eab308" },
            { name: "Input", bg: "#eff6ff", accent: "#3b82f6" },
          ].map(({ name, bg, accent }) => (
            <div key={name} style={{ background: bg, borderRadius: 8, padding: "8px 6px", textAlign: "center", border: `1px solid ${accent}22` }}>
              <div style={{ width: "100%", height: 4, borderRadius: 2, background: accent, marginBottom: 6, opacity: 0.5 }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: "#3f3f46" }}>{name}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "preview",
    pos: { top: "36%", left: "0%", width: 244, zIndex: 5 },
    rotate: 3,
    depth: 0.9,
    float: { dur: 4.6, delay: 300 },
    card: { background: "#18181b", color: "#fafafa", padding: "16px 14px" },
    node: (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Eye size={12} style={{ color: "#a78bfa" }} />
          <span style={{ ...label, color: "#a1a1aa" }}>Live Preview</span>
        </div>
        <div style={{ background: "#27272a", borderRadius: 8, padding: "12px 10px", marginBottom: 8 }}>
          <div style={{ width: "60%", height: 4, borderRadius: 2, background: "#52525b", marginBottom: 6 }} />
          <div style={{ width: "80%", height: 3, borderRadius: 2, background: "#3f3f46", marginBottom: 4 }} />
          <div style={{ width: "45%", height: 3, borderRadius: 2, background: "#3f3f46", marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 48, height: 16, borderRadius: 4, background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
            <div style={{ width: 48, height: 16, borderRadius: 4, background: "#3f3f46" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#71717a" }}>
          <span>Previewing with your data</span>
          <span style={{ animation: "pc-blink 1s step-end infinite", color: "#a78bfa", fontWeight: 700 }}>|</span>
        </div>
      </>
    ),
  },
  {
    id: "pricing",
    pos: { top: "34%", right: "0%", width: 200, zIndex: 8 },
    rotate: -4,
    depth: 1.3,
    float: { dur: 3.4, delay: 450 },
    card: { background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", border: "1px solid #fde68a", padding: "14px 14px" },
    node: (
      <>
        <div style={{ ...label, fontWeight: 700, color: "#92400e", marginBottom: 10 }}>Pricing</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#78350f" }}>Free</span>
            <span style={{ fontSize: 11, color: "#a16207" }}>3 sections</span>
          </div>
          <div style={{ height: 1, background: "#fde68a" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#78350f" }}>Pro</span>
            <span style={{ fontSize: 11, color: "#a16207" }}>Unlimited ✨</span>
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 9, color: "#a16207" }}>Upgrade</span>
          <div style={{ width: 32, height: 16, borderRadius: 999, background: "#f59e0b", position: "relative" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, right: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
          </div>
        </div>
      </>
    ),
  },
  {
    id: "sections",
    pos: { top: "62%", left: "14%", width: 186, zIndex: 4 },
    rotate: -6,
    depth: 0.55,
    float: { dur: 5, delay: 550 },
    card: { background: "#ffffff", border: "1px solid #e4e4e7", padding: "14px 14px" },
    node: (
      <>
        <div style={{ ...label, color: "#71717a", marginBottom: 10 }}>Your Sections</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            { name: "Hero", checked: true },
            { name: "About", checked: true },
            { name: "Projects", checked: true },
            { name: "Testimonials", checked: false },
          ].map(({ name, checked }) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {checked ? (
                <div style={{ width: 16, height: 16, borderRadius: 4, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={10} color="#fff" strokeWidth={3} />
                </div>
              ) : (
                <Square size={16} color="#d4d4d8" strokeWidth={1.5} />
              )}
              <span style={{ fontSize: 12, fontWeight: checked ? 600 : 400, color: checked ? "#18181b" : "#a1a1aa" }}>{name}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "stack",
    pos: { top: "60%", right: "2%", width: 206, zIndex: 3 },
    rotate: 6,
    depth: 0.45,
    float: { dur: 4, delay: 650 },
    card: { background: "#18181b", color: "#fafafa", padding: "14px 14px" },
    node: (
      <>
        <div style={{ ...label, color: "#71717a", marginBottom: 10 }}>Built with</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {[
            { name: "Next.js", bg: "#27272a", color: "#fafafa" },
            { name: "shadcn/ui", bg: "#27272a", color: "#fafafa" },
            { name: "Gemini AI", bg: "#1e1b4b", color: "#a5b4fc" },
            { name: "Tailwind", bg: "#042f2e", color: "#5eead4" },
          ].map(({ name, bg, color }) => (
            <span key={name} style={{ fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: bg, color, border: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>
              {name}
            </span>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "export",
    pos: { top: "82%", left: "30%", width: 220, zIndex: 6 },
    rotate: 8,
    depth: 1.0,
    float: { dur: 3.6, delay: 800 },
    card: { background: "#ffffff", border: "1px solid #e4e4e7", padding: "14px 14px" },
    node: (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Download size={12} color="#6366f1" />
          <span style={{ ...label, color: "#71717a" }}>Export</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#52525b" }}>
            <FileCode size={12} color="#6366f1" />
            <span>index.tsx</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#52525b" }}>
            <FileText size={12} color="#8b5cf6" />
            <span>globals.css</span>
          </div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "#fff",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
          borderRadius: 8, padding: "7px 0", textAlign: "center",
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
          s.tx = nx * 14 * CARDS[i].depth;
          s.ty = ny * 10 * CARDS[i].depth;
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
        @keyframes pc-float { from { transform: translateY(-5px); } to { transform: translateY(5px); } }
        @keyframes pc-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pc-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .pc-cluster {
          position: relative;
          width: 100%;
          height: 520px;
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
        .pc-float {
          animation: pc-float ease-in-out infinite alternate;
        }
        .pc-dragging .pc-float {
          animation-play-state: paused;
        }
        .pc-card {
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.06);
          transition: box-shadow 0.35s ease;
        }
        .pc-item:hover .pc-card,
        .pc-dragging .pc-card {
          box-shadow: 0 16px 48px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08);
        }
        .pc-hint { display: none; }
        @media (pointer: fine) {
          .pc-hint {
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
        }

        @media (max-width: 768px) {
          .pc-cluster { height: 400px; transform: scale(0.72); transform-origin: top center; }
        }
        @media (max-width: 480px) {
          .pc-cluster { transform: scale(0.58); }
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
