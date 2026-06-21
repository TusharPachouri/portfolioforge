import Link from "next/link";
import Navbar from "@/components/library/Navbar";
import LibraryShowcase from "@/components/landing/LibraryShowcase";
import FanCardCarousel from "@/components/landing/FanCardCarousel";
import HeroWave from "@/components/landing/HeroWave";
import Logo from "@/components/Logo";
import { ArrowRight, Sparkles, Layers, Zap, Lock, FileText, Plus, Moon, ExternalLink, RefreshCw, BarChart, Settings, LayoutTemplate, Palette, PenLine } from "lucide-react";
import MainFooter from "@/components/library/MainFooter";

export default function HomePage() {
  return (
    <div className="pf-page-root min-h-screen bg-white dark:bg-[#191919] text-zinc-900 dark:text-white selection:bg-blue-100 dark:selection:bg-blue-900/30">
      <Navbar />

      {/* ── Hero area — wave spans text + mockup ── */}
      <div className="relative overflow-hidden">
      <HeroWave />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 max-w-5xl mx-auto text-center relative">
        {/* Floating Avatar Bubbles */}
        <div className="flex items-center justify-center mb-8 relative z-10">
          <div className="flex -space-x-3">
            <div className="w-12 h-12 rounded-full border-2 border-white dark:border-[#191919] bg-orange-100 flex items-center justify-center text-xl shadow-sm transform -rotate-12 hover:rotate-0 transition-transform cursor-pointer">👩‍💻</div>
            <div className="w-12 h-12 rounded-full border-2 border-white dark:border-[#191919] bg-blue-100 flex items-center justify-center text-xl shadow-sm transform rotate-6 hover:rotate-0 transition-transform cursor-pointer">👨‍🎨</div>
            <div className="w-14 h-14 rounded-full border-2 border-white dark:border-[#191919] bg-violet-100 flex items-center justify-center text-2xl shadow-md z-10 transform scale-110 hover:scale-125 transition-transform cursor-pointer">🤖</div>
            <div className="w-12 h-12 rounded-full border-2 border-white dark:border-[#191919] bg-emerald-100 flex items-center justify-center text-xl shadow-sm transform -rotate-6 hover:rotate-0 transition-transform cursor-pointer">⚡️</div>
            <div className="w-12 h-12 rounded-full border-2 border-white dark:border-[#191919] bg-pink-100 flex items-center justify-center text-xl shadow-sm transform rotate-12 hover:rotate-0 transition-transform cursor-pointer">✨</div>
          </div>
        </div>

        <h1
          className="pf-page-text text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] relative z-10"
          style={{ color: "var(--pf-page-fg)" }}
        >
          Where developers and AI{" "}
          <br className="hidden sm:block" />
          <span className="relative inline-block px-3 mx-1">
            <span className="relative z-10" style={{ color: "#18181b" }}>Ship</span>
            <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg -z-10 transform -rotate-2"></div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
          </span>{" "}
          portfolios.
        </h1>

        <p
          className="pf-page-text text-lg sm:text-xl max-w-2xl mx-auto mb-8 font-medium"
          style={{ color: "var(--pf-page-muted)" }}
        >
          Capture context, find beautiful components, and automate your portfolio creation with AI built for developers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link href="/components" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-colors shadow-sm text-sm sm:text-base">
            Get PortfolioForge free
          </Link>
          <Link href="/preview" className="w-full sm:w-auto text-blue-600 dark:text-blue-400 hover:underline px-6 py-3 font-semibold transition-colors text-sm sm:text-base">
            Request a demo →
          </Link>
        </div>

      </section>

      {/* Hero Visual App Mockup */}
      <section className="max-w-6xl mx-auto px-4 relative mb-24 z-10">
        {/* Floating decorations */}
        <div className="absolute -top-6 -left-4 sm:-left-12 z-20 animate-bounce" style={{ animationDuration: '3.5s' }}>
          <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700 transform -rotate-12">
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        <div className="absolute top-1/3 -right-4 sm:-right-12 z-20 animate-bounce" style={{ animationDuration: '4.2s' }}>
          <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700 transform rotate-12">
            <Layers className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="absolute bottom-10 -left-6 sm:-left-16 z-20 animate-bounce" style={{ animationDuration: '3.8s' }}>
          <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700 transform -rotate-6">
            <Zap className="w-6 h-6 text-violet-500" />
          </div>
        </div>

        {/* Platform Mockup Window */}
        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 bg-white dark:bg-[#121212] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col h-[600px]">

          {/* Mock App Header */}
          <div className="h-14 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-4 bg-white dark:bg-[#121212] z-20 shrink-0">
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6" />
              <span className="font-semibold text-sm">PortfolioForge</span>
            </div>

            <div className="hidden sm:flex items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-3 py-1.5 text-xs text-zinc-500 gap-2">
              <Lock className="w-3 h-3" />
              <span>portfolioforge.dev/u/ipandeysumit</span>
              <FileText className="w-3 h-3 ml-2" />
              <ExternalLink className="w-3 h-3" />
            </div>

            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-zinc-400" />
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Live
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </div>
          </div>

          {/* Mock App Body */}
          <div className="flex flex-1 overflow-hidden bg-white dark:bg-[#121212] text-left">

            {/* Left Nav */}
            <div className="w-48 border-r border-zinc-100 dark:border-zinc-800 p-4 hidden md:flex flex-col gap-6 shrink-0 bg-white dark:bg-[#121212]">
              <div>
                <div className="text-[10px] font-bold text-zinc-400 tracking-wider mb-2 uppercase">Build</div>
                <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md px-3 py-2 text-sm font-medium flex items-center gap-2 shadow-sm">
                  <Layers className="w-4 h-4" /> Builder
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md cursor-pointer transition-colors mt-1">
                  <PenLine className="w-4 h-4" /> Edit Details
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 tracking-wider mb-2 uppercase">Customize</div>
                <div className="text-zinc-600 dark:text-zinc-400 px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md cursor-pointer transition-colors">
                  <Palette className="w-4 h-4" /> Theme
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md cursor-pointer transition-colors mt-1">
                  <LayoutTemplate className="w-4 h-4" /> Pattern
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 tracking-wider mb-2 uppercase">Account</div>
                <div className="text-zinc-600 dark:text-zinc-400 px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md cursor-pointer transition-colors">
                  <BarChart className="w-4 h-4" /> Analytics
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md cursor-pointer transition-colors mt-1">
                  <Settings className="w-4 h-4" /> Settings
                </div>
              </div>
            </div>

            {/* Middle Column */}
            <div className="w-64 border-r border-zinc-100 dark:border-zinc-800 p-4 hidden lg:flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-sm">My Components</h3>
                  <p className="text-xs text-zinc-500">0 sections</p>
                </div>
                <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium px-2 py-1 rounded flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3 h-3" /> Add
                </div>
              </div>

              <div className="border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-white dark:bg-[#121212]">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
                  <Plus className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-200">Add your first section</h4>
                <p className="text-xs text-zinc-400">Browse the component library</p>
              </div>
            </div>

            {/* Main Preview */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 p-6 flex flex-col relative">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
                </div>
                <div className="bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors">
                  <Sparkles className="w-3 h-3" /> Surprise me
                </div>
              </div>

              <div className="flex-1 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-[#121212] flex flex-col items-center justify-center text-center p-8 shadow-sm relative overflow-hidden">
                 <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-500 mb-6 relative">
                   <Sparkles className="w-8 h-8 relative z-10" />
                   <div className="absolute inset-0 bg-violet-400 opacity-20 blur-xl rounded-full"></div>
                 </div>
                 <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Start building your portfolio</h2>
                 <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
                   Add sections from the library — they&apos;ll preview here exactly as visitors will see them.
                 </p>
                 <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm">
                   <Plus className="w-4 h-4" /> Browse Library
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      </div>{/* end hero wave wrapper */}

      {/* Trusted By Strip */}
      <section className="mb-24 text-center px-4">
        <p
          className="pf-page-text text-sm font-medium mb-8 uppercase tracking-widest text-xs"
          style={{ color: "var(--pf-page-muted)" }}
        >
          Trusted by 50% of the Forbes Cloud 100
        </p>
        <div
          className="pf-page-text flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-80"
          style={{ color: "var(--pf-page-muted)" }}
        >
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><div className="w-5 h-5 bg-current rounded-sm"></div> Vercel</div>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><div className="w-5 h-5 rounded-full border-4 border-current"></div> OpenAI</div>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter italic">Next.js</div>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">tailwindcss</div>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter font-serif">Figma</div>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter uppercase">Stripe</div>
        </div>
      </section>

      {/* Library Showcase Section */}
      <section className="pf-section border-y border-zinc-200 dark:border-zinc-800 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <LibraryShowcase />
        </div>
      </section>

      {/* Portfolio Showcase — Fan Card Carousel */}
      <section className="pf-section border-b border-zinc-200 dark:border-zinc-800 py-24 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.22em] text-violet-500 uppercase mb-3">Live portfolios</p>
            <h2
              className="pf-page-text text-3xl sm:text-4xl font-bold tracking-tight mb-3"
              style={{ color: "var(--pf-page-fg)" }}
            >
              Built by developers like you
            </h2>
            <p
              className="pf-page-text text-base max-w-md mx-auto"
              style={{ color: "var(--pf-page-muted)" }}
            >
              Browse real portfolios shipping on PortfolioForge — click a card to explore.
            </p>
          </div>
          <FanCardCarousel />
        </div>
      </section>

      {/* Footer */}
      <MainFooter />
    </div>
  );
}
