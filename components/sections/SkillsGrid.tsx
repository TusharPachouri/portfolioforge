import { PortfolioData } from "@/types/portfolio";

interface Props { data: PortfolioData }

export default function SkillsGrid({ data }: Props) {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--pf-fg)' }}>Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.skills.categories.map(({ name, items }) => (
          <div key={name} className="pf-glass p-5 shadow-sm" style={{
            background: 'var(--pf-card-bg)',
            border: '1px solid var(--pf-card-border)',
            borderRadius: 'var(--pf-radius)',
          }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--pf-muted)' }}>{name}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span key={skill} className="text-sm px-2.5 py-1" style={{
                  background: 'var(--pf-badge-bg)',
                  color: 'var(--pf-badge-fg)',
                  border: '1px solid var(--pf-badge-border)',
                  borderRadius: 'calc(var(--pf-radius) * 0.5)',
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
