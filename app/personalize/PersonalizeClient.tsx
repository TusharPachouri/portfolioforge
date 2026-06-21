"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RawUserDetails, RawExperience, RawEducation, RawProject, GalleryImage } from "@/types/portfolio";
import { useBuilderState } from "@/hooks/useBuilderState";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { saveDetailsAndGenerate } from "@/lib/actions/portfolio";
import ImageUpload from "@/components/ui/ImageUpload";
import ResumeImport from "./ResumeImport";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  User, FileText, Wrench, Briefcase, GraduationCap,
  FolderOpen, Link2, CheckCircle2, Plus, Trash2,
  ChevronRight, Loader2, AlertCircle, Sparkles, Images, ArrowRight, LayoutDashboard, Home
} from "lucide-react";

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

const STEPS = [
  { id: 1, label: "Basic Info",   icon: User,          title: "Let's start with the basics",       subtitle: "Your name, tagline, and a photo — the first things visitors see." },
  { id: 2, label: "About Me",     icon: FileText,       title: "Tell your story",                   subtitle: "A short bio goes a long way. Write freely — AI will polish it." },
  { id: 3, label: "Skills",       icon: Wrench,         title: "What do you work with?",            subtitle: "Add your core technologies and tools." },
  { id: 4, label: "Experience",   icon: Briefcase,      title: "Your work history",                 subtitle: "Add the positions you're most proud of." },
  { id: 5, label: "Education",    icon: GraduationCap,  title: "Academic background",               subtitle: "Schools, degrees, and relevant coursework." },
  { id: 6, label: "Projects",     icon: FolderOpen,     title: "Show off your work",                subtitle: "Projects are the heart of a great portfolio." },
  { id: 7, label: "Gallery",      icon: Images,         title: "Visual highlights",                 subtitle: "Screenshots, designs, or anything visual. Totally optional." },
  { id: 8, label: "Socials",      icon: Link2,          title: "Where can people find you?",        subtitle: "Add links to your profiles and personal website." },
  { id: 9, label: "Generate",     icon: CheckCircle2,   title: "Ready to launch",                   subtitle: "AI will polish your data and build your live portfolio." },
];
const LAST_STEP = STEPS.length;

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
      <label className="block text-sm font-semibold text-zinc-800">{label}</label>
      {children}
      {hint && <p className="text-xs text-zinc-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full h-10 px-3 text-sm border border-zinc-200 rounded-lg bg-white placeholder:text-zinc-400",
        "focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all",
        className
      )}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-lg bg-white placeholder:text-zinc-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none transition-all"
    />
  );
}

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-zinc-50/70 border border-zinc-200 rounded-xl p-5", className)}>
      {children}
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

