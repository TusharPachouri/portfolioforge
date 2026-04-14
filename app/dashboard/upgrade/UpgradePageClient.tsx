"use client";

import { useState, useTransition } from "react";
import { createCheckoutSession } from "@/lib/actions/billing";
import { Check, Sparkles, Loader2, Zap } from "lucide-react";
import Link from "next/link";

const FREE_FEATURES = [
  "1 portfolio",
  "3 themes",
  "Gradients & dots patterns",
  "8 core section components",
  "5 AI regenerations per day",
  "PortfolioForge branding on portfolio",
  "10 pattern favourites",
];

const PRO_FEATURES = [
  "Unlimited portfolios",
  "All 7+ themes",
  "All patterns including animated",
  "All 27 section components",
  "Unlimited AI regenerations",
  "Remove PortfolioForge branding",
  "Portfolio analytics",
  "Custom domain support",
  "Unlimited pattern favourites",
  "Priority support",
];

export default function UpgradePageClient() {
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    startTransition(async () => {
      await createCheckoutSession(plan);
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
            <Zap className="h-3.5 w-3.5" />
            Pro Plan
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-3">
            Build a portfolio that gets noticed
          </h1>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto">
            Unlock every theme, pattern, and component. Ship faster with unlimited AI.
          </p>
        </div>

        {/* Plan toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["monthly", "annual"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                plan === p
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
              }`}
            >
              {p === "monthly" ? (
                <>Monthly — <span className="font-bold">$9/mo</span></>
              ) : (
                <span className="flex items-center gap-2">
                  Annual — <span className="font-bold">$79/yr</span>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-1.5 py-0.5 rounded-md">
                    SAVE 27%
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Comparison cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Free */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-zinc-900">Free</h2>
              <p className="text-3xl font-bold text-zinc-900 mt-1">
                $0 <span className="text-sm font-normal text-zinc-400">forever</span>
              </p>
            </div>
            <ul className="space-y-2.5 mb-6">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-600">
                  <Check className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="block text-center py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Current plan
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-violet-600 to-violet-800 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
              PRO
            </div>
            <div className="mb-5">
              <h2 className="text-lg font-bold">Pro</h2>
              <p className="text-3xl font-bold mt-1">
                {plan === "monthly" ? "$9" : "$79"}
                <span className="text-sm font-normal text-violet-200 ml-1">
                  {plan === "monthly" ? "/month" : "/year"}
                </span>
              </p>
              {plan === "annual" && (
                <p className="text-violet-300 text-xs mt-1">That&apos;s just $6.58/month</p>
              )}
            </div>
            <ul className="space-y-2.5 mb-6">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/90">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-white text-violet-700 py-3 rounded-xl font-semibold text-sm hover:bg-violet-50 transition-colors cursor-pointer disabled:opacity-70"
            >
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Upgrade to Pro</>
              )}
            </button>
            <p className="text-center text-xs text-violet-300 mt-3">
              Cancel anytime · 14-day money-back guarantee
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <h3 className="font-bold text-zinc-900 mb-4">Common questions</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-zinc-800">Can I cancel anytime?</p>
              <p className="text-zinc-500 mt-1">Yes. Your Pro access continues until the end of your billing period.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-800">What happens to my portfolio if I cancel?</p>
              <p className="text-zinc-500 mt-1">Your portfolio stays published but the PortfolioForge branding badge will return, and Pro-only sections will fall back to free equivalents.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-800">Do you offer a refund?</p>
              <p className="text-zinc-500 mt-1">Yes, within 14 days of your initial purchase. Contact support@portfolioforge.dev.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
