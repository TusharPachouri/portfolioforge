import { PortfolioData } from "@/types/portfolio";

interface Props { data: PortfolioData }

export default function SkillsCards({ data }: Props) {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--pf-fg)" }}>Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.skills.categories.map((cat, i) => (
          <div
            key={i}
            className="pf-glass p-5 shadow-sm flex flex-col gap-3"
            style={{
              background: "var(--pf-card-bg)",
              border: "1px solid var(--pf-card-border)",
              borderRadius: "var(--pf-radius)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-1.5 rounded-full" style={{ background: "var(--pf-accent)" }} />
              <h3 className="font-semibold text-sm" style={{ color: "var(--pf-fg)" }}>{cat.name}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2.5 py-1"
                  style={{
                    background: "var(--pf-badge-bg)",
                    color: "var(--pf-badge-fg)",
                    border: "1px solid var(--pf-badge-border)",
                    borderRadius: "calc(var(--pf-radius) * 0.5)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
