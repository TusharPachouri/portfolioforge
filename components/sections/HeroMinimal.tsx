import { PortfolioData } from "@/types/portfolio";
import { getSocialIcon } from "@/lib/social-icons";

interface Props { data: PortfolioData }

export default function HeroMinimal({ data }: Props) {
  const { hero, contact } = data;
  return (
    <section className="py-20 px-6 max-w-2xl mx-auto">
      <p className="text-sm mb-2" style={{ color: 'var(--pf-muted)' }}>{hero.location}</p>
      <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--pf-fg)' }}>{hero.name}</h1>
      <p className="text-lg mb-6" style={{ color: 'var(--pf-muted)' }}>{hero.tagline}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(contact.socials).map(([platform, url]) => (
          <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm transition-colors px-2 py-1"
            style={{ color: 'var(--pf-muted)', borderRadius: 'var(--pf-radius)' }}>
            {getSocialIcon(platform)} {platform}
          </a>
        ))}
      </div>
    </section>
  );
}
