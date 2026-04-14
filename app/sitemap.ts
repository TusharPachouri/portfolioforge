import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const BASE = "https://portfolioforge.dev";

export const revalidate = 3600; // rebuild sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/components`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/dashboard/upgrade`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Published portfolios
  let portfolioPages: MetadataRoute.Sitemap = [];
  try {
    const published = await db.query.portfolios.findMany({
      where: eq(portfolios.published, true),
      columns: { slug: true, updatedAt: true },
    });
    portfolioPages = published.map((p) => ({
      url: `${BASE}/u/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB unavailable during build — skip portfolio pages
  }

  return [...staticPages, ...portfolioPages];
}
