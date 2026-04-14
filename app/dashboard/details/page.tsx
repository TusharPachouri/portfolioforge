import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userDetails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { RawUserDetails } from "@/types/portfolio";
import DetailsClient from "./DetailsClient";

export const metadata = { title: "Edit Details — PortfolioForge" };

export default async function DetailsPage() {
  const session = await auth();
  const saved = await db.query.userDetails.findFirst({
    where: eq(userDetails.userId, session!.user.id),
  });

  return (
    <DetailsClient
      initialData={(saved?.rawData as RawUserDetails | null) ?? null}
      generationCount={saved?.aiGenerationCount ?? 0}
    />
  );
}
