"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight, Palette, X, Zap } from "lucide-react";
import { patterns } from "@/lib/patterns/registry";
import { vantaPatterns } from "@/lib/patterns/vantaRegistry";
import { PatternCategory } from "@/lib/patterns/types";
import PatternCard from "@/components/patterns/PatternCard";
import PatternCodeModal from "@/components/patterns/PatternCodeModal";
import VantaPatternCard from "@/components/patterns/VantaPatternCard";
import VantaCodeModal from "@/components/patterns/VantaCodeModal";
import VantaPageBackground from "@/components/landing/VantaPageBackground";
import TiltCard from "@/components/landing/TiltCard";

const DEMO_COMPONENTS = [
  { name: "Hero — Centered", sub: "Hero", gradient: "from-violet-100 to-indigo-200", tier: "Free", id: "hero-centered", category: "section" },
  { name: "Skills — Grid", sub: "Skills", gradient: "from-emerald-50 to-teal-200", tier: "Free", id: "skills-grid", category: "section" },
  { name: "Projects — Grid", sub: "Projects", gradient: "from-orange-50 to-amber-200", tier: "Free", id: "projects-grid", category: "section" },
  { name: "Experience — Timeline", sub: "Experience", gradient: "from-pink-50 to-rose-200", tier: "Free", id: "experience-timeline", category: "section" },
  { name: "Testimonials — Grid", sub: "Testimonials", gradient: "from-yellow-50 to-amber-200", tier: "Pro", id: "testimonials-grid", category: "section" },
  { name: "Gallery — Masonry", sub: "Gallery", gradient: "from-sky-50 to-blue-200", tier: "Pro", id: "gallery-masonry", category: "section" },
  { name: "Skill Badge", sub: "Badge", gradient: "from-zinc-50 to-zinc-200", tier: "Free", id: "skill-badge", category: "primitive" },
  { name: "Project Card", sub: "Card", gradient: "from-orange-50 to-amber-100", tier: "Free", id: "project-card", category: "primitive" },
  { name: "Avatar with Ring", sub: "Avatar", gradient: "from-violet-50 to-purple-100", tier: "Free", id: "avatar-ring", category: "primitive" },
];

type ComponentTab = "All Components" | "Sections" | "Primitives" | "Free" | "Pro";
type PatternTab = "all" | PatternCategory;

const COMPONENT_TABS: ComponentTab[] = ["All Components", "Sections", "Primitives", "Free", "Pro"];
const PATTERN_TABS: { id: PatternTab; label: string }[] = [
  { id: "all", label: "All Patterns" },
  { id: "animated", label: "Animated" },
  { id: "gradient", label: "Gradients" },
  { id: "geometric", label: "Geometric" },
  { id: "decorative", label: "Decorative" },
  { id: "effects", label: "Effects" },
];

interface ActivePattern {
  id: string;
  name: string;
  style: React.CSSProperties;
  textContrast: "light" | "dark";
}

interface CodeModalState {
  id: string;
  name: string;
  css: string;
}

interface VantaModalState {
  id: string;
  name: string;
  code: string;
}

