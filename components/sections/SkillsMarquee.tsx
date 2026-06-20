import { PortfolioData } from "@/types/portfolio";

interface Props { data: PortfolioData }

// Pure-CSS infinite marquee (compositor-only transform) — no JS, no hydration.
function Row({ items, reverse, duration }: { items: string[]; reverse?: boolean; duration: string }) {
  if (items.length === 0) return null;
  return (
    <div className={`marquee py-1.5 ${reverse ? "marquee-reverse" : ""}`}>
      <div className="marquee-track" style={{ animationDuration: duration }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-3" aria-hidden={copy === 1}>
            {items.map((s) => (
              <span
                key={`${copy}-${s}`}
                className="shrink-0 text-sm font-medium px-4 py-2 whitespace-nowrap"
                style={{
                  background: "var(--pf-badge-bg)",
                  color: "var(--pf-badge-fg)",
                  border: "1px solid var(--pf-badge-border)",
                  borderRadius: "999px",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsMarquee({ data }: Props) {
  const skills = data.skills.categories.flatMap((c) => c.items);
  const half = Math.ceil(skills.length / 2);
  const top = skills.slice(0, half);
  const bottom = skills.slice(half);

  return (
    <section className="py-16 overflow-hidden">
      <h2 className="text-2xl font-bold mb-8 px-6 max-w-5xl mx-auto" style={{ color: "var(--pf-fg)" }}>Skills</h2>
      <div className="space-y-2">
        <Row items={top} duration="36s" />
        <Row items={bottom.length ? bottom : top} reverse duration="44s" />
      </div>
    </section>
  );
}
