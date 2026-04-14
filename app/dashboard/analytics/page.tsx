import { auth } from "@/auth";
import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAnalytics } from "@/lib/analytics";
import { redirect } from "next/navigation";
import AnalyticsClient from "./AnalyticsClient";

export const metadata = { title: "Analytics — PortfolioForge" };

export default async function AnalyticsPage() {
  const session = await auth();
  const userRole = session!.user.role ?? "free";
  const isPro = userRole === "pro" || userRole === "admin";

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, session!.user.id),
  });

  if (!isPro) {
    redirect("/dashboard/upgrade");
  }

  if (!portfolio) {
    return (
      <div className="p-8 text-zinc-500">No portfolio found.</div>
    );
  }

  const analytics = await getAnalytics(portfolio.id);

  return (
    <AnalyticsClient
      analytics={analytics}
      slug={portfolio.slug}
      totalAllTime={portfolio.viewCount}
    />
  );
}
