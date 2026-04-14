import { PortfolioData } from "@/types/portfolio";

interface Props { data: PortfolioData }

// Derive stats from portfolio data
function deriveStats(data: PortfolioData) {
  return [
    { label: "Years Experience", value: `${data.experience.length > 0 ? data.experience.length + "+" : "—"}` },
    { label: "Projects", value: `${data.projects.length}+` },
    { label: "Skills", value: `${data.skills.categories.flatMap(c => c.items).length}+` },
    { label: "Open to Work", value: data.hero.openToWork ? "Yes" : "Not now" },
  ];
}

export default function StatsRow({ data }: Props) {
  const stats = deriveStats(data);
  return (
    <section className="py-12 px-6" style={{
      background: 'var(--pf-secondary-bg)',
      borderTop: '1px solid var(--pf-secondary-border)',
      borderBottom: '1px solid var(--pf-secondary-border)',
    }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold" style={{ color: 'var(--pf-fg)' }}>{stat.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--pf-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
