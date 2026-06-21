"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PortfolioData, GalleryImage } from "@/types/portfolio";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  X, Plus, Trash2, Loader2, Save,
  User, FileText, Wrench, FolderOpen, Briefcase, GraduationCap, Mail, Images
} from "lucide-react";
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

const SECTION_META: Record<string, { icon: typeof User; color: string; accent: string }> = {
  Hero:       { icon: User,          color: "from-violet-500 to-indigo-600",  accent: "from-violet-500 to-indigo-500" },
  About:      { icon: FileText,      color: "from-blue-500 to-cyan-600",      accent: "from-blue-400 to-cyan-500"    },
  Skills:     { icon: Wrench,        color: "from-emerald-500 to-teal-600",   accent: "from-emerald-400 to-teal-500" },
  Projects:   { icon: FolderOpen,    color: "from-orange-500 to-amber-600",   accent: "from-orange-400 to-amber-500" },
  Experience: { icon: Briefcase,     color: "from-pink-500 to-rose-600",      accent: "from-pink-400 to-rose-500"    },
  Education:  { icon: GraduationCap, color: "from-sky-500 to-blue-600",       accent: "from-sky-400 to-blue-500"     },
  Gallery:    { icon: Images,        color: "from-purple-500 to-fuchsia-600", accent: "from-purple-400 to-fuchsia-500"},
  Contact:    { icon: Mail,          color: "from-rose-500 to-pink-600",      accent: "from-rose-400 to-pink-500"    },
};

// ── Field primitives ──────────────────────────────────────────────────────────

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-zinc-400 leading-relaxed">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full h-10 px-3.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900/50 focus:border-violet-400 transition-all";
const areaCls =
  "w-full px-3.5 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900/50 focus:border-violet-400 resize-none transition-all leading-relaxed";

