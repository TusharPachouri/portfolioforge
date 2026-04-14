import { PortfolioData } from "@/types/portfolio";

interface Props { data: PortfolioData }

const DEMO_TESTIMONIALS = [
  { name: "Sarah Chen", role: "Engineering Manager at Google", text: "One of the most talented engineers I've worked with. Exceptional attention to detail and always delivers on time." },
  { name: "Mark Williams", role: "CTO at StartupXYZ", text: "Transformed our entire frontend architecture. The codebase went from a mess to a joy to work in." },
  { name: "Priya Patel", role: "Senior Developer at Stripe", text: "Outstanding collaboration skills and deep technical knowledge. A true team player." },
];

export default function TestimonialsGrid({ data: _data }: Props) {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--pf-fg)' }}>What People Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DEMO_TESTIMONIALS.map((t) => (
          <div key={t.name} className="pf-glass p-5 shadow-sm" style={{
            background: 'var(--pf-card-bg)',
            border: '1px solid var(--pf-card-border)',
            borderRadius: 'var(--pf-radius)',
          }}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--pf-muted)' }}>&ldquo;{t.text}&rdquo;</p>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--pf-fg)' }}>{t.name}</p>
              <p className="text-xs" style={{ color: 'var(--pf-muted)' }}>{t.role}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs mt-4 text-center" style={{ color: 'var(--pf-muted)' }}>Pro — connect real testimonials via Gemini AI</p>
    </section>
  );
}
