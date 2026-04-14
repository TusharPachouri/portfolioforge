import Stripe from "stripe";

// Lazy singleton — safe to import at module level without a configured key
function createStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return new Proxy({} as Stripe, {
      get() {
        throw new Error(
          "STRIPE_SECRET_KEY is not configured. Add it to .env.local to enable billing."
        );
      },
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" as any });
}

export const stripe = createStripe();

// Price IDs from env (set in Stripe Dashboard)
export const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_ID_MONTHLY ?? "",
  annual: process.env.STRIPE_PRICE_ID_ANNUAL ?? "",
} as const;

export const PLANS = [
  {
    id: "monthly" as const,
    label: "Monthly",
    price: "$9",
    period: "/month",
    priceId: PRICE_IDS.monthly,
    savings: null,
  },
  {
    id: "annual" as const,
    label: "Annual",
    price: "$79",
    period: "/year",
    priceId: PRICE_IDS.annual,
    savings: "Save 27%",
  },
] as const;
