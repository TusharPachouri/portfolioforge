import { RawUserDetails, PortfolioData } from "@/types/portfolio";

/**
 * Pure deterministic formatter — no AI, always succeeds.
 * Used when Gemini fails or quota is exceeded.
 */
export function fallbackFormat(raw: RawUserDetails): PortfolioData {
  // Group skills into buckets heuristically
  const skillCategories = groupSkills(raw.skills);

  const socials: Record<string, string> = {};
  if (raw.socials.github) socials["GitHub"] = raw.socials.github;
  if (raw.socials.linkedin) socials["LinkedIn"] = raw.socials.linkedin;
  if (raw.socials.twitter) socials["Twitter"] = raw.socials.twitter;
  if (raw.socials.website) socials["Website"] = raw.socials.website;

  const email = raw.socials.email || "";

  return {
    hero: {
      name: raw.name,
      tagline: raw.tagline,
      avatarUrl: raw.avatarUrl || "",
      location: raw.location,
      openToWork: raw.openToWork,
      availability: raw.availability || (raw.openToWork ? "Open to new opportunities" : ""),
      ctaPrimary: { label: "Get in touch", href: email ? `mailto:${email}` : "#contact" },
      ctaSecondary: { label: "View projects", href: "#projects" },
    },
    about: {
      paragraphs: raw.bio ? raw.bio.split("\n\n").filter(Boolean) : [raw.bio],
      highlights: [],
    },
    skills: {
      categories: skillCategories,
    },
    projects: raw.projects.map((p) => ({
      name: p.name,
      description: p.description,
      techStack: p.techStack,
      repoUrl: p.repoUrl,
      liveUrl: p.liveUrl,
      featured: p.featured,
      role: "Developer",
    })),
    experience: raw.experience.map((e) => ({
      company: e.company,
      role: e.role,
      period: e.period,
      description: e.description,
    })),
    education: raw.education.map((e) => ({
      school: e.school,
      degree: e.degree,
      period: e.period,
      notes: e.notes,
    })),
    contact: { email, socials },
    meta: {
      seoTitle: `${raw.name} — ${raw.tagline}`.slice(0, 60),
      seoDescription: raw.bio.slice(0, 160),
      keywords: raw.skills.slice(0, 10),
    },
  };
}

function groupSkills(skills: string[]): PortfolioData["skills"]["categories"] {
  const languages = ["javascript", "typescript", "python", "go", "rust", "java", "c#", "c++", "ruby", "php", "swift", "kotlin"];
  const frontend = ["react", "next.js", "vue", "angular", "svelte", "html", "css", "tailwind", "sass", "webpack", "vite"];
  const backend = ["node.js", "express", "fastapi", "django", "rails", "spring", "graphql", "rest", "grpc"];
  const database = ["postgresql", "mysql", "mongodb", "redis", "sqlite", "prisma", "supabase", "firebase"];
  const devops = ["docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "github actions", "terraform", "nginx"];

  const buckets: Record<string, string[]> = {
    Languages: [],
    Frontend: [],
    Backend: [],
    Database: [],
    "DevOps & Cloud": [],
    Other: [],
  };

  for (const skill of skills) {
    const s = skill.toLowerCase();
    if (languages.some((l) => s.includes(l))) buckets["Languages"].push(skill);
    else if (frontend.some((f) => s.includes(f))) buckets["Frontend"].push(skill);
    else if (backend.some((b) => s.includes(b))) buckets["Backend"].push(skill);
    else if (database.some((d) => s.includes(d))) buckets["Database"].push(skill);
    else if (devops.some((d) => s.includes(d))) buckets["DevOps & Cloud"].push(skill);
    else buckets["Other"].push(skill);
  }

  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([name, items]) => ({ name, items }));
}
