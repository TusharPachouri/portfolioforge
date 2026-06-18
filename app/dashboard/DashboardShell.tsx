"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { Portfolio } from "@/lib/db/schema";
import { signOut } from "next-auth/react";
import {
  Layers, Settings, ExternalLink, Globe, LogOut, Sparkles, Palette,
  LayoutGrid, Zap, BarChart2, Moon, Sun, Copy, Check, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import { publishPortfolio } from "@/lib/actions/portfolio";

interface Props {
  session: Session;
  portfolio: Portfolio | null;
  children: React.ReactNode;
}

const NAV_GROUPS: { label: string; items: { href: string; label: string; icon: typeof Layers; proOnly?: boolean }[] }[] = [
  {
    label: "Build",
    items: [
      { href: "/dashboard", label: "Builder", icon: Layers },
      { href: "/dashboard/details", label: "Edit Details", icon: Sparkles },
    ],
  },
  {
    label: "Customize",
    items: [
      { href: "/dashboard/theme", label: "Theme", icon: Palette },
      { href: "/dashboard/pattern", label: "Pattern", icon: LayoutGrid },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2, proOnly: true },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

function SidebarNav({ pathname, isProUser, onNavigate }: {
  pathname: string;
  isProUser: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      <nav className="space-y-5 flex-1" aria-label="Dashboard">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.18em] text-zinc-400 dark:text-zinc-500 uppercase select-none">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, proOnly }) => {
                const locked = proOnly && !isProUser;
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={locked ? "/dashboard/upgrade" : href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-zinc-900 dark:bg-zinc-700 text-white shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-violet-400" aria-hidden="true" />
                    )}
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{label}</span>
                    {locked && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-1.5 py-0.5 rounded-full">
                        <Zap className="h-2.5 w-2.5" aria-hidden="true" /> Pro
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!isProUser && (
        <div className="mt-4 mx-1">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-700 p-3.5 text-white shadow-md">
            <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-white/10 blur-xl" aria-hidden="true" />
            <p className="text-xs font-semibold mb-1 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" aria-hidden="true" /> Go Pro
            </p>
            <p className="text-[11px] text-violet-200 leading-relaxed mb-2.5">
              Unlimited components, analytics &amp; more.
            </p>
            <Link
              href="/dashboard/upgrade"
              onClick={onNavigate}
              className="press-scale block text-center bg-white text-violet-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function DashboardShell({ session, portfolio, children }: Props) {
  const pathname = usePathname();
  const [published, setPublished] = useState(portfolio?.published ?? false);
  const [isPending, startTransition] = useTransition();
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const isProUser = session.user.role === "pro" || session.user.role === "admin";

  // Close the mobile drawer on Escape + lock scroll while open
  useEffect(() => {
    if (!mobileNav) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileNav(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [mobileNav]);

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

  const copyUrl = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${publicUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — leave the button state unchanged
    }
  };

  return (
    <div className={cn("min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col", darkMode && "dark")}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-4">
          {/* Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setMobileNav(true)}
              aria-label="Open menu"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white text-sm">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-600 dark:to-zinc-800 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">PF</span>
              </div>
              <span className="hidden sm:inline">PortfolioForge</span>
            </Link>
          </div>

          {/* Public URL */}
          <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 min-w-0 mx-1 sm:mx-0">
            {publicUrl && (
              <div className="flex items-center gap-1 sm:gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full pl-2 sm:pl-3 pr-1 sm:pr-1.5 py-1 max-w-xs w-full">
                <Globe className="hidden sm:block h-3.5 w-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
                <span className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate flex-1 min-w-0 text-left">
                  <span className="hidden sm:inline">portfolioforge.dev</span>
                  {publicUrl}
                </span>
                <div className="ml-auto flex items-center shrink-0">
                  <button
                    onClick={copyUrl}
                    aria-label={copied ? "Copied" : "Copy public URL"}
                    className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" aria-hidden="true" /> : <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />}
                  </button>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open public portfolio in a new tab"
                    className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right: dark toggle + publish + user */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            </button>

            <button
              onClick={togglePublish}
              disabled={isPending}
              aria-pressed={published}
              className={cn(
                "press-scale inline-flex items-center gap-2 text-sm font-medium px-3 sm:px-3.5 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-60",
                published
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  published ? "bg-emerald-500 motion-safe:animate-pulse" : "bg-zinc-300 dark:bg-zinc-600"
                )}
                aria-hidden="true"
              />
              {published ? "Live" : "Publish"}
            </button>

            <div className="flex items-center gap-2">
              {session.user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="h-7 w-7 rounded-full ring-2 ring-zinc-100 dark:ring-zinc-700" />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Sign out"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full min-w-0">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-52 shrink-0 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 px-2 min-h-full flex-col">
          <SidebarNav pathname={pathname} isProUser={isProUser} />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto min-w-0">{children}</main>
      </div>

      {/* Mobile nav drawer */}
      {mobileNav && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] fade-in" onClick={() => setMobileNav(false)} />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="drawer-in relative w-72 max-w-[82%] h-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col py-4 px-3 overflow-y-auto"
          >
            <div className="flex items-center justify-between px-1 mb-4">
              <Link href="/" onClick={() => setMobileNav(false)} className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white text-sm">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PF</span>
                </div>
                PortfolioForge
              </Link>
              <button
                onClick={() => setMobileNav(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <SidebarNav pathname={pathname} isProUser={isProUser} onNavigate={() => setMobileNav(false)} />
            <button
              onClick={() => { setMobileNav(false); signOut({ callbackUrl: "/" }); }}
              className="mt-4 mx-1 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 px-3 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
