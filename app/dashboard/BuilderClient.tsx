"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { Portfolio } from "@/lib/db/schema";
import { registry } from "@/lib/components/registry";
import { componentMap } from "@/lib/components/map";
import { demoData } from "@/lib/demo-data";
import { PortfolioData } from "@/types/portfolio";
import { saveSelectedComponents, importLocalStorageData, importComponentIds } from "@/lib/actions/portfolio";
import { useBuilderState } from "@/hooks/useBuilderState";
import ComponentCard from "@/components/library/ComponentCard";
import FilterTabs, { FilterTab } from "@/components/library/FilterTabs";
import SearchBar from "@/components/library/SearchBar";
import { getThemeTokenStyle } from "@/lib/themes";
import { getPatternById } from "@/lib/patterns/registry";
import { PatternConfig } from "@/lib/patterns/types";
import { cn } from "@/lib/utils";
import { canUseComponent, canAddMoreComponents, isPro } from "@/lib/gate";
import UpgradeModal from "@/components/UpgradeModal";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, X, Plus, Sparkles, Loader2, CheckCircle2, AlertCircle, Zap
} from "lucide-react";
import { getComponentById } from "@/lib/components/registry";

interface Props {
  portfolio: Portfolio | null;
  hasDetails: boolean;
  showImportPrompt: boolean;
  userId: string;
  userRole: string;
  upgradeSuccess: boolean;
}

// ─── Sortable component row ───────────────────────────────────────────────────

