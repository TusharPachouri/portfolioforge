import Link from "next/link";
import { patterns } from "@/lib/patterns/registry";

interface Swatch {
  id: string;
  name: string;
  style: React.CSSProperties;
}

function MarqueeRow({ swatches, reverse, duration }: { swatches: Swatch[]; reverse?: boolean; duration: string }) {
  return (
    <div className={`marquee py-1.5 ${reverse ? "marquee-reverse" : ""}`}>
      <div className="marquee-track" style={{ animationDuration: duration }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-3" aria-hidden={copy === 1}>
            {swatches.map((s) => (
              <Link
                key={`${copy}-${s.id}`}
                href={`/patterns/${s.id}`}
                tabIndex={copy === 1 ? -1 : undefined}
                className="flex items-center gap-2 shrink-0 bg-white border border-zinc-200 rounded-full pl-1.5 pr-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm hover:text-zinc-900 hover:border-violet-200 hover:shadow transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                <span
                  className="h-6 w-6 rounded-full border border-zinc-100"
                  style={s.style}
                  aria-hidden="true"
                />
                {s.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Two counter-scrolling strips of real pattern swatches from the registry.
 * Pure CSS animation (compositor-only transform), edge-masked, pauses on
 * hover and keyboard focus. Duplicate copies are aria-hidden and untabbable.
 */
export default function PatternMarquee() {
  const swatches: Swatch[] = patterns.map((p) => ({
    id: p.id,
    name: p.name,
    style: { ...p.render(p.defaults), opacity: 1 } as React.CSSProperties,
  }));
  const half = Math.ceil(swatches.length / 2);

  return (
    <div role="region" aria-label="Pattern library highlights">
      <MarqueeRow swatches={swatches.slice(0, half)} duration="44s" />
      <MarqueeRow swatches={swatches.slice(half)} reverse duration="56s" />
    </div>
  );
}
