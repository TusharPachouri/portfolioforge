import { PortfolioData } from "@/types/portfolio";

export const demoData: PortfolioData = {
  hero: {
    name: "Alex Rivera",
    tagline: "I build fast, beautiful products that people love to use.",
    avatarUrl: "",
    location: "San Francisco, CA",
    openToWork: true,
    availability: "Available for new opportunities",
    ctaPrimary: { label: "Get in touch", href: "mailto:alex@example.com" },
    ctaSecondary: { label: "View projects", href: "#projects" },
  },
  about: {
    paragraphs: [
      "I'm a full-stack engineer with 5+ years of experience building web applications. I care deeply about performance, accessibility, and developer experience.",
      "Currently open to new opportunities — remote-friendly, product-focused teams preferred.",
    ],
    highlights: [
      "5+ years building production web apps",
      "Led teams of up to 6 engineers",
      "Open-source contributor",
      "Ex-Stripe, ex-Vercel",
    ],
  },
  skills: {
    categories: [
      { name: "Languages", items: ["TypeScript", "Python", "Go"] },
      { name: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
      { name: "Backend", items: ["Node.js", "PostgreSQL", "Redis"] },
      { name: "DevOps", items: ["Docker", "AWS", "GitHub Actions"] },
    ],
  },
  projects: [
    {
      name: "PortfolioForge",
      description: "A component library for building stunning developer portfolios. Browse, customize, and publish in minutes.",
      techStack: ["Next.js", "TypeScript", "Tailwind"],
      liveUrl: "https://portfolioforge.dev",
      repoUrl: "https://github.com/alex/portfolioforge",
      featured: true,
      role: "Solo developer",
    },
    {
      name: "TaskFlow",
      description: "Real-time collaborative task management with drag-and-drop boards, team presence, and smart prioritization.",
      techStack: ["React", "Node.js", "Socket.io"],
      liveUrl: "https://taskflow.app",
      repoUrl: "https://github.com/alex/taskflow",
      featured: true,
      role: "Frontend lead",
    },
    {
      name: "DataLens",
      description: "Analytics dashboard that turns raw CSV/JSON data into interactive charts with one click.",
      techStack: ["Python", "FastAPI", "React", "D3.js"],
      repoUrl: "https://github.com/alex/datalens",
      liveUrl: "",
      featured: false,
      role: "Solo developer",
    },
  ],
  experience: [
    {
      company: "Stripe",
      role: "Senior Software Engineer",
      period: "Mar 2022 – Present",
      description: "Lead development of the payments SDK. Improved checkout conversion by 12% through performance optimizations.",
    },
    {
      company: "Vercel",
      role: "Software Engineer",
      period: "Jan 2020 – Feb 2022",
      description: "Built developer tooling for the Next.js ecosystem. Contributed to the open-source runtime.",
    },
    {
      company: "StartupXYZ",
      role: "Junior Developer",
      period: "Jun 2019 – Dec 2019",
      description: "Full-stack development with React and Ruby on Rails.",
    },
  ],
  education: [
    {
      school: "UC Berkeley",
      degree: "B.S. Computer Science",
      period: "Sep 2015 – May 2019",
      notes: "Focus on distributed systems and human-computer interaction.",
    },
  ],
  contact: {
    email: "alex@example.com",
    socials: {
      GitHub: "https://github.com/alex",
      LinkedIn: "https://linkedin.com/in/alex",
      Twitter: "https://twitter.com/alex",
    },
  },
  meta: {
    seoTitle: "Alex Rivera — Full-Stack Engineer",
    seoDescription: "Full-stack engineer specializing in React, Next.js, and TypeScript. 5+ years building fast, beautiful web products.",
    keywords: ["full-stack engineer", "React", "Next.js", "TypeScript", "San Francisco"],
  },
};
