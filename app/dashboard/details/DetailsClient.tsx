"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RawUserDetails } from "@/types/portfolio";
import { updateUserDetails, regeneratePortfolio } from "@/lib/actions/portfolio";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { Loader2, Sparkles, Save, CheckCircle2 } from "lucide-react";

// Re-import the same PersonalizeClient form logic inline —
// wrap the shared form steps here pre-filled from DB data

interface Props {
  initialData: RawUserDetails | null;
  generationCount: number;
}

export default function DetailsClient({ initialData, generationCount }: Props) {
  const router = useRouter();
  const { setPortfolioData: setContext, showToast } = usePortfolio();
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  // We redirect to /personalize with a flag so it pre-fills from localStorage
  // For dashboard, we handle save+regenerate here separately
  const handleSaveAndRegenerate = async () => {
    setRegenerating(true);
    try {
      const { data, source } = await regeneratePortfolio();
      setContext(data, initialData!);
      showToast(
        source.startsWith("gemini")
          ? "Portfolio regenerated with Gemini AI ✓"
          : "Portfolio updated (used smart formatter)"
      );
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Regeneration failed";
      showToast(msg, "error");
    } finally {
      setRegenerating(false);
    }
  };

  const handleSaveForm = async (raw: RawUserDetails) => {
    setSaving(true);
    try {
      await updateUserDetails(raw);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      showToast("Failed to save details", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Edit Your Details</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {generationCount} AI generation{generationCount !== 1 ? "s" : ""} used · Changes save automatically
          </p>
        </div>
        <div className="flex items-center gap-2">
          {initialData && (
            <button
              onClick={handleSaveAndRegenerate}
              disabled={regenerating}
              className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Regenerate with AI
            </button>
          )}
        </div>
      </div>

      {/* Embedded form — links to /personalize for the full multi-step experience */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm mb-6">
        <p className="text-sm text-zinc-500 mb-4">
          Your details are used to personalise every portfolio component. Use the full editor for a guided experience.
        </p>
        <a href="/personalize"
          className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-all">
          Open Full Details Editor →
        </a>
      </div>

      {/* Quick save section */}
      {initialData && (
        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-5">
          <h3 className="font-semibold text-zinc-900 mb-3 text-sm">Current Data Summary</h3>
          <div className="space-y-2 text-sm text-zinc-600">
            <div className="flex justify-between"><span className="text-zinc-400">Name</span><span>{initialData.name}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Skills</span><span>{initialData.skills.length} added</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Experience</span><span>{initialData.experience.filter(e => e.company).length} positions</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Projects</span><span>{initialData.projects.filter(p => p.name).length} projects</span></div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => handleSaveForm(initialData)}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              {saved ? "Saved!" : "Save to account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
