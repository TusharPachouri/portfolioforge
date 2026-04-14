import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users, subscriptions, processedEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

async function isAlreadyProcessed(eventId: string): Promise<boolean> {
  const existing = await db.query.processedEvents.findFirst({
    where: eq(processedEvents.id, eventId),
  });
  return !!existing;
}

async function markProcessed(eventId: string): Promise<void> {
  await db.insert(processedEvents).values({ id: eventId }).onConflictDoNothing();
}

async function setUserRole(userId: string, role: "free" | "pro" | "admin") {
  await db.update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

async function upsertSubscription(
  userId: string,
  sub: Stripe.Subscription,
) {
  const values = {
    userId,
    stripeSubscriptionId: sub.id,
    stripePriceId: (sub.items.data[0]?.price.id) ?? "",
    stripeCustomerId: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
    status: sub.status as "active" | "trialing" | "past_due" | "canceled" | "incomplete",
    currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    updatedAt: new Date(),
  };

  await db.insert(subscriptions)
    .values({ ...values, createdAt: new Date() })
    .onConflictDoUpdate({
      target: subscriptions.stripeSubscriptionId,
      set: values,
    });
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  // Idempotency — skip duplicate events
  if (await isAlreadyProcessed(event.id)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;
        const userId = session.subscription
          ? (await stripe.subscriptions.retrieve(session.subscription as string)).metadata.userId
          : null;
        if (!userId) break;

        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await upsertSubscription(userId, sub);
        await setUserRole(userId, "pro");
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata.userId;
        if (!userId) break;

        await upsertSubscription(userId, sub);

        // Active/trialing = pro; others = free (unless grace period still active)
        if (sub.status === "active" || sub.status === "trialing") {
          await setUserRole(userId, "pro");
        } else if (sub.status === "canceled" || sub.status === "incomplete") {
          // Check if still within grace period (currentPeriodEnd > now)
          const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end * 1000;
          if (Date.now() < periodEnd) {
            // Grace period — keep pro until expiry (cron job handles downgrade)
          } else {
            await setUserRole(userId, "free");
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata.userId;
        if (!userId) break;

        await upsertSubscription(userId, sub);
        // Grace period: role stays pro until currentPeriodEnd (cron handles downgrade)
        // Only immediately downgrade if period already passed
        const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end * 1000;
        if (Date.now() >= periodEnd) {
          await setUserRole(userId, "free");
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;
        if (!customerId) break;

        const user = await db.query.users.findFirst({
          where: eq(users.stripeCustomerId, customerId),
        });
        if (!user) break;

        // Update subscription status to past_due
        await db.update(subscriptions)
          .set({ status: "past_due", updatedAt: new Date() })
          .where(eq(subscriptions.userId, user.id));
        break;
      }
    }

    await markProcessed(event.id);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
