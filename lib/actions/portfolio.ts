"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { portfolios, userDetails, users, userFavourites, userImages } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { PortfolioData, RawUserDetails } from "@/types/portfolio";
import { buildPrompt } from "@/lib/ai/gemini-prompt";
import { fallbackFormat } from "@/lib/ai/fallback-formatter";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isReserved } from "@/lib/slug";
import { getThemeById } from "@/lib/themes";
import { getPatternById } from "@/lib/patterns/registry";
import { validatePatternConfig, PatternConfig } from "@/lib/patterns/types";
import { sendPortfolioLiveEmail } from "@/lib/email";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}

async function getUserPortfolio(userId: string) {
  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, userId),
  });
  if (!portfolio) throw new Error("Portfolio not found");
  return portfolio;
}

// ─── Shared AI generation ─────────────────────────────────────────────────────
// Single source of truth for turning raw form data into structured portfolio
// JSON. Tries Gemini (twice, second pass stricter), then a deterministic
// fallback formatter that always succeeds — so generation never hard-fails.

async function generatePortfolioData(
  raw: RawUserDetails,
): Promise<{ data: PortfolioData; source: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { data: fallbackFormat(raw), source: "fallback" };

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const prompt =
        attempt === 0
          ? buildPrompt(raw)
          : buildPrompt(raw) + "\n\nIMPORTANT: Respond with ONLY valid JSON, no markdown.";
      const text = (await model.generateContent(prompt)).response
        .text()
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
      return { data: JSON.parse(text) as PortfolioData, source: attempt === 0 ? "gemini" : "gemini-retry" };
    } catch {
      // try the stricter prompt, then fall through to the deterministic formatter
    }
  }
  return { data: fallbackFormat(raw), source: "fallback" };
}

// ─── Component order ──────────────────────────────────────────────────────────

export async function saveSelectedComponents(componentIds: string[]) {
  const user = await requireAuth();
  const portfolio = await getUserPortfolio(user.id);
  await db.update(portfolios)
    .set({ selectedComponentIds: componentIds, updatedAt: new Date() })
    .where(eq(portfolios.id, portfolio.id));
  revalidatePath(`/u/${portfolio.slug}`);
  revalidatePath("/dashboard");
}

// ─── Portfolio data (AI output) ───────────────────────────────────────────────

export async function savePortfolioData(data: PortfolioData) {
  const user = await requireAuth();
  const portfolio = await getUserPortfolio(user.id);
  await db.update(portfolios)
    .set({ portfolioData: data, updatedAt: new Date() })
    .where(eq(portfolios.id, portfolio.id));
  revalidatePath(`/u/${portfolio.slug}`);
  revalidatePath("/dashboard");
}

// ─── Publish toggle ───────────────────────────────────────────────────────────

export async function publishPortfolio(publish: boolean) {
  const user = await requireAuth();
  const portfolio = await getUserPortfolio(user.id);

  const wasPublished = portfolio.published;
  await db.update(portfolios)
    .set({ published: publish, updatedAt: new Date() })
    .where(eq(portfolios.id, portfolio.id));

  // Send "portfolio is live" email only on first publish
  if (publish && !wasPublished) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { email: true, name: true },
    });
    if (dbUser?.email) {
      sendPortfolioLiveEmail(dbUser.email, dbUser.name ?? "there", portfolio.slug).catch(() => {});
    }
  }

  revalidatePath(`/u/${portfolio.slug}`);
  revalidatePath("/dashboard");
  return { slug: portfolio.slug, published: publish };
}

// ─── Save raw form data ───────────────────────────────────────────────────────

export async function updateUserDetails(raw: RawUserDetails) {
  const user = await requireAuth();
  await db.insert(userDetails)
    .values({ userId: user.id, rawData: raw })
    .onConflictDoUpdate({
      target: userDetails.userId,
      set: { rawData: raw, updatedAt: new Date() },
    });
  revalidatePath("/dashboard");
}

// ─── Save details + generate + persist, in one round-trip ─────────────────────
// Used by the /personalize editor for signed-in users: writes the raw form,
// generates structured portfolio data, saves it to the live portfolio, and
// revalidates the public page so changes show up immediately.

