import { PortfolioData } from "@/types/portfolio";
import { Briefcase } from "lucide-react";

interface Props { data: PortfolioData }

export default function ExperienceCards({ data }: Props) {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--pf-fg)" }}>Experience</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.experience.map((exp, i) => (
          <div
            key={i}
            className="pf-glass p-5 shadow-sm flex flex-col gap-3"
            style={{
              background: "var(--pf-card-bg)",
              border: "1px solid var(--pf-card-border)",
              borderRadius: "var(--pf-radius)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "color-mix(in srgb, var(--pf-accent) 14%, transparent)",
                  color: "var(--pf-accent)",
                }}
              >
                <Briefcase className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium whitespace-nowrap pt-1" style={{ color: "var(--pf-muted)" }}>{exp.period}</span>
            </div>
            <div>
              <h3 className="font-semibold leading-tight" style={{ color: "var(--pf-fg)" }}>{exp.role}</h3>
              <p className="text-sm" style={{ color: "var(--pf-accent)" }}>{exp.company}</p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--pf-muted)" }}>{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
