"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { Portfolio } from "@/lib/db/schema";
import { signOut } from "next-auth/react";
import {
  Layers, Settings, ExternalLink, Globe, ToggleLeft, ToggleRight,
  LogOut, Sparkles, Palette, LayoutGrid, Zap, BarChart2, Moon, Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { publishPortfolio } from "@/lib/actions/portfolio";

interface Props {
  session: Session;
  portfolio: Portfolio | null;
  children: React.ReactNode;
}

const NAV = [
  { href: "/dashboard", label: "Builder", icon: Layers },
  { href: "/dashboard/details", label: "Edit Details", icon: Sparkles },
  { href: "/dashboard/theme", label: "Theme", icon: Palette },
  { href: "/dashboard/pattern", label: "Pattern", icon: LayoutGrid },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2, proOnly: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardShell({ session, portfolio, children }: Props) {
  const pathname = usePathname();
  const [published, setPublished] = useState(portfolio?.published ?? false);
  const [isPending, startTransition] = useTransition();
  const [darkMode, setDarkMode] = useState(false);

  const togglePublish = () => {
    const next = !published;
    setPublished(next);
    startTransition(async () => {
      try {
        await publishPortfolio(next);
      } catch {
        setPublished(!next);
      }
    });
  };

  const publicUrl = portfolio ? `/u/${portfolio.slug}` : null;

  return (
    <div className={cn("min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col", darkMode && "dark")}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white text-sm shrink-0">
            <div className="h-7 w-7 rounded-lg bg-zinc-900 dark:bg-zinc-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">PF</span>
            </div>
            <span className="hidden sm:inline">PortfolioForge</span>
          </Link>

          {/* Public URL */}
          <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
            {publicUrl && (
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 max-w-xs w-full">
                <Globe className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">portfolioforge.dev{publicUrl}</span>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="ml-auto shrink-0">
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" />
                </a>
              </div>
            )}
          </div>

          {/* Right: dark toggle + publish toggle + user */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={togglePublish}
              disabled={isPending}
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                published
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
            >
              {published
                ? <><ToggleRight className="h-4 w-4" /> Live</>
                : <><ToggleLeft className="h-4 w-4" /> Publish</>}
            </button>

            <div className="flex items-center gap-2">
              {session.user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="h-7 w-7 rounded-full" />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">
        {/* Sidebar nav */}
        <aside className="w-52 shrink-0 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 px-2 min-h-full">
          <nav className="space-y-0.5">
            {NAV.map(({ href, label, icon: Icon, proOnly }) => {
              const isPro = session.user.role === "pro" || session.user.role === "admin";
              if (proOnly && !isPro) return null;
              return (
                <Link key={href} href={href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-zinc-900 dark:bg-zinc-700 text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  )}>
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade CTA for free users */}
          {session.user.role !== "pro" && session.user.role !== "admin" && (
            <div className="mt-4 mx-2">
              <Link
                href="/dashboard/upgrade"
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-3 py-2.5 rounded-xl text-xs font-semibold hover:from-violet-700 hover:to-violet-800 transition-all"
              >
                <Zap className="h-3.5 w-3.5 shrink-0" />
                Upgrade to Pro
              </Link>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
