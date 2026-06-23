export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  componentIds: string[];
  themeId: string;
  patternId?: string;
  tier: "free" | "pro";
  tags: string[];
  accentColor: string;
  previewBg: string;
}

export const templates: PortfolioTemplate[] = [
  {
    id: "midnight-pro",
    name: "Midnight Pro",
    description: "Dark, focused layout for senior developers. Spotlight hero, animated skills marquee, tilt-card projects, and a clean timeline.",
    componentIds: [
      "hero-spotlight",
      "stats-row",
      "skills-marquee",
      "projects-tilt",
      "experience-reveal",
      "education-cards",
      "contact-simple",
      "footer-minimal",
    ],
    themeId: "dark-tech",
    tier: "free",
    tags: ["dark", "developer", "professional"],
    accentColor: "#a78bfa",
    previewBg: "linear-gradient(145deg,#0d1117 0%,#161b22 60%,#0d1117 100%)",
  },
  {
    id: "clean-minimal",
    name: "Clean Minimal",
    description: "White-space first. Perfect for designers and writers who let their work speak.",
    componentIds: [
      "hero-centered",
      "about-highlights",
      "skills-cards",
      "projects-showcase",
      "experience-timeline",
      "contact-simple",
      "footer-minimal",
    ],
    themeId: "minimalist",
    tier: "free",
    tags: ["light", "minimal", "designer"],
    accentColor: "#6d28d9",
    previewBg: "linear-gradient(145deg,#ffffff 0%,#f9fafb 100%)",
  },
  {
    id: "gradient-pop",
    name: "Gradient Pop",
    description: "Bold gradients and colourful cards for creative engineers who want to stand out.",
    componentIds: [
      "hero-gradient",
      "skills-tags",
      "projects-grid",
      "experience-cards",
      "contact-banner",
      "footer-minimal",
    ],
    themeId: "glassmorphism",
    tier: "free",
    tags: ["colorful", "creative", "modern"],
    accentColor: "#f59e0b",
    previewBg: "linear-gradient(145deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)",
  },
  {
    id: "premium-night",
    name: "Premium Night",
    description: "Fully custom single-page portfolio with active scroll-spy navbar, Framer Motion reveals, floating gradient orbs, and glassmorphism cards. No component assembly required.",
    componentIds: ["template-premium-night"],
    themeId: "dark-tech",
    tier: "free",
    tags: ["dark", "premium", "animated"],
    accentColor: "#a855f7",
    previewBg: "linear-gradient(145deg,#07091a 0%,#120b2e 60%,#07091a 100%)",
  },
];