function SortableRow({ id, onRemove }: { id: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const entry = getComponentById(id);
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
    >
      <button {...attributes} {...listeners} className="text-zinc-300 hover:text-zinc-500 cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-zinc-700">{entry?.name ?? id}</span>
      <button onClick={onRemove} className="text-zinc-300 hover:text-red-400 cursor-pointer">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Import prompt ────────────────────────────────────────────────────────────

function ImportPrompt({
  onImport,
  onDismiss,
  componentCount,
  hasFormData,
}: {
  onImport: () => void;
  onDismiss: () => void;
  componentCount: number;
  hasFormData: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="h-10 w-10 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
          <Sparkles className="h-5 w-5 text-violet-600" />
        </div>
        {hasFormData ? (
          <>
            <h2 className="text-lg font-bold text-zinc-900 mb-2">Import your session data?</h2>
            <p className="text-sm text-zinc-500 mb-6">
              We found {componentCount} component{componentCount !== 1 ? "s" : ""} and portfolio details from your session. Import them to your account.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold text-zinc-900 mb-2">Add components from preview?</h2>
            <p className="text-sm text-zinc-500 mb-6">
              You had {componentCount} component{componentCount !== 1 ? "s" : ""} selected in the preview. Add them to your dashboard layout?
            </p>
          </>
        )}
        <div className="flex gap-3">
          <button onClick={onImport}
            className="flex-1 bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all cursor-pointer">
            {hasFormData ? "Yes, import it" : "Yes, add them"}
          </button>
          <button onClick={onDismiss}
            className="flex-1 border border-zinc-200 text-zinc-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-all cursor-pointer">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BuilderClient({ portfolio, hasDetails, showImportPrompt, userRole, upgradeSuccess }: Props) {
  const { state, clearBuilder } = useBuilderState();
  const [isPending, startTransition] = useTransition();
  const [showImport, setShowImport] = useState(showImportPrompt);
  const [importStatus, setImportStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [showLibrary, setShowLibrary] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; trigger?: string }>({ open: false });
  const [showUpgradeToast, setShowUpgradeToast] = useState(upgradeSuccess);
  const proUser = isPro(userRole);

  useEffect(() => {
    if (showUpgradeToast) {
      const t = setTimeout(() => setShowUpgradeToast(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showUpgradeToast]);

  // Component IDs — start from DB, sync with actions
  const [componentIds, setComponentIds] = useState<string[]>(
    portfolio?.selectedComponentIds ?? []
  );

  // Preview data
  const portfolioData = (portfolio?.portfolioData as PortfolioData | null) ?? demoData;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const save = useCallback((ids: string[]) => {
    startTransition(async () => {
      await saveSelectedComponents(ids);
    });
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = componentIds.indexOf(active.id as string);
      const newIdx = componentIds.indexOf(over.id as string);
      const next = arrayMove(componentIds, oldIdx, newIdx);
      setComponentIds(next);
      save(next);
    }
  };

  const addComponent = (id: string) => {
    if (componentIds.includes(id)) return;
    const entry = getComponentById(id);
    if (entry && !canUseComponent(entry, userRole)) {
      setUpgradeModal({ open: true, trigger: "component" });
      return;
    }
    if (!canAddMoreComponents(componentIds.length, userRole)) {
      setUpgradeModal({ open: true, trigger: "component" });
      return;
    }
    const next = [...componentIds, id];
    setComponentIds(next);
    save(next);
  };

  const removeComponent = (id: string) => {
    const next = componentIds.filter((c) => c !== id);
    setComponentIds(next);
    save(next);
  };

  const handleImport = () => {
    const hasComponents = state.selectedComponentIds.length > 0;
    if (!state.rawFormData && !hasComponents) { setShowImport(false); return; }
    setImportStatus("loading");
    startTransition(async () => {
      try {
        if (state.rawFormData) {
          // Full import: form data + components
          await importLocalStorageData(state.rawFormData, state.selectedComponentIds);
          setComponentIds(state.selectedComponentIds);
        } else {
          // Components-only: merge into existing layout
          const result = await importComponentIds(state.selectedComponentIds);
          setComponentIds((prev) => [
            ...prev,
            ...state.selectedComponentIds.filter((id) => !prev.includes(id)),
          ]);
          void result;
        }
        clearBuilder();
        setImportStatus("done");
        setShowImport(false);
      } catch {
        setImportStatus("error");
        setShowImport(false);
      }
    });
  };

  // Filter library
  const filteredRegistry = registry.filter((c) => {
    if (filter === "sections") return c.category === "section";
    if (filter === "primitives") return c.category === "primitive";
    if (filter === "free") return c.tier === "free";
    if (filter === "pro") return c.tier === "pro";
    return true;
  }).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q));
  });

  return (
    <div className="flex h-full flex-col">
      {/* Upgrade success toast */}
      {showUpgradeToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>You&apos;re now Pro! All features unlocked.</span>
          <button onClick={() => setShowUpgradeToast(false)} className="ml-2 text-emerald-200 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Free tier banner */}
      {!proUser && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100 px-4 py-2 flex items-center justify-between">
          <p className="text-xs text-violet-700">
            <span className="font-semibold">Free plan</span> — {componentIds.length}/{8} components used · Upgrade for unlimited access
          </p>
          <a href="/dashboard/upgrade"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
            <Zap className="h-3 w-3" /> Upgrade to Pro
          </a>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
      {/* Left panel — component list */}
      <div className="w-72 shrink-0 border-r border-zinc-100 bg-white flex flex-col">
        <div className="p-4 border-b border-zinc-100">
          <h2 className="font-semibold text-zinc-900 text-sm mb-0.5">My Components</h2>
          <p className="text-xs text-zinc-400">{componentIds.length} section{componentIds.length !== 1 ? "s" : ""} · drag to reorder</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {componentIds.length === 0 ? (
            <div className="text-center py-10 text-zinc-400">
              <p className="text-sm">No sections yet.</p>
              <p className="text-xs mt-1">Click + Add to browse the library</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
                {componentIds.map((id) => (
                  <SortableRow key={id} id={id} onRemove={() => removeComponent(id)} />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
        <div className="p-3 border-t border-zinc-100">
          <button
            onClick={() => setShowLibrary(true)}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 text-zinc-600 py-2.5 rounded-xl text-sm hover:border-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Components
          </button>
        </div>
      </div>

      {/* Center — live preview */}
      <div className="flex-1 overflow-auto bg-zinc-50">
        <div className="p-4">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              {isPending && <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>}
              {!isPending && importStatus === "done" && <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Data imported</>}
              {!isPending && importStatus === "error" && <><AlertCircle className="h-3 w-3 text-red-400" /> Import failed</>}
            </div>
            {!hasDetails && (
              <a href="/dashboard/details"
                className="inline-flex items-center gap-1.5 text-xs text-violet-600 border border-violet-200 bg-violet-50 px-2.5 py-1 rounded-lg hover:bg-violet-100 transition-colors">
                <Sparkles className="h-3 w-3" /> Fill in your details to personalize →
              </a>
            )}
          </div>

          {/* Portfolio preview */}
          {componentIds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="h-16 w-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="h-7 w-7 text-zinc-400" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-1">Start building your portfolio</h3>
              <p className="text-sm text-zinc-500 mb-4">Add sections from the library to preview them here</p>
              <button onClick={() => setShowLibrary(true)}
                className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 cursor-pointer">
                <Plus className="h-4 w-4" /> Browse Library
              </button>
            </div>
          ) : (() => {
            // Resolve theme tokens
            const themeTokens = getThemeTokenStyle(portfolio?.themeId ?? "minimalist");

            // Resolve pattern
            let patternStyle: React.CSSProperties = {};
            let patternBaseColor: string | null = null;
            if (portfolio?.patternId) {
              const pattern = getPatternById(portfolio.patternId);
              if (pattern) {
                const config = (portfolio.patternConfig as PatternConfig | null) ?? pattern.defaults;
                patternStyle = pattern.render(config);
                patternBaseColor = config.baseColor;
              }
            }

            const rootBg = patternBaseColor ?? (themeTokens["--pf-bg"] as string) ?? "#ffffff";

            return (
              <div
                className="pf-themed border border-zinc-200 rounded-2xl overflow-hidden shadow-sm"
                style={{
                  ...(themeTokens as React.CSSProperties),
                  background: rootBg,
                  color: "var(--pf-fg)",
                  position: "relative",
                }}
              >
                {/* Pattern overlay inside the preview box */}
                {portfolio?.patternId && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      zIndex: 0,
                      ...patternStyle,
                    }}
                  />
                )}
                <div style={{ position: "relative", zIndex: 1 }}>
                  {componentIds.map((id) => {
                    const Component = componentMap[id];
                    return Component ? <Component key={id} data={portfolioData} /> : null;
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Library drawer */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowLibrary(false)} />
          <div className="relative ml-auto w-[480px] max-w-full bg-white shadow-xl flex flex-col h-full">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="font-semibold text-zinc-900">Component Library</h2>
              <button onClick={() => setShowLibrary(false)} className="text-zinc-400 hover:text-zinc-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3 border-b border-zinc-100 space-y-2">
              <SearchBar value={search} onChange={setSearch} />
              <FilterTabs active={filter} onChange={setFilter} />
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-3">
                {filteredRegistry.map((comp) => {
                  const isLocked = !canUseComponent(comp, userRole);
                  const isAdded = componentIds.includes(comp.id);
                  return (
                    <div key={comp.id} className="relative">
                      <ComponentCard component={comp} />
                      {!isAdded && (
                        <button
                          onClick={() => addComponent(comp.id)}
                          className={`absolute inset-0 opacity-0 hover:opacity-100 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1 transition-opacity cursor-pointer ${
                            isLocked ? "bg-violet-900/80" : "bg-zinc-900/80"
                          }`}
                        >
                          {isLocked ? (
                            <><Zap className="h-3.5 w-3.5" /> Pro</>
                          ) : (
                            <><Plus className="h-3.5 w-3.5" /> Add</>
                          )}
                        </button>
                      )}
                      {isAdded && (
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Added
                        </div>
                      )}
                      {isLocked && !isAdded && (
                        <div className="absolute top-2 right-2 bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          PRO
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import prompt — show when there are localStorage components to bring in */}
      {showImport && state.selectedComponentIds.length > 0 && (
        <ImportPrompt
          onImport={handleImport}
          onDismiss={() => setShowImport(false)}
          componentCount={state.selectedComponentIds.length}
          hasFormData={!!state.rawFormData}
        />
      )}
      </div>{/* end flex flex-1 overflow-hidden */}

      {/* Upgrade modal */}
      <UpgradeModal
        open={upgradeModal.open}
        onClose={() => setUpgradeModal({ open: false })}
        trigger={upgradeModal.trigger}
      />
    </div>
  );
}
