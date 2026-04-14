import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/dashboard");

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, session.user.id),
  });

  return (
    <DashboardShell session={session} portfolio={portfolio ?? null}>
      {children}
    </DashboardShell>
  );
}
