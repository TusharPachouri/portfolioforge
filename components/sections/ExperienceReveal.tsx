"use client";

import { PortfolioData } from "@/types/portfolio";
import { motion, useReducedMotion } from "framer-motion";

interface Props { data: PortfolioData }

export default function ExperienceReveal({ data }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="py-16 px-6 max-w-3xl mx-auto">
      <motion.h2
        className="text-2xl font-bold mb-8"
        style={{ color: "var(--pf-fg)" }}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Experience
      </motion.h2>

      <div className="relative">
        {/* Self-drawing timeline line */}
        <motion.div
          aria-hidden="true"
          className="absolute left-4 top-1 bottom-1 w-px origin-top"
          style={{ background: "var(--pf-card-border)" }}
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="space-y-6">
          {data.experience.map((exp, i) => (
            <motion.div
              key={i}
              className="relative pl-12"
              initial={reduce ? false : { opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="absolute left-[13px] top-1.5 h-2.5 w-2.5 rounded-full ring-4"
                style={{ background: "var(--pf-accent)", "--tw-ring-color": "var(--pf-bg)" } as React.CSSProperties}
              />
              <div className="pf-glass p-5 shadow-sm" style={{
                background: "var(--pf-card-bg)",
                border: "1px solid var(--pf-card-border)",
                borderRadius: "var(--pf-radius)",
              }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--pf-fg)" }}>{exp.role}</h3>
                    <p className="text-sm" style={{ color: "var(--pf-accent)" }}>{exp.company}</p>
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: "var(--pf-muted)" }}>{exp.period}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--pf-muted)" }}>{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
