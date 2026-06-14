"use server";

// ─── Credentials registration ─────────────────────────────────────────────────
// Usernames double as the public portfolio slug (/u/<username>), so they must
// be globally unique across: existing usernames, existing portfolio slugs
// (OAuth users' URLs), the local part of every account email (a Gmail or
// GitHub-noreply handle), and the reserved-route list.

import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users, portfolios } from "@/lib/db/schema";
import { isReserved } from "@/lib/slug";
import { rateLimit } from "@/lib/rate-limit";
import { sendWelcomeEmail } from "@/lib/email";

const USERNAME_RE = /^[a-z][a-z0-9-]{2,29}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UsernameCheck {
  available: boolean;
  reason?: string;
}

/** Validates format and checks every identity source a username could collide with. */
export async function checkUsername(raw: string): Promise<UsernameCheck> {
  const username = raw.toLowerCase().trim();

  if (username.length < 3) {
    return { available: false, reason: "At least 3 characters." };
  }
  if (!USERNAME_RE.test(username)) {
    return { available: false, reason: "Lowercase letters, numbers and hyphens only — must start with a letter." };
  }
  if (isReserved(username)) {
    return { available: false, reason: "This name is reserved." };
  }

  const [byUsername, bySlug, byEmailHandle] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.username, username), columns: { id: true } }),
    db.query.portfolios.findFirst({ where: eq(portfolios.slug, username), columns: { id: true } }),
    // The local part of any account email (gmail handle, github noreply handle, …)
    db.query.users.findFirst({
      where: sql`lower(split_part(${users.email}, '@', 1)) = ${username}`,
      columns: { id: true },
    }),
  ]);

  if (byUsername || bySlug || byEmailHandle) {
    return { available: false, reason: "This username is already taken." };
  }
  return { available: true };
}

export interface RegisterResult {
  ok: boolean;
  error?: string;
}

export async function registerUser(input: {
  username: string;
  email: string;
  password: string;
}): Promise<RegisterResult> {
  const username = input.username.toLowerCase().trim();
  const email = input.email.toLowerCase().trim();
  const password = input.password;

  // Throttle sign-ups per IP (no-ops in dev without Redis)
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await rateLimit({ key: `register:${ip}`, limit: 5, windowSeconds: 600 });
  if (!rl.allowed) {
    return { ok: false, error: "Too many sign-up attempts. Please try again in a few minutes." };
  }

  // Validate
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  const usernameCheck = await checkUsername(username);
  if (!usernameCheck.available) {
    return { ok: false, error: usernameCheck.reason ?? "This username is not available." };
  }
  const existingEmail = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { id: true },
  });
  if (existingEmail) {
    return { ok: false, error: "An account with this email already exists. Try signing in instead." };
  }

  // Create user + their portfolio at /u/<username>
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const [user] = await db
      .insert(users)
      .values({ username, email, name: username, passwordHash, emailVerified: null })
      .returning({ id: users.id });

    await db.insert(portfolios).values({ userId: user.id, slug: username }).onConflictDoNothing();
  } catch {
    // Unique-constraint race (someone claimed it between check and insert)
    return { ok: false, error: "This username or email was just taken. Please pick another." };
  }

  sendWelcomeEmail(email, username).catch(() => {});
  return { ok: true };
}
