import { auth } from "@/auth";
import { db } from "@/lib/db";
import { portfolios, users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import SettingsClient from "./SettingsClient";

export const metadata = { title: "Settings — PortfolioForge" };

export default async function SettingsPage() {
  const session = await auth();
  const [portfolio, user, subscription] = await Promise.all([
    db.query.portfolios.findFirst({ where: eq(portfolios.userId, session!.user.id) }),
    db.query.users.findFirst({ where: eq(users.id, session!.user.id) }),
    db.query.subscriptions.findFirst({ where: eq(subscriptions.userId, session!.user.id) }),
  ]);

  return (
    <SettingsClient
      currentSlug={portfolio?.slug ?? ""}
      currentAvatar={user?.image ?? ""}
      userEmail={user?.email ?? ""}
      userName={user?.name ?? ""}
      userRole={user?.role ?? "free"}
      hasSubscription={!!subscription}
    />
  );
}
