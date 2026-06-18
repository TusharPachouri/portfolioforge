import { db } from "@/lib/db";
import { portfolios, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { componentMap } from "@/lib/components/map";
import { demoData } from "@/lib/demo-data";
import { PortfolioData } from "@/types/portfolio";
import { getThemeTokenStyle } from "@/lib/themes";
import { getPatternById } from "@/lib/patterns/registry";
import { PatternConfig } from "@/lib/patterns/types";
import type { Metadata } from "next";
import ViewRecorder from "./ViewRecorder";
import FloatingNavbar from "@/components/portfolio/FloatingNavbar";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR — revalidate every 60s

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.slug, slug),
  });

  if (!portfolio || !portfolio.published) {
    return { title: "Portfolio — PortfolioForge" };
  }

  // Same fallback as the page itself: unpersonalized portfolios publish the demo data
  const data = (portfolio.portfolioData as PortfolioData | null) ?? demoData;
  const { meta, hero } = data;

  return {
    title: meta.seoTitle || `${hero.name} — Portfolio`,
    description: meta.seoDescription || hero.tagline,
    keywords: meta.keywords,
    openGraph: {
      type: "profile",
      title: meta.seoTitle || hero.name,
      description: meta.seoDescription || hero.tagline,
      url: `https://portfolioforge.dev/u/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.seoTitle || hero.name,
      description: meta.seoDescription || hero.tagline,
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: hero.name,
        description: hero.tagline,
        url: `https://portfolioforge.dev/u/${slug}`,
        email: data.contact.email,
        sameAs: Object.values(data.contact.socials).filter(Boolean),
      }),
    },
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params;

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.slug, slug),
  });

  // 404 for missing or unpublished (no enumeration)
  if (!portfolio || !portfolio.published) notFound();

  // Owners who haven't personalized yet publish exactly what the dashboard
  // preview showed them — the demo data. The dashboard nudges them to fill
  // in details; the live link must never 404 once published.
  const data = (portfolio.portfolioData as PortfolioData | null) ?? demoData;

  const owner = await db.query.users.findFirst({
    where: eq(users.id, portfolio.userId),
  });

  const isPro = owner?.role === "pro" || owner?.role === "admin";
  const ids = portfolio.selectedComponentIds;

  // Theme tokens — CSS custom properties
  const themeTokens = getThemeTokenStyle(portfolio.themeId ?? "minimalist");

  // Pattern
  let patternStyle: React.CSSProperties = {};
  let patternBaseColor: string | null = null;
  if (portfolio.patternId) {
    const pattern = getPatternById(portfolio.patternId);
    if (pattern) {
      const config = (portfolio.patternConfig as PatternConfig | null) ?? pattern.defaults;
      patternStyle = pattern.render(config);
      patternBaseColor = config.baseColor;
    }
  }

  // The page root background: use pattern base color when a pattern is active,
  // otherwise use the theme's --pf-bg token value directly.
  const rootBg = patternBaseColor ?? (themeTokens["--pf-bg"] as string) ?? "#ffffff";

  return (
    <div
      className="pf-themed min-h-screen"
      style={{
        ...(themeTokens as React.CSSProperties),
        background: rootBg,
        color: "var(--pf-fg)",
        position: "relative",
      }}
    >
      <ViewRecorder slug={slug} />

      {/* Pattern overlay — sits above the base color, behind content */}
      {portfolio.patternId && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            ...patternStyle,
          }}
        />
      )}

      {/* Content sits above the pattern overlay */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <FloatingNavbar data={data} />
        {ids.map((id) => {
          const baseId = id.includes(":") ? id.split(":")[0] : id;
          const Component = componentMap[baseId];
          return Component ? <Component key={id} data={data} /> : null;
        })}

        {/* Free tier branding badge */}
        {!isPro && (
          <div className="py-4 text-center" style={{ borderTop: "1px solid var(--pf-card-border)" }}>
            <a
              href="https://portfolioforge.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: "var(--pf-muted)" }}
            >
              <div className="h-4 w-4 rounded flex items-center justify-center" style={{
                background: "var(--pf-primary-btn-bg)",
              }}>
                <span style={{ color: "var(--pf-primary-btn-fg)", fontSize: "8px", fontWeight: 700 }}>PF</span>
              </div>
              Made with PortfolioForge
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
