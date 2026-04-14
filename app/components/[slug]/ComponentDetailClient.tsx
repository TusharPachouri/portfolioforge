"use client";

import { ComponentEntry } from "@/lib/components/registry";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { componentMap } from "@/lib/components/map";
import { Badge } from "@/components/ui/badge";
import { useBuilderState } from "@/hooks/useBuilderState";
import { Plus, Check, ArrowLeft, Tag, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  component: ComponentEntry;
  related: ComponentEntry[];
}

export default function ComponentDetailClient({ component, related }: Props) {
  const { state, addComponent, removeComponent } = useBuilderState();
  const { portfolioData, isCustom } = usePortfolio();
  const isAdded = state.selectedComponentIds.includes(component.id);

  const SectionComponent = componentMap[component.id];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back + header */}
        <div className="mb-6">
          <Link href="/components" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to library
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-zinc-900">{component.name}</h1>
                <Badge variant={component.tier === "pro" ? "pro" : "free"}>
                  {component.tier === "pro" ? "Pro" : "Free"}
                </Badge>
              </div>
              <p className="text-zinc-500 text-sm">{component.description}</p>
            </div>
            <button
              onClick={() => isAdded ? removeComponent(component.id) : addComponent(component.id)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                isAdded
                  ? "bg-zinc-100 text-zinc-700 hover:bg-red-50 hover:text-red-600"
                  : "bg-zinc-900 text-white hover:bg-zinc-700"
              )}
            >
              {isAdded ? <><Check className="h-4 w-4" /> Added</> : <><Plus className="h-4 w-4" /> Add to portfolio</>}
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
          <Badge variant="secondary">{component.category}</Badge>
          <Badge variant="secondary">{component.subcategory}</Badge>
          {component.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 text-xs bg-zinc-50 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full">
              <Tag className="h-3 w-3" />{t}
            </span>
          ))}
        </div>

        {/* Data indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
            <div className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-zinc-900 shadow-sm">Preview</div>
            <div className="px-3 py-1.5 text-sm font-medium rounded-md text-zinc-500">Code (Phase 2)</div>
          </div>
          {isCustom ? (
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Showing your data
            </span>
          ) : (
            <Link href="/personalize" className="text-xs text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors">
              <Sparkles className="h-3 w-3" /> Personalize to see your data →
            </Link>
          )}
        </div>

        {/* Live preview */}
        <div className="border border-zinc-200 rounded-2xl overflow-hidden mb-8 bg-white shadow-sm">
          <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-2 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="ml-2 text-xs text-zinc-400">
              {isCustom ? "Preview with your data" : "Preview with demo data"}
            </span>
          </div>
          {SectionComponent ? (
            <SectionComponent data={portfolioData} />
          ) : (
            <div className="py-20 text-center text-zinc-400">
              <p>Preview not available for this component yet.</p>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Related components</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/components/${r.id}`}
                  className="border border-zinc-200 rounded-xl p-4 hover:shadow-sm hover:border-zinc-300 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-zinc-900">{r.name}</span>
                    <Badge variant={r.tier === "pro" ? "pro" : "free"}>{r.tier === "pro" ? "Pro" : "Free"}</Badge>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
