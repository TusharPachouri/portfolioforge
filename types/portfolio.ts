// ─── Raw form data (what the user fills in) ──────────────────────────────────

export interface RawExperience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface RawEducation {
  school: string;
  degree: string;
  period: string;
  notes: string;
}

export interface RawProject {
  name: string;
  description: string;
  techStack: string[];
  repoUrl: string;
  liveUrl: string;
  featured: boolean;
  imageUrl: string;
}

export interface GalleryImage {
  imageUrl: string;
  caption: string;
}

export interface RawUserDetails {
  name: string;
  tagline: string;
  location: string;
  avatarUrl: string;
  userType: "experienced" | "fresher";
  bio: string;
  openToWork: boolean;
  availability: string;
  skills: string[];
  experience: RawExperience[];
  education: RawEducation[];
  projects: RawProject[];
  gallery: GalleryImage[];
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
    email: string;
  };
}

// ─── Structured portfolio data (Gemini output) ───────────────────────────────

export interface PortfolioData {
  hero: {
    name: string;
    tagline: string;
    avatarUrl: string;
    location: string;
    openToWork: boolean;
    availability: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  };
  about: {
    paragraphs: string[];
    highlights: string[];
  };
  skills: {
    categories: Array<{
      name: string;
      items: string[];
    }>;
  };
  projects: Array<{
    name: string;
    description: string;
    techStack: string[];
    repoUrl: string;
    liveUrl: string;
    featured: boolean;
    role: string;
    imageUrl: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    period: string;
    notes: string;
  }>;
  gallery: GalleryImage[];
  contact: {
    email: string;
    socials: Record<string, string>;
  };
  meta: {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
  };
}

// ─── Builder state (localStorage) ────────────────────────────────────────────

export interface BuilderState {
  selectedComponentIds: string[];
  portfolioData: PortfolioData | null;
  rawFormData: RawUserDetails | null;
  lastUpdated: number;
  generationCount: number;
  lastGeneratedAt: number | null;
}
