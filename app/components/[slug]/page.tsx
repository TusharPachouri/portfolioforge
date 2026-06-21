import fs from "fs";
import path from "path";
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

function idToFileName(id: string): string {
  return id
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

export default async function ComponentDetailPage({ params }: Props) {
  const { slug } = await params;
  const component = getComponentById(slug);
  if (!component) notFound();

  // Related: same subcategory, different id
  const related = registry
    .filter((c) => c.subcategory === component.subcategory && c.id !== component.id)
    .slice(0, 3);

  // Read source file
  const fileName = idToFileName(component.id);
  const filePath = path.join(process.cwd(), "components", "sections", `${fileName}.tsx`);
  let sourceCode = "// Source file not available for this component yet.";
  try {
    if (fs.existsSync(filePath)) {
      sourceCode = fs.readFileSync(filePath, "utf-8");
    }
  } catch {
    // leave default message
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <ComponentDetailClient
        component={component}
        related={related}
        sourceCode={sourceCode}
        fileName={fileName}
      />
    </div>
  );
}
