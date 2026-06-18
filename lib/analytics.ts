import { db } from "./db";
import { portfolioViews, portfolios } from "./db/schema";
import { eq, sql, desc, count } from "drizzle-orm";

const BOT_UA_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /googlebot/i,
  /bingbot/i, /facebookexternalhit/i, /twitterbot/i, /vercel/i,
];

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_UA_PATTERNS.some((p) => p.test(userAgent));
}

export async function recordView(
  portfolioId: string,
  referrer: string | null,
  country: string | null,
) {
  await Promise.all([
    db.insert(portfolioViews).values({ portfolioId, referrer, country }),
    db.update(portfolios)
      .set({ viewCount: sql`${portfolios.viewCount} + 1` })
      .where(eq(portfolios.id, portfolioId)),
  ]);
}

export async function getAnalytics(portfolioId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalViews, recentViews, topReferrers, topCountries, dailyViews] = await Promise.all([
    // Total all-time views
    db.select({ count: count() })
      .from(portfolioViews)
      .where(eq(portfolioViews.portfolioId, portfolioId))
      .then((r) => r[0]?.count ?? 0),

    // Views in last 30 days
    db.select({ count: count() })
      .from(portfolioViews)
      .where(
        sql`${portfolioViews.portfolioId} = ${portfolioId} AND ${portfolioViews.viewedAt} >= ${thirtyDaysAgo}`
      )
      .then((r) => r[0]?.count ?? 0),

    // Top referrers (last 30 days)
    db.select({
      referrer: portfolioViews.referrer,
      count: count(),
    })
      .from(portfolioViews)
      .where(
        sql`${portfolioViews.portfolioId} = ${portfolioId} AND ${portfolioViews.viewedAt} >= ${thirtyDaysAgo} AND ${portfolioViews.referrer} IS NOT NULL`
      )
      .groupBy(portfolioViews.referrer)
      .orderBy(desc(count()))
      .limit(10),

    // Top countries (last 30 days)
    db.select({
      country: portfolioViews.country,
      count: count(),
    })
      .from(portfolioViews)
      .where(
        sql`${portfolioViews.portfolioId} = ${portfolioId} AND ${portfolioViews.viewedAt} >= ${thirtyDaysAgo} AND ${portfolioViews.country} IS NOT NULL`
      )
      .groupBy(portfolioViews.country)
      .orderBy(desc(count()))
      .limit(10),

    // Daily views for chart (last 30 days).
    // to_char(...) returns a plain 'YYYY-MM-DD' string (forced to UTC) so it
    // matches the client's date keys — DATE() comes back as a JS Date which
    // never === the string key, silently zeroing the chart.
    db.select({
      day: sql<string>`to_char(${portfolioViews.viewedAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`.as("day"),
      count: count(),
    })
      .from(portfolioViews)
      .where(
        sql`${portfolioViews.portfolioId} = ${portfolioId} AND ${portfolioViews.viewedAt} >= ${thirtyDaysAgo}`
      )
      .groupBy(sql`to_char(${portfolioViews.viewedAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${portfolioViews.viewedAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`),
  ]);

  return { totalViews, recentViews, topReferrers, topCountries, dailyViews };
}
