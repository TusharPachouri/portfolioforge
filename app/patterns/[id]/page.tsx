import { notFound } from "next/navigation";
import { getPatternById, patterns } from "@/lib/patterns/registry";
import { getVantaPatternById, vantaPatterns } from "@/lib/patterns/vantaRegistry";
import Navbar from "@/components/library/Navbar";
import PatternPreviewClient from "./PatternPreviewClient";
import VantaPreviewClient from "./VantaPreviewClient";

export function generateStaticParams() {
  return [
    ...patterns.map((p) => ({ id: p.id })),
    ...vantaPatterns.map((p) => ({ id: p.id })),
  ];
}

export default async function PatternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Check vanta registry first
  const vantaPattern = getVantaPatternById(id);
  if (vantaPattern) {
    const { toCode, ...serializablePattern } = vantaPattern;
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <VantaPreviewClient pattern={serializablePattern} code={toCode()} />
      </div>
    );
  }

  // Fall back to CSS pattern registry
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
