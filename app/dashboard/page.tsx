import { auth } from "@/auth";
import { db } from "@/lib/db";
import { portfolios, userDetails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import BuilderClient from "./BuilderClient";

export const metadata = { title: "Dashboard — PortfolioForge" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ import?: string; upgrade?: string }>;
}) {
  const session = await auth();
  const { import: shouldImport, upgrade } = await searchParams;

  const [portfolio, details] = await Promise.all([
    db.query.portfolios.findFirst({ where: eq(portfolios.userId, session!.user.id) }),
    db.query.userDetails.findFirst({ where: eq(userDetails.userId, session!.user.id) }),
  ]);

  const userRole = session!.user.role ?? "free";

  return (
    <BuilderClient
      portfolio={portfolio ?? null}
      hasDetails={!!details}
      showImportPrompt={shouldImport === "1"}
      userId={session!.user.id}
      userRole={userRole}
      upgradeSuccess={upgrade === "success"}
    />
  );
}
