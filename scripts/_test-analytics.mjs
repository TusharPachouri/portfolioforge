import { writeFileSync } from 'fs';
import { getAnalytics } from '../lib/analytics.ts';
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const p = await sql`select id from portfolios where slug='claude-test-demo'`;
await sql.end();
try {
  const a = await getAnalytics(p[0].id);
  const out = {
    ok: true,
    totalViews: a.totalViews,
    recentViews: a.recentViews,
    dailyViewsCount: a.dailyViews.length,
    sampleDay: a.dailyViews[0],
    dayType: typeof a.dailyViews[0]?.day,
    topReferrers: a.topReferrers,
    topCountries: a.topCountries,
  };
  writeFileSync('scripts/_test-analytics.json', JSON.stringify(out, null, 2));
} catch (e) {
  writeFileSync('scripts/_test-analytics.json', JSON.stringify({ ok: false, error: e.message }, null, 2));
}
process.exit(0);
