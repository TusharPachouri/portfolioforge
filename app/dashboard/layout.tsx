import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { portfolios, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/dashboard");

  const [portfolio, dbUser] = await Promise.all([
    db.query.portfolios.findFirst({ where: eq(portfolios.userId, session.user.id) }),
    db.query.users.findFirst({ where: eq(users.id, session.user.id), columns: { image: true } }),
  ]);

  // Use the DB image (updated by settings) instead of the session image (stale OAuth value)
  const avatarUrl = dbUser?.image ?? session.user.image ?? null;

  return (
    <DashboardShell session={session} portfolio={portfolio ?? null} avatarUrl={avatarUrl}>
      {children}
    </DashboardShell>
  );
}
