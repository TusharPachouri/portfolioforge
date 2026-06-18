import { PortfolioData } from "@/types/portfolio";
import { ExternalLink, Code } from "lucide-react";

interface Props { data: PortfolioData }

export default function ProjectsList({ data }: Props) {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--pf-fg)' }}>Projects</h2>
      <div className="divide-y" style={{ borderColor: 'var(--pf-card-border)' }}>
        {data.projects.map((project) => (
          <div key={project.name} className="py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            {project.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.imageUrl} alt={project.name} loading="lazy" className="w-full sm:w-32 sm:h-20 object-cover shrink-0" style={{ borderRadius: 'calc(var(--pf-radius) * 0.6)' }} />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold" style={{ color: 'var(--pf-fg)' }}>{project.name}</h3>
                {project.techStack.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs px-1.5 py-0.5" style={{
                    color: 'var(--pf-muted)',
                    border: '1px solid var(--pf-badge-border)',
                    borderRadius: 'calc(var(--pf-radius) * 0.3)',
                  }}>{tag}</span>
                ))}
              </div>
              <p className="text-sm" style={{ color: 'var(--pf-muted)' }}>{project.description}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm transition-colors"
                  style={{ color: 'var(--pf-muted)' }}>
                  <ExternalLink className="h-4 w-4" /> Live
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm transition-colors"
                  style={{ color: 'var(--pf-muted)' }}>
                  <Code className="h-4 w-4" /> Code
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
