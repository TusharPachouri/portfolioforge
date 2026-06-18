import { PortfolioData } from "@/types/portfolio";
import { ExternalLink, Code, Star } from "lucide-react";

interface Props { data: PortfolioData }

export default function ProjectsShowcase({ data }: Props) {
  const projects = data.projects;
  if (projects.length === 0) return null;

  // Lead with a featured project, then the rest
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p !== featured);

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--pf-fg)" }}>Projects</h2>

      {/* Featured */}
      <div
        className="pf-glass overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 mb-5"
        style={{
          background: "var(--pf-card-bg)",
          border: "1px solid var(--pf-card-border)",
          borderRadius: "var(--pf-radius)",
        }}
      >
        <div
          className="min-h-[200px] flex items-center justify-center"
          style={{ background: featured.imageUrl ? undefined : "color-mix(in srgb, var(--pf-accent) 12%, transparent)" }}
        >
          {featured.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={featured.imageUrl} alt={featured.name} className="h-full w-full object-cover" />
          ) : (
            <Star className="h-10 w-10" style={{ color: "var(--pf-accent)" }} />
          )}
        </div>
        <div className="p-6 flex flex-col gap-3">
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold w-fit px-2 py-0.5 rounded-full"
            style={{
              background: "color-mix(in srgb, var(--pf-accent) 12%, transparent)",
              color: "var(--pf-accent)",
            }}
          >
            <Star className="h-3 w-3" /> Featured
          </span>
          <h3 className="text-xl font-bold" style={{ color: "var(--pf-fg)" }}>{featured.name}</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--pf-muted)" }}>{featured.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {featured.techStack.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5" style={{
                background: "var(--pf-badge-bg)", color: "var(--pf-badge-fg)",
                border: "1px solid var(--pf-badge-border)", borderRadius: "calc(var(--pf-radius) * 0.4)",
              }}>{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-auto pt-2">
            {featured.liveUrl && (
              <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--pf-accent)" }}>
                <ExternalLink className="h-4 w-4" /> Live
              </a>
            )}
            {featured.repoUrl && (
              <a href={featured.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm" style={{ color: "var(--pf-muted)" }}>
                <Code className="h-4 w-4" /> Code
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Rest */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {rest.map((project) => (
            <div key={project.name} className="pf-glass p-5 shadow-sm flex flex-col gap-2.5 overflow-hidden" style={{
              background: "var(--pf-card-bg)", border: "1px solid var(--pf-card-border)", borderRadius: "var(--pf-radius)",
            }}>
              <h3 className="font-semibold" style={{ color: "var(--pf-fg)" }}>{project.name}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--pf-muted)" }}>{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.techStack.slice(0, 4).map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5" style={{
                    background: "var(--pf-badge-bg)", color: "var(--pf-badge-fg)",
                    border: "1px solid var(--pf-badge-border)", borderRadius: "calc(var(--pf-radius) * 0.4)",
                  }}>{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-1">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--pf-muted)" }}>
                    <ExternalLink className="h-3.5 w-3.5" /> Live
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--pf-muted)" }}>
                    <Code className="h-3.5 w-3.5" /> Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
