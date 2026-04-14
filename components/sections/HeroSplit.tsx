import { PortfolioData } from "@/types/portfolio";
import { Mail, ArrowRight, MapPin } from "lucide-react";
import { getSocialIcon } from "@/lib/social-icons";

interface Props { data: PortfolioData }

export default function HeroSplit({ data }: Props) {
  const { hero, contact } = data;
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-12 py-20 px-6 max-w-5xl mx-auto min-h-[60vh]">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          {hero.location && (
            <span className="inline-flex items-center gap-1 text-sm" style={{ color: 'var(--pf-muted)' }}>
              <MapPin className="h-3.5 w-3.5" />{hero.location}
            </span>
          )}
          {hero.openToWork && (
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'color-mix(in srgb, var(--pf-highlight) 15%, transparent)',
                color: 'var(--pf-highlight)',
                border: '1px solid color-mix(in srgb, var(--pf-highlight) 30%, transparent)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--pf-highlight)' }} />
              Open to work
            </span>
          )}
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--pf-fg)' }}>{hero.name}</h1>
        <p className="text-base mb-8 max-w-md" style={{ color: 'var(--pf-muted)' }}>{hero.tagline}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <a href={hero.ctaPrimary.href}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors"
            style={{
              background: 'var(--pf-primary-btn-bg)',
              color: 'var(--pf-primary-btn-fg)',
              borderRadius: 'var(--pf-radius)',
            }}>
            <Mail className="h-4 w-4" /> {hero.ctaPrimary.label} <ArrowRight className="h-4 w-4" />
          </a>
          {Object.entries(contact.socials).map(([platform, url]) => (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" title={platform}
              className="inline-flex items-center justify-center h-10 w-10 transition-colors"
              style={{
                border: '1px solid var(--pf-border)',
                color: 'var(--pf-muted)',
                borderRadius: 'var(--pf-radius)',
              }}>
              {getSocialIcon(platform)}
            </a>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0">
        {hero.avatarUrl ? (
          <div className="h-52 w-52 overflow-hidden ring-4" style={{
            borderRadius: 'var(--pf-radius)',
            '--tw-ring-color': 'var(--pf-card-border)',
          } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.avatarUrl} alt={hero.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-52 w-52 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-6xl font-bold" style={{
            borderRadius: 'var(--pf-radius)',
            color: 'var(--pf-accent)',
          }}>
            {hero.name[0]}
          </div>
        )}
      </div>
    </section>
  );
}
