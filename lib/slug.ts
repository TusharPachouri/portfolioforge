import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const RESERVED = new Set([
  "admin", "api", "u", "auth", "dashboard", "settings",
  "pricing", "docs", "components", "preview", "help",
  "blog", "personalize", "about", "contact",
]);

export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32) || "user";
}

export async function findUniqueSlug(base: string): Promise<string> {
  let candidate = generateSlug(base);
  if (RESERVED.has(candidate)) candidate = `${candidate}-portfolio`;

  const existing = await db.query.portfolios.findFirst({
    where: eq(portfolios.slug, candidate),
  });

  if (!existing) return candidate;

  // Append -2, -3 ... until unique
  for (let i = 2; i <= 99; i++) {
    const next = `${candidate}-${i}`;
    const ex = await db.query.portfolios.findFirst({
      where: eq(portfolios.slug, next),
    });
    if (!ex) return next;
  }
  return `${candidate}-${Date.now()}`;
}

export function isReserved(slug: string): boolean {
  return RESERVED.has(slug.toLowerCase());
}
