"use client";

import { Sparkles, Download, FileCode, FileText, Check, Square, Eye } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
 *  FloatingCardCluster
 *  Right-side hero visual — a scattered, floating cluster of feature cards
 *  inspired by the reference screenshot of overlapping UI cards.
 * ──────────────────────────────────────────────────────────────────────────── */

export default function FloatingCardCluster() {
  return (
    <>
      {/* Keyframe animations — scoped via unique names */}
      <style>{`
        @keyframes fc-float-1 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes fc-float-2 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(6px); } }
        @keyframes fc-float-3 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        @keyframes fc-float-4 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(5px); } }
        @keyframes fc-float-5 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
        @keyframes fc-float-6 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(6px); } }
        @keyframes fc-float-7 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }

        @keyframes fc-pulse-bar {
          0%,100% { width: 32%; }
          50%     { width: 68%; }
        }
        @keyframes fc-blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
        @keyframes fc-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .fc-cluster {
          position: relative;
          width: 100%;
          height: 520px;
          perspective: 1200px;
        }

        /* On parent hover, children spread apart */
        .fc-cluster:hover .fc-card {
          filter: brightness(1.03);
        }

        .fc-card {
          position: absolute;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.06);
          transition: transform 0.45s cubic-bezier(.4,0,.2,1), box-shadow 0.35s ease;
          will-change: transform;
        }
        .fc-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
          z-index: 20 !important;
        }

        /* ── Responsive ────────────────────────── */
        @media (max-width: 768px) {
          .fc-cluster {
            height: 400px;
            transform: scale(0.72);
            transform-origin: top center;
          }
        }
        @media (max-width: 480px) {
          .fc-cluster {
            transform: scale(0.58);
          }
        }
      `}</style>

      <div className="fc-cluster" aria-hidden="true">

        {/* ─────── 1. AI Preview Card ─────── */}
        <div
          className="fc-card"
          style={{
            top: "6%",
            left: "8%",
            width: 232,
            rotate: "-5deg",
            zIndex: 7,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
            color: "#fff",
            padding: "18px 16px",
            animation: "fc-float-1 3.8s ease-in-out infinite",
            animationDelay: "0ms",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Sparkles size={14} style={{ opacity: 0.9 }} />
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.85 }}>
              Gemini AI
            </span>
          </div>
          {/* shimmer bar */}
          <div style={{ height: 3, borderRadius: 4, background: "rgba(255,255,255,0.2)", marginBottom: 14, overflow: "hidden", position: "relative" }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: 4,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "fc-shimmer 2s linear infinite",
            }} />
          </div>
          <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 10 }}>Structuring your data…</div>
          {/* Mini profile card */}
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, backdropFilter: "blur(8px)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #c4b5fd, #e9d5ff)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>Tushar M.</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>Product Engineer</div>
            </div>
          </div>
        </div>

        {/* ─────── 2. Component Browser Card ─────── */}
        <div
          className="fc-card"
          style={{
            top: "2%",
            right: "4%",
            width: 210,
            rotate: "4deg",
            zIndex: 6,
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            padding: "14px 14px 12px",
            animation: "fc-float-2 4.2s ease-in-out infinite",
            animationDelay: "150ms",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
            Browse 40+ sections
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              { label: "Button", bg: "#f0fdf4", accent: "#22c55e" },
              { label: "Card", bg: "#faf5ff", accent: "#a855f7" },
              { label: "Badge", bg: "#fefce8", accent: "#eab308" },
              { label: "Input", bg: "#eff6ff", accent: "#3b82f6" },
            ].map(({ label, bg, accent }) => (
              <div key={label} style={{
                background: bg,
                borderRadius: 8,
                padding: "8px 6px",
                textAlign: "center",
                border: `1px solid ${accent}22`,
              }}>
                <div style={{ width: "100%", height: 4, borderRadius: 2, background: accent, marginBottom: 6, opacity: 0.5 }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "#3f3f46" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─────── 3. Live Preview Card ─────── */}
        <div
          className="fc-card"
          style={{
            top: "36%",
            left: "0%",
            width: 244,
            rotate: "3deg",
            zIndex: 5,
            background: "#18181b",
            color: "#fafafa",
            padding: "16px 14px",
            animation: "fc-float-3 4.6s ease-in-out infinite",
            animationDelay: "300ms",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Eye size={12} style={{ color: "#a78bfa" }} />
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#a1a1aa" }}>
              Live Preview
            </span>
          </div>
          {/* mock hero preview */}
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
            <span style={{ animation: "fc-blink 1s step-end infinite", color: "#a78bfa", fontWeight: 700 }}>|</span>
          </div>
        </div>

        {/* ─────── 4. Freemium Badge Card ─────── */}
        <div
          className="fc-card"
          style={{
            top: "34%",
            right: "0%",
            width: 200,
            rotate: "-4deg",
            zIndex: 8,
            background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
            border: "1px solid #fde68a",
            padding: "14px 14px",
            animation: "fc-float-4 3.4s ease-in-out infinite",
            animationDelay: "450ms",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
            Pricing
          </div>
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
          {/* toggle */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
            <span style={{ fontSize: 9, color: "#a16207" }}>Upgrade</span>
            <div style={{ width: 32, height: 16, borderRadius: 999, background: "#f59e0b", position: "relative" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, right: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
            </div>
          </div>
        </div>

        {/* ─────── 5. Section Picker Card ─────── */}
        <div
          className="fc-card"
          style={{
            top: "62%",
            left: "14%",
            width: 186,
            rotate: "-6deg",
            zIndex: 4,
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            padding: "14px 14px",
            animation: "fc-float-5 5s ease-in-out infinite",
            animationDelay: "550ms",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
            Your Sections
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { label: "Hero", checked: true },
              { label: "About", checked: true },
              { label: "Projects", checked: true },
              { label: "Testimonials", checked: false },
            ].map(({ label, checked }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {checked ? (
                  <div style={{
                    width: 16, height: 16, borderRadius: 4,
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={10} color="#fff" strokeWidth={3} />
                  </div>
                ) : (
                  <Square size={16} color="#d4d4d8" strokeWidth={1.5} />
                )}
                <span style={{ fontSize: 12, fontWeight: checked ? 600 : 400, color: checked ? "#18181b" : "#a1a1aa" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─────── 6. Tech Stack Card ─────── */}
        <div
          className="fc-card"
          style={{
            top: "60%",
            right: "2%",
            width: 206,
            rotate: "6deg",
            zIndex: 3,
            background: "#18181b",
            color: "#fafafa",
            padding: "14px 14px",
            animation: "fc-float-6 4s ease-in-out infinite",
            animationDelay: "650ms",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
            Built with
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {[
              { label: "Next.js", bg: "#27272a", color: "#fafafa" },
              { label: "shadcn/ui", bg: "#27272a", color: "#fafafa" },
              { label: "Gemini AI", bg: "#1e1b4b", color: "#a5b4fc" },
              { label: "Tailwind", bg: "#042f2e", color: "#5eead4" },
            ].map(({ label, bg, color }) => (
              <span key={label} style={{
                fontSize: 10, fontWeight: 600, padding: "4px 10px",
                borderRadius: 999, background: bg, color,
                border: "1px solid rgba(255,255,255,0.08)",
                whiteSpace: "nowrap",
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ─────── 7. Export Card ─────── */}
        <div
          className="fc-card"
          style={{
            top: "82%",
            left: "30%",
            width: 220,
            rotate: "8deg",
            zIndex: 6,
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            padding: "14px 14px",
            animation: "fc-float-7 3.6s ease-in-out infinite",
            animationDelay: "800ms",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Download size={12} color="#6366f1" />
            <span style={{ fontSize: 10, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Export
            </span>
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
            borderRadius: 8, padding: "7px 0",
            textAlign: "center",
            cursor: "pointer",
          }}>
            Download as ZIP
          </div>
        </div>

      </div>
    </>
  );
}
