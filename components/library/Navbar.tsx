"use client";

import Link from "next/link";
import { useBuilderState } from "@/hooks/useBuilderState";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useSession } from "next-auth/react";
import { Layers, Sparkles, RotateCcw, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { state } = useBuilderState();
  const { isCustom, resetToDemo } = usePortfolio();
  const { data: session, status } = useSession();
  const count = state.selectedComponentIds.length;
  const isSignedIn = status === "authenticated" && !!session?.user;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 text-sm shrink-0">
          <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">PF</span>
          </div>
          PortfolioForge
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/components" className="px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors">
            Components
          </Link>
          <Link href="/patterns" className="px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors">
            Patterns
          </Link>
          <Link href="/docs" className="px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors">
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isCustom && (
            <button onClick={resetToDemo}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          )}

          <Link href="/personalize"
            className="inline-flex items-center gap-1.5 text-sm font-medium border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors">
            <Sparkles className="h-3.5 w-3.5" />
            {isCustom ? "Edit details" : "Personalize"}
          </Link>

          {count > 0 && (
            <Link href="/preview"
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors">
              <Layers className="h-3.5 w-3.5" />
              Preview
              <span className="bg-white text-zinc-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                {count}
              </span>
            </Link>
          )}

          {/* Auth-aware right side */}
          {isSignedIn ? (
            <Link href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="h-5 w-5 rounded-full" />
              ) : (
                <LayoutDashboard className="h-4 w-4" />
              )}
              Dashboard
            </Link>
          ) : (
            <Link href="/auth/signin"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium border border-zinc-900 text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
