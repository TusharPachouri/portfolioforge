import { PortfolioData } from "@/types/portfolio";

interface Props { data: PortfolioData }

const DEMO_COLORS = ["bg-violet-100","bg-indigo-100","bg-pink-100","bg-sky-100","bg-emerald-100","bg-amber-100"];

export default function GalleryMasonry({ data: _data }: Props) {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--pf-fg)' }}>Gallery</h2>
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {DEMO_COLORS.map((color, i) => (
          <div key={i} className={`${color} w-full break-inside-avoid`} style={{
            height: `${120 + (i % 3) * 60}px`,
            borderRadius: 'var(--pf-radius)',
          }} />
        ))}
      </div>
      <p className="text-xs mt-4 text-center" style={{ color: 'var(--pf-muted)' }}>Pro — upload real images for your gallery</p>
    </section>
  );
}
