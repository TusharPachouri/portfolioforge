"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { patterns } from "@/lib/patterns/registry";
import { PatternCategory } from "@/lib/patterns/types";
import PatternCard from "@/components/patterns/PatternCard";
import PatternCodeModal from "@/components/patterns/PatternCodeModal";

const TABS: { id: "all" | PatternCategory; label: string }[] = [
  { id: "all", label: "All Patterns" },
  { id: "animated", label: "Animated" },
  { id: "gradient", label: "Gradients" },
  { id: "geometric", label: "Geometric" },
  { id: "decorative", label: "Decorative" },
  { id: "effects", label: "Effects" },
];

interface CodeModalState {
  id: string;
  name: string;
  css: string;
}

export default function PatternsGallery() {
  const [activeTab, setActiveTab] = useState<"all" | PatternCategory>("all");
  const [search, setSearch] = useState("");
  const [codeModal, setCodeModal] = useState<CodeModalState | null>(null);

  const filtered = patterns.filter((p) => {
    if (activeTab !== "all" && p.category !== activeTab) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-zinc-900 mb-2">Pattern Library</h1>
        <p className="text-zinc-500">Ready-made CSS backgrounds for your portfolio — customize colors and scale in the dashboard</p>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <span><span className="font-bold text-zinc-900">{patterns.length}</span> <span className="text-zinc-500">Patterns</span></span>
          <span><span className="font-bold text-zinc-900">100%</span> <span className="text-zinc-500">Free</span></span>
          <span><span className="font-bold text-zinc-900">CSS</span> <span className="text-zinc-500">&amp; Tailwind</span></span>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl flex-wrap max-w-full shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                activeTab === tab.id
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patterns..."
            aria-label="Search patterns"
            className="w-full pl-10 pr-4 py-2.5 text-base sm:text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
          />
        </div>
      </div>

      {/* Count — announced when filters change */}
      <p className="text-sm text-zinc-500 mb-6" aria-live="polite">
        {filtered.length} pattern{filtered.length !== 1 ? "s" : ""}
        {activeTab !== "all" ? ` in ${TABS.find((t) => t.id === activeTab)?.label}` : ""}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((pattern) => (
          <PatternCard
            key={pattern.id}
            pattern={{
              id: pattern.id,
              name: pattern.name,
              css: pattern.toCss(pattern.defaults),
              previewStyle: { ...pattern.render(pattern.defaults), opacity: 1 },
            }}
            onShowCode={() =>
              setCodeModal({ id: pattern.id, name: pattern.name, css: pattern.toCss(pattern.defaults) })
            }
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-sm mb-2">No patterns found{search ? <> for &ldquo;{search}&rdquo;</> : null}.</p>
          <button
            type="button"
            onClick={() => { setSearch(""); setActiveTab("all"); }}
            className="text-sm text-violet-600 hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 bg-zinc-900 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Apply patterns to your portfolio</h2>
        <p className="text-zinc-400 text-sm mb-6">Customize colors, scale, and blend modes in the dashboard.</p>
        <Link
          href="/dashboard/pattern"
          className="inline-flex items-center gap-2 bg-white text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-colors"
        >
          Open Pattern Picker <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {codeModal && (
        <PatternCodeModal
          name={codeModal.name}
          css={codeModal.css}
          previewHref={`/patterns/${codeModal.id}`}
          onClose={() => setCodeModal(null)}
        />
      )}
    </div>
  );
}
