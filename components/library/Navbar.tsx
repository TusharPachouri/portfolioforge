"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { useBuilderState } from "@/hooks/useBuilderState";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useSession } from "next-auth/react";
import { Layers, Sparkles, RotateCcw, LayoutDashboard, Menu, X, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useHeroDark } from "@/hooks/useHeroDark";

export default function Navbar({ avatarUrl }: { avatarUrl?: string | null }) {
  const { state } = useBuilderState();
  const { isCustom, resetToDemo } = usePortfolio();
  const { data: session, status } = useSession();
  const count = state.selectedComponentIds.length;
  const isSignedIn = status === "authenticated" && !!session?.user;
  // Use DB avatar (prop) when available; fall back to session image for unauthenticated/initial render
  const displayAvatar = avatarUrl ?? session?.user?.image ?? null;
  const [open, setOpen] = useState(false);
  const darkHero = useHeroDark();

  // Close the mobile menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`sticky top-0 md:top-6 md:mt-6 z-[100] w-full md:w-max mx-auto backdrop-blur-md border-b md:border md:rounded-full transition-all duration-500 ${
        darkHero
          ? "bg-white/5 border-white/10 md:shadow-[0_8px_30px_rgb(0,0,0,0.25)]"
          : "bg-white/80 md:bg-white/70 border-zinc-100 md:border-zinc-200/60 md:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      }`}>
        <div className="mx-auto px-4 md:px-2 md:pr-2 h-14 md:h-[56px] flex items-center justify-between gap-2 sm:gap-3 md:gap-2">
          <Link href="/" className={`flex items-center gap-2 font-semibold text-sm shrink-0 md:px-3 md:py-2 md:rounded-full transition-colors ${
            darkHero ? "text-white md:hover:bg-white/10" : "text-zinc-900 md:hover:bg-zinc-100/80"
          }`} onClick={close}>
            <Logo className="h-7 w-7" />
            <span className="hidden sm:inline">PortfolioForge</span>
          </Link>

          <div className={`hidden md:block h-6 w-px mx-1 ${darkHero ? "bg-white/20" : "bg-zinc-900 opacity-15"}`} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {(["Components", "Patterns", "Docs"] as const).map((label) => (
              <Link key={label} href={`/${label.toLowerCase()}`}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  darkHero
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                }`}>
                {label}
              </Link>
            ))}
          </nav>

          <div className={`hidden md:block h-6 w-px mx-1 ${darkHero ? "bg-white/20" : "bg-zinc-900 opacity-15"}`} />

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isCustom && (
              <button onClick={resetToDemo}
                className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full transition-colors cursor-pointer ${
                  darkHero ? "text-white/60 hover:text-white hover:bg-white/10" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80"
                }`}>
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}

            <Link href="/personalize"
              className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm ${
                darkHero
                  ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  : "bg-white/50 border border-zinc-200/80 text-zinc-700 hover:bg-white"
              }`}>
              <Sparkles className={`h-3.5 w-3.5 ${darkHero ? "text-violet-300" : "text-violet-500"}`} />
              {isCustom ? "Edit details" : "Personalize"}
            </Link>

            {count > 0 && (
              <Link href="/preview"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors shadow-sm">
                <Layers className="h-3.5 w-3.5" />
                Preview
                <span className="bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {count}
                </span>
              </Link>
            )}

            {isSignedIn ? (
              <Link href="/dashboard"
                className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm ${
                  darkHero
                    ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                    : "bg-white/50 border border-zinc-200/80 text-zinc-700 hover:bg-white"
                }`}>
                {displayAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayAvatar} alt="" className="h-5 w-5 rounded-full border border-zinc-200 object-cover" />
                ) : (
                  <LayoutDashboard className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            ) : (
              <Link href="/auth/signin"
                className={`inline-flex items-center gap-1.5 text-sm font-medium px-5 py-2 rounded-full transition-colors shadow-sm ${
                  darkHero
                    ? "bg-white text-zinc-900 hover:bg-zinc-100"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }`}>
                Sign in
              </Link>
            )}

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={`md:hidden flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer shrink-0 ${
                darkHero ? "bg-white/15 text-white hover:bg-white/25" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              }`}
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="h-5 w-5" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Premium Menu Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-x-0 top-14 bottom-0 bg-white/95 backdrop-blur-xl z-40 overflow-y-auto"
          >
            <div className="flex flex-col p-5 space-y-6 min-h-full">
              
              {/* Primary Actions Grid */}
              <div className="grid grid-cols-2 gap-3">
                <Link href="/personalize" onClick={close}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-white to-zinc-50 border border-zinc-100 shadow-sm active:scale-95 transition-all">
                  <Sparkles className="h-6 w-6 text-violet-500 mb-2" />
                  <span className="text-sm font-semibold text-zinc-900">{isCustom ? "Edit details" : "Personalize"}</span>
                </Link>
                
                {count > 0 ? (
                  <Link href="/preview" onClick={close}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-900 text-white shadow-md active:scale-95 transition-all">
                    <Layers className="h-6 w-6 mb-2" />
                    <span className="text-sm font-semibold flex items-center gap-1.5">
                      Preview
                      <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">{count}</span>
                    </span>
                  </Link>
                ) : (
                  <Link href="/components" onClick={close}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-white to-zinc-50 border border-zinc-100 shadow-sm active:scale-95 transition-all">
                    <Layers className="h-6 w-6 text-zinc-900 mb-2" />
                    <span className="text-sm font-semibold text-zinc-900">Browse Library</span>
                  </Link>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1.5">
                {[
                  { name: "Components", href: "/components" },
                  { name: "Patterns", href: "/patterns" },
                  { name: "Documentation", href: "/docs" }
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, ease: "easeOut" }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={close} 
                      className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100 transition-colors"
                    >
                      {item.name}
                      <ChevronRight className="h-4 w-4 text-zinc-300" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="h-px bg-zinc-100 w-full my-2" />

              {/* Bottom Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, ease: "easeOut" }}
                className="mt-auto pb-8 space-y-3"
              >
                {isCustom && (
                  <button onClick={() => { resetToDemo(); close(); }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium text-zinc-600 bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 active:scale-[0.98] transition-all">
                    <RotateCcw className="h-4 w-4" /> Reset to Demo Data
                  </button>
                )}

                {isSignedIn ? (
                  <Link href="/dashboard" onClick={close}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-zinc-900 bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 active:scale-[0.98] transition-all">
                    {displayAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={displayAvatar} alt="" className="h-5 w-5 rounded-full object-cover" />
                    ) : (
                      <LayoutDashboard className="h-4 w-4" />
                    )}
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link href="/auth/signin" onClick={close} 
                    className="w-full flex items-center justify-center py-3.5 rounded-xl text-sm font-semibold text-white bg-zinc-900 shadow-md active:scale-[0.98] transition-all">
                    Sign in to save progress
                  </Link>
                )}
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
