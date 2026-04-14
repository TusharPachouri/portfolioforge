"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { stripe, PRICE_IDS } from "@/lib/stripe";
import { redirect } from "next/navigation";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  return session.user;
}

// ─── Get or create Stripe customer ───────────────────────────────────────────

async function getOrCreateCustomer(userId: string, email: string, name: string | null | undefined): Promise<string> {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (user?.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { userId },
  });

  await db.update(users)
    .set({ stripeCustomerId: customer.id, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return customer.id;
}

// ─── Create checkout session ──────────────────────────────────────────────────

export async function createCheckoutSession(plan: "monthly" | "annual") {
  const user = await requireAuth();
  const priceId = PRICE_IDS[plan];
  if (!priceId) throw new Error("Invalid plan or price not configured");

  const dbUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });
  const customerId = await getOrCreateCustomer(user.id, user.email ?? "", dbUser?.name);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/dashboard/upgrade`,
    subscription_data: {
      metadata: { userId: user.id },
    },
    allow_promotion_codes: true,
  });

  if (!session.url) throw new Error("Failed to create checkout session");
  redirect(session.url);
}

// ─── Open billing portal ──────────────────────────────────────────────────────

export async function openBillingPortal() {
  const user = await requireAuth();
  const dbUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });

  if (!dbUser?.stripeCustomerId) {
    throw new Error("No billing account found. Please subscribe first.");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/dashboard/settings`,
  });

  redirect(session.url);
}
