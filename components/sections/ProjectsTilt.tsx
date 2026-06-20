"use client";

import { PortfolioData } from "@/types/portfolio";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { ExternalLink, Code } from "lucide-react";

interface Props { data: PortfolioData }
type Project = PortfolioData["projects"][number];

function TiltCard({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 220, damping: 22, mass: 0.4 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [9, -9]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), spring);

  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={reset}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      whileHover={reduce ? undefined : { scale: 1.02 }}
      className="shadow-sm flex flex-col overflow-hidden h-full"
    >
      <div style={{ background: "var(--pf-card-bg)", border: "1px solid var(--pf-card-border)", borderRadius: "var(--pf-radius)" }} className="pf-glass flex flex-col h-full overflow-hidden">
        {project.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt={project.name} loading="lazy" className="w-full aspect-video object-cover" />
        )}
        <div className="p-5 flex flex-col gap-3 flex-1" style={{ transform: reduce ? undefined : "translateZ(40px)" }}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold" style={{ color: "var(--pf-fg)" }}>{project.name}</h3>
            {project.featured && (
              <span className="text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap" style={{
                background: "color-mix(in srgb, var(--pf-accent) 12%, transparent)",
                color: "var(--pf-accent)",
                border: "1px solid color-mix(in srgb, var(--pf-accent) 25%, transparent)",
              }}>Featured</span>
            )}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--pf-muted)" }}>{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.techStack.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5" style={{
                background: "var(--pf-badge-bg)", color: "var(--pf-muted)",
                border: "1px solid var(--pf-badge-border)", borderRadius: "calc(var(--pf-radius) * 0.3)",
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
      </div>
    </motion.div>
  );
}

export default function ProjectsTilt({ data }: Props) {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--pf-fg)" }}>Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {data.projects.map((project) => (
          <TiltCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
