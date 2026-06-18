"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RawUserDetails, RawExperience, RawEducation, RawProject, GalleryImage } from "@/types/portfolio";
import { useBuilderState } from "@/hooks/useBuilderState";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { saveDetailsAndGenerate } from "@/lib/actions/portfolio";
import ImageUpload from "@/components/ui/ImageUpload";
import { cn } from "@/lib/utils";
import {
  User, FileText, Wrench, Briefcase, GraduationCap,
  FolderOpen, Link2, CheckCircle2, Plus, Trash2,
  ChevronLeft, ChevronRight, Loader2, AlertCircle, Sparkles, Images
} from "lucide-react";

// Read any in-progress draft an anonymous visitor left in localStorage.
function readLocalForm(): RawUserDetails | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("pf_builder");
    if (!raw) return null;
    return (JSON.parse(raw) as { rawFormData?: RawUserDetails }).rawFormData ?? null;
  } catch {
    return null;
  }
}

// ─── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Basic Info", icon: User },
  { id: 2, label: "About Me", icon: FileText },
  { id: 3, label: "Skills", icon: Wrench },
  { id: 4, label: "Experience", icon: Briefcase },
  { id: 5, label: "Education", icon: GraduationCap },
  { id: 6, label: "Projects", icon: FolderOpen },
  { id: 7, label: "Gallery", icon: Images },
  { id: 8, label: "Socials", icon: Link2 },
  { id: 9, label: "Generate", icon: CheckCircle2 },
];
const LAST_STEP = STEPS.length; // 9

const EMPTY_EXP: RawExperience = { company: "", role: "", period: "", description: "" };
const EMPTY_EDU: RawEducation = { school: "", degree: "", period: "", notes: "" };
const EMPTY_PROJ: RawProject = { name: "", description: "", techStack: [], repoUrl: "", liveUrl: "", featured: false, imageUrl: "" };
const EMPTY_GALLERY: GalleryImage = { imageUrl: "", caption: "" };

function emptyForm(): RawUserDetails {
  return {
    name: "", tagline: "", location: "", avatarUrl: "",
    userType: "experienced",
    bio: "", openToWork: false, availability: "",
    skills: [],
    experience: [{ ...EMPTY_EXP }],
    education: [{ ...EMPTY_EDU }],
    projects: [{ ...EMPTY_PROJ }],
    gallery: [],
    socials: { github: "", linkedin: "", twitter: "", website: "", email: "" },
  };
}

// ─── Shared field components ──────────────────────────────────────────────────

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn("w-full h-9 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white", className)}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none bg-white"
    />
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