export async function saveDetailsAndGenerate(
  raw: RawUserDetails,
): Promise<{ data: PortfolioData; source: string }> {
  const user = await requireAuth();

  // 1. Persist the raw form
  await db.insert(userDetails)
    .values({ userId: user.id, rawData: raw })
    .onConflictDoUpdate({
      target: userDetails.userId,
      set: { rawData: raw, updatedAt: new Date() },
    });

  // 2. Generate structured data
  const { data, source } = await generatePortfolioData(raw);

  // 3. Save to the live portfolio + bump generation stats
  const portfolio = await getUserPortfolio(user.id);
  await db.update(portfolios)
    .set({ portfolioData: data, updatedAt: new Date() })
    .where(eq(portfolios.id, portfolio.id));
  await db.update(userDetails)
    .set({ lastGeneratedAt: new Date(), aiGenerationCount: sql`${userDetails.aiGenerationCount} + 1` })
    .where(eq(userDetails.userId, user.id));

  revalidatePath(`/u/${portfolio.slug}`);
  revalidatePath("/dashboard");

  return { data, source };
}

// ─── AI regeneration (uses already-saved details) ─────────────────────────────

export async function regeneratePortfolio(): Promise<{ data: PortfolioData; source: string }> {
  const user = await requireAuth();
  const [portfolio, details] = await Promise.all([
    getUserPortfolio(user.id),
    db.query.userDetails.findFirst({ where: eq(userDetails.userId, user.id) }),
  ]);

  if (!details?.rawData) throw new Error("No user details found. Fill in your details first.");

  const { data, source } = await generatePortfolioData(details.rawData as RawUserDetails);

  await db.update(portfolios)
    .set({ portfolioData: data, updatedAt: new Date() })
    .where(eq(portfolios.id, portfolio.id));
  await db.update(userDetails)
    .set({ lastGeneratedAt: new Date(), aiGenerationCount: (details.aiGenerationCount ?? 0) + 1 })
    .where(eq(userDetails.userId, user.id));

  revalidatePath(`/u/${portfolio.slug}`);
  revalidatePath("/dashboard");

  return { data, source };
}

// ─── Import localStorage data on sign-in ──────────────────────────────────────

export async function importLocalStorageData(raw: RawUserDetails, componentIds: string[]) {
  const user = await requireAuth();

  // Save raw form
  await db.insert(userDetails)
    .values({ userId: user.id, rawData: raw })
    .onConflictDoUpdate({
      target: userDetails.userId,
      set: { rawData: raw, updatedAt: new Date() },
    });

  // Run AI (shared helper — Gemini with deterministic fallback)
  const { data: portfolioData, source } = await generatePortfolioData(raw);

  const portfolio = await getUserPortfolio(user.id);
  await db.update(portfolios)
    .set({ portfolioData, selectedComponentIds: componentIds, updatedAt: new Date() })
    .where(eq(portfolios.id, portfolio.id));

  revalidatePath(`/u/${portfolio.slug}`);
  revalidatePath("/dashboard");

  return { source };
}

// ─── Import component IDs only (for users who already have details) ──────────

export async function importComponentIds(componentIds: string[]) {
  const user = await requireAuth();
  const portfolio = await getUserPortfolio(user.id);
  // Merge with existing — add new IDs that aren't already saved
  const existing = portfolio.selectedComponentIds ?? [];
  const merged = [...existing, ...componentIds.filter((id) => !existing.includes(id))];
  await db.update(portfolios)
    .set({ selectedComponentIds: merged, updatedAt: new Date() })
    .where(eq(portfolios.id, portfolio.id));
  revalidatePath("/dashboard");
  revalidatePath(`/u/${portfolio.slug}`);
  return { count: merged.length };
}

// ─── Slug management ──────────────────────────────────────────────────────────

