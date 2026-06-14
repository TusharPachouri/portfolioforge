// One-off additive migration: credentials-auth columns on users.
// drizzle-kit push crashes in non-TTY shells, so this applies the same SQL directly.
// Run with: DATABASE_URL=... npx tsx scripts/migrate-add-username.ts
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(url, { max: 1 });

async function main() {
  await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" text`;
  await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" text`;
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_username_unique') THEN
        ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE ("username");
      END IF;
    END $$
  `;
  const cols = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name IN ('username', 'password_hash')
  `;
  console.log("columns present:", cols.map((c) => c.column_name).join(", "));
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
