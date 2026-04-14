import { PortfolioData } from "@/types/portfolio";

interface Props { data: PortfolioData }

export default function FooterMinimal({ data }: Props) {
  return (
    <footer className="py-8 px-6" style={{ borderTop: '1px solid var(--pf-card-border)' }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: 'var(--pf-muted)' }}>
          © {new Date().getFullYear()} {data.hero.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {Object.entries(data.contact.socials).map(([platform, url]) => (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
              className="text-sm transition-colors"
              style={{ color: 'var(--pf-muted)' }}>
              {platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
