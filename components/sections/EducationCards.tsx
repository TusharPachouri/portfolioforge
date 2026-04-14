import { PortfolioData } from "@/types/portfolio";
import { GraduationCap } from "lucide-react";

interface Props { data: PortfolioData }

export default function EducationCards({ data }: Props) {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--pf-fg)' }}>Education</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {data.education.map((edu, i) => (
          <div key={i} className="pf-glass p-5 shadow-sm flex gap-4" style={{
            background: 'var(--pf-card-bg)',
            border: '1px solid var(--pf-card-border)',
            borderRadius: 'var(--pf-radius)',
          }}>
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center" style={{
              background: 'var(--pf-badge-bg)',
              border: '1px solid var(--pf-badge-border)',
              borderRadius: 'calc(var(--pf-radius) * 0.6)',
            }}>
              <GraduationCap className="h-5 w-5" style={{ color: 'var(--pf-muted)' }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--pf-fg)' }}>{edu.degree}</h3>
              <p className="text-sm mb-1" style={{ color: 'var(--pf-muted)' }}>{edu.school}</p>
              <p className="text-xs" style={{ color: 'var(--pf-muted)' }}>{edu.period}</p>
              {edu.notes && <p className="text-sm mt-2" style={{ color: 'var(--pf-muted)' }}>{edu.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
