import { PortfolioData } from "@/types/portfolio";
import { Sparkles } from "lucide-react";

interface Props { data: PortfolioData }

export default function AboutHighlights({ data }: Props) {
  const { about } = data;
  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--pf-fg)" }}>About</h2>

      <div className="space-y-4 mb-8">
        {about.paragraphs.map((p, i) => (
          <p key={i} className="text-base leading-relaxed" style={{ color: "var(--pf-muted)" }}>{p}</p>
        ))}
      </div>

      {about.highlights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {about.highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 pf-glass shadow-sm"
              style={{
                background: "var(--pf-card-bg)",
                border: "1px solid var(--pf-card-border)",
                borderRadius: "var(--pf-radius)",
              }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "color-mix(in srgb, var(--pf-accent) 14%, transparent)",
                  color: "var(--pf-accent)",
                }}
              >
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium leading-snug pt-1.5" style={{ color: "var(--pf-fg)" }}>{h}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
