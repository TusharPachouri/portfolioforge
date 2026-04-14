import { PortfolioData } from "@/types/portfolio";
import { Mail } from "lucide-react";
import { getSocialIcon } from "@/lib/social-icons";

interface Props { data: PortfolioData }

export default function ContactSimple({ data }: Props) {
  const { contact } = data;
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--pf-fg)' }}>Get in Touch</h2>
      <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--pf-muted)' }}>
        I&apos;m always open to new opportunities and interesting projects. Feel free to reach out.
      </p>
      <a href={`mailto:${contact.email}`}
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors mb-8"
        style={{
          background: 'var(--pf-primary-btn-bg)',
          color: 'var(--pf-primary-btn-fg)',
          borderRadius: 'var(--pf-radius)',
        }}>
        <Mail className="h-4 w-4" /> {contact.email}
      </a>
      <div className="flex items-center justify-center gap-3 mt-4">
        {Object.entries(contact.socials).map(([platform, url]) => (
          <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 transition-colors"
            style={{ color: 'var(--pf-muted)', borderRadius: 'var(--pf-radius)' }}>
            {getSocialIcon(platform)} {platform}
          </a>
        ))}
      </div>
    </section>
  );
}