function Text({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />;
}
function Area({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={areaCls} />;
}

function CardWrap({ label, accent = "from-violet-400 to-indigo-400", onRemove, children }: {
  label: string;
  accent?: string;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl border border-zinc-100 dark:border-zinc-700/60 bg-zinc-50/60 dark:bg-zinc-800/40 overflow-hidden shadow-sm">
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${accent}`} />
      <div className="pl-5 pr-4 pt-3.5 pb-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.16em]">{label}</span>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-2xl hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-all cursor-pointer group"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40 transition-colors">
        <Plus className="h-3.5 w-3.5 text-zinc-400 group-hover:text-violet-600 transition-colors" />
      </span>
      {label}
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

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

  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Escape") onClose(); };
  const editable = EDITABLE.has(subcategory);
  const meta = SECTION_META[subcategory];
  const SectionIcon = meta?.icon ?? FileText;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in"
      onClick={onClose}
      onKeyDown={onKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.3)] w-full max-w-2xl max-h-[90vh] flex flex-col focus:outline-none overflow-hidden"
      >
        {/* Gradient accent bar */}
        <div className={`h-1 bg-gradient-to-r ${meta?.accent ?? "from-violet-500 to-indigo-500"} shrink-0`} />

        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${meta?.color ?? "from-violet-500 to-indigo-600"} flex items-center justify-center shadow-lg shrink-0`}
            style={{ boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}
          >
            <SectionIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-[0.18em] text-violet-500 dark:text-violet-400 uppercase mb-0.5">
              Edit section
            </p>
            <h2 id={titleId} className="text-lg font-bold text-zinc-900 dark:text-white leading-tight truncate">
              {componentName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!editable ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <FileText className="h-5 w-5 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 max-w-xs">
                This section renders automatically from your theme — no custom fields to edit yet.
              </p>
            </div>
          ) : (
            <SectionFields subcategory={subcategory} draft={draft} setDraft={setDraft} meta={meta} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all cursor-pointer"
          >
            Cancel
          </button>
          {editable && (
            <button
              type="button"
              onClick={() => onSave(draft)}
              disabled={saving}
              className={cn(
                "press-scale inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer disabled:opacity-60 shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
                `bg-gradient-to-r ${meta?.color ?? "from-violet-600 to-indigo-600"} hover:shadow-lg hover:scale-[1.01]`
              )}
              style={{ boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}
            >
              {saving
                ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Saving…</>
                : <><Save className="h-4 w-4" aria-hidden="true" /> Save changes</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Per-section field sets ────────────────────────────────────────────────────

function SectionFields({ subcategory, draft, setDraft, meta }: {
  subcategory: string;
  draft: PortfolioData;
  setDraft: React.Dispatch<React.SetStateAction<PortfolioData>>;
  meta?: { accent: string };
}) {
  const accent = meta?.accent ?? "from-violet-400 to-indigo-400";

  // ── Hero ──
  if (subcategory === "Hero") {
    const h = draft.hero;
    const setH = (patch: Partial<PortfolioData["hero"]>) => setDraft((d) => ({ ...d, hero: { ...d.hero, ...patch } }));
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name"><Text value={h.name} onChange={(v) => setH({ name: v })} placeholder="Your full name" /></Field>
          <Field label="Location"><Text value={h.location} onChange={(v) => setH({ location: v })} placeholder="City, Country" /></Field>
        </div>
        <Field label="Tagline">
          <Text value={h.tagline} onChange={(v) => setH({ tagline: v })} placeholder="What you do in one line" />
        </Field>
        <Field label="Profile photo" hint="Upload a photo or paste an image URL below.">
          <div className="flex gap-4 items-start p-4 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl hover:border-violet-300 dark:hover:border-violet-700 transition-colors bg-white dark:bg-zinc-800/50">
            <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
              <ImageUpload value={h.avatarUrl} onChange={(v) => setH({ avatarUrl: v })} kind="avatar" aspect="square" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-2 justify-center">
              <p className="text-xs text-zinc-400 font-medium">Upload a photo or paste a URL</p>
              <input
                type="url"
                value={h.avatarUrl}
                onChange={(e) => setH({ avatarUrl: e.target.value })}
                placeholder="https://…"
                className={inputCls}
              />
            </div>
          </div>
        </Field>
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setH({ openToWork: !h.openToWork })}
            aria-pressed={h.openToWork}
            className={cn(
              "h-6 w-11 rounded-full relative transition-all cursor-pointer shrink-0 shadow-inner",
              h.openToWork ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-600"
            )}
          >
            <span className={cn(
              "absolute top-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200",
              h.openToWork ? "translate-x-5" : "translate-x-1"
            )} />
          </button>
          <div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Open to work</p>
            <p className="text-xs text-zinc-400">Show an availability badge on your portfolio</p>
          </div>
        </div>
        {h.openToWork && (
          <Field label="Availability note">
            <Text value={h.availability} onChange={(v) => setH({ availability: v })} placeholder="Available immediately for full-time roles" />
          </Field>
        )}
      </div>
    );
  }

  // ── About ──
  if (subcategory === "About") {
    const a = draft.about;
    const setA = (patch: Partial<PortfolioData["about"]>) => setDraft((d) => ({ ...d, about: { ...d.about, ...patch } }));
    return (
      <div className="space-y-5">
        <Field label="Bio paragraphs" hint="Separate paragraphs with a blank line. AI will polish these.">
          <Area value={a.paragraphs.join("\n\n")} onChange={(v) => setA({ paragraphs: v.split("\n\n").map((s) => s.trim()).filter(Boolean) })} rows={6} placeholder="Tell your story…" />
        </Field>
        <Field label="Highlights" hint="Short phrases, one per line — shown as bullet points.">
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
      <div className="space-y-3.5">
        {cats.map((c, i) => (
          <CardWrap key={i} label={`Category ${i + 1}`} accent={accent} onRemove={() => setCats(cats.filter((_, idx) => idx !== i))}>
            <Field label="Category name">
              <Text value={c.name} onChange={(v) => setCats(cats.map((x, idx) => (idx === i ? { ...x, name: v } : x)))} placeholder="Frontend" />
            </Field>
            <Field label="Skills" hint="Comma-separated">
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
      <div className="space-y-3.5">
        {ps.map((p, i) => (
          <CardWrap key={i} label={`Project ${i + 1}`} accent={accent} onRemove={() => setPs(ps.filter((_, idx) => idx !== i))}>
            <Field label="Project name"><Text value={p.name} onChange={(v) => upd(i, { name: v })} placeholder="Project name" /></Field>
            <Field label="Cover image"><ImageUpload value={p.imageUrl} onChange={(v) => upd(i, { imageUrl: v })} kind="project" aspect="video" /></Field>
            <Field label="Description"><Area value={p.description} onChange={(v) => upd(i, { description: v })} rows={3} placeholder="What it does and how you built it…" /></Field>
            <Field label="Tech stack" hint="Comma-separated">
              <Text value={p.techStack.join(", ")} onChange={(v) => upd(i, { techStack: v.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="React, Node.js, PostgreSQL" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Live URL"><Text value={p.liveUrl} onChange={(v) => upd(i, { liveUrl: v })} placeholder="https://…" /></Field>
              <Field label="Repo URL"><Text value={p.repoUrl} onChange={(v) => upd(i, { repoUrl: v })} placeholder="https://github.com/…" /></Field>
            </div>
            <label className="inline-flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={p.featured} onChange={(e) => upd(i, { featured: e.target.checked })}
                className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-400 cursor-pointer" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 transition-colors">
                Feature this project
              </span>
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
      <div className="space-y-3.5">
        {xs.map((x, i) => (
          <CardWrap key={i} label={`Position ${i + 1}`} accent={accent} onRemove={() => setXs(xs.filter((_, idx) => idx !== i))}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company"><Text value={x.company} onChange={(v) => upd(i, { company: v })} placeholder="Company name" /></Field>
              <Field label="Role"><Text value={x.role} onChange={(v) => upd(i, { role: v })} placeholder="Job title" /></Field>
            </div>
            <Field label="Period"><Text value={x.period} onChange={(v) => upd(i, { period: v })} placeholder="Jan 2022 – Present" /></Field>
            <Field label="Description"><Area value={x.description} onChange={(v) => upd(i, { description: v })} rows={3} placeholder="What you worked on and achieved…" /></Field>
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
      <div className="space-y-3.5">
        {es.map((x, i) => (
          <CardWrap key={i} label={`Institution ${i + 1}`} accent={accent} onRemove={() => setEs(es.filter((_, idx) => idx !== i))}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="School"><Text value={x.school} onChange={(v) => upd(i, { school: v })} placeholder="University name" /></Field>
              <Field label="Degree"><Text value={x.degree} onChange={(v) => upd(i, { degree: v })} placeholder="B.S. Computer Science" /></Field>
            </div>
            <Field label="Period"><Text value={x.period} onChange={(v) => upd(i, { period: v })} placeholder="2019 – 2023" /></Field>
            <Field label="Notes"><Area value={x.notes} onChange={(v) => upd(i, { notes: v })} rows={2} placeholder="GPA, clubs, relevant coursework…" /></Field>
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
      <div className="space-y-3.5">
        {gs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {gs.map((g, i) => (
              <CardWrap key={i} label={`Image ${i + 1}`} accent={accent} onRemove={() => setGs(gs.filter((_, idx) => idx !== i))}>
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
        <Field label="Email address">
          <Text type="email" value={c.email} onChange={setEmail} placeholder="you@example.com" />
        </Field>
        <div className="pt-1">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.16em] mb-3">Social links</p>
          <div className="space-y-3">
            {SOCIAL_KEYS.map((key) => (
              <Field key={key} label={key}>
                <Text value={c.socials[key] ?? ""} onChange={(v) => setSocial(key, v)} placeholder="https://…" />
              </Field>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