export default function LibraryShowcase() {
  const [libraryView, setLibraryView] = useState<"components" | "patterns">("patterns");
  const [componentTab, setComponentTab] = useState<ComponentTab>("All Components");
  const [patternTab, setPatternTab] = useState<PatternTab>("all");
  const [activePattern, setActivePattern] = useState<ActivePattern | null>(null);
  const [activeVantaId, setActiveVantaId] = useState<string | null>(null);
  const [codeModal, setCodeModal] = useState<CodeModalState | null>(null);
  const [vantaModal, setVantaModal] = useState<VantaModalState | null>(null);

  const activeVantaName = activeVantaId
    ? vantaPatterns.find((p) => p.id === activeVantaId)?.name ?? null
    : null;

  // Text contrast for the above-fold zone only
  const activeTextContrast: "light" | "dark" | null = activePattern?.textContrast
    ?? (activeVantaId ? (vantaPatterns.find((p) => p.id === activeVantaId)?.textContrast ?? "light") : null);

  // Library section is always light-background — hardcoded dark text regardless of theme
  const tx = {
    heading:    "text-zinc-900",
    body:       "text-zinc-500",
    badge:      "text-violet-600",
    toggleOn:   "bg-zinc-900 text-white shadow-sm",
    toggleOff:  "bg-zinc-100 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-200",
    tabBar:     "bg-zinc-100",
    tabOn:      "bg-white text-zinc-900 shadow-sm",
    tabOff:     "text-zinc-500 hover:text-zinc-700",
    browseLink: "text-zinc-600 border-zinc-200 hover:text-zinc-900 hover:bg-zinc-50",
    count:      "text-zinc-500",
  };

  // Text tokens + Navbar theme — scoped to #pf-above-fold only
  useEffect(() => {
    const above = document.getElementById("pf-above-fold");
    if (!above) return;
    if (activeTextContrast === "light") {
      above.style.setProperty("--pf-page-fg",    "rgba(255,255,255,0.93)");
      above.style.setProperty("--pf-page-muted", "rgba(255,255,255,0.60)");
      above.setAttribute("data-dark-theme", "");
    } else {
      above.style.removeProperty("--pf-page-fg");
      above.style.removeProperty("--pf-page-muted");
      above.removeAttribute("data-dark-theme");
    }
    return () => {
      above.style.removeProperty("--pf-page-fg");
      above.style.removeProperty("--pf-page-muted");
      above.removeAttribute("data-dark-theme");
    };
  }, [activeTextContrast]);

  // CSS pattern background — scoped to #pf-above-fold only
  useEffect(() => {
    const above = document.getElementById("pf-above-fold");
    if (!above) return;
    const applied: string[] = [];

    if (activePattern) {
      (Object.entries(activePattern.style) as [string, unknown][]).forEach(([key, value]) => {
        if (!["opacity", "mixBlendMode"].includes(key) && value !== undefined && value !== "") {
          (above.style as unknown as Record<string, string>)[key] = String(value);
          applied.push(key);
        }
      });
    }

    return () => {
      applied.forEach((key) => { (above.style as unknown as Record<string, string>)[key] = ""; });
    };
  }, [activePattern]);

  function applyVanta(id: string) {
    setActiveVantaId(id);
    setActivePattern(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyCss(pattern: ActivePattern) {
    setActivePattern(pattern);
    setActiveVantaId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearActive() {
    setActivePattern(null);
    setActiveVantaId(null);
  }

  const filteredComponents = DEMO_COMPONENTS.filter((c) => {
    if (componentTab === "Sections") return c.category === "section";
    if (componentTab === "Primitives") return c.category === "primitive";
    if (componentTab === "Free") return c.tier === "Free";
    if (componentTab === "Pro") return c.tier === "Pro";
    return true;
  });

  const filteredPatterns = (
    patternTab === "all" ? patterns : patterns.filter((p) => p.category === patternTab)
  ).slice(0, 8);

  const filteredVanta = (patternTab === "all" || patternTab === "effects") ? vantaPatterns : [];

  const totalShown = filteredPatterns.length + filteredVanta.length;

  // Portal target — #pf-above-fold covers Navbar + hero + trusted-by
  const [aboveFoldEl, setAboveFoldEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setAboveFoldEl(document.getElementById("pf-above-fold"));
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-4 pt-10 pb-20">
      {/* ── Vanta canvas portalled into #pf-above-fold — z-0 so content sits above it ── */}
      {activeVantaId && aboveFoldEl && createPortal(
        <VantaPageBackground
          patternId={activeVantaId}
          className="absolute inset-0 pointer-events-none z-0"
        />,
        aboveFoldEl
      )}

      {/* ── Floating pill (z-50, above overlay and content) ─────────────── */}
      {(activePattern || activeVantaId) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50" role="status" aria-live="polite">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur border border-zinc-200 pl-4 pr-1.5 py-1.5 rounded-full text-xs text-zinc-600 shadow-xl">
            {activeVantaId
              ? <Zap className="h-3.5 w-3.5 text-yellow-500" aria-hidden="true" />
              : <Palette className="h-3.5 w-3.5 text-violet-500" aria-hidden="true" />}
            <span>
              Theme: <span className="font-semibold text-zinc-900">
                {activePattern?.name ?? activeVantaName}
              </span>
            </span>
            <button
              type="button"
              onClick={clearActive}
              aria-label="Clear theme preview"
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ── Main content (z-10, above overlay, below pill) ───────────────── */}
      <div className="relative z-[10] transition-colors duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <p className={`text-xs font-semibold tracking-[0.22em] uppercase mb-3 transition-colors duration-500 ${tx.badge}`}>The Library</p>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-3 transition-colors duration-500 ${tx.heading}`}>
            {libraryView === "components" ? (
              <>Component <span className="font-display-serif italic font-normal">Library</span></>
            ) : (
              <>Pattern <span className="font-display-serif italic font-normal">Library</span></>
            )}
          </h2>
          <p className={`transition-colors duration-500 ${tx.body}`}>
            {libraryView === "components"
              ? "Mix and match sections to assemble your portfolio"
              : "Apply any pattern to preview it as a live page theme"}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["patterns", "components"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setLibraryView(v)}
              aria-pressed={libraryView === v}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer capitalize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                libraryView === v ? tx.toggleOn : tx.toggleOff
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {libraryView === "components" && (
          <>
            <div className={`flex items-center justify-center gap-1 p-1 rounded-lg w-fit max-w-full mx-auto mb-8 flex-wrap transition-colors duration-500 ${tx.tabBar}`}>
              {COMPONENT_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setComponentTab(tab)}
                  aria-pressed={componentTab === tab}
                  className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                    componentTab === tab ? tx.tabOn : tx.tabOff
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {filteredComponents.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredComponents.map((comp) => (
                  <TiltCard key={comp.id} maxTilt={6} className="h-full rounded-xl">
                    <Link
                      href={`/components/${comp.id}`}
                      className="card-premium group flex flex-col h-full bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                    >
                      <div className={`h-36 bg-gradient-to-br ${comp.gradient} relative flex items-center justify-center`}>
                        <div className="text-5xl font-black text-zinc-400/60" aria-hidden="true">{comp.sub[0]}</div>
                        <div className="absolute top-2 right-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${comp.tier === "Pro" ? "bg-violet-100 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>
                            {comp.tier}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="bg-white text-zinc-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm">Preview →</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-zinc-900">{comp.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{comp.sub}</p>
                      </div>
                    </Link>
                  </TiltCard>
                ))}
              </div>
            ) : (
              <div className={`text-center py-16 transition-colors duration-500 ${tx.body}`}>
                <p className="text-sm mb-2">No {componentTab.toLowerCase()} shown in this preview.</p>
                <Link href="/components" className="text-sm text-violet-400 hover:underline">
                  Browse the full library →
                </Link>
              </div>
            )}

            <div className="text-center mt-8">
              <Link
                href="/components"
                className={`inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl border transition-all duration-300 ${tx.browseLink}`}
              >
                Browse all 27+ components <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </>
        )}

        {libraryView === "patterns" && (
          <>
            <div className={`flex items-center justify-center gap-1 p-1 rounded-xl w-fit max-w-full mx-auto mb-4 flex-wrap transition-colors duration-500 ${tx.tabBar}`}>
              {PATTERN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPatternTab(tab.id)}
                  aria-pressed={patternTab === tab.id}
                  className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                    patternTab === tab.id ? tx.tabOn : tx.tabOff
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <p className={`text-xs text-center mb-6 transition-colors duration-500 ${tx.count}`}>
              Showing {totalShown} pattern{totalShown !== 1 ? "s" : ""}
              {patternTab !== "all" ? ` in ${PATTERN_TABS.find((t) => t.id === patternTab)?.label}` : ""}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPatterns.map((pattern) => {
                const preview = pattern.render(pattern.defaults);
                return (
                  <PatternCard
                    key={pattern.id}
                    pattern={{
                      id: pattern.id,
                      name: pattern.name,
                      css: pattern.toCss(pattern.defaults),
                      previewStyle: { ...preview, opacity: 1 },
                      category: pattern.category,
                    }}
                    isActive={activePattern?.id === pattern.id}
                    onApply={() => applyCss({ id: pattern.id, name: pattern.name, style: preview, textContrast: pattern.textContrast })}
                    onShowCode={() =>
                      setCodeModal({ id: pattern.id, name: pattern.name, css: pattern.toCss(pattern.defaults) })
                    }
                  />
                );
              })}

              {filteredVanta.map((pattern) => (
                <VantaPatternCard
                  key={pattern.id}
                  pattern={pattern}
                  isActive={activeVantaId === pattern.id}
                  onApply={() => applyVanta(pattern.id)}
                  onShowCode={(code, name) => setVantaModal({ id: pattern.id, name, code })}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/patterns"
                className={`inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl border transition-all duration-300 ${tx.browseLink}`}
              >
                Browse all {patterns.length + vantaPatterns.length} patterns <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </>
        )}
      </div>

      {codeModal && (
        <PatternCodeModal
          name={codeModal.name}
          css={codeModal.css}
          previewHref={`/patterns/${codeModal.id}`}
          onClose={() => setCodeModal(null)}
        />
      )}

      {vantaModal && (
        <VantaCodeModal
          name={vantaModal.name}
          code={vantaModal.code}
          previewHref={`/patterns/${vantaModal.id}`}
          onClose={() => setVantaModal(null)}
        />
      )}
    </section>
  );
}
