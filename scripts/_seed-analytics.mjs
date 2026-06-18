import postgres from 'postgres';
import { randomUUID } from 'crypto';
import { writeFileSync } from 'fs';
const sql = postgres(process.env.DATABASE_URL, { max: 1 });

const slug = 'claude-test-demo';
const p = await sql`select p.id, p.user_id from portfolios p where p.slug = ${slug}`;
if (!p.length) { writeFileSync('scripts/_seed-analytics.json', JSON.stringify({error:'no portfolio'})); await sql.end(); process.exit(0); }
const pid = p[0].id, uid = p[0].user_id;

await sql`update users set role='pro' where id=${uid}`;
await sql`update portfolios set published=true where id=${pid}`;
await sql`delete from portfolio_views where portfolio_id=${pid}`;

const refs = ['https://www.google.com/', 'https://www.linkedin.com/feed/', 'https://t.co/abc', null, null, 'https://github.com/'];
const countries = ['US','US','IN','GB','DE','IN','US',null];
const rows = [];
for (let day = 13; day >= 0; day--) {
  const n = Math.floor(Math.random() * 6) + (day % 4 === 0 ? 4 : 0);
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - day);
    d.setUTCHours(8 + (i % 12), (i*7) % 60, 0, 0);
    rows.push({ id: randomUUID(), portfolio_id: pid, referrer: refs[(day+i) % refs.length], country: countries[(day*2+i) % countries.length], viewed_at: d });
  }
}
if (rows.length) await sql`insert into portfolio_views ${sql(rows, 'id','portfolio_id','referrer','country','viewed_at')}`;
await sql`update portfolios set view_count=${rows.length} where id=${pid}`;

const check = await sql`select count(*)::int as total, count(distinct to_char(viewed_at at time zone 'UTC','YYYY-MM-DD'))::int as days from portfolio_views where portfolio_id=${pid}`;
writeFileSync('scripts/_seed-analytics.json', JSON.stringify({ seeded: rows.length, ...check[0] }, null, 2));
await sql.end();
