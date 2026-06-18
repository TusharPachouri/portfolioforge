import { PortfolioData } from "@/types/portfolio";

interface Props { data: PortfolioData }

const DEMO_COLORS = ["bg-violet-100", "bg-indigo-100", "bg-pink-100", "bg-sky-100", "bg-emerald-100", "bg-amber-100"];

export default function GalleryMasonry({ data }: Props) {
  const images = (data.gallery ?? []).filter((g) => g.imageUrl);

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--pf-fg)" }}>Gallery</h2>

      {images.length > 0 ? (
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <figure key={i} className="break-inside-avoid overflow-hidden" style={{ borderRadius: "var(--pf-radius)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.imageUrl}
                alt={img.caption || `Gallery image ${i + 1}`}
                loading="lazy"
                className="w-full h-auto block"
                style={{ borderRadius: "var(--pf-radius)" }}
              />
              {img.caption && (
                <figcaption className="text-xs mt-1.5 px-0.5" style={{ color: "var(--pf-muted)" }}>
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : (
        <>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {DEMO_COLORS.map((color, i) => (
              <div key={i} className={`${color} w-full break-inside-avoid`} style={{
                height: `${120 + (i % 3) * 60}px`,
                borderRadius: "var(--pf-radius)",
              }} />
            ))}
          </div>
          <p className="text-xs mt-4 text-center" style={{ color: "var(--pf-muted)" }}>
            Add images in the editor to fill your gallery
          </p>
        </>
      )}
    </section>
  );
}
