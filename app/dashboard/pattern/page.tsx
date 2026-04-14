import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { portfolios, userFavourites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import PatternPicker from "./PatternPicker";
import { PatternConfig } from "@/lib/patterns/types";

export default async function PatternPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const [portfolio, favs] = await Promise.all([
    db.query.portfolios.findFirst({
      where: eq(portfolios.userId, session.user.id),
    }),
    db.query.userFavourites.findMany({
      where: eq(userFavourites.userId, session.user.id),
    }),
  ]);

  return (
    <PatternPicker
      currentPatternId={portfolio?.patternId ?? null}
      currentConfig={(portfolio?.patternConfig as PatternConfig | null) ?? null}
      initialFavourites={favs.map((f) => f.patternId)}
    />
  );
}
