import { PortfolioData } from "@/types/portfolio";
import { ExternalLink, Code } from "lucide-react";

interface Props { data: PortfolioData }

export default function ProjectsGrid({ data }: Props) {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--pf-fg)' }}>Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {data.projects.map((project) => (
          <div key={project.name} className="pf-glass shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow overflow-hidden" style={{
            background: 'var(--pf-card-bg)',
            border: '1px solid var(--pf-card-border)',
            borderRadius: 'var(--pf-radius)',
          }}>
            {project.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.imageUrl} alt={project.name} loading="lazy" className="w-full aspect-video object-cover" />
            )}
            <div className={project.imageUrl ? "px-5 pb-5 flex flex-col gap-3 flex-1" : "p-5 flex flex-col gap-3 flex-1"}>
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold" style={{ color: 'var(--pf-fg)' }}>{project.name}</h3>
                {project.featured && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap" style={{
                    background: 'color-mix(in srgb, var(--pf-accent) 12%, transparent)',
                    color: 'var(--pf-accent)',
                    border: '1px solid color-mix(in srgb, var(--pf-accent) 25%, transparent)',
                  }}>Featured</span>
                )}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--pf-muted)' }}>{project.description}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {project.techStack.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5" style={{
                  background: 'var(--pf-badge-bg)',
                  color: 'var(--pf-muted)',
                  border: '1px solid var(--pf-badge-border)',
                  borderRadius: 'calc(var(--pf-radius) * 0.3)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-1">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs transition-colors"
                  style={{ color: 'var(--pf-muted)' }}>
                  <ExternalLink className="h-3.5 w-3.5" /> Live
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs transition-colors"
                  style={{ color: 'var(--pf-muted)' }}>
                  <Code className="h-3.5 w-3.5" /> Code
                </a>
              )}
            </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
