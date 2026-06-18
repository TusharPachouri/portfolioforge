import Link from "next/link";
import Navbar from "@/components/library/Navbar";
import PhysicsCardCluster from "@/components/landing/PhysicsCardCluster";
import LibraryShowcase from "@/components/landing/LibraryShowcase";
import PatternMarquee from "@/components/landing/PatternMarquee";
import Reveal from "@/components/landing/Reveal";
import CountUp from "@/components/landing/CountUp";
import Magnetic from "@/components/landing/Magnetic";
import TiltCard from "@/components/landing/TiltCard";
import Parallax from "@/components/landing/Parallax";
import { ArrowRight, Sparkles, Layers, Zap, Code2, Eye, Users, Check } from "lucide-react";

const HEADLINE_LEAD = ["Build", "a", "stunning"];
const HEADLINE_TAIL = ["in", "minutes"];

const TRUST_POINTS = ["Free forever plan", "No credit card", "Export code anytime"];

const FEATURES = [
  {
    icon: <Layers className="h-5 w-5" aria-hidden="true" />,
    title: "Browse & Build",
    description: "Pick sections from our library. Mix and match hero styles, project grids, timelines and more.",
  },
  {
    icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
    title: "AI-Powered",
    description: "Fill a simple form — Gemini AI structures your data and populates every component instantly.",
  },
  {
    icon: <Eye className="h-5 w-5" aria-hidden="true" />,
    title: "Live Preview",
    description: "See your real information in every component as you browse. What you see is what you publish.",
  },
  {
    icon: <Zap className="h-5 w-5" aria-hidden="true" />,
    title: "Zero Boilerplate",
    description: "No coding required. Copy production-ready code or publish a live portfolio URL in one click.",
  },
];

