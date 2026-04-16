"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { Portfolio } from "@/lib/db/schema";
import { registry } from "@/lib/components/registry";
import { componentMap } from "@/lib/components/map";
import { demoData } from "@/lib/demo-data";
import { PortfolioData } from "@/types/portfolio";
import { saveSelectedComponents, importLocalStorageData, importComponentIds } from "@/lib/actions/portfolio";
import { useBuilderState } from "@/hooks/useBuilderState";
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
  const baseId = id.includes(":") ? id.split(":")[0] : id;
  const entry = getComponentById(baseId);
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
    >
      <button {...attributes} {...listeners} className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-zinc-700 dark:text-zinc-200">{entry?.name ?? id}</span>
      <button onClick={onRemove} className="text-zinc-300 dark:text-zinc-600 hover:text-red-400 cursor-pointer">
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
    const alreadyAdded = componentIds.some((cId) => (cId.includes(":") ? cId.split(":")[0] : cId) === id);
    if (alreadyAdded) return;
    const entry = getComponentById(id);
    if (entry?.category === "section") {
      const subcategoryTaken = componentIds.some((cId) => {
        const baseId = cId.includes(":") ? cId.split(":")[0] : cId;
        return getComponentById(baseId)?.subcategory === entry.subcategory;
      });
      if (subcategoryTaken) return;
    }
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
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 border-b border-violet-100 dark:border-violet-900/50 px-4 py-2 flex items-center justify-between">
          <p className="text-xs text-violet-700 dark:text-violet-300">
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
      <div className="w-72 shrink-0 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-white text-sm mb-0.5">My Components</h2>
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
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => setShowLibrary(true)}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 py-2.5 rounded-xl text-sm hover:border-zinc-500 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Components
          </button>
        </div>
      </div>

      {/* Center — live preview */}
      <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-950">
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
                className="inline-flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 px-2.5 py-1 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors">
                <Sparkles className="h-3 w-3" /> Fill in your details to personalize →
              </a>
            )}
          </div>

          {/* Portfolio preview */}
          {componentIds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="h-7 w-7 text-zinc-400" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">Start building your portfolio</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Add sections from the library to preview them here</p>
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
                className="pf-themed border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden shadow-sm"
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
                    const baseId = id.includes(":") ? id.split(":")[0] : id;
                    const Component = componentMap[baseId];
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
          <div className="relative ml-auto w-[480px] max-w-full bg-white dark:bg-zinc-900 shadow-xl flex flex-col h-full">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="font-semibold text-zinc-900 dark:text-white">Component Library</h2>
              <button onClick={() => setShowLibrary(false)} className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 space-y-2">
              <SearchBar value={search} onChange={setSearch} />
              <FilterTabs active={filter} onChange={setFilter} />
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-3">
                {filteredRegistry.map((comp) => {
                  const isLocked = !canUseComponent(comp, userRole);
                  const isAdded = componentIds.some((cId) => (cId.includes(":") ? cId.split(":")[0] : cId) === comp.id);
                  const isSubcategoryUsed = !isAdded && comp.category === "section" && componentIds.some((cId) => {
                    const baseId = cId.includes(":") ? cId.split(":")[0] : cId;
                    return getComponentById(baseId)?.subcategory === comp.subcategory;
                  });
                  const gradients: Record<string, string> = {
                    Hero: "from-violet-100 to-indigo-100",
                    About: "from-blue-50 to-cyan-100",
                    Skills: "from-emerald-50 to-teal-100",
                    Projects: "from-orange-50 to-amber-100",
                    Experience: "from-pink-50 to-rose-100",
                    Education: "from-sky-50 to-blue-100",
                    Contact: "from-purple-50 to-fuchsia-100",
                    Footer: "from-zinc-50 to-zinc-100",
                    Stats: "from-green-50 to-emerald-100",
                    Testimonials: "from-yellow-50 to-amber-100",
                    Gallery: "from-red-50 to-pink-100",
                  };
                  const gradient = gradients[comp.subcategory as string] ?? "from-zinc-50 to-zinc-100";
                  return (
                    <div key={comp.id} className={cn(
                      "border rounded-xl overflow-hidden transition-all flex flex-col",
                      isAdded || isSubcategoryUsed ? "bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
                    )}>
                      {/* Thumbnail */}
                      <div className={`relative h-28 bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 ${isAdded || isSubcategoryUsed ? "opacity-50" : ""}`}>
                        <span className="text-4xl font-black text-zinc-300 select-none">{(comp.subcategory as string)[0]}</span>
                        {comp.tier === "pro" && (
                          <div className="absolute top-2 right-2 bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">PRO</div>
                        )}
                        {isAdded && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Added
                            </div>
                          </div>
                        )}
                        {isSubcategoryUsed && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                              Type used
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Card footer */}
                      <div className="p-2.5 flex items-center gap-2 flex-1">
                        <span className="flex-1 text-xs font-medium text-zinc-700 dark:text-zinc-200 truncate">{comp.name}</span>
                        {isAdded ? (
                          <button
                            onClick={() => removeComponent(componentIds.find((cId) => (cId.includes(":") ? cId.split(":")[0] : cId) === comp.id)!)}
                            className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <X className="h-3 w-3" /> Remove
                          </button>
                        ) : isSubcategoryUsed ? (
                          <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed">
                            Type used
                          </span>
                        ) : (
                          <button
                            onClick={() => addComponent(comp.id)}
                            className={cn(
                              "flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer",
                              isLocked
                                ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                                : "bg-zinc-900 text-white hover:bg-zinc-700"
                            )}
                          >
                            {isLocked
                              ? <><Zap className="h-3 w-3" /> Pro</>
                              : <><Plus className="h-3 w-3" /> Add</>
                            }
                          </button>
                        )}
                      </div>
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
