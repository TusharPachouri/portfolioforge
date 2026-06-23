"use client";

import { useBuilderState } from "@/hooks/useBuilderState";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { componentMap } from "@/lib/components/map";
import { getComponentById } from "@/lib/components/registry";
import Link from "next/link";
import { Layers, Pencil, LogIn, Trash2, Sparkles, CheckCircle2, LayoutDashboard } from "lucide-react";

interface Props {
  isSignedIn: boolean;
}

export default function PreviewClient({ isSignedIn }: Props) {
  const { state, removeComponent, clearBuilder } = useBuilderState();
  const { portfolioData, isCustom, resetToDemo } = usePortfolio();
  const ids = state.selectedComponentIds;

  // callbackUrl brings the user to dashboard with the import prompt
  const dashboardImportUrl = "/dashboard?import=1";
  const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(dashboardImportUrl)}`;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Preview top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-700">
              Portfolio Preview
              {ids.length > 0 && (
                <span className="ml-2 text-xs text-zinc-400">· {ids.length} section{ids.length !== 1 ? "s" : ""}</span>
              )}
            </span>
            {isCustom && (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" /> Your data
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/components"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors">
              <Pencil className="h-3.5 w-3.5" /> Edit components
            </Link>
            <Link href="/personalize"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors">
              <Sparkles className="h-3.5 w-3.5" /> {isCustom ? "Edit details" : "Personalize"}
            </Link>

            {/* Auth-aware publish button */}
            {isSignedIn ? (
              <Link href={dashboardImportUrl}
                className="inline-flex items-center gap-1.5 text-sm bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors">
                <LayoutDashboard className="h-3.5 w-3.5" /> Go to Dashboard
              </Link>
            ) : (
              <Link href={signInUrl}
                className="inline-flex items-center gap-1.5 text-sm bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors">
                <LogIn className="h-3.5 w-3.5" /> Sign in to publish
              </Link>
            )}

            {ids.length > 0 && (
              <button onClick={() => { clearBuilder(); if (isCustom) resetToDemo(); }}
                className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio preview area */}
      {ids.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 px-4 text-center">
          <div className="h-16 w-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-5">
            <Layers className="h-7 w-7 text-zinc-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">No components added yet</h2>
          <p className="text-zinc-500 text-sm mb-6 max-w-xs">
            Browse the library and add sections to see your portfolio assembled here.
          </p>
          <Link href="/components"
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors">
            Browse Components
          </Link>
        </div>
      ) : (
        <div className="bg-white border-x border-zinc-200 max-w-5xl mx-auto shadow-sm min-h-screen">
          {/* Section chips */}
          <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-2 flex flex-wrap items-center gap-2">
            {ids.map((id) => {
              const entry = getComponentById(id);
              return entry ? (
                <div key={id} className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 text-xs text-zinc-600 px-2.5 py-1 rounded-full">
                  {entry.name}
                  <button onClick={() => removeComponent(id)} className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer">×</button>
                </div>
              ) : null;
            })}
          </div>

          {/* Render sections with live context data */}
          <div className="relative isolate pt-14 pf-themed" style={{ background: "var(--pf-bg)", color: "var(--pf-fg)" }}>
            {ids.map((id) => {
            const Component = componentMap[id];
            if (!Component) return null;
            return <Component key={id} data={portfolioData} />;
          })}
          </div>
        </div>
      )}
    </div>
  );
}