const STEPS = [
  { step: "01", icon: <Layers className="h-6 w-6" aria-hidden="true" />, title: "Browse & pick sections", desc: "Explore our library of portfolio sections. Add the ones you like to your builder." },
  { step: "02", icon: <Code2 className="h-6 w-6" aria-hidden="true" />, title: "Fill in your details", desc: "Answer a simple form about your experience and projects. Gemini AI does the rest." },
  { step: "03", icon: <Users className="h-6 w-6" aria-hidden="true" />, title: "Preview & publish", desc: "See your live portfolio. Share a link or export the code." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Keep revealed content visible when JavaScript is unavailable */}
      <noscript>
        <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
      </noscript>

      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Backdrop: soft wash + rotating aurora + dot grid + parallax glow blobs */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/70 via-white to-white pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="hero-aurora motion-reduce:hidden" />
        </div>
        <div className="absolute inset-0 hero-dots pointer-events-none" aria-hidden="true" />
        <Parallax speed={0.18} className="absolute -top-24 left-1/4 pointer-events-none" aria-hidden="true">
          <div className="hero-blob w-[560px] h-[420px] rounded-full bg-gradient-to-br from-violet-300/45 to-indigo-300/35 blur-3xl" />
        </Parallax>
        <Parallax speed={0.1} className="absolute top-10 right-0 pointer-events-none" aria-hidden="true">
          <div className="hero-blob-2 w-[460px] h-[360px] rounded-full bg-gradient-to-br from-fuchsia-300/40 to-violet-300/35 blur-3xl" />
        </Parallax>
        <Parallax speed={0.14} className="absolute top-40 left-1/2 pointer-events-none" aria-hidden="true">
          <div className="hero-blob w-[360px] h-[300px] rounded-full bg-gradient-to-br from-sky-200/35 to-cyan-200/25 blur-3xl" />
        </Parallax>

        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column — headline + CTA */}
          <div>
            <div className="hero-rise-block inline-flex items-center gap-1.5 bg-white/80 backdrop-blur border border-zinc-200 px-3 py-1 rounded-full text-xs text-zinc-600 shadow-sm mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" aria-hidden="true" />
              27+ Components · 100% Free to start · AI-powered
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 tracking-tight leading-[1.08] mb-5">
              {HEADLINE_LEAD.map((word, i) => (
                <span key={word} className="hero-word" style={{ animationDelay: `${80 + i * 70}ms` }}>
                  {word}&nbsp;
                </span>
              ))}
              <span className="hero-word" style={{ animationDelay: "290ms" }}>
                <span className="font-display-serif italic font-normal text-gradient-animated pr-1">portfolio</span>
              </span>
              <br />
              {HEADLINE_TAIL.map((word, i) => (
                <span key={word} className="hero-word" style={{ animationDelay: `${360 + i * 70}ms` }}>
                  {word}&nbsp;
                </span>
              ))}
            </h1>

            <p className="hero-rise-block text-lg text-zinc-600 max-w-xl mb-8 leading-relaxed" style={{ animationDelay: "420ms" }}>
              Browse beautiful portfolio sections, fill in your details, and let Gemini AI assemble
              everything with your real data. Preview live. Publish instantly.
            </p>

            <div className="hero-rise-block flex flex-col sm:flex-row items-start gap-3" style={{ animationDelay: "520ms" }}>
              <Magnetic>
                <Link href="/components"
                  className="btn-shine inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors shadow-sm hover:shadow-md">
                  Browse Components
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Magnetic>
              <Magnetic strength={4}>
                <Link href="/preview"
                  className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  See a Demo
                </Link>
              </Magnetic>
            </div>

            <div className="hero-rise-block flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-6 text-xs text-zinc-500" style={{ animationDelay: "620ms" }}>
              {TRUST_POINTS.map((point) => (
                <span key={point} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  {point}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — physics card cluster */}
          <div className="hidden lg:block hero-rise-block" style={{ animationDelay: "300ms" }}>
            <PhysicsCardCluster />
          </div>
        </div>

        {/* Mobile fallback — show cluster below text */}
        <div className="block lg:hidden max-w-md mx-auto px-4 pb-8">
          <PhysicsCardCluster />
        </div>

        {/* Pattern swatch marquee — real patterns from the registry */}
        <div className="relative max-w-6xl mx-auto px-4 pb-10">
          <PatternMarquee />
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-100 bg-zinc-50/50">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-3 divide-x divide-zinc-200">
          <div className="text-center px-4">
            <p className="text-2xl font-bold text-zinc-900"><CountUp to={27} suffix="+" /></p>
            <p className="text-sm text-zinc-600 mt-0.5">Components</p>
          </div>
          <div className="text-center px-4">
            <p className="text-2xl font-bold text-zinc-900"><CountUp to={100} suffix="%" /></p>
            <p className="text-sm text-zinc-600 mt-0.5">Free to start</p>
          </div>
          <div className="text-center px-4">
            <p className="text-2xl font-bold text-zinc-900">CSS</p>
            <p className="text-sm text-zinc-600 mt-0.5">& Tailwind</p>
          </div>
        </div>
      </section>

      {/* Component + Pattern library (interactive) */}
      <Reveal>
        <LibraryShowcase />
      </Reveal>

      {/* Features */}
      <section className="bg-zinc-50/50 border-t border-zinc-100 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.22em] text-violet-600 uppercase mb-3">Why PortfolioForge</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-3">
              Everything you <span className="font-display-serif italic font-normal">need</span>
            </h2>
            <p className="text-zinc-500">From browsing to publishing — all in one place</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} className="h-full">
                <TiltCard maxTilt={8} className="h-full rounded-xl">
                  <div className="card-premium h-full bg-white border border-zinc-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="h-9 w-9 bg-gradient-to-br from-violet-50 to-indigo-100 rounded-lg flex items-center justify-center mb-4 text-violet-700">
                      {f.icon}
                    </div>
                    <h3 className="font-semibold text-zinc-900 mb-1.5">{f.title}</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">{f.description}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <Reveal className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.22em] text-violet-600 uppercase mb-3">Workflow</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-3">
            How it <span className="font-display-serif italic font-normal">works</span>
          </h2>
          <p className="text-zinc-500">Three steps from blank page to published portfolio</p>
        </Reveal>
        <Reveal className="relative">
          {/* Connector line draws itself across the steps on reveal */}
          <div className="steps-line hidden md:block" aria-hidden="true" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item, i) => (
              <Reveal key={item.step} delay={i * 140}>
                <div className="relative">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 to-zinc-50 mb-4 leading-none select-none" aria-hidden="true">{item.step}</div>
                  <div className="relative z-10 h-10 w-10 bg-zinc-900 rounded-xl ring-4 ring-white flex items-center justify-center text-white mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-zinc-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-zinc-900 py-24">
        <Parallax speed={0.08} className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="cta-aurora" />
        </Parallax>
        <Reveal className="relative max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-violet-400 uppercase mb-4">Get started</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Start building for <span className="font-display-serif italic font-normal text-gradient-animated">free</span>
          </h2>
          <p className="text-zinc-400 mb-8">No sign-up required. Pick components, preview with your data, publish when ready.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <Link href="/components"
                className="btn-shine inline-flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-colors">
                Browse Components
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Link href="/patterns" className="text-sm text-zinc-400 hover:text-white underline-offset-4 hover:underline transition-colors">
              or explore patterns →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer>
        <div className="h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">PF</span>
            </div>
            <span className="text-sm font-semibold text-zinc-900">PortfolioForge</span>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-4 text-sm text-zinc-500">
            <Link href="/components" className="hover:text-zinc-700">Components</Link>
            <Link href="/patterns" className="hover:text-zinc-700">Patterns</Link>
            <Link href="/docs" className="hover:text-zinc-700">Docs</Link>
            <Link href="/preview" className="hover:text-zinc-700">Preview</Link>
          </nav>
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} PortfolioForge</p>
        </div>
      </footer>
    </div>
  );
}
