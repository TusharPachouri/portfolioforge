import { readFileSync } from "fs";
import postgres from "postgres";

// Load .env.local manually
readFileSync(".env.local", "utf8")
  .split("\n")
  .forEach((line) => {
    const eq = line.indexOf("=");
    if (eq === -1 || line.trim().startsWith("#")) return;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim().replace(/^"|"$/g, "");
    if (key && !process.env[key]) process.env[key] = val;
  });

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }

const sql = postgres(url, { ssl: "require" });

const migrations = [
  // Phase 5: users additions
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS users_stripe_customer_id_unique
     ON users(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL`,

  // Phase 5: portfolios additions
  `ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS custom_domain TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS portfolios_custom_domain_unique
     ON portfolios(custom_domain) WHERE custom_domain IS NOT NULL`,
  `ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0`,

  // Phase 5: user_favourites
  `CREATE TABLE IF NOT EXISTS user_favourites (
    user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pattern_id TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, pattern_id)
  )`,

  // Phase 5: subscriptions
  `CREATE TABLE IF NOT EXISTS subscriptions (
    id                      TEXT PRIMARY KEY,
    user_id                 TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id  TEXT NOT NULL UNIQUE,
    stripe_price_id         TEXT NOT NULL,
    stripe_customer_id      TEXT NOT NULL,
    status                  TEXT NOT NULL,
    current_period_end      TIMESTAMP NOT NULL,
    cancel_at_period_end    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  // Phase 5: processed_events (Stripe idempotency)
  `CREATE TABLE IF NOT EXISTS processed_events (
    id           TEXT PRIMARY KEY,
    processed_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  // Phase 6: portfolio_views
  `CREATE TABLE IF NOT EXISTS portfolio_views (
    id           TEXT PRIMARY KEY,
    portfolio_id TEXT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    referrer     TEXT,
    country      TEXT,
    viewed_at    TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
];

let ok = 0;
let failed = 0;

for (const stmt of migrations) {
  const label = stmt.trim().split("\n")[0].slice(0, 60);
  try {
    await sql.unsafe(stmt);
    console.log(`✓  ${label}`);
    ok++;
  } catch (err) {
    console.error(`✗  ${label}`);
    console.error(`   ${err.message}`);
    failed++;
  }
}

await sql.end();
console.log(`\n${ok} succeeded, ${failed} failed`);
if (failed > 0) process.exit(1);
