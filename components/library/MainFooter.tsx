import Link from "next/link";
import { Sparkles, X, Camera, Briefcase, Code, Globe, ArrowUpRight } from "lucide-react";

const NAV = {
  product: [
    { label: "Components",  href: "/components" },
    { label: "Patterns",    href: "/patterns"   },
    { label: "Showcase",    href: "/preview"    },
    { label: "Pricing",     href: "#"           },
  ],
  resources: [
    { label: "Documentation", href: "/docs"         },
    { label: "Help Center",   href: "#"             },
    { label: "Get Started",   href: "/personalize"  },
    { label: "Changelog",     href: "#"             },
  ],
};

const SOCIALS = [
  { icon: X,        href: "#", label: "X"         },
  { icon: Camera,   href: "#", label: "Instagram"  },
  { icon: Briefcase,href: "#", label: "LinkedIn"   },
  { icon: Code,     href: "#", label: "GitHub"     },
  { icon: Globe,    href: "#", label: "Website"    },
];

export default function MainFooter() {
  return (
    <footer className="relative overflow-hidden bg-zinc-950">
      {/* Smooth fade from page white/light into dark */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.04) 0%, transparent 100%)",
        }}
      />

      {/* Ambient violet glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Thin gradient top border */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent 0%, rgba(124,58,237,0.5) 30%, rgba(99,102,241,0.5) 60%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-0">
        {/* ── Main Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1.5fr] gap-x-10 gap-y-14 pb-16">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                  boxShadow: "0 0 20px rgba(124,58,237,0.45)",
                }}
              >
                <Sparkles className="w-4.5 h-4.5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">PortfolioForge</span>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-[260px]">
              Build a portfolio that gets you hired. AI-powered, beautifully designed, instantly live.
            </p>

            {/* Live status badge */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-lime-400 mb-6">
              Product
            </p>
            <ul className="space-y-4">
              {NAV.product.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-lime-400 mb-6">
              Resources
            </p>
            <ul className="space-y-4">
              {NAV.resources.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Say Hello */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-lime-400 mb-6">
                Say Hello
              </p>
              <a
                href="mailto:hello@portfolioforge.dev"
                className="group inline-flex items-end gap-1 text-base font-semibold text-white transition-colors duration-200"
              >
                <span className="border-b border-violet-700/50 group-hover:border-violet-500 pb-0.5 transition-colors duration-200">
                  hello@portfolioforge.dev
                </span>
                <ArrowUpRight className="w-4 h-4 text-violet-400 mb-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group relative w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-violet-500/60 transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.2), transparent 70%)",
                    }}
                  />
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-xs font-medium text-zinc-600"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p>© {new Date().getFullYear()} PortfolioForge. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <span className="text-lime-400">✦</span> by the PortfolioForge team
          </p>
        </div>
      </div>

      {/* ── Ghost watermark ──────────────────────────────── */}
      <div
        aria-hidden="true"
        className="select-none pointer-events-none w-full overflow-hidden flex justify-center"
        style={{ marginTop: "-0.5rem" }}
      >
        <span
          className="text-[12vw] font-black leading-[0.85] tracking-[-0.04em] whitespace-nowrap"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.045)",
            color: "transparent",
            letterSpacing: "-0.04em",
          }}
        >
          PORTFOLIOFORGE
        </span>
      </div>
    </footer>
  );
}
