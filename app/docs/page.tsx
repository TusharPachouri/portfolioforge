import Navbar from "@/components/library/Navbar";
import Link from "next/link";
import { BookOpen, Layers, Sparkles, Eye, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Docs — PortfolioForge",
  description: "Documentation for PortfolioForge.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16 flex-1">
        <div className="mb-10">
          <div className="h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="h-5 w-5 text-zinc-600" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-3">Documentation</h1>
          <p className="text-zinc-500">Everything you need to get started with PortfolioForge.</p>
        </div>

        <div className="space-y-8">
          {[
            {
              icon: <Layers className="h-5 w-5" />,
              title: "1. Browse the Component Library",
              desc: "Head to /components to explore all available portfolio sections and UI primitives. Filter by category (Sections, Primitives), tier (Free, Pro), or search by name.",
              link: "/components",
              linkLabel: "Browse Library →",
            },
            {
              icon: <Sparkles className="h-5 w-5" />,
              title: "2. Add components to your portfolio",
              desc: "Click the + button on any component card to add it to your portfolio builder. The selection is saved automatically in localStorage. Your count appears in the navbar.",
              link: "/components",
              linkLabel: "Start building →",
            },
            {
              icon: <Eye className="h-5 w-5" />,
              title: "3. Preview your portfolio",
              desc: "Visit /preview to see all your selected components assembled in order. Each section renders with demo data for now — Phase 2 will let you fill in your real details.",
              link: "/preview",
              linkLabel: "Go to Preview →",
            },
          ].map((item) => (
            <div key={item.title} className="border border-zinc-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-600">
                  {item.icon}
                </div>
                <h2 className="font-semibold text-zinc-900">{item.title}</h2>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">{item.desc}</p>
              <Link href={item.link} className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">
                {item.linkLabel} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-zinc-50 border border-zinc-100 rounded-xl p-6">
          <h2 className="font-semibold text-zinc-900 mb-2">Coming in Phase 2</h2>
          <ul className="text-sm text-zinc-500 space-y-1.5 list-disc list-inside">
            <li>Fill-in-your-details form</li>
            <li>Gemini AI data structuring pipeline</li>
            <li>Live preview with your real data</li>
            <li>Component code export</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
