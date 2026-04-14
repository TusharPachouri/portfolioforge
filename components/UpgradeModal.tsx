"use client";

import { useState, useTransition } from "react";
import { createCheckoutSession } from "@/lib/actions/billing";
import { X, Sparkles, Check, Loader2, Zap } from "lucide-react";

const PRO_FEATURES = [
  "All themes (7+) and animated patterns",
  "Unlock all 27 portfolio sections",
  "Unlimited AI regenerations",
  "Remove PortfolioForge branding",
  "Portfolio analytics",
  "Custom domain support",
  "Unlimited pattern favourites",
];

interface Props {
  open: boolean;
  onClose: () => void;
  trigger?: string; // What triggered the modal — used for headline copy
}

export default function UpgradeModal({ open, onClose, trigger }: Props) {
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  const handleUpgrade = () => {
    startTransition(async () => {
      await createCheckoutSession(plan);
    });
  };

  const headline = trigger === "component"
    ? "Unlock all 27 portfolio sections"
    : trigger === "pattern"
    ? "Unlock all patterns"
    : trigger === "ai"
    ? "Unlimited AI regenerations"
    : "Upgrade to Pro";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to Pro"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-800 px-6 pt-8 pb-6 text-white">
          <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1">{headline}</h2>
          <p className="text-violet-200 text-sm">
            Get the full PortfolioForge experience.
          </p>
        </div>

        <div className="p-6">
          {/* Features */}
          <ul className="space-y-2 mb-6">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>

          {/* Plan toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPlan("monthly")}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                plan === "monthly"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <div className="font-bold text-base">$9</div>
              <div className="text-xs opacity-70">per month</div>
            </button>
            <button
              onClick={() => setPlan("annual")}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer relative ${
                plan === "annual"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                SAVE 27%
              </div>
              <div className="font-bold text-base">$79</div>
              <div className="text-xs opacity-70">per year</div>
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            {isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting to checkout...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Upgrade to Pro</>
            )}
          </button>

          <p className="text-center text-xs text-zinc-400 mt-3">
            Cancel anytime. 14-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
