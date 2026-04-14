import { registry, getComponentById } from "@/lib/components/registry";
import Navbar from "@/components/library/Navbar";
import ComponentDetailClient from "./ComponentDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return registry.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const component = getComponentById(slug);
  if (!component) return { title: "Not Found" };
  return {
    title: `${component.name} — PortfolioForge`,
    description: component.description,
  };
}

export default async function ComponentDetailPage({ params }: Props) {
  const { slug } = await params;
  const component = getComponentById(slug);
  if (!component) notFound();

  // Related: same subcategory, different id
  const related = registry
    .filter((c) => c.subcategory === component.subcategory && c.id !== component.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <ComponentDetailClient component={component} related={related} />
    </div>
  );
}
