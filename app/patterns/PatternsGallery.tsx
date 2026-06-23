"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Zap, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { patterns } from "@/lib/patterns/registry";
import { vantaPatterns } from "@/lib/patterns/vantaRegistry";
import { PatternCategory } from "@/lib/patterns/types";
import PatternCard from "@/components/patterns/PatternCard";
import PatternCodeModal from "@/components/patterns/PatternCodeModal";
import VantaPatternCard from "@/components/patterns/VantaPatternCard";
import VantaCodeModal from "@/components/patterns/VantaCodeModal";
import WebGLLiveBackground from "@/components/patterns/WebGLLiveBackground";
import CardReveal from "@/components/patterns/CardReveal";

const WEBGL_INITIAL = 3;
const ease = [0.22, 1, 0.36, 1] as const;

const CSS_TABS: { id: "all" | PatternCategory; label: string }[] = [
  { id: "all",         label: "All"        },
  { id: "animated",   label: "Animated"   },
  { id: "gradient",   label: "Gradients"  },
  { id: "geometric",  label: "Geometric"  },
  { id: "decorative", label: "Decorative" },
];

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease },
});

interface CodeModalState  { id: string; name: string; css: string }
interface VantaModalState { name: string; code: string; id: string }

export default function PatternsGallery() {
  const [cssTab, setCssTab]               = useState<"all" | PatternCategory>("all");
  const [search, setSearch]               = useState("");
  const [webglExpanded, setWebglExpanded] = useState(false);
  const [codeModal, setCodeModal]         = useState<CodeModalState | null>(null);
  const [vantaModal, setVantaModal]       = useState<VantaModalState | null>(null);
  const [appliedId, setAppliedId]         = useState<string | null>(null);
  const [liveTheme, setLiveTheme]         = useState<React.CSSProperties | null>(null);
  const [webglApplied, setWebglApplied]   = useState<string | null>(null);

  const appliedWebgl = webglApplied ? vantaPatterns.find((p) => p.id === webglApplied) : null;
  const q = search.toLowerCase();

  const allWebGL    = vantaPatterns.filter((p) =>
    !search || p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
  );
  const visibleWebGL = webglExpanded ? allWebGL : allWebGL.slice(0, WEBGL_INITIAL);

  const filteredCSS = patterns.filter((p) => {
    if (cssTab !== "all" && p.category !== cssTab) return false;
    return !search || p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
  });

  return (
    <div className="relative min-h-screen transition-colors duration-500"
      style={!appliedWebgl ? (liveTheme || undefined) : undefined}>
      {liveTheme && !appliedWebgl && (
        <div className="absolute inset-0 bg-white/70 pointer-events-none" aria-hidden="true" />
      )}
      {appliedWebgl && (
        <WebGLLiveBackground
          effect={appliedWebgl.vantaEffect}
          config={appliedWebgl.vantaConfig}
          name={appliedWebgl.name}
          onClear={() => { setWebglApplied(null); setAppliedId(null); }}
        />
      )}

      <div className="relative max-w-6xl mx-auto px-4 py-12" style={{ zIndex: 2 }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.div className="text-center mb-10" {...fadeUp(0)}>
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-violet-500 mb-2">The Library</p>
          <h1 className="text-4xl font-bold text-zinc-900 mb-1">
            Pattern <span className="font-serif italic font-normal text-zinc-500">Library</span>
          </h1>
          <p className="text-zinc-500 text-sm">Apply any pattern to preview it as a live page theme</p>
        </motion.div>

        {/* ── Search ──────────────────────────────────────────────────── */}
        <motion.div className="relative max-w-sm mx-auto mb-12" {...fadeUp(0.1)}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patterns…"
            aria-label="Search patterns"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 shadow-sm"
          />
        </motion.div>

        {/* ── WebGL section ───────────────────────────────────────────── */}
        <motion.section className="mb-14" {...fadeUp(0.15)}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                <Zap className="h-3 w-3 text-yellow-400" aria-hidden="true" />
                WebGL
              </span>
              <span className="text-sm text-zinc-500">{vantaPatterns.length} GPU effects</span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">Hover to animate · Preview for full-page</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleWebGL.map((pattern, idx) => (
              <CardReveal key={pattern.id} col={idx % 3}>
                <VantaPatternCard
                  pattern={pattern}
                  isActive={appliedId === pattern.id}
                  onApply={() => {
                    setAppliedId(pattern.id);
                    setWebglApplied(pattern.id);
                    setLiveTheme(null);
                  }}
                  onShowCode={(code, name) => setVantaModal({ code, name, id: pattern.id })}
                />
              </CardReveal>
            ))}
          </div>

          {allWebGL.length > WEBGL_INITIAL && (
            <div className="mt-6 text-center">
              <motion.button
                type="button"
                onClick={() => setWebglExpanded((x) => !x)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-zinc-700 cursor-pointer"
                style={{
                  background: "white",
                  border: "1px solid #e4e4e7",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <motion.span animate={{ rotate: webglExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
                {webglExpanded ? "Show less" : `Show all ${allWebGL.length} WebGL effects`}
              </motion.button>
            </div>
          )}
        </motion.section>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, scaleX: 0.6 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-zinc-400">CSS Patterns</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </motion.div>

        {/* ── CSS section ─────────────────────────────────────────────── */}
        <section>
          <motion.div
            className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl w-fit mb-6 flex-wrap shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease }}
          >
            {CSS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCssTab(tab.id)}
                aria-pressed={cssTab === tab.id}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  cssTab === tab.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {filteredCSS.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCSS.map((pattern, idx) => (
                <CardReveal key={`${pattern.id}-${cssTab}`} col={idx % 3}>
                  <PatternCard
                    pattern={{
                      id:           pattern.id,
                      name:         pattern.name,
                      css:          pattern.toCss(pattern.defaults),
                      previewStyle: { ...pattern.render(pattern.defaults), opacity: 1 },
                      category:     pattern.category,
                    }}
                    isActive={appliedId === pattern.id}
                    onApply={() => {
                      setAppliedId(pattern.id);
                      setLiveTheme(pattern.render(pattern.defaults));
                      setWebglApplied(null);
                    }}
                    onShowCode={() =>
                      setCodeModal({ id: pattern.id, name: pattern.name, css: pattern.toCss(pattern.defaults) })
                    }
                  />
                </CardReveal>
              ))}
            </div>
          ) : (
            <motion.div className="text-center py-16 text-zinc-500" {...fadeUp()}>
              <p className="text-sm mb-2">No CSS patterns match{search ? <> &ldquo;{search}&rdquo;</> : null}.</p>
              <button type="button" onClick={() => { setSearch(""); setCssTab("all"); }}
                className="text-sm text-violet-600 hover:underline cursor-pointer">
                Clear filters
              </button>
            </motion.div>
          )}
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <motion.div
          className="mt-16 rounded-2xl p-8 text-center overflow-hidden relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          style={{ background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)" }}
        >
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.4) 0%, transparent 65%)" }} aria-hidden="true" />
          <div className="relative">
            <h2 className="text-xl font-bold text-white mb-2">Apply patterns to your portfolio</h2>
            <p className="text-zinc-400 text-sm mb-6">Customize colors, scale, and blend modes in the dashboard.</p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/dashboard/pattern"
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                style={{ background: "white", color: "#18181b", boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}
              >
                Open Pattern Picker <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {codeModal && (
        <PatternCodeModal name={codeModal.name} css={codeModal.css} previewHref={`/patterns/${codeModal.id}`} onClose={() => setCodeModal(null)} />
      )}
      {vantaModal && (
        <VantaCodeModal name={vantaModal.name} code={vantaModal.code} previewHref={`/patterns/${vantaModal.id}`} onClose={() => setVantaModal(null)} />
      )}
    </div>
  );
}