function Step1({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="First & Last Name">
          <TextInput value={form.name} onChange={(v) => set({ name: v })} placeholder="Ex: Lawson Kenzi" />
        </Field>
        <Field label="Tagline">
          <TextInput value={form.tagline} onChange={(v) => set({ tagline: v })} placeholder="Ex: Full-stack engineer building at scale" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Email">
          <TextInput type="email" value={form.socials.email} onChange={(v) => set({ socials: { ...form.socials, email: v } })} placeholder="you@example.com" />
        </Field>
        <Field label="Location">
          <TextInput value={form.location} onChange={(v) => set({ location: v })} placeholder="San Francisco, CA" />
        </Field>
      </div>

      <Field label="Profile Photo" hint="PNG or JPG, up to 10 MB. You can also paste a URL.">
        <div className="flex flex-col sm:flex-row gap-4 items-start border border-dashed border-zinc-300 bg-white rounded-xl p-4 hover:border-violet-300 transition-colors">
          <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
            <ImageUpload value={form.avatarUrl} onChange={(v) => set({ avatarUrl: v })} kind="avatar" aspect="square" />
          </div>
          <div className="flex-1 w-full min-w-0 flex flex-col justify-center gap-2">
            <p className="text-xs font-medium text-zinc-500">Upload a photo or paste an image URL</p>
            <TextInput
              type="url"
              value={form.avatarUrl}
              onChange={(v) => set({ avatarUrl: v })}
              placeholder="https://…"
              className="h-9 text-xs"
            />
          </div>
        </div>
      </Field>

      <Field label="Status">
        <div className="inline-flex bg-zinc-100 p-1 rounded-lg gap-1">
          {(["experienced", "fresher"] as const).map((t) => (
            <button
              key={t}
              onClick={() => set({ userType: t })}
              className={cn(
                "px-5 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer",
                form.userType === t
                  ? "bg-white text-zinc-900 shadow-sm shadow-zinc-200/80 border border-zinc-200/60"
                  : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {t === "experienced" ? "Experienced" : "Student"}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function Step2({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  return (
    <div className="space-y-6">
      <Field label="Your Story" hint="Write freely — Gemini AI will polish and structure this for you.">
        <Textarea value={form.bio} onChange={(v) => set({ bio: v })} placeholder="What have you built? What drives you? What are you looking for next? Tell your story in your own words." rows={7} />
      </Field>

      <SectionCard>
        <Field label="Open to Work">
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-zinc-600 font-medium">I&apos;m currently open to new opportunities</span>
            <button
              onClick={() => set({ openToWork: !form.openToWork })}
              className={cn("relative h-6 w-11 rounded-full transition-colors cursor-pointer shrink-0 shadow-inner", form.openToWork ? "bg-violet-600" : "bg-zinc-300")}
            >
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", form.openToWork ? "translate-x-5" : "translate-x-0.5")} />
            </button>
          </div>
        </Field>
      </SectionCard>

      {form.openToWork && (
        <Field label="Availability">
          <TextInput value={form.availability} onChange={(v) => set({ availability: v })} placeholder="Ex: Available immediately for remote roles" />
        </Field>
      )}
    </div>
  );
}

function Step3({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const items = input.split(",").map((s) => s.trim()).filter(Boolean);
    set({ skills: [...new Set([...form.skills, ...items])] });
    setInput("");
  };
  const remove = (skill: string) => set({ skills: form.skills.filter((s) => s !== skill) });

  return (
    <div className="space-y-6">
      <Field label="Add Skills" hint="Comma-separated, then press Enter or click Add">
        <div className="flex gap-2">
          <TextInput
            value={input}
            onChange={setInput}
            placeholder="React, TypeScript, Node.js…"
            className="flex-1"
          />
          <button onClick={add} className="px-4 h-10 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors cursor-pointer shrink-0">
            Add
          </button>
        </div>
      </Field>
      {form.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
          {form.skills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 text-zinc-700 text-sm px-3 py-1.5 rounded-full font-medium shadow-sm">
              {skill}
              <button onClick={() => remove(skill)} className="text-zinc-400 hover:text-red-500 cursor-pointer ml-0.5 leading-none text-base">&times;</button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-400 italic p-4 border border-dashed border-zinc-200 rounded-xl text-center">No skills added yet.</p>
      )}
    </div>
  );
}

function Step4({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const update = (i: number, field: keyof RawExperience, value: string) =>
    set({ experience: form.experience.map((e, idx) => idx === i ? { ...e, [field]: value } : e) });
  const add = () => set({ experience: [...form.experience, { ...EMPTY_EXP }] });
  const remove = (i: number) => set({ experience: form.experience.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      {form.experience.map((exp, i) => (
        <SectionCard key={i}>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Position {i + 1}</span>
            {form.experience.length > 1 && (
              <button onClick={() => remove(i)} className="text-xs font-semibold text-zinc-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company"><TextInput value={exp.company} onChange={(v) => update(i, "company", v)} placeholder="Ex: Stripe" /></Field>
              <Field label="Job Title"><TextInput value={exp.role} onChange={(v) => update(i, "role", v)} placeholder="Ex: Senior Software Engineer" /></Field>
              <Field label="Period"><TextInput value={exp.period} onChange={(v) => update(i, "period", v)} placeholder="Jan 2022 – Present" /></Field>
            </div>
            <Field label="Description" hint="What did you build or achieve? Gemini will polish this.">
              <Textarea value={exp.description} onChange={(v) => update(i, "description", v)} placeholder="Led development of the payments SDK…" rows={3} />
            </Field>
          </div>
        </SectionCard>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-zinc-600 border border-dashed border-zinc-300 bg-white py-3 rounded-xl hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/40 transition-all cursor-pointer">
        <Plus className="h-4 w-4" /> Add another position
      </button>
    </div>
  );
}

function Step5({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const update = (i: number, field: keyof RawEducation, value: string) =>
    set({ education: form.education.map((e, idx) => idx === i ? { ...e, [field]: value } : e) });
  const add = () => set({ education: [...form.education, { ...EMPTY_EDU }] });
  const remove = (i: number) => set({ education: form.education.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      {form.education.map((edu, i) => (
        <SectionCard key={i}>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Institution {i + 1}</span>
            {form.education.length > 1 && (
              <button onClick={() => remove(i)} className="text-xs font-semibold text-zinc-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="School / University"><TextInput value={edu.school} onChange={(v) => update(i, "school", v)} placeholder="Ex: UC Berkeley" /></Field>
              <Field label="Degree"><TextInput value={edu.degree} onChange={(v) => update(i, "degree", v)} placeholder="Ex: B.S. Computer Science" /></Field>
              <Field label="Period"><TextInput value={edu.period} onChange={(v) => update(i, "period", v)} placeholder="Sep 2019 – May 2023" /></Field>
            </div>
            <Field label="Coursework / Notes">
              <Textarea value={edu.notes} onChange={(v) => update(i, "notes", v)} placeholder="Focus areas, notable courses, thesis…" rows={2} />
            </Field>
          </div>
        </SectionCard>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-zinc-600 border border-dashed border-zinc-300 bg-white py-3 rounded-xl hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/40 transition-all cursor-pointer">
        <Plus className="h-4 w-4" /> Add another institution
      </button>
    </div>
  );
}

function Step6({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const [techInput, setTechInput] = useState<Record<number, string>>({});

  const update = <K extends keyof RawProject>(i: number, field: K, value: RawProject[K]) =>
    set({ projects: form.projects.map((p, idx) => idx === i ? { ...p, [field]: value } : p) });

  const addTech = (i: number) => {
    const items = (techInput[i] || "").split(",").map((s) => s.trim()).filter(Boolean);
    update(i, "techStack", [...new Set([...form.projects[i].techStack, ...items])]);
    setTechInput((prev) => ({ ...prev, [i]: "" }));
  };

  const add = () => set({ projects: [...form.projects, { ...EMPTY_PROJ }] });
  const remove = (i: number) => set({ projects: form.projects.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      {form.projects.map((proj, i) => (
        <SectionCard key={i}>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Project {i + 1}</span>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg cursor-pointer border border-violet-200">
                <input type="checkbox" checked={proj.featured} onChange={(e) => update(i, "featured", e.target.checked)} className="rounded accent-violet-600" />
                Featured
              </label>
            </div>
            {form.projects.length > 1 && (
              <button onClick={() => remove(i)} className="text-xs font-semibold text-zinc-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          <div className="space-y-4">
            <Field label="Project Name">
              <TextInput value={proj.name} onChange={(v) => update(i, "name", v)} placeholder="Ex: My Awesome Project" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Repo URL"><TextInput value={proj.repoUrl} onChange={(v) => update(i, "repoUrl", v)} placeholder="https://github.com/…" /></Field>
              <Field label="Live URL"><TextInput value={proj.liveUrl} onChange={(v) => update(i, "liveUrl", v)} placeholder="https://…" /></Field>
            </div>
            <Field label="Cover Image" hint="PNG or JPG">
              <div className="bg-white border border-dashed border-zinc-300 rounded-xl p-3 max-w-sm hover:border-violet-300 transition-colors">
                <ImageUpload value={proj.imageUrl} onChange={(v) => update(i, "imageUrl", v)} kind="project" aspect="video" />
              </div>
            </Field>
            <Field label="Description">
              <Textarea value={proj.description} onChange={(v) => update(i, "description", v)} placeholder="Describe the project, its purpose and your technical approach…" rows={3} />
            </Field>
            <Field label="Tech Stack">
              <div className="flex gap-2 mb-2">
                <TextInput
                  value={techInput[i] || ""}
                  onChange={(v) => setTechInput((prev) => ({ ...prev, [i]: v }))}
                  placeholder="React, Node.js…"
                  className="flex-1"
                />
                <button onClick={() => addTech(i)} className="px-4 h-10 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer shrink-0">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {proj.techStack.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 bg-white border border-zinc-200 text-zinc-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                    {t}
                    <button onClick={() => update(i, "techStack", proj.techStack.filter((x) => x !== t))} className="text-zinc-400 hover:text-red-500 cursor-pointer">&times;</button>
                  </span>
                ))}
              </div>
            </Field>
          </div>
        </SectionCard>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-zinc-600 border border-dashed border-zinc-300 bg-white py-3 rounded-xl hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/40 transition-all cursor-pointer">
        <Plus className="h-4 w-4" /> Add another project
      </button>
    </div>
  );
}

function StepGallery({ form, set }: { form: RawUserDetails; set: (f: Partial<RawUserDetails>) => void }) {
  const update = (i: number, field: keyof GalleryImage, value: string) =>
    set({ gallery: form.gallery.map((g, idx) => (idx === i ? { ...g, [field]: value } : g)) });
  const add = () => set({ gallery: [...form.gallery, { ...EMPTY_GALLERY }] });
  const remove = (i: number) => set({ gallery: form.gallery.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      {form.gallery.length === 0 && (
        <p className="text-sm text-zinc-400 text-center py-8 border border-dashed border-zinc-200 rounded-xl">
          No images yet. Add visual highlights — screenshots, designs, talk photos, anything.
        </p>
      )}
      {form.gallery.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {form.gallery.map((g, i) => (
            <SectionCard key={i}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Image {i + 1}</span>
                <button onClick={() => remove(i)} className="text-xs font-semibold text-zinc-400 hover:text-red-500 transition-colors cursor-pointer">Remove</button>
              </div>
              <div className="bg-white border border-dashed border-zinc-300 rounded-xl p-2 mb-3">
                <ImageUpload value={g.imageUrl} onChange={(v) => update(i, "imageUrl", v)} kind="gallery" aspect="video" />
              </div>
              <TextInput value={g.caption} onChange={(v) => update(i, "caption", v)} placeholder="Caption (optional)" />
            </SectionCard>
          ))}
        </div>
      )}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-zinc-600 border border-dashed border-zinc-300 bg-white py-3 rounded-xl hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/40 transition-all cursor-pointer">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="GitHub"><TextInput value={s.github} onChange={(v) => upd("github", v)} placeholder="https://github.com/…" /></Field>
        <Field label="LinkedIn"><TextInput value={s.linkedin} onChange={(v) => upd("linkedin", v)} placeholder="https://linkedin.com/in/…" /></Field>
        <Field label="Twitter / X"><TextInput value={s.twitter} onChange={(v) => upd("twitter", v)} placeholder="https://twitter.com/…" /></Field>
        <Field label="Personal Website"><TextInput value={s.website} onChange={(v) => upd("website", v)} placeholder="https://yoursite.com" /></Field>
      </div>
    </div>
  );
}

function Step8({ form, generating, error, isAuthed, onGenerate }: {
  form: RawUserDetails; generating: boolean; error: string | null; isAuthed: boolean; onGenerate: () => void;
}) {
  const missing: string[] = [];
  if (!form.name.trim()) missing.push("name");
  if (!form.bio.trim()) missing.push("bio");
  const incomplete = missing.length > 0;

  return (
    <div className="space-y-5">
      {incomplete && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Add your {missing.join(" and ")} for a better result</p>
            <p className="text-amber-700 mt-0.5">You can still generate — the AI will fill in sensible placeholders.</p>
          </div>
        </div>
      )}
      {error && (
        <div role="alert" className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}
      <button
        onClick={onGenerate}
        disabled={generating}
        className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-base hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-violet-500/25 tracking-tight"
      >
        {generating ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> {isAuthed ? "Generating & saving…" : "Generating…"}</>
        ) : (
          <><Sparkles className="h-5 w-5" /> {isAuthed ? "Generate & Save Portfolio" : "Create my portfolio"}</>
        )}
      </button>
      <p className="text-center text-xs font-medium text-zinc-400">
        {isAuthed ? "Saves to your account and updates your live portfolio instantly." : "Generate as many times as you like. Data stays local."}
      </p>
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

  const fillFromResume = (d: RawUserDetails) => {
    const normalized: RawUserDetails = {
      ...emptyForm(), ...d,
      gallery: d.gallery ?? [],
      projects: (d.projects ?? []).map((p) => ({ ...p, imageUrl: p.imageUrl ?? "" })),
    };
    setForm(normalized);
    saveRawForm(normalized);
    setStep(1);
    showToast("Résumé imported ✓ — review your details");
  };

  const next = () => setStep((s) => Math.min(s + 1, LAST_STEP));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const generate = async () => {
    setGenerating(true);
    setError(null);
    try {
      if (isAuthed) {
        const { data, source } = await saveDetailsAndGenerate(form);
        setContext(data, form);
        showToast(source.startsWith("gemini") ? "Saved & generated ✓" : "Saved to your portfolio");
        router.push("/dashboard");
        router.refresh();
      } else {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Server error");
        const { data, source } = await res.json();
        setPortfolioData(data, form);
        setContext(data, form);
        showToast(source === "gemini" || source === "gemini-retry" ? "Preview updated ✓" : "Preview updated");
        router.push("/preview");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const currentStep = STEPS[step - 1];
  const progress = Math.round((step / LAST_STEP) * 100);
  const STEP_PROPS = { form, set };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">

      {/* ── Top bar (mirrors DashboardShell) ─────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-zinc-100">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 text-sm shrink-0">
            <Logo className="h-7 w-7" />
            <span className="hidden sm:inline">PortfolioForge</span>
          </Link>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm min-w-0 flex-1 justify-center">
            <Link href="/dashboard" className="hidden sm:flex items-center gap-1 text-zinc-400 hover:text-zinc-700 font-medium transition-colors shrink-0">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <ChevronRight className="hidden sm:block h-3.5 w-3.5 text-zinc-300 shrink-0" />
            <span className="text-zinc-400 font-medium shrink-0">Personalize</span>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-300 shrink-0" />
            <span className="font-semibold text-zinc-800 truncate">{currentStep.label}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-600 transition-colors bg-white cursor-pointer"
              onClick={() => {/* noop */}}
            >
              Save draft
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm shadow-violet-500/20 cursor-pointer"
              onClick={step === LAST_STEP ? generate : next}
            >
              {step === LAST_STEP ? (generating ? "Generating…" : "Create now") : "Continue"}
              {step !== LAST_STEP && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 max-w-screen-xl mx-auto w-full min-w-0">

        {/* Left Sidebar */}
        <aside className="hidden md:flex w-52 shrink-0 border-r border-zinc-100 bg-white py-4 px-2 flex-col min-h-full">
          {/* Progress */}
          <div className="px-3 pb-3 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em]">Progress</span>
              <span className="text-[10px] font-bold text-violet-600">{step}/{LAST_STEP}</span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps nav */}
          <nav className="space-y-0.5 flex-1 px-1">
            {STEPS.map((s) => {
              const active = step === s.id;
              const done = step > s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer group",
                    active
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-500/25"
                      : done
                        ? "text-zinc-600 hover:bg-zinc-50"
                        : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
                  )}
                >
                  <span className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all",
                    active ? "bg-white/25 text-white" : done ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                  )}>
                    {done && !active ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : s.id}
                  </span>
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </nav>

          {/* AI promo card */}
          <div className="mt-4 mx-1 shrink-0">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 p-3.5 text-white shadow-md">
              <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-white/10 blur-xl" aria-hidden="true" />
              <p className="text-xs font-semibold mb-1 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> AI Powered
              </p>
              <p className="text-[11px] text-violet-200 leading-relaxed mb-2.5">
                Gemini formats your raw data into polished portfolio content instantly.
              </p>
              <button className="press-scale block w-full text-center bg-white text-violet-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors cursor-pointer">
                View plans
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 min-w-0">
          <div className="max-w-[1100px] mx-auto">

            {/* Page title */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full">
                  Step {step} of {LAST_STEP}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{currentStep.title}</h1>
              <p className="text-sm text-zinc-500 mt-1">{currentStep.subtitle}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Form card */}
              <div className="flex-1 w-full min-w-0">
                <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                  {/* Card accent bar */}
                  <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500" />

                  <div className="p-6 md:p-7">
                    {/* Card header */}
                    <div className="flex items-center gap-4 mb-7 pb-5 border-b border-zinc-100">
                      <div className="h-11 w-11 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-500/25 shrink-0">
                        {(() => { const Icon = currentStep.icon; return <Icon className="w-5 h-5 text-white" />; })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-zinc-900">{currentStep.label}</h2>
                        <p className="text-xs text-zinc-400 font-medium mt-0.5">Step {step} of {LAST_STEP}</p>
                      </div>
                      <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 cursor-pointer transition-colors">
                        Help &amp; Info
                      </button>
                    </div>

                    {/* Step content */}
                    {step === 1 && <Step1 {...STEP_PROPS} />}
                    {step === 2 && <Step2 {...STEP_PROPS} />}
                    {step === 3 && <Step3 {...STEP_PROPS} />}
                    {step === 4 && <Step4 {...STEP_PROPS} />}
                    {step === 5 && <Step5 {...STEP_PROPS} />}
                    {step === 6 && <Step6 {...STEP_PROPS} />}
                    {step === 7 && <StepGallery {...STEP_PROPS} />}
                    {step === 8 && <Step7 {...STEP_PROPS} />}
                    {step === 9 && <Step8 form={form} generating={generating} error={error} isAuthed={isAuthed} onGenerate={generate} />}
                  </div>
                </div>

                {/* Step navigation */}
                <div className={cn("mt-5 flex items-center", step === 1 ? "justify-end" : "justify-between")}>
                  {step > 1 && (
                    <button
                      onClick={prev}
                      className="px-5 py-2.5 border border-zinc-200 rounded-xl text-sm font-semibold bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 transition-all cursor-pointer shadow-sm"
                    >
                      ← Back
                    </button>
                  )}
                  {step < LAST_STEP && (
                    <button
                      onClick={next}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-all cursor-pointer shadow-sm"
                    >
                      Next Step <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right panel */}
              <div className="w-full lg:w-[300px] shrink-0 space-y-5 lg:sticky lg:top-24">
                {step === 1 && (
                  <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-zinc-500" />
                        <h3 className="text-sm font-bold text-zinc-900">Import from résumé</h3>
                      </div>
                      <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                        Upload your PDF or paste text — AI fills every field automatically.
                      </p>
                      <ResumeImport onParsed={fillFromResume} />
                    </div>
                  </div>
                )}

                {step === LAST_STEP && (
                  <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <h3 className="text-sm font-bold text-zinc-900">Ready to launch</h3>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        You&apos;ve filled in all your details. Click <strong>Generate</strong> and AI will create your live portfolio.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tips card for middle steps */}
                {step > 1 && step < LAST_STEP && (
                  <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      <h3 className="text-sm font-bold text-zinc-900">AI tip</h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Don&apos;t worry about perfect wording — fill in the raw details and let Gemini AI polish everything into professional copy.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

