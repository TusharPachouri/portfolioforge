import { PortfolioData } from "@/types/portfolio";

interface Props { data: PortfolioData }

export default function SkillsTags({ data }: Props) {
  const allSkills = data.skills.categories.flatMap((c) => c.items);
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--pf-fg)' }}>Skills &amp; Technologies</h2>
      <div className="flex flex-wrap gap-2.5">
        {allSkills.map((skill) => (
          <span key={skill} className="text-sm px-3 py-1.5 rounded-full font-medium" style={{
            background: 'var(--pf-primary-btn-bg)',
            color: 'var(--pf-primary-btn-fg)',
          }}>
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
