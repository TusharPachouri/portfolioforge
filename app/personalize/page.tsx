import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userDetails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { RawUserDetails } from "@/types/portfolio";
import PersonalizeClient from "./PersonalizeClient";

export const metadata = {
  title: "Personalize — PortfolioForge",
  description: "Fill in your details and generate your portfolio with Gemini AI.",
};

export default async function PersonalizePage() {
  const session = await auth();

  let initialData: RawUserDetails | null = null;
  if (session?.user?.id) {
    const saved = await db.query.userDetails.findFirst({
      where: eq(userDetails.userId, session.user.id),
    });
    initialData = (saved?.rawData as RawUserDetails | null) ?? null;
  }

  return <PersonalizeClient isAuthed={!!session?.user?.id} initialData={initialData} />;
}
