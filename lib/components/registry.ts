export type ComponentTier = "free" | "pro";
export type ComponentCategory = "section" | "primitive";
export type SectionSubcategory =
  | "Hero"
  | "About"
  | "Skills"
  | "Projects"
  | "Experience"
  | "Education"
  | "Contact"
  | "Footer"
  | "Stats"
  | "Testimonials"
  | "Gallery";
export type PrimitiveSubcategory =
  | "Badge"
  | "Card"
  | "Button"
  | "Timeline"
  | "Avatar"
  | "Tag"
  | "Heading";

export interface ComponentEntry {
  id: string;
  name: string;
  category: ComponentCategory;
  subcategory: SectionSubcategory | PrimitiveSubcategory;
  description: string;
  tags: string[];
  tier: ComponentTier;
  sortOrder: number;
  previewImage?: string;
  variants: number;
  isNew?: boolean;
}

export const registry: ComponentEntry[] = [
  // ── Newest (free) — surfaced at the top of the library ──────────────────────
  {
    id: "hero-gradient",
    name: "Hero — Gradient",
    category: "section",
    subcategory: "Hero",
    description: "Bold hero with a gradient name, accent glow halo and a gradient CTA.",
    tags: ["hero", "gradient", "bold", "premium"],
    tier: "free",
    sortOrder: -6,
    variants: 1,
    isNew: true,
  },
  {
    id: "about-highlights",
    name: "About — Highlights",
    category: "section",
    subcategory: "About",
    description: "Bio paragraphs paired with a grid of highlight cards.",
    tags: ["about", "highlights", "cards", "bio"],
    tier: "free",
    sortOrder: -5,
    variants: 1,
    isNew: true,
  },
  {
    id: "skills-cards",
    name: "Skills — Cards",
    category: "section",
    subcategory: "Skills",
    description: "Skill categories as clean cards with accent headers and chips.",
    tags: ["skills", "cards", "categories", "grid"],
    tier: "free",
    sortOrder: -4,
    variants: 1,
    isNew: true,
  },
  {
    id: "experience-cards",
    name: "Experience — Cards",
    category: "section",
    subcategory: "Experience",
    description: "Work history as a responsive card grid with role, company and period.",
    tags: ["experience", "cards", "grid", "work history"],
    tier: "free",
    sortOrder: -3,
    variants: 1,
    isNew: true,
  },
  {
    id: "projects-showcase",
    name: "Projects — Showcase",
    category: "section",
    subcategory: "Projects",
    description: "A large featured project with image, plus a grid of the rest.",
    tags: ["projects", "showcase", "featured", "image"],
    tier: "free",
    sortOrder: -2,
    variants: 1,
    isNew: true,
  },
  {
    id: "contact-banner",
    name: "Contact — Banner",
    category: "section",
    subcategory: "Contact",
    description: "Bold full-width gradient call-to-action banner with email and socials.",
    tags: ["contact", "banner", "cta", "gradient"],
    tier: "free",
    sortOrder: -1,
    variants: 1,
    isNew: true,
  },

  // ── Sections ──────────────────────────────────────────────────────────────
  {
    id: "hero-centered",
    name: "Hero — Centered",
    category: "section",
    subcategory: "Hero",
    description: "Full-width centered hero with name, title, tagline and CTA buttons.",
    tags: ["hero", "landing", "intro", "centered"],
    tier: "free",
    sortOrder: 1,
    variants: 1,
  },
  {
    id: "hero-split",
    name: "Hero — Split Layout",
    category: "section",
    subcategory: "Hero",
    description: "Two-column hero with text on the left and avatar on the right.",
    tags: ["hero", "split", "avatar", "two-column"],
    tier: "free",
    sortOrder: 2,
    variants: 1,
  },
  {
    id: "hero-minimal",
    name: "Hero — Minimal",
    category: "section",
    subcategory: "Hero",
    description: "Clean minimal hero, just name, title and social links.",
    tags: ["hero", "minimal", "clean"],
    tier: "free",
    sortOrder: 3,
    variants: 1,
  },
  {
    id: "about-card",
    name: "About — Card",
    category: "section",
    subcategory: "About",
    description: "Card-style about section with bio, avatar and quick stats.",
    tags: ["about", "bio", "card"],
    tier: "free",
    sortOrder: 4,
    variants: 1,
  },
  {
    id: "about-split",
    name: "About — Split",
    category: "section",
    subcategory: "About",
    description: "Side-by-side about with photo and bio text.",
    tags: ["about", "split", "photo"],
    tier: "free",
    sortOrder: 5,
    variants: 1,
  },
  {
    id: "skills-grid",
    name: "Skills — Grid",
    category: "section",
    subcategory: "Skills",
    description: "Skills displayed in a responsive icon grid with progress indicators.",
    tags: ["skills", "grid", "tech stack"],
    tier: "free",
    sortOrder: 6,
    variants: 1,
  },
  {
    id: "skills-tags",
    name: "Skills — Tags",
    category: "section",
    subcategory: "Skills",
    description: "Skills shown as pill tags, grouped by category.",
    tags: ["skills", "tags", "pills", "badges"],
    tier: "free",
    sortOrder: 7,
    variants: 1,
  },
  {
    id: "projects-grid",
    name: "Projects — Grid",
    category: "section",
    subcategory: "Projects",
    description: "Project cards in a 2–3 column grid with image, title, tags and links.",
    tags: ["projects", "grid", "cards", "portfolio"],
    tier: "free",
    sortOrder: 8,
    variants: 1,
  },
  {
    id: "projects-list",
    name: "Projects — List",
    category: "section",
    subcategory: "Projects",
    description: "Compact project list with title, short description and links.",
    tags: ["projects", "list", "compact"],
    tier: "free",
    sortOrder: 9,
    variants: 1,
  },
  {
    id: "experience-timeline",
    name: "Experience — Timeline",
    category: "section",
    subcategory: "Experience",
    description: "Vertical timeline showing work history with roles, companies and dates.",
    tags: ["experience", "timeline", "work history"],
    tier: "free",
    sortOrder: 10,
    variants: 1,
  },
  {
    id: "education-cards",
    name: "Education — Cards",
    category: "section",
    subcategory: "Education",
    description: "Education entries as clean cards with degree and institution.",
    tags: ["education", "cards", "degree"],
    tier: "free",
    sortOrder: 11,
    variants: 1,
  },
  {
    id: "contact-simple",
    name: "Contact — Simple",
    category: "section",
    subcategory: "Contact",
    description: "Minimal contact section with email link and social icons.",
    tags: ["contact", "email", "social"],
    tier: "free",
    sortOrder: 12,
    variants: 1,
  },
  {
    id: "footer-minimal",
    name: "Footer — Minimal",
    category: "section",
    subcategory: "Footer",
    description: "Simple footer with name, links and copyright.",
    tags: ["footer", "minimal"],
    tier: "free",
    sortOrder: 13,
    variants: 1,
  },
  {
    id: "stats-row",
    name: "Stats — Row",
    category: "section",
    subcategory: "Stats",
    description: "Horizontal row of key stats or achievements.",
    tags: ["stats", "numbers", "achievements"],
    tier: "free",
    sortOrder: 14,
    variants: 1,
  },
  {
    id: "testimonials-grid",
    name: "Testimonials — Grid",
    category: "section",
    subcategory: "Testimonials",
    description: "Testimonial cards in a grid layout.",
    tags: ["testimonials", "reviews", "social proof"],
    tier: "pro",
    sortOrder: 15,
    variants: 1,
  },
  {
    id: "gallery-masonry",
    name: "Gallery — Masonry",
    category: "section",
    subcategory: "Gallery",
    description: "Masonry-layout image gallery for creative portfolios.",
    tags: ["gallery", "masonry", "images", "creative"],
    tier: "pro",
    sortOrder: 16,
    variants: 1,
  },

  // ── Primitives ─────────────────────────────────────────────────────────────
  {
    id: "skill-badge",
    name: "Skill Badge",
    category: "primitive",
    subcategory: "Badge",
    description: "Compact badge for displaying a single skill or technology.",
    tags: ["badge", "skill", "tag"],
    tier: "free",
    sortOrder: 17,
    variants: 1,
  },
  {
    id: "project-card",
    name: "Project Card",
    category: "primitive",
    subcategory: "Card",
    description: "Individual project card with image, title, description and links.",
    tags: ["card", "project"],
    tier: "free",
    sortOrder: 18,
    variants: 1,
  },
  {
    id: "timeline-item",
    name: "Timeline Item",
    category: "primitive",
    subcategory: "Timeline",
    description: "Single entry in a vertical timeline.",
    tags: ["timeline", "item", "experience"],
    tier: "free",
    sortOrder: 19,
    variants: 1,
  },
  {
    id: "stat-counter",
    name: "Stat Counter",
    category: "primitive",
    subcategory: "Badge",
    description: "A single stat with a label and value.",
    tags: ["stat", "counter", "number"],
    tier: "free",
    sortOrder: 20,
    variants: 1,
  },
  {
    id: "social-link-button",
    name: "Social Link Button",
    category: "primitive",
    subcategory: "Button",
    description: "Icon button linking to a social media profile.",
    tags: ["social", "button", "link"],
    tier: "free",
    sortOrder: 21,
    variants: 1,
  },
  {
    id: "avatar-ring",
    name: "Avatar with Ring",
    category: "primitive",
    subcategory: "Avatar",
    description: "Circular avatar with a decorative gradient ring.",
    tags: ["avatar", "profile", "image"],
    tier: "free",
    sortOrder: 22,
    variants: 1,
  },
  {
    id: "tag-chip",
    name: "Tag Chip",
    category: "primitive",
    subcategory: "Tag",
    description: "Small rounded chip for tags and labels.",
    tags: ["tag", "chip", "label"],
    tier: "free",
    sortOrder: 23,
    variants: 1,
  },
  {
    id: "section-heading",
    name: "Section Heading",
    category: "primitive",
    subcategory: "Heading",
    description: "Styled heading with optional subtitle for sections.",
    tags: ["heading", "title", "section"],
    tier: "free",
    sortOrder: 24,
    variants: 1,
  },
  {
    id: "gradient-button",
    name: "Gradient Button",
    category: "primitive",
    subcategory: "Button",
    description: "Eye-catching gradient CTA button.",
    tags: ["button", "gradient", "cta"],
    tier: "pro",
    sortOrder: 25,
    variants: 1,
  },
  {
    id: "glow-card",
    name: "Glow Card",
    category: "primitive",
    subcategory: "Card",
    description: "Card with animated glow border effect.",
    tags: ["card", "glow", "animated"],
    tier: "pro",
    sortOrder: 26,
    variants: 1,
  },
  {
    id: "animated-counter",
    name: "Animated Counter",
    category: "primitive",
    subcategory: "Badge",
    description: "Number that animates up when scrolled into view.",
    tags: ["counter", "animated", "number"],
    tier: "pro",
    sortOrder: 27,
    variants: 1,
  },
];

export function getComponentById(id: string): ComponentEntry | undefined {
  return registry.find((c) => c.id === id);
}

export function getComponentsByCategory(category: ComponentCategory): ComponentEntry[] {
  return registry.filter((c) => c.category === category).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getComponentsByTier(tier: ComponentTier): ComponentEntry[] {
  return registry.filter((c) => c.tier === tier);
}

export function searchComponents(query: string): ComponentEntry[] {
  const q = query.toLowerCase();
  return registry.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.includes(q)) ||
      c.subcategory.toLowerCase().includes(q)
  );
}
