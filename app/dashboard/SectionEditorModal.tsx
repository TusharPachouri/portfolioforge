"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PortfolioData, GalleryImage } from "@/types/portfolio";
import ImageUpload from "@/components/ui/ImageUpload";
import { X, Plus, Trash2, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  subcategory: string;
  componentName: string;
  data: PortfolioData;
  saving: boolean;
  onSave: (next: PortfolioData) => void;
  onClose: () => void;
}

const EDITABLE = new Set(["Hero", "About", "Skills", "Projects", "Experience", "Education", "Gallery", "Contact"]);
const SOCIAL_KEYS = ["GitHub", "LinkedIn", "Twitter", "Website"] as const;

// ── Small field primitives ────────────────────────────────────────────────────

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full h-9 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400";
const areaCls =
  "w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none";

function Text({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />;
}
function Area({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={areaCls} />;
}

function CardWrap({ label, onRemove, children }: { label: string; onRemove?: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-zinc-100 dark:border-zinc-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{label}</span>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-zinc-300 hover:text-red-400 transition-colors cursor-pointer">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center justify-center gap-2 w-full text-sm text-zinc-600 dark:text-zinc-300 border border-dashed border-zinc-300 dark:border-zinc-600 px-4 py-2.5 rounded-xl hover:border-violet-400 hover:text-violet-600 transition-colors cursor-pointer">
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

// ── The modal ─────────────────────────────────────────────────────────────────

export default function SectionEditorModal({ subcategory, componentName, data, saving, onSave, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const [draft, setDraft] = useState<PortfolioData>(() => ({
    ...data,
    gallery: data.gallery ?? [],
    projects: (data.projects ?? []).map((p) => ({ ...p, imageUrl: p.imageUrl ?? "" })),
  }));

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      opener?.focus();
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  const editable = EDITABLE.has(subcategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4 fade-in" onClick={onClose} onKeyDown={onKeyDown}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-violet-600 dark:text-violet-400 uppercase mb-1">Edit section</p>
            <h2 id={titleId} className="text-lg font-bold text-zinc-900 dark:text-white">{componentName}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!editable ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 py-6 text-center">
              This section renders automatically from your theme and content — it has no custom fields to edit yet.
            </p>
          ) : (
            <SectionFields subcategory={subcategory} draft={draft} setDraft={setDraft} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-zinc-100 dark:border-zinc-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            Cancel
          </button>
          {editable && (
            <button
              type="button"
              onClick={() => onSave(draft)}
              disabled={saving}
              className="press-scale inline-flex items-center gap-2 bg-zinc-900 dark:bg-violet-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-violet-700 transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Saving…</> : <><Save className="h-4 w-4" aria-hidden="true" /> Save changes</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Per-section field sets ────────────────────────────────────────────────────

function SectionFields({ subcategory, draft, setDraft }: {
  subcategory: string;
  draft: PortfolioData;
  setDraft: React.Dispatch<React.SetStateAction<PortfolioData>>;
}) {
  // ── Hero ──
  if (subcategory === "Hero") {
    const h = draft.hero;
    const setH = (patch: Partial<PortfolioData["hero"]>) => setDraft((d) => ({ ...d, hero: { ...d.hero, ...patch } }));
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name"><Text value={h.name} onChange={(v) => setH({ name: v })} placeholder="Your name" /></Field>
          <Field label="Location"><Text value={h.location} onChange={(v) => setH({ location: v })} placeholder="City, Country" /></Field>
        </div>
        <Field label="Tagline"><Text value={h.tagline} onChange={(v) => setH({ tagline: v })} placeholder="What you do" /></Field>
        <Field label="Avatar" hint="Upload a photo or paste a URL below.">
          <div className="max-w-[160px]">
            <ImageUpload value={h.avatarUrl} onChange={(v) => setH({ avatarUrl: v })} kind="avatar" aspect="square" />
          </div>
          <input type="url" value={h.avatarUrl} onChange={(e) => setH({ avatarUrl: e.target.value })} placeholder="https://… (optional)" className={cn(inputCls, "mt-2")} />
        </Field>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setH({ openToWork: !h.openToWork })}
            className={cn("h-5 w-9 rounded-full relative transition-colors cursor-pointer", h.openToWork ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600")}>
            <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", h.openToWork ? "translate-x-4" : "translate-x-0.5")} />
          </button>
          <span className="text-sm text-zinc-700 dark:text-zinc-300">Open to work</span>
        </div>
        {h.openToWork && (
          <Field label="Availability note"><Text value={h.availability} onChange={(v) => setH({ availability: v })} placeholder="Available immediately" /></Field>
        )}
      </div>
    );
  }

  // ── About ──
  if (subcategory === "About") {
    const a = draft.about;
    const setA = (patch: Partial<PortfolioData["about"]>) => setDraft((d) => ({ ...d, about: { ...d.about, ...patch } }));
    return (
      <div className="space-y-4">
        <Field label="About paragraphs" hint="Separate paragraphs with a blank line.">
          <Area value={a.paragraphs.join("\n\n")} onChange={(v) => setA({ paragraphs: v.split("\n\n").map((s) => s.trim()).filter(Boolean) })} rows={6} placeholder="Tell your story…" />
        </Field>
        <Field label="Highlights" hint="One per line — short phrases.">
          <Area value={a.highlights.join("\n")} onChange={(v) => setA({ highlights: v.split("\n").map((s) => s.trim()).filter(Boolean) })} rows={4} placeholder={"5+ years building web apps\nLed a team of 6"} />
        </Field>
      </div>
    );
  }

  // ── Skills ──
  if (subcategory === "Skills") {
    const cats = draft.skills.categories;
    const setCats = (next: PortfolioData["skills"]["categories"]) => setDraft((d) => ({ ...d, skills: { categories: next } }));
    return (
      <div className="space-y-4">
        {cats.map((c, i) => (
          <CardWrap key={i} label={`Category ${i + 1}`} onRemove={() => setCats(cats.filter((_, idx) => idx !== i))}>
            <Field label="Category name"><Text value={c.name} onChange={(v) => setCats(cats.map((x, idx) => (idx === i ? { ...x, name: v } : x)))} placeholder="Frontend" /></Field>
            <Field label="Skills" hint="Comma-separated.">
              <Text value={c.items.join(", ")} onChange={(v) => setCats(cats.map((x, idx) => (idx === i ? { ...x, items: v.split(",").map((s) => s.trim()).filter(Boolean) } : x)))} placeholder="React, TypeScript, Tailwind" />
            </Field>
          </CardWrap>
        ))}
        <AddButton onClick={() => setCats([...cats, { name: "", items: [] }])} label="Add category" />
      </div>
    );
  }

  // ── Projects ──
  if (subcategory === "Projects") {
    const ps = draft.projects;
    const setPs = (next: PortfolioData["projects"]) => setDraft((d) => ({ ...d, projects: next }));
    const upd = (i: number, patch: Partial<PortfolioData["projects"][number]>) => setPs(ps.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
    return (
      <div className="space-y-4">
        {ps.map((p, i) => (
          <CardWrap key={i} label={`Project ${i + 1}`} onRemove={() => setPs(ps.filter((_, idx) => idx !== i))}>
            <Field label="Name"><Text value={p.name} onChange={(v) => upd(i, { name: v })} placeholder="Project name" /></Field>
            <Field label="Cover image"><ImageUpload value={p.imageUrl} onChange={(v) => upd(i, { imageUrl: v })} kind="project" aspect="video" /></Field>
            <Field label="Description"><Area value={p.description} onChange={(v) => upd(i, { description: v })} rows={3} placeholder="What it does and how you built it…" /></Field>
            <Field label="Tech stack" hint="Comma-separated.">
              <Text value={p.techStack.join(", ")} onChange={(v) => upd(i, { techStack: v.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="React, Node.js" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Live URL"><Text value={p.liveUrl} onChange={(v) => upd(i, { liveUrl: v })} placeholder="https://…" /></Field>
              <Field label="Repo URL"><Text value={p.repoUrl} onChange={(v) => upd(i, { repoUrl: v })} placeholder="https://github.com/…" /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
              <input type="checkbox" checked={p.featured} onChange={(e) => upd(i, { featured: e.target.checked })} className="rounded" /> Featured
            </label>
          </CardWrap>
        ))}
        <AddButton onClick={() => setPs([...ps, { name: "", description: "", techStack: [], repoUrl: "", liveUrl: "", featured: false, role: "", imageUrl: "" }])} label="Add project" />
      </div>
    );
  }

  // ── Experience ──
  if (subcategory === "Experience") {
    const xs = draft.experience;
    const setXs = (next: PortfolioData["experience"]) => setDraft((d) => ({ ...d, experience: next }));
    const upd = (i: number, patch: Partial<PortfolioData["experience"][number]>) => setXs(xs.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
    return (
      <div className="space-y-4">
        {xs.map((x, i) => (
          <CardWrap key={i} label={`Position ${i + 1}`} onRemove={() => setXs(xs.filter((_, idx) => idx !== i))}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company"><Text value={x.company} onChange={(v) => upd(i, { company: v })} placeholder="Company" /></Field>
              <Field label="Role"><Text value={x.role} onChange={(v) => upd(i, { role: v })} placeholder="Title" /></Field>
            </div>
            <Field label="Period"><Text value={x.period} onChange={(v) => upd(i, { period: v })} placeholder="Jan 2022 – Present" /></Field>
            <Field label="Description"><Area value={x.description} onChange={(v) => upd(i, { description: v })} rows={3} /></Field>
          </CardWrap>
        ))}
        <AddButton onClick={() => setXs([...xs, { company: "", role: "", period: "", description: "" }])} label="Add position" />
      </div>
    );
  }

  // ── Education ──
  if (subcategory === "Education") {
    const es = draft.education;
    const setEs = (next: PortfolioData["education"]) => setDraft((d) => ({ ...d, education: next }));
    const upd = (i: number, patch: Partial<PortfolioData["education"][number]>) => setEs(es.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
    return (
      <div className="space-y-4">
        {es.map((x, i) => (
          <CardWrap key={i} label={`Institution ${i + 1}`} onRemove={() => setEs(es.filter((_, idx) => idx !== i))}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="School"><Text value={x.school} onChange={(v) => upd(i, { school: v })} placeholder="University" /></Field>
              <Field label="Degree"><Text value={x.degree} onChange={(v) => upd(i, { degree: v })} placeholder="B.S. Computer Science" /></Field>
            </div>
            <Field label="Period"><Text value={x.period} onChange={(v) => upd(i, { period: v })} placeholder="2019 – 2023" /></Field>
            <Field label="Notes"><Area value={x.notes} onChange={(v) => upd(i, { notes: v })} rows={2} /></Field>
          </CardWrap>
        ))}
        <AddButton onClick={() => setEs([...es, { school: "", degree: "", period: "", notes: "" }])} label="Add institution" />
      </div>
    );
  }

  // ── Gallery ──
  if (subcategory === "Gallery") {
    const gs = draft.gallery ?? [];
    const setGs = (next: GalleryImage[]) => setDraft((d) => ({ ...d, gallery: next }));
    const upd = (i: number, patch: Partial<GalleryImage>) => setGs(gs.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
    return (
      <div className="space-y-4">
        {gs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gs.map((g, i) => (
              <CardWrap key={i} label={`Image ${i + 1}`} onRemove={() => setGs(gs.filter((_, idx) => idx !== i))}>
                <ImageUpload value={g.imageUrl} onChange={(v) => upd(i, { imageUrl: v })} kind="gallery" aspect="video" />
                <Text value={g.caption} onChange={(v) => upd(i, { caption: v })} placeholder="Caption (optional)" />
              </CardWrap>
            ))}
          </div>
        )}
        <AddButton onClick={() => setGs([...gs, { imageUrl: "", caption: "" }])} label="Add gallery image" />
      </div>
    );
  }

  // ── Contact ──
  if (subcategory === "Contact") {
    const c = draft.contact;
    const setEmail = (email: string) => setDraft((d) => ({ ...d, contact: { ...d.contact, email } }));
    const setSocial = (key: string, value: string) => setDraft((d) => ({ ...d, contact: { ...d.contact, socials: { ...d.contact.socials, [key]: value } } }));
    return (
      <div className="space-y-4">
        <Field label="Email"><Text value={c.email} onChange={setEmail} placeholder="you@example.com" /></Field>
        {SOCIAL_KEYS.map((key) => (
          <Field key={key} label={key}><Text value={c.socials[key] ?? ""} onChange={(v) => setSocial(key, v)} placeholder={`https://…`} /></Field>
        ))}
      </div>
    );
  }

  return null;
}
