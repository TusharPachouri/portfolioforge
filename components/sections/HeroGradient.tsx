import { PortfolioData } from "@/types/portfolio";
import { Mail, ArrowRight, MapPin } from "lucide-react";
import { getSocialIcon } from "@/lib/social-icons";

interface Props { data: PortfolioData }

export default function HeroGradient({ data }: Props) {
  const { hero, contact } = data;
  return (
    <section className="relative overflow-hidden py-28 px-6 text-center" style={{ color: "var(--pf-fg)" }}>
      {/* Accent glow halo */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 -top-16 h-80 w-[40rem] max-w-full rounded-full blur-3xl pointer-events-none"
        style={{ background: "color-mix(in srgb, var(--pf-accent) 24%, transparent)" }}
      />
      <div className="relative max-w-2xl mx-auto flex flex-col items-center">
        {hero.avatarUrl && (
          <div
            className="mb-7 rounded-full p-[3px]"
            style={{ background: "linear-gradient(135deg, var(--pf-accent), color-mix(in srgb, var(--pf-accent) 35%, #ffffff))" }}
          >
            <div className="h-24 w-24 rounded-full overflow-hidden" style={{ border: "3px solid var(--pf-bg)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.avatarUrl} alt={hero.name} className="h-full w-full object-cover" />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          {hero.location && (
            <span className="inline-flex items-center gap-1 text-sm" style={{ color: "var(--pf-muted)" }}>
              <MapPin className="h-3.5 w-3.5" />{hero.location}
            </span>
          )}
          {hero.openToWork && (
            <span
              className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full"
              style={{
                background: "color-mix(in srgb, var(--pf-highlight) 15%, transparent)",
                color: "var(--pf-highlight)",
                border: "1px solid color-mix(in srgb, var(--pf-highlight) 30%, transparent)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--pf-highlight)" }} />
              Open to work
            </span>
          )}
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-5 leading-[1.05]">
          <span
            style={{
              background: "linear-gradient(120deg, var(--pf-fg), var(--pf-accent))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {hero.name}
          </span>
        </h1>
        <p className="text-lg max-w-xl mb-9" style={{ color: "var(--pf-muted)" }}>{hero.tagline}</p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <a href={hero.ctaPrimary.href}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(120deg, var(--pf-accent), color-mix(in srgb, var(--pf-accent) 60%, #ffffff))",
              color: "var(--pf-accent-fg)",
              borderRadius: "var(--pf-radius)",
              boxShadow: "0 10px 30px -8px color-mix(in srgb, var(--pf-accent) 55%, transparent)",
            }}>
            <Mail className="h-4 w-4" /> {hero.ctaPrimary.label} <ArrowRight className="h-4 w-4" />
          </a>
          <a href={hero.ctaSecondary.href}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors"
            style={{ border: "1px solid var(--pf-border)", color: "var(--pf-fg)", borderRadius: "var(--pf-radius)" }}>
            {hero.ctaSecondary.label}
          </a>
        </div>

        {Object.keys(contact.socials).length > 0 && (
          <div className="flex items-center gap-2 mt-6">
            {Object.entries(contact.socials).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" title={platform}
                className="inline-flex items-center justify-center h-9 w-9 transition-colors"
                style={{ border: "1px solid var(--pf-border)", color: "var(--pf-muted)", borderRadius: "var(--pf-radius)" }}>
                {getSocialIcon(platform)}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
