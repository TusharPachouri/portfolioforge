import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { recordView, isBot } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ua = req.headers.get("user-agent");
    if (isBot(ua)) return NextResponse.json({ ok: false });

    const portfolio = await db.query.portfolios.findFirst({
      where: eq(portfolios.slug, slug),
      columns: { id: true, published: true },
    });
    if (!portfolio?.published) return NextResponse.json({ ok: false });

    const referrer = req.headers.get("referer") ?? null;
    const country =
      req.headers.get("x-vercel-ip-country") ??
      req.headers.get("cf-ipcountry") ??
      null;

    await recordView(portfolio.id, referrer, country);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
