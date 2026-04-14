import { PortfolioData } from "@/types/portfolio";
import { Mail, ArrowRight, MapPin } from "lucide-react";
import { getSocialIcon } from "@/lib/social-icons";

interface Props { data: PortfolioData }

export default function HeroCentered({ data }: Props) {
  const { hero, contact } = data;
  return (
    <section
      className="flex flex-col items-center justify-center text-center py-24 px-6 min-h-[70vh]"
      style={{ color: 'var(--pf-fg)' }}
    >
      {hero.avatarUrl && (
        <div
          className="mb-6 h-20 w-20 rounded-full overflow-hidden"
          style={{ border: '2px solid var(--pf-border)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.avatarUrl} alt={hero.name} className="h-full w-full object-cover" />
        </div>
      )}
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
      <p className="text-lg max-w-xl mb-8" style={{ color: 'var(--pf-muted)' }}>{hero.tagline}</p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <a href={hero.ctaPrimary.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors"
          style={{
            background: 'var(--pf-primary-btn-bg)',
            color: 'var(--pf-primary-btn-fg)',
            borderRadius: 'var(--pf-radius)',
          }}>
          <Mail className="h-4 w-4" />
          {hero.ctaPrimary.label}
          <ArrowRight className="h-4 w-4" />
        </a>
        <a href={hero.ctaSecondary.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors"
          style={{
            border: '1px solid var(--pf-border)',
            color: 'var(--pf-fg)',
            borderRadius: 'var(--pf-radius)',
          }}>
          {hero.ctaSecondary.label}
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
    </section>
  );
}
