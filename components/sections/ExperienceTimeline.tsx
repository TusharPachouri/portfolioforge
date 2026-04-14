import { PortfolioData } from "@/types/portfolio";

interface Props { data: PortfolioData }

export default function ExperienceTimeline({ data }: Props) {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--pf-fg)' }}>Experience</h2>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'var(--pf-card-border)' }} />
        <div className="space-y-8">
          {data.experience.map((exp, i) => (
            <div key={i} className="relative pl-12">
              <div className="absolute left-[13px] top-1.5 h-2.5 w-2.5 rounded-full ring-4" style={{
                background: 'var(--pf-accent)',
                '--tw-ring-color': 'var(--pf-bg)',
              } as React.CSSProperties} />
              <div className="pf-glass p-5 shadow-sm" style={{
                background: 'var(--pf-card-bg)',
                border: '1px solid var(--pf-card-border)',
                borderRadius: 'var(--pf-radius)',
              }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--pf-fg)' }}>{exp.role}</h3>
                    <p className="text-sm" style={{ color: 'var(--pf-muted)' }}>{exp.company}</p>
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--pf-muted)' }}>{exp.period}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--pf-muted)' }}>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
