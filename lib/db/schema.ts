import {
  pgTable, text, timestamp, boolean, jsonb, integer, primaryKey
} from "drizzle-orm/pg-core";

import type { AdapterAccountType } from "next-auth/adapters";

// ─── Auth.js required tables ──────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  // Credentials auth — null for OAuth-only users. Username doubles as the portfolio slug.
  username: text("username").unique(),
  passwordHash: text("password_hash"),
  role: text("role", { enum: ["free", "pro", "admin"] }).notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

// ─── App tables ───────────────────────────────────────────────────────────────

export const portfolios = pgTable("portfolios", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").unique().notNull(),
  published: boolean("published").notNull().default(false),
  selectedComponentIds: jsonb("selected_component_ids").$type<string[]>().notNull().default([]),
  portfolioData: jsonb("portfolio_data"),
  themeId: text("theme_id").default("minimalist"),
  patternId: text("pattern_id"),
  patternConfig: jsonb("pattern_config"),
  customDomain: text("custom_domain").unique(),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const userDetails = pgTable("user_details", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  rawData: jsonb("raw_data").notNull(),
  aiGenerationCount: integer("ai_generation_count").notNull().default(0),
  lastGeneratedAt: timestamp("last_generated_at", { mode: "date" }),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// ─── Favourites ───────────────────────────────────────────────────────────────

export const userFavourites = pgTable(
  "user_favourites",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    patternId: text("pattern_id").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.patternId] })]
);

// ─── Stripe: Subscriptions ────────────────────────────────────────────────────

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  status: text("status", {
    enum: ["active", "trialing", "past_due", "canceled", "incomplete"],
  }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }).notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// ─── Analytics ───────────────────────────────────────────────────────────────

export const portfolioViews = pgTable("portfolio_views", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  portfolioId: text("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  referrer: text("referrer"),
  country: text("country"),
  viewedAt: timestamp("viewed_at", { mode: "date" }).notNull().defaultNow(),
});

// ─── Stripe: Idempotency ──────────────────────────────────────────────────────

export const processedEvents = pgTable("processed_events", {
  id: text("id").primaryKey(), // Stripe event ID
  processedAt: timestamp("processed_at", { mode: "date" }).notNull().defaultNow(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type UserDetails = typeof userDetails.$inferSelect;
export type UserFavourite = typeof userFavourites.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type PortfolioView = typeof portfolioViews.$inferSelect;
