import { PortfolioData } from "@/types/portfolio";
import { Home, Terminal, Sun } from "lucide-react";
import { getSocialIcon } from "@/lib/social-icons";

import { cn } from "@/lib/utils";

interface Props {
  data: PortfolioData;
  className?: string;
}

export default function FloatingNavbar({ data, className }: Props) {
  const { socials } = data.contact;
  const hasSocials = Object.values(socials).some((url) => !!url);

  return (
    <nav
      className={cn("hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-[100] items-center gap-1 px-2 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl", className)}
      style={{
        background: "color-mix(in srgb, var(--pf-card-bg) 85%, transparent)",
        border: "1px solid color-mix(in srgb, var(--pf-card-border) 60%, transparent)",
        color: "var(--pf-fg)",
      }}
    >
      {/* Home / Name */}
      <a
        href="#"
        className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors group"
        style={{
          background: "transparent",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in srgb, var(--pf-fg) 8%, transparent)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <Home className="h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity" />
        <span className="text-sm font-semibold tracking-tight">{data.hero.name}</span>
      </a>

      {/* Divider */}
      <div className="h-5 w-px mx-1 opacity-20" style={{ background: "var(--pf-fg)" }} />

      {/* Social Icons & Terminal */}
      <div className="flex items-center gap-1 px-2">
        {hasSocials &&
          Object.entries(socials).map(([platform, url]) => {
            if (!url) return null;
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={platform}
                className="flex items-center justify-center h-9 w-9 rounded-full transition-colors"
                style={{ color: "var(--pf-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "color-mix(in srgb, var(--pf-fg) 8%, transparent)";
                  e.currentTarget.style.color = "var(--pf-fg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--pf-muted)";
                }}
              >
                {getSocialIcon(platform, "h-4 w-4")}
              </a>
            );
          })}
        
        {/* Decorative terminal/projects icon like in the design */}
        <a
          href="#projects"
          title="Projects"
          className="flex items-center justify-center h-9 w-9 rounded-full transition-colors"
          style={{ color: "var(--pf-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "color-mix(in srgb, var(--pf-fg) 8%, transparent)";
            e.currentTarget.style.color = "var(--pf-fg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--pf-muted)";
          }}
        >
          <Terminal className="h-4 w-4" />
        </a>
      </div>

      {/* Divider */}
      <div className="h-5 w-px mx-1 opacity-20" style={{ background: "var(--pf-fg)" }} />

      {/* Contact Button */}
      <div className="px-2">
        <a
          href={data.hero.ctaPrimary.href}
          className="flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm"
          style={{
            background: "var(--pf-primary-btn-bg)",
            color: "var(--pf-primary-btn-fg)",
          }}
        >
          Contact
        </a>
      </div>

      {/* Divider */}
      <div className="h-5 w-px mx-1 opacity-20" style={{ background: "var(--pf-fg)" }} />

      {/* Theme Toggle (Decorative) */}
      <div className="px-2 pr-3">
        <button
          className="flex items-center justify-center h-9 w-9 rounded-full transition-colors"
          style={{ color: "var(--pf-muted)" }}
          aria-label="Theme toggle"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "color-mix(in srgb, var(--pf-fg) 8%, transparent)";
            e.currentTarget.style.color = "var(--pf-fg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--pf-muted)";
          }}
        >
          <Sun className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
