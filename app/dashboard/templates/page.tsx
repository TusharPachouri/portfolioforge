import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { templates } from "@/lib/templates";
import TemplatesClient from "./TemplatesClient";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/dashboard/templates");

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, session.user.id),
    columns: { themeId: true, selectedComponentIds: true },
  });

  return (
    <TemplatesClient
      templates={templates}
      currentThemeId={portfolio?.themeId ?? "minimalist"}
      currentComponentIds={(portfolio?.selectedComponentIds as string[]) ?? []}
    />
  );
}