function Step1({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  return (
    <div className="space-y-5">
      <Field label="Full Name *">
        <TextInput value={form.name} onChange={(v) => set({ name: v })} placeholder="Alex Rivera" />
      </Field>
      <Field label="Tagline *" hint="One punchy line — what you do and for whom. Max 140 chars.">
        <TextInput value={form.tagline} onChange={(v) => set({ tagline: v })} placeholder="Full-stack engineer building fast, beautiful products" />
      </Field>
      <Field label="Location">
        <TextInput value={form.location} onChange={(v) => set({ location: v })} placeholder="San Francisco, CA" />
      </Field>
      <Field label="Avatar" hint="Upload a photo, or paste an image URL below.">
        <div className="max-w-[180px]">
          <ImageUpload value={form.avatarUrl} onChange={(v) => set({ avatarUrl: v })} kind="avatar" aspect="square" />
        </div>
        <input
          type="url"
          value={form.avatarUrl}
          onChange={(e) => set({ avatarUrl: e.target.value })}
          placeholder="https://… (optional)"
          className="mt-2 w-full h-9 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        />
      </Field>
      <Field label="I am a...">
        <div className="flex gap-3">
          {(["experienced", "fresher"] as const).map((t) => (
            <button key={t} onClick={() => set({ userType: t })}
              className={cn(
                "flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer",
                form.userType === t ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
              )}>
              {t === "experienced" ? "Experienced Professional" : "Student / Fresher"}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function Step2({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  return (
    <div className="space-y-5">
      <Field label="Bio *" hint="Write freely — Gemini AI will polish and structure this for you.">
        <Textarea value={form.bio} onChange={(v) => set({ bio: v })} placeholder="Tell your story. What have you built? What drives you? What are you looking for next?" rows={6} />
      </Field>
      <Field label="Open to Work">
        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => set({ openToWork: !form.openToWork })}
            className={cn("h-5 w-9 rounded-full transition-colors relative cursor-pointer", form.openToWork ? "bg-zinc-900" : "bg-zinc-200")}>
            <div className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", form.openToWork ? "translate-x-4" : "translate-x-0.5")} />
          </div>
          <span className="text-sm text-zinc-700">I&apos;m currently open to new opportunities</span>
        </label>
      </Field>
      {form.openToWork && (
        <Field label="Availability note" hint="e.g. 'Available from June 2025' or 'Looking for remote roles'">
          <TextInput value={form.availability} onChange={(v) => set({ availability: v })} placeholder="Available immediately for full-time roles" />
        </Field>
      )}
    </div>
  );
}

function Step3({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const [input, setInput] = useState("");

  const add = () => {
    const items = input.split(",").map((s) => s.trim()).filter(Boolean);
    const updated = [...new Set([...form.skills, ...items])];
    set({ skills: updated });
    setInput("");
  };

  const remove = (skill: string) => set({ skills: form.skills.filter((s) => s !== skill) });

  return (
    <div className="space-y-5">
      <Field label="Skills" hint="Type skills separated by commas, then press Enter or Add">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder="React, TypeScript, Node.js, PostgreSQL..."
            className="flex-1 h-9 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          />
          <button onClick={add}
            className="px-4 h-9 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer">
            Add
          </button>
        </div>
      </Field>
      {form.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {form.skills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm px-3 py-1.5 rounded-full">
              {skill}
              <button onClick={() => remove(skill)} className="text-zinc-400 hover:text-red-500 cursor-pointer leading-none">×</button>
            </span>
          ))}
        </div>
      )}
      {form.skills.length === 0 && (
        <p className="text-sm text-zinc-400 italic">No skills added yet.</p>
      )}
    </div>
  );
}

function Step4({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const update = (i: number, field: keyof RawExperience, value: string) => {
    const updated = form.experience.map((e, idx) => idx === i ? { ...e, [field]: value } : e);
    set({ experience: updated });
  };
  const add = () => set({ experience: [...form.experience, { ...EMPTY_EXP }] });
  const remove = (i: number) => set({ experience: form.experience.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      {form.experience.map((exp, i) => (
        <div key={i} className="border border-zinc-100 rounded-xl p-5 space-y-4 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Position {i + 1}</span>
            {form.experience.length > 1 && (
              <button onClick={() => remove(i)} className="text-zinc-300 hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company"><TextInput value={exp.company} onChange={(v) => update(i, "company", v)} placeholder="Stripe" /></Field>
            <Field label="Role / Title"><TextInput value={exp.role} onChange={(v) => update(i, "role", v)} placeholder="Senior Software Engineer" /></Field>
            <Field label="Period"><TextInput value={exp.period} onChange={(v) => update(i, "period", v)} placeholder="Jan 2022 – Present" /></Field>
          </div>
          <Field label="Description" hint="What did you build or achieve? Gemini will polish this.">
            <Textarea value={exp.description} onChange={(v) => update(i, "description", v)} placeholder="Led development of the payments SDK..." rows={3} />
          </Field>
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-2 text-sm text-zinc-600 border border-dashed border-zinc-300 px-4 py-2.5 rounded-xl hover:border-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer w-full justify-center">
        <Plus className="h-4 w-4" /> Add another position
      </button>
    </div>
  );
}

function Step5({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const update = (i: number, field: keyof RawEducation, value: string) => {
    const updated = form.education.map((e, idx) => idx === i ? { ...e, [field]: value } : e);
    set({ education: updated });
  };
  const add = () => set({ education: [...form.education, { ...EMPTY_EDU }] });
  const remove = (i: number) => set({ education: form.education.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      {form.education.map((edu, i) => (
        <div key={i} className="border border-zinc-100 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Institution {i + 1}</span>
            {form.education.length > 1 && (
              <button onClick={() => remove(i)} className="text-zinc-300 hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="School / University"><TextInput value={edu.school} onChange={(v) => update(i, "school", v)} placeholder="UC Berkeley" /></Field>
            <Field label="Degree"><TextInput value={edu.degree} onChange={(v) => update(i, "degree", v)} placeholder="B.S. Computer Science" /></Field>
            <Field label="Period"><TextInput value={edu.period} onChange={(v) => update(i, "period", v)} placeholder="Sep 2019 – May 2023" /></Field>
          </div>
          <Field label="Notes / Coursework (optional)">
            <Textarea value={edu.notes} onChange={(v) => update(i, "notes", v)} placeholder="Focus areas, notable courses, thesis..." rows={2} />
          </Field>
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-2 text-sm text-zinc-600 border border-dashed border-zinc-300 px-4 py-2.5 rounded-xl hover:border-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer w-full justify-center">
        <Plus className="h-4 w-4" /> Add another institution
      </button>
    </div>
  );
}

function Step6({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const [techInput, setTechInput] = useState<Record<number, string>>({});

  const update = <K extends keyof RawProject>(i: number, field: K, value: RawProject[K]) => {
    const updated = form.projects.map((p, idx) => idx === i ? { ...p, [field]: value } : p);
    set({ projects: updated });
  };

  const addTech = (i: number) => {
    const items = (techInput[i] || "").split(",").map((s) => s.trim()).filter(Boolean);
    const updated = [...new Set([...form.projects[i].techStack, ...items])];
    update(i, "techStack", updated);
    setTechInput((prev) => ({ ...prev, [i]: "" }));
  };

  const removeTech = (i: number, tech: string) => {
    update(i, "techStack", form.projects[i].techStack.filter((t) => t !== tech));
  };

  const add = () => set({ projects: [...form.projects, { ...EMPTY_PROJ }] });
  const remove = (i: number) => set({ projects: form.projects.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      {form.projects.map((proj, i) => (
        <div key={i} className="border border-zinc-100 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Project {i + 1}</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-zinc-500 cursor-pointer">
                <input type="checkbox" checked={proj.featured} onChange={(e) => update(i, "featured", e.target.checked)} className="rounded" />
                Featured
              </label>
              {form.projects.length > 1 && (
                <button onClick={() => remove(i)} className="text-zinc-300 hover:text-red-400 transition-colors cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <Field label="Project Name"><TextInput value={proj.name} onChange={(v) => update(i, "name", v)} placeholder="My Awesome Project" /></Field>
          <Field label="Cover Image" hint="Optional — a screenshot or banner for this project.">
            <ImageUpload value={proj.imageUrl} onChange={(v) => update(i, "imageUrl", v)} kind="project" aspect="video" />
          </Field>
          <Field label="Description" hint="What problem does it solve? Gemini will sharpen this.">
            <Textarea value={proj.description} onChange={(v) => update(i, "description", v)} placeholder="Describe the project, its purpose and your technical approach..." rows={3} />
          </Field>
          <Field label="Tech Stack">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput[i] || ""}
                onChange={(e) => setTechInput((prev) => ({ ...prev, [i]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(i); } }}
                placeholder="React, Node.js, PostgreSQL..."
                className="flex-1 h-9 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
              <button onClick={() => addTech(i)} className="px-3 h-9 bg-zinc-900 text-white text-sm rounded-lg hover:bg-zinc-700 cursor-pointer">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {proj.techStack.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs px-2 py-1 rounded-full">
                  {t} <button onClick={() => removeTech(i, t)} className="text-zinc-400 hover:text-red-400 cursor-pointer">×</button>
                </span>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Repo URL"><TextInput value={proj.repoUrl} onChange={(v) => update(i, "repoUrl", v)} placeholder="https://github.com/..." /></Field>
            <Field label="Live URL"><TextInput value={proj.liveUrl} onChange={(v) => update(i, "liveUrl", v)} placeholder="https://..." /></Field>
          </div>
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-2 text-sm text-zinc-600 border border-dashed border-zinc-300 px-4 py-2.5 rounded-xl hover:border-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer w-full justify-center">
        <Plus className="h-4 w-4" /> Add another project
      </button>
    </div>
  );
}

function StepGallery({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const update = (i: number, field: keyof GalleryImage, value: string) => {
    set({ gallery: form.gallery.map((g, idx) => (idx === i ? { ...g, [field]: value } : g)) });
  };
  const add = () => set({ gallery: [...form.gallery, { ...EMPTY_GALLERY }] });
  const remove = (i: number) => set({ gallery: form.gallery.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      <p className="text-sm text-zinc-500">
        Add images for a gallery section — screenshots, designs, talks, anything visual. Optional.
      </p>
      {form.gallery.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {form.gallery.map((g, i) => (
            <div key={i} className="border border-zinc-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Image {i + 1}</span>
                <button onClick={() => remove(i)} className="text-zinc-300 hover:text-red-400 transition-colors cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <ImageUpload value={g.imageUrl} onChange={(v) => update(i, "imageUrl", v)} kind="gallery" aspect="video" />
              <TextInput value={g.caption} onChange={(v) => update(i, "caption", v)} placeholder="Caption (optional)" />
            </div>
          ))}
        </div>
      )}
      <button onClick={add} className="inline-flex items-center gap-2 text-sm text-zinc-600 border border-dashed border-zinc-300 px-4 py-2.5 rounded-xl hover:border-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer w-full justify-center">
        <Plus className="h-4 w-4" /> Add gallery image
      </button>
    </div>
  );
}

function Step7({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const s = form.socials;
  const upd = (field: keyof typeof s, value: string) => set({ socials: { ...s, [field]: value } });
  return (
    <div className="space-y-5">
      <Field label="Email *"><TextInput value={s.email} onChange={(v) => upd("email", v)} placeholder="you@example.com" /></Field>
      <Field label="GitHub"><TextInput value={s.github} onChange={(v) => upd("github", v)} placeholder="https://github.com/username" /></Field>
      <Field label="LinkedIn"><TextInput value={s.linkedin} onChange={(v) => upd("linkedin", v)} placeholder="https://linkedin.com/in/username" /></Field>
      <Field label="Twitter / X"><TextInput value={s.twitter} onChange={(v) => upd("twitter", v)} placeholder="https://twitter.com/username" /></Field>
      <Field label="Personal Website"><TextInput value={s.website} onChange={(v) => upd("website", v)} placeholder="https://yoursite.com" /></Field>
    </div>
  );
}

function Step8({ form, generating, error, isAuthed, onGenerate }:
  { form: RawUserDetails; generating: boolean; error: string | null; isAuthed: boolean; onGenerate: () => void }) {
  const missing: string[] = [];
  if (!form.name.trim()) missing.push("name");
  if (!form.bio.trim()) missing.push("bio");
  const incomplete = missing.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-5 space-y-3 text-sm">
        <SummaryRow label="Name" value={form.name} />
        <SummaryRow label="Tagline" value={form.tagline} />
        <SummaryRow label="Location" value={form.location} />
        <SummaryRow label="Skills" value={`${form.skills.length} skills added`} />
        <SummaryRow label="Experience" value={`${form.experience.filter(e => e.company).length} position(s)`} />
        <SummaryRow label="Education" value={`${form.education.filter(e => e.school).length} institution(s)`} />
        <SummaryRow label="Projects" value={`${form.projects.filter(p => p.name).length} project(s)`} />
        <SummaryRow label="Gallery" value={`${form.gallery.filter(g => g.imageUrl).length} image(s)`} />
        <SummaryRow label="Email" value={form.socials.email} />
      </div>

      {incomplete && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium">Add your {missing.join(" and ")} for a better result</p>
            <p className="text-amber-700 mt-0.5">You can still generate — the AI will fill in sensible placeholders.</p>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={generating}
        className="press-scale w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-3.5 rounded-xl font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
      >
        {generating ? (
          <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {isAuthed ? "Generating & saving…" : "Generating with Gemini AI…"}</>
        ) : (
          <><Sparkles className="h-4 w-4" aria-hidden="true" /> {isAuthed ? "Generate & Save to Portfolio" : "Generate Portfolio Data with AI"}</>
        )}
      </button>
      <p className="text-center text-xs text-zinc-400">
        {isAuthed
          ? "Saves to your account and updates your live portfolio instantly."
          : "Generate as many times as you like · Your data never leaves your browser except for the AI call."}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-zinc-500 shrink-0">{label}</span>
      <span className="text-zinc-800 text-right">{value || <span className="text-zinc-300 italic">not set</span>}</span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface Props {
  isAuthed: boolean;
  initialData: RawUserDetails | null;
}

export default function PersonalizeClient({ isAuthed, initialData }: Props) {
  const router = useRouter();
  const { saveRawForm, setPortfolioData } = useBuilderState();
  const { setPortfolioData: setContext, showToast } = usePortfolio();

  const [step, setStep] = useState(1);
  // Prefer saved DB details (signed-in), then any local draft, then a blank form.
  // Normalize so older saved data (no gallery / project imageUrl) stays valid.
  const [form, setForm] = useState<RawUserDetails>(() => {
    const loaded = initialData ?? readLocalForm();
    if (!loaded) return emptyForm();
    return {
      ...emptyForm(),
      ...loaded,
      gallery: loaded.gallery ?? [],
      projects: (loaded.projects ?? []).map((p) => ({ ...p, imageUrl: p.imageUrl ?? "" })),
    };
  });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = useCallback((partial: Partial<RawUserDetails>) => {
    setForm((prev) => {
      const next = { ...prev, ...partial };
      saveRawForm(next);
      return next;
    });
  }, [saveRawForm]);

  const next = () => setStep((s) => Math.min(s + 1, LAST_STEP));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const generate = async () => {
    setGenerating(true);
    setError(null);
    try {
      if (isAuthed) {
        // Persist details + generated portfolio straight to the DB, then show it live.
        const { data, source } = await saveDetailsAndGenerate(form);
        setContext(data, form);
        showToast(
          source.startsWith("gemini")
            ? "Saved & generated with Gemini AI ✓"
            : "Saved to your portfolio (used smart formatter)"
        );
        router.push("/dashboard");
        router.refresh();
      } else {
        // Anonymous: generate a preview and keep it in localStorage.
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Server error");
        const { data, source } = await res.json();
        setPortfolioData(data, form);
        setContext(data, form);
        showToast(
          source === "gemini" || source === "gemini-retry"
            ? "Preview updated with your data ✓"
            : "Preview updated (AI unavailable — used smart formatter)"
        );
        router.push("/preview");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const STEP_PROPS = { form, set };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Personalize your portfolio</h1>
          <p className="text-sm text-zinc-500">Fill in your details — Gemini AI will structure everything for you</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 justify-center mb-8 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <button key={s.id} onClick={() => setStep(s.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                  active ? "bg-zinc-900 text-white" : done ? "text-zinc-500 hover:text-zinc-700" : "text-zinc-400"
                )}>
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
                {i < STEPS.length - 1 && <span className="text-zinc-300 ml-1">·</span>}
              </button>
            );
          })}
        </div>

        {/* Step card */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            {(() => { const Icon = STEPS[step - 1].icon; return <div className="h-8 w-8 bg-zinc-100 rounded-lg flex items-center justify-center"><Icon className="h-4 w-4 text-zinc-700" /></div>; })()}
            <div>
              <h2 className="font-semibold text-zinc-900">{STEPS[step - 1].label}</h2>
              <p className="text-xs text-zinc-400">Step {step} of {STEPS.length}</p>
            </div>
          </div>

          {step === 1 && <Step1 {...STEP_PROPS} />}
          {step === 2 && <Step2 {...STEP_PROPS} />}
          {step === 3 && <Step3 {...STEP_PROPS} />}
          {step === 4 && <Step4 {...STEP_PROPS} />}
          {step === 5 && <Step5 {...STEP_PROPS} />}
          {step === 6 && <Step6 {...STEP_PROPS} />}
          {step === 7 && <StepGallery {...STEP_PROPS} />}
          {step === 8 && <Step7 {...STEP_PROPS} />}
          {step === 9 && (
            <Step8
              form={form}
              generating={generating}
              error={error}
              isAuthed={isAuthed}
              onGenerate={generate}
            />
          )}
        </div>

        {/* Navigation */}
        {step < LAST_STEP && (
          <div className="flex items-center justify-between">
            <button onClick={prev} disabled={step === 1}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button onClick={next}
              className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors cursor-pointer">
              {step === LAST_STEP - 1 ? "Review & Generate" : "Continue"} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        {step === LAST_STEP && (
          <div className="flex justify-start">
            <button onClick={prev} className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