export async function updateSlug(newSlug: string): Promise<{ error?: string; slug?: string }> {
  const user = await requireAuth();
  const cleaned = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  if (cleaned.length < 3) return { error: "Slug must be at least 3 characters." };
  if (cleaned.length > 48) return { error: "Slug must be 48 characters or less." };
  if (isReserved(cleaned)) return { error: "This slug is reserved. Please choose another." };

  const existing = await db.query.portfolios.findFirst({
    where: eq(portfolios.slug, cleaned),
  });
  if (existing && existing.userId !== user.id) return { error: "This slug is already taken." };

  const portfolio = await getUserPortfolio(user.id);
  const oldSlug = portfolio.slug;

  await db.update(portfolios).set({ slug: cleaned, updatedAt: new Date() }).where(eq(portfolios.id, portfolio.id));

  revalidatePath(`/u/${oldSlug}`);
  revalidatePath(`/u/${cleaned}`);
  revalidatePath("/dashboard");

  return { slug: cleaned };
}

// ─── Update avatar URL ────────────────────────────────────────────────────────

export async function updateAvatarUrl(url: string) {
  const user = await requireAuth();
  await db.update(users).set({ image: url, updatedAt: new Date() }).where(eq(users.id, user.id));
  revalidatePath("/dashboard");
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export async function saveTheme(themeId: string) {
  const user = await requireAuth();
  const theme = getThemeById(themeId);
  if (!theme) throw new Error("Invalid theme ID");
  const portfolio = await getUserPortfolio(user.id);
  await db.update(portfolios)
    .set({ themeId, updatedAt: new Date() })
    .where(eq(portfolios.id, portfolio.id));
  revalidatePath(`/u/${portfolio.slug}`);
  revalidatePath("/dashboard");
  return { themeId };
}

// ─── Pattern ──────────────────────────────────────────────────────────────────

export async function savePattern(
  patternId: string | null,
  config: PatternConfig | null,
) {
  const user = await requireAuth();
  const portfolio = await getUserPortfolio(user.id);

  if (patternId) {
    const pattern = getPatternById(patternId);
    if (!pattern) throw new Error("Invalid pattern ID");
  }

  if (config) {
    const validated = validatePatternConfig(config);
    if (!validated) throw new Error("Invalid pattern config");
    config = validated;
  }

  await db.update(portfolios)
    .set({ patternId, patternConfig: config, updatedAt: new Date() })
    .where(eq(portfolios.id, portfolio.id));
  revalidatePath(`/u/${portfolio.slug}`);
  revalidatePath("/dashboard");
  return { patternId };
}

// ─── Favourites ───────────────────────────────────────────────────────────────

export async function toggleFavourite(patternId: string): Promise<{ favourited: boolean }> {
  const user = await requireAuth();
  const pattern = getPatternById(patternId);
  if (!pattern) throw new Error("Invalid pattern ID");

  const existing = await db.query.userFavourites.findFirst({
    where: (f, { and, eq: feq }) => and(feq(f.userId, user.id), feq(f.patternId, patternId)),
  });

  if (existing) {
    await db.delete(userFavourites)
      .where(
        and(
          eq(userFavourites.userId, user.id),
          eq(userFavourites.patternId, patternId),
        )
      );
    return { favourited: false };
  } else {
    await db.insert(userFavourites).values({ userId: user.id, patternId });
    return { favourited: true };
  }
}

export async function getFavourites(): Promise<string[]> {
  const user = await requireAuth();
  const favs = await db.query.userFavourites.findMany({
    where: eq(userFavourites.userId, user.id),
  });
  return favs.map((f) => f.patternId);
}

// ─── Uploaded images ──────────────────────────────────────────────────────────

/** Delete an uploaded image from Cloudinary + the ledger (owner only). */
export async function deleteImage(publicId: string): Promise<{ ok: boolean }> {
  const user = await requireAuth();

  const image = await db.query.userImages.findFirst({
    where: and(eq(userImages.publicId, publicId), eq(userImages.userId, user.id)),
  });
  if (!image) return { ok: false };

  const cloud = getCloudinary();
  if (cloud) {
    try {
      await cloud.uploader.destroy(publicId, { resource_type: "image" });
    } catch {
      // Cloudinary delete failed — still drop the ledger row so the UI stays consistent
    }
  }

  await db.delete(userImages)
    .where(and(eq(userImages.publicId, publicId), eq(userImages.userId, user.id)));
  return { ok: true };
}
