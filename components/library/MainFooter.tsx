import Link from "next/link";
import Logo from "@/components/Logo";
import { X, Camera, Briefcase, Code, Globe, ArrowUpRight } from "lucide-react";

const NAV = {
  product: [
    { label: "Components", href: "/components" },
    { label: "Patterns",   href: "/patterns"   },
    { label: "Showcase",   href: "/preview"    },
    { label: "Pricing",    href: "#"           },
  ],
  resources: [
    { label: "Documentation", href: "/docs"        },
    { label: "Help Center",   href: "#"            },
    { label: "Get Started",   href: "/personalize" },
    { label: "Changelog",     href: "#"            },
  ],
};

const SOCIALS = [
  { icon: X,         href: "#", label: "X"        },
  { icon: Camera,    href: "#", label: "Instagram" },
  { icon: Briefcase, href: "#", label: "LinkedIn"  },
  { icon: Code,      href: "#", label: "GitHub"    },
  { icon: Globe,     href: "#", label: "Website"   },
];

export default function MainFooter() {
  return (
    <footer className="relative bg-zinc-950 overflow-hidden">

      {/* Gradient bridge from the page's white into the dark footer */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 100%)" }}
      />

      {/* Violet ambient glow — mirrors the site's violet accent */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] -translate-y-1/2 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)" }}
      />

      {/* Top accent line — violet to indigo, same palette as the site's CTA buttons */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent 0%, rgba(139,92,246,0.7) 30%, rgba(99,102,241,0.7) 60%, transparent 100%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-0">

        {/* ── Main grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.6fr] gap-x-10 gap-y-12 pb-14 border-b border-white/[0.06]">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Logo className="w-9 h-9" />
              <span className="text-lg font-bold text-white tracking-tight">PortfolioForge</span>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-[260px]">
              Build a portfolio that gets you hired. AI-powered, beautifully designed, instantly live.
            </p>

            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-violet-400 mb-5">Product</p>
            <ul className="space-y-3.5">
              {NAV.product.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-violet-400 mb-5">Resources</p>
            <ul className="space-y-3.5">
              {NAV.resources.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Say Hello */}
          <div className="flex flex-col gap-5">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-violet-400">Say Hello</p>

            <a
              href="mailto:hello@portfolioforge.dev"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-violet-300 transition-colors duration-200 w-fit"
            >
              <span className="border-b border-violet-700/40 group-hover:border-violet-400 pb-0.5 transition-colors duration-200">
                hello@portfolioforge.dev
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-violet-400 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
            </a>

            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} PortfolioForge. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <span className="text-violet-400">✦</span> by the PortfolioForge team
          </p>
        </div>
      </div>

      {/* ── Ghost watermark ───────────────────────────────── */}
      <div
        aria-hidden="true"
        className="select-none pointer-events-none w-full overflow-hidden flex justify-center"
        style={{ marginTop: "-0.5rem" }}
      >
        <span
          className="text-[12vw] font-black leading-[0.85] tracking-[-0.04em] whitespace-nowrap"
          style={{ WebkitTextStroke: "1px rgba(139,92,246,0.08)", color: "transparent" }}
        >
          PORTFOLIOFORGE
        </span>
      </div>
    </footer>
  );
}
