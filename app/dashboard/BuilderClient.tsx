"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { Portfolio } from "@/lib/db/schema";
import { registry } from "@/lib/components/registry";
import { componentMap } from "@/lib/components/map";
import { demoData } from "@/lib/demo-data";
import { PortfolioData } from "@/types/portfolio";
import { saveSelectedComponents, importLocalStorageData, importComponentIds, saveTheme, savePattern, savePortfolioData } from "@/lib/actions/portfolio";
import { generateRandomLayout, generateRandomStyle } from "@/lib/random-theme";
import SectionEditorModal from "./SectionEditorModal";
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
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, X, Plus, Sparkles, Loader2, CheckCircle2, AlertCircle, Zap, Dices, Undo2, Pencil
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

function SortableRow({ id, onRemove, onEdit }: { id: string; onRemove: () => void; onEdit: (info: { subcategory: string; name: string }) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const baseId = id.includes(":") ? id.split(":")[0] : id;
  const entry = getComponentById(baseId);
  const name = entry?.name ?? id;
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group flex items-center gap-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-2.5 py-2 text-sm transition-shadow hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600",
        isDragging && "opacity-60 shadow-lg z-50 ring-2 ring-violet-200 dark:ring-violet-900"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${name}`}
        className="flex h-8 w-6 items-center justify-center rounded-md text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-violet-500"
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="flex-1 truncate text-zinc-700 dark:text-zinc-200 font-medium">{name}</span>
      <button
        onClick={() => entry && onEdit({ subcategory: String(entry.subcategory), name })}
        aria-label={`Edit ${name}`}
        title="Edit content"
        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        onClick={onRemove}
        aria-label={`Remove ${name}`}
        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
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

  // Theme + pattern — local state so the preview updates instantly when randomized
  const [themeId, setThemeId] = useState<string>(portfolio?.themeId ?? "minimalist");
  const [activePattern, setActivePattern] = useState<{ id: string | null; config: PatternConfig | null }>({
    id: portfolio?.patternId ?? null,
    config: (portfolio?.patternConfig as PatternConfig | null) ?? null,
  });

  // "Surprise me" undo snapshot + dice animation state
  interface Snapshot {
    ids: string[];
    themeId: string;
    pattern: { id: string | null; config: PatternConfig | null };
    label: string;
  }
  const [undoSnap, setUndoSnap] = useState<Snapshot | null>(null);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (!undoSnap) return;
    const t = setTimeout(() => setUndoSnap(null), 10000);
    return () => clearTimeout(t);
  }, [undoSnap]);

  // Preview data — local state so per-section edits update the preview instantly
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(
    (portfolio?.portfolioData as PortfolioData | null) ?? demoData
  );

  // Per-section content editor
  const [editingSection, setEditingSection] = useState<{ subcategory: string; name: string } | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleSectionSave = async (next: PortfolioData) => {
    setSavingEdit(true);
    setPortfolioData(next); // optimistic — preview updates immediately
    try {
      await savePortfolioData(next);
      setEditingSection(null);
    } catch {
      // leave the modal open so the user can retry
    } finally {
      setSavingEdit(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Close the library drawer with Escape
  useEffect(() => {
    if (!showLibrary) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLibrary(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLibrary]);

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

  // ── Random theme generator ──
  const surpriseMe = () => {
    // Snapshot current state so the change is one click away from undone
    setUndoSnap({ ids: componentIds, themeId, pattern: activePattern, label: "previous setup" });

    const ids = generateRandomLayout(userRole);
    const style = generateRandomStyle(userRole);

    setComponentIds(ids);
    setThemeId(style.themeId);
    setActivePattern({ id: style.patternId, config: style.patternConfig });
    setRolling(true);
    setTimeout(() => setRolling(false), 700);

    startTransition(async () => {
      await saveSelectedComponents(ids);
      await saveTheme(style.themeId);
      await savePattern(style.patternId, style.patternConfig);
    });
  };

  const undoSurprise = () => {
    if (!undoSnap) return;
    const snap = undoSnap;
    setUndoSnap(null);
    setComponentIds(snap.ids);
    setThemeId(snap.themeId);
    setActivePattern(snap.pattern);
    startTransition(async () => {
      await saveSelectedComponents(snap.ids);
      await saveTheme(snap.themeId);
      await savePattern(snap.pattern.id, snap.pattern.config);
    });
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

  // Mobile: show one pane at a time (the two panels can't fit side-by-side)
  const [mobileView, setMobileView] = useState<"preview" | "sections">("preview");

  return (
    <div className="flex h-full flex-col">
      {/* Random theme undo toast */}
      {undoSnap && (
        <div role="status" className="toast-in fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-zinc-900 text-white pl-4 pr-1.5 py-2 rounded-2xl shadow-xl text-sm">
          <Dices className="h-4 w-4 text-violet-400 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Random theme applied</span>
          <button
            onClick={undoSurprise}
            className="inline-flex items-center gap-1.5 font-semibold text-violet-300 hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" /> Undo
          </button>
          <button
            onClick={() => setUndoSnap(null)}
            aria-label="Dismiss notification"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Upgrade success toast */}
      {showUpgradeToast && (
        <div role="status" className="toast-in fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium">
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>You&apos;re now Pro! All features unlocked.</span>
          <button onClick={() => setShowUpgradeToast(false)} aria-label="Dismiss notification" className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors cursor-pointer">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Free tier banner with slot meter */}
      {!proUser && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 border-b border-violet-100 dark:border-violet-900/50 px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <p className="text-xs text-violet-700 dark:text-violet-300 truncate">
              <span className="font-semibold">Free plan</span> — {componentIds.length}/8 components used
            </p>
            <div
              className="hidden sm:block h-1.5 w-24 rounded-full bg-violet-100 dark:bg-violet-900/60 overflow-hidden"
              role="progressbar"
              aria-valuenow={componentIds.length}
              aria-valuemin={0}
              aria-valuemax={8}
              aria-label="Component slots used"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${Math.min((componentIds.length / 8) * 100, 100)}%` }}
              />
            </div>
          </div>
          <a href="/dashboard/upgrade"
            className="press-scale shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
            <Zap className="h-3 w-3" aria-hidden="true" /> Upgrade to Pro
          </a>
        </div>
      )}

      {/* Mobile pane toggle */}
      <div className="md:hidden flex items-center gap-1 p-1 mx-3 mt-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
        {(["preview", "sections"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            aria-pressed={mobileView === v}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer",
              mobileView === v ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400"
            )}
          >
            {v === "preview" ? "Preview" : `Sections (${componentIds.length})`}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
      {/* Left panel — component list */}
      <div className={cn(
        "w-full md:w-72 shrink-0 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex-col md:flex",
        mobileView === "sections" ? "flex" : "hidden"
      )}>
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-semibold text-zinc-900 dark:text-white text-sm mb-0.5">My Components</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {componentIds.length} section{componentIds.length !== 1 ? "s" : ""}{componentIds.length > 1 ? " · drag to reorder" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowLibrary(true)}
            className="press-scale shrink-0 inline-flex items-center gap-1.5 bg-zinc-900 dark:bg-zinc-700 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {componentIds.length === 0 ? (
            <button
              onClick={() => setShowLibrary(true)}
              className="w-full flex flex-col items-center gap-2 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl py-10 px-4 text-center hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/40 dark:hover:bg-violet-950/20 transition-colors cursor-pointer group"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-violet-100 group-hover:text-violet-600 dark:group-hover:bg-violet-900/50 transition-colors">
                <Plus className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Add your first section</span>
              <span className="text-xs text-zinc-400">Browse the component library</span>
            </button>
          ) : (
            <>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
                  {componentIds.map((id) => (
                    <SortableRow key={id} id={id} onRemove={() => removeComponent(id)} onEdit={setEditingSection} />
                  ))}
                </SortableContext>
              </DndContext>
              {/* Flowing add tile — sits right after the last section */}
              <button
                onClick={() => setShowLibrary(true)}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 py-2.5 rounded-xl text-sm hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50/40 dark:hover:bg-violet-950/20 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" aria-hidden="true" /> Add section
              </button>
            </>
          )}
        </div>
      </div>

      {/* Center — live preview */}
      <div className={cn(
        "flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-950 md:block",
        mobileView === "preview" ? "block" : "hidden"
      )}>
        <div className="p-4">
          {/* Status bar */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400" aria-live="polite">
              {isPending && <><Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> Saving…</>}
              {!isPending && importStatus === "done" && <><CheckCircle2 className="h-3 w-3 text-emerald-500" aria-hidden="true" /> Data imported</>}
              {!isPending && importStatus === "error" && <><AlertCircle className="h-3 w-3 text-red-400" aria-hidden="true" /> Import failed</>}
            </div>
            <div className="flex items-center gap-2">
              {!hasDetails && (
                <a href="/dashboard/details"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 px-2.5 py-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors">
                  <Sparkles className="h-3 w-3" aria-hidden="true" /> Fill in your details to personalize →
                </a>
              )}
              <button
                onClick={surpriseMe}
                disabled={isPending}
                title="Randomize layout, theme and colors"
                className="press-scale btn-shine inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3.5 py-2 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                <Dices className={cn("h-3.5 w-3.5", rolling && "dice-roll")} aria-hidden="true" />
                Surprise me
              </button>
            </div>
          </div>

          {/* Portfolio preview */}
          {componentIds.length === 0 ? (
            <div className="fade-in flex flex-col items-center justify-center py-36 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/60 dark:bg-zinc-900/40">
              <div className="h-16 w-16 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-950 dark:to-indigo-950 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="h-7 w-7 text-violet-500" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">Start building your portfolio</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 max-w-xs">
                Add sections from the library — they&apos;ll preview here exactly as visitors will see them.
              </p>
              <button onClick={() => setShowLibrary(true)}
                className="press-scale inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500">
                <Plus className="h-4 w-4" aria-hidden="true" /> Browse Library
              </button>
            </div>
          ) : (() => {
            // Resolve theme tokens (live state — updates instantly on randomize)
            const themeTokens = getThemeTokenStyle(themeId);

            // Resolve pattern
            let patternStyle: React.CSSProperties = {};
            let patternBaseColor: string | null = null;
            if (activePattern.id) {
              const pattern = getPatternById(activePattern.id);
              if (pattern) {
                const config = activePattern.config ?? pattern.defaults;
                patternStyle = pattern.render(config);
                patternBaseColor = config.baseColor;
              }
            }

            const rootBg = patternBaseColor ?? (themeTokens["--pf-bg"] as string) ?? "#ffffff";

            return (
              <div className="fade-in rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-md bg-white dark:bg-zinc-900">
                {/* Browser chrome — makes the preview read as the live site */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-zinc-100/90 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700" aria-hidden="true">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                  </div>
                  <div className="flex-1 flex justify-center min-w-0">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-3.5 py-1 truncate max-w-[260px]">
                      portfolioforge.dev/u/{portfolio?.slug ?? "you"}
                    </span>
                  </div>
                  <div className="w-12 shrink-0" />
                </div>
                <div
                  className="pf-themed"
                  style={{
                    ...(themeTokens as React.CSSProperties),
                    background: rootBg,
                    color: "var(--pf-fg)",
                    position: "relative",
                  }}
                >
                  {/* Pattern overlay inside the preview box */}
                  {activePattern.id && (
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
              </div>
            );
          })()}
        </div>
      </div>

      {/* Library drawer */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] fade-in" onClick={() => setShowLibrary(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Component Library"
            className="drawer-in relative ml-auto w-[480px] max-w-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col h-full"
          >
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-zinc-900 dark:text-white">Component Library</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Pick sections to add to your portfolio</p>
              </div>
              <button
                onClick={() => setShowLibrary(false)}
                aria-label="Close library"
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500"
              >
                <X className="h-5 w-5" aria-hidden="true" />
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
                        {comp.isNew && (
                          <div className="absolute top-2 left-2 bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">✦ NEW</div>
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
                            aria-label={`Remove ${comp.name}`}
                            className="press-scale flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500"
                          >
                            <X className="h-3 w-3" aria-hidden="true" /> Remove
                          </button>
                        ) : isSubcategoryUsed ? (
                          <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed">
                            Type used
                          </span>
                        ) : (
                          <button
                            onClick={() => addComponent(comp.id)}
                            aria-label={isLocked ? `${comp.name} requires Pro` : `Add ${comp.name}`}
                            className={cn(
                              "press-scale flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500",
                              isLocked
                                ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                                : "bg-zinc-900 text-white hover:bg-zinc-700"
                            )}
                          >
                            {isLocked
                              ? <><Zap className="h-3 w-3" aria-hidden="true" /> Pro</>
                              : <><Plus className="h-3 w-3" aria-hidden="true" /> Add</>
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

      {/* Per-section content editor */}
      {editingSection && (
        <SectionEditorModal
          subcategory={editingSection.subcategory}
          componentName={editingSection.name}
          data={portfolioData}
          saving={savingEdit}
          onSave={handleSectionSave}
          onClose={() => setEditingSection(null)}
        />
      )}

      {/* Upgrade modal */}
      <UpgradeModal
        open={upgradeModal.open}
        onClose={() => setUpgradeModal({ open: false })}
        trigger={upgradeModal.trigger}
      />
    </div>
  );
}
