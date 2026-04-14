import { PortfolioData } from "@/types/portfolio";
import { MapPin, Mail, CheckCircle2 } from "lucide-react";

interface Props { data: PortfolioData }

export default function AboutCard({ data }: Props) {
  const { hero, about, contact } = data;
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--pf-fg)' }}>About</h2>
      <div className="pf-glass p-8 shadow-sm" style={{
        background: 'var(--pf-card-bg)',
        border: '1px solid var(--pf-card-border)',
        borderRadius: 'var(--pf-radius)',
      }}>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            {hero.avatarUrl ? (
              <div className="h-24 w-24 overflow-hidden" style={{ borderRadius: 'var(--pf-radius)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero.avatarUrl} alt={hero.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-24 w-24 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-3xl font-bold"
                style={{ borderRadius: 'var(--pf-radius)', color: 'var(--pf-accent)' }}>
                {hero.name[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--pf-fg)' }}>{hero.name}</h3>
            <div className="space-y-3 mb-6">
              {about.paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed text-sm" style={{ color: 'var(--pf-muted)' }}>{p}</p>
              ))}
            </div>
            {about.highlights.length > 0 && (
              <ul className="space-y-1.5 mb-6">
                {about.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm" style={{ color: 'var(--pf-muted)' }}>
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--pf-highlight)' }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--pf-muted)' }}>
              {hero.location && (
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{hero.location}</span>
              )}
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{contact.email}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
