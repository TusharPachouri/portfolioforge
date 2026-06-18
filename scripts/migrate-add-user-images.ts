// One-off additive migration: user_images table (Cloudinary uploads ledger).
// drizzle-kit push crashes in non-TTY shells, so this applies the SQL directly.
// Run with: DATABASE_URL=... npx tsx scripts/migrate-add-user-images.ts
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(url, { max: 1 });

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS "user_images" (
      "id" text PRIMARY KEY,
      "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "url" text NOT NULL,
      "public_id" text NOT NULL UNIQUE,
      "kind" text NOT NULL DEFAULT 'other',
      "width" integer,
      "height" integer,
      "bytes" integer,
      "created_at" timestamp NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS "user_images_user_id_idx" ON "user_images" ("user_id")`;
  const exists = await sql`SELECT to_regclass('public.user_images') as t`;
  console.log("user_images table:", exists[0]?.t ?? "MISSING");
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
