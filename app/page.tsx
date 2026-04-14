import Link from "next/link";
import Navbar from "@/components/library/Navbar";
import FloatingCardCluster from "@/components/landing/FloatingCardCluster";
import { ArrowRight, Sparkles, Layers, Zap, Code2, Eye, Users } from "lucide-react";

const DEMO_COMPONENTS = [
  { name: "Hero — Centered", sub: "Hero", gradient: "from-violet-100 to-indigo-200", tier: "Free", id: "hero-centered" },
  { name: "Skills — Grid", sub: "Skills", gradient: "from-emerald-50 to-teal-200", tier: "Free", id: "skills-grid" },
  { name: "Projects — Grid", sub: "Projects", gradient: "from-orange-50 to-amber-200", tier: "Free", id: "projects-grid" },
  { name: "Experience — Timeline", sub: "Experience", gradient: "from-pink-50 to-rose-200", tier: "Free", id: "experience-timeline" },
  { name: "Testimonials — Grid", sub: "Testimonials", gradient: "from-yellow-50 to-amber-200", tier: "Pro", id: "testimonials-grid" },
  { name: "Gallery — Masonry", sub: "Gallery", gradient: "from-sky-50 to-blue-200", tier: "Pro", id: "gallery-masonry" },
];

const FEATURES = [
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Browse & Build",
    description: "Pick sections from our library. Mix and match hero styles, project grids, timelines and more.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI-Powered",
    description: "Fill a simple form — Gemini AI structures your data and populates every component instantly.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Live Preview",
    description: "See your real information in every component as you browse. What you see is what you publish.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Zero Boilerplate",
    description: "No coding required. Copy production-ready code or publish a live portfolio URL in one click.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/60 via-white to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-violet-100/50 to-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column — headline + CTA */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1 rounded-full text-xs text-zinc-600 shadow-sm mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              27+ Components · 100% Free to start · AI-powered
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 tracking-tight leading-[1.1] mb-5">
              Build a stunning{" "}
              <span className="relative inline-block">
                <span className="relative z-10">portfolio</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-violet-200/60 rounded-sm -z-0" />
              </span>
              <br />
              in minutes
            </h1>

            <p className="text-lg text-zinc-500 max-w-xl mb-8 leading-relaxed">
              Browse beautiful portfolio sections, fill in your details, and let Gemini AI assemble
              everything with your real data. Preview live. Publish instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link href="/components"
                className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all shadow-sm hover:shadow-md">
                Browse Components
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/preview"
                className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-all">
                <Eye className="h-4 w-4" />
                See a Demo
              </Link>
            </div>
          </div>

          {/* Right column — floating card cluster */}
          <div className="hidden lg:block">
            <FloatingCardCluster />
          </div>
        </div>

        {/* Mobile fallback — show cluster below text */}
        <div className="block lg:hidden max-w-md mx-auto px-4 pb-8">
          <FloatingCardCluster />
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-100 bg-zinc-50/50">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-3 divide-x divide-zinc-200">
          {[
            { value: "27+", label: "Components" },
            { value: "100%", label: "Free to start" },
            { value: "CSS", label: "& Tailwind" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center px-4">
              <p className="text-2xl font-bold text-zinc-900">{value}</p>
              <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Component Library preview */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-zinc-900 mb-3">Component Library</h2>
          <p className="text-zinc-500">Tap on mobile or hover on desktop to see options</p>
        </div>

        {/* Filter tabs mock */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg w-fit mx-auto mb-8 overflow-x-auto">
          {["All Components", "Sections", "Primitives", "Free", "Pro"].map((tab, i) => (
            <div key={tab} className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap cursor-default ${i === 0 ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}>
              {tab}
            </div>
          ))}
        </div>

        {/* Component grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {DEMO_COMPONENTS.map((comp) => (
            <Link key={comp.name} href={`/components/${comp.id}`}
              className="group bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className={`h-36 bg-gradient-to-br ${comp.gradient} relative flex items-center justify-center`}>
                <div className="text-5xl font-black text-zinc-300/60">{comp.sub[0]}</div>
                <div className="absolute top-2 right-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${comp.tier === "Pro" ? "bg-violet-100 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {comp.tier}
                  </span>
                </div>
                <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white text-zinc-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm">Preview →</span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-zinc-900">{comp.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{comp.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/components"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 px-5 py-2.5 rounded-xl hover:bg-zinc-50 transition-all">
            Browse all 27+ components
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-50/50 border-t border-zinc-100 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-3">Everything you need</h2>
            <p className="text-zinc-500">From browsing to publishing in four steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white border border-zinc-100 rounded-xl p-5 shadow-sm">
                <div className="h-9 w-9 bg-zinc-100 rounded-lg flex items-center justify-center mb-4 text-zinc-700">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-zinc-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 mb-3">How it works</h2>
          <p className="text-zinc-500">Three steps to your perfect portfolio</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: <Layers className="h-6 w-6" />, title: "Browse & pick sections", desc: "Explore our library of portfolio sections. Add the ones you like to your builder." },
            { step: "02", icon: <Code2 className="h-6 w-6" />, title: "Fill in your details", desc: "Answer a simple form about your experience and projects. Gemini AI does the rest." },
            { step: "03", icon: <Users className="h-6 w-6" />, title: "Preview & publish", desc: "See your live portfolio. Share a link or export the code." },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="text-6xl font-black text-zinc-100 mb-4 leading-none select-none">{item.step}</div>
              <div className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-3">
                {item.icon}
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start building for free</h2>
          <p className="text-zinc-400 mb-8">No sign-up required. Pick components, preview with your data, publish when ready.</p>
          <Link href="/components"
            className="inline-flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-all">
            Browse Components
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">PF</span>
            </div>
            <span className="text-sm font-medium text-zinc-700">PortfolioForge</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <Link href="/components" className="hover:text-zinc-600">Components</Link>
            <Link href="/docs" className="hover:text-zinc-600">Docs</Link>
            <Link href="/preview" className="hover:text-zinc-600">Preview</Link>
          </div>
          <p className="text-xs text-zinc-400">© {new Date().getFullYear()} PortfolioForge</p>
        </div>
      </footer>
    </div>
  );
}
