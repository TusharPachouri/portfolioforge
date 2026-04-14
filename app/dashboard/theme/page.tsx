import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ThemeSelector from "./ThemeSelector";

export default async function ThemePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, session.user.id),
  });

  return (
    <ThemeSelector currentThemeId={portfolio?.themeId ?? "minimalist"} />
  );
}
