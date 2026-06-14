import { notFound } from "next/navigation";
import { getPatternById, patterns } from "@/lib/patterns/registry";
import Navbar from "@/components/library/Navbar";
import PatternPreviewClient from "./PatternPreviewClient";

export function generateStaticParams() {
  return patterns.map((p) => ({ id: p.id }));
}

export default async function PatternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pattern = getPatternById(id);
  if (!pattern) notFound();

  const previewStyle = pattern.render(pattern.defaults);
  const css = pattern.toCss(pattern.defaults);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PatternPreviewClient
        id={pattern.id}
        name={pattern.name}
        category={pattern.category}
        tags={pattern.tags}
        previewStyle={previewStyle}
        css={css}
        allPatterns={patterns.filter((p) => p.category === pattern.category && p.id !== id).slice(0, 4).map((p) => ({
          id: p.id,
          name: p.name,
          previewStyle: { ...p.render(p.defaults), opacity: 1 },
        }))}
      />
    </div>
  );
}
