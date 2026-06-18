import { PortfolioData } from "@/types/portfolio";
import HeroCentered from "@/components/sections/HeroCentered";
import HeroSplit from "@/components/sections/HeroSplit";
import HeroMinimal from "@/components/sections/HeroMinimal";
import AboutCard from "@/components/sections/AboutCard";
import SkillsGrid from "@/components/sections/SkillsGrid";
import SkillsTags from "@/components/sections/SkillsTags";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import ProjectsList from "@/components/sections/ProjectsList";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import EducationCards from "@/components/sections/EducationCards";
import ContactSimple from "@/components/sections/ContactSimple";
import FooterMinimal from "@/components/sections/FooterMinimal";
import StatsRow from "@/components/sections/StatsRow";
import TestimonialsGrid from "@/components/sections/TestimonialsGrid";
import GalleryMasonry from "@/components/sections/GalleryMasonry";
import HeroGradient from "@/components/sections/HeroGradient";
import AboutHighlights from "@/components/sections/AboutHighlights";
import SkillsCards from "@/components/sections/SkillsCards";
import ExperienceCards from "@/components/sections/ExperienceCards";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import ContactBanner from "@/components/sections/ContactBanner";

type SectionComponent = React.ComponentType<{ data: PortfolioData }>;

export const componentMap: Record<string, SectionComponent> = {
  "hero-centered": HeroCentered,
  "hero-split": HeroSplit,
  "hero-minimal": HeroMinimal,
  "about-card": AboutCard,
  "about-split": HeroSplit, // reuse split for now
  "skills-grid": SkillsGrid,
  "skills-tags": SkillsTags,
  "projects-grid": ProjectsGrid,
  "projects-list": ProjectsList,
  "experience-timeline": ExperienceTimeline,
  "education-cards": EducationCards,
  "contact-simple": ContactSimple,
  "footer-minimal": FooterMinimal,
  "stats-row": StatsRow,
  "testimonials-grid": TestimonialsGrid,
  "gallery-masonry": GalleryMasonry,
  // Newly added (free)
  "hero-gradient": HeroGradient,
  "about-highlights": AboutHighlights,
  "skills-cards": SkillsCards,
  "experience-cards": ExperienceCards,
  "projects-showcase": ProjectsShowcase,
  "contact-banner": ContactBanner,
};
