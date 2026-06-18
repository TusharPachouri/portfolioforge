import { db } from "./db";
import { portfolioViews, portfolios } from "./db/schema";
import { eq, sql, desc, count, and, gte, isNotNull } from "drizzle-orm";

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

  // Use typed Drizzle operators (not raw `sql` with an interpolated Date) so the
  // driver encodes the timestamp param correctly. Interpolating a bare Date into
  // a sql template throws "Received an instance of Date".
  const recent = and(
    eq(portfolioViews.portfolioId, portfolioId),
    gte(portfolioViews.viewedAt, thirtyDaysAgo),
  );

  // Plain 'YYYY-MM-DD' string (forced to UTC) so it matches the client's date
  // keys — DATE() comes back as a JS Date which never === the string key.
  const dayExpr = sql<string>`to_char(${portfolioViews.viewedAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`;

  const [totalViews, recentViews, topReferrers, topCountries, dailyViews] = await Promise.all([
    // Total all-time views
    db.select({ count: count() })
      .from(portfolioViews)
      .where(eq(portfolioViews.portfolioId, portfolioId))
      .then((r) => r[0]?.count ?? 0),

    // Views in last 30 days
    db.select({ count: count() })
      .from(portfolioViews)
      .where(recent)
      .then((r) => r[0]?.count ?? 0),

    // Top referrers (last 30 days)
    db.select({ referrer: portfolioViews.referrer, count: count() })
      .from(portfolioViews)
      .where(and(recent, isNotNull(portfolioViews.referrer)))
      .groupBy(portfolioViews.referrer)
      .orderBy(desc(count()))
      .limit(10),

    // Top countries (last 30 days)
    db.select({ country: portfolioViews.country, count: count() })
      .from(portfolioViews)
      .where(and(recent, isNotNull(portfolioViews.country)))
      .groupBy(portfolioViews.country)
      .orderBy(desc(count()))
      .limit(10),

    // Daily views for chart (last 30 days)
    db.select({ day: dayExpr.as("day"), count: count() })
      .from(portfolioViews)
      .where(recent)
      .groupBy(dayExpr)
      .orderBy(dayExpr),
  ]);

  return { totalViews, recentViews, topReferrers, topCountries, dailyViews };
}
