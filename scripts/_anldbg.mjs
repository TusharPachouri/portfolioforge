import postgres from 'postgres';
import { writeFileSync } from 'fs';
const sql = postgres(process.env.DATABASE_URL, { max: 1 });
// How many views exist per portfolio + how DATE() deserializes
const counts = await sql`select p.slug, count(v.id)::int as views from portfolios p left join portfolio_views v on v.portfolio_id=p.id group by p.slug order by views desc`;
const sample = await sql`select date(viewed_at) as d_date, to_char(viewed_at,'YYYY-MM-DD') as d_str, viewed_at from portfolio_views order by viewed_at desc limit 3`;
const typeinfo = sample.map(r => ({ d_date: r.d_date, d_date_type: Object.prototype.toString.call(r.d_date), d_str: r.d_str, d_str_type: typeof r.d_str }));
writeFileSync('scripts/_anldbg.json', JSON.stringify({ counts, typeinfo }, null, 2));
await sql.end();
