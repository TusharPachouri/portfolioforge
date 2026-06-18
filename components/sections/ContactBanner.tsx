import { PortfolioData } from "@/types/portfolio";
import { Mail, ArrowRight } from "lucide-react";
import { getSocialIcon } from "@/lib/social-icons";

interface Props { data: PortfolioData }

export default function ContactBanner({ data }: Props) {
  const { contact, hero } = data;
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <div
        className="relative overflow-hidden text-center px-8 py-14"
        style={{
          borderRadius: "calc(var(--pf-radius) * 1.5)",
          background: "linear-gradient(135deg, var(--pf-accent), color-mix(in srgb, var(--pf-accent) 55%, #000000))",
          color: "var(--pf-accent-fg)",
        }}
      >
        {/* Decorative glow */}
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-16 h-64 w-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />
        <div className="relative max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Let&apos;s work together</h2>
          <p className="text-base opacity-90 mb-8">
            {hero.openToWork
              ? hero.availability || "I'm open to new opportunities — let's talk."
              : "Have a project in mind? I'd love to hear about it."}
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{
              background: "var(--pf-accent-fg)",
              color: "var(--pf-accent)",
              borderRadius: "var(--pf-radius)",
              boxShadow: "0 12px 32px -8px rgba(0,0,0,0.35)",
            }}
          >
            <Mail className="h-4 w-4" /> {contact.email} <ArrowRight className="h-4 w-4" />
          </a>

          {Object.keys(contact.socials).length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-7">
              {Object.entries(contact.socials).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platform}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-xl transition-colors"
                  style={{ background: "rgba(255,255,255,0.16)", color: "var(--pf-accent-fg)" }}
                >
                  {getSocialIcon(platform)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
