import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RawUserDetails, PortfolioData } from "@/types/portfolio";
import { buildPrompt } from "@/lib/ai/gemini-prompt";
import { fallbackFormat } from "@/lib/ai/fallback-formatter";
import { auth } from "@/auth";
import { canGenerateAi, incrementAiUsage, FREE_DAILY_LIMIT } from "@/lib/redis";

export async function POST(req: NextRequest) {
  // Rate-limit authenticated users; anonymous users use localStorage tracking
  const session = await auth();
  if (session?.user?.id) {
    const allowed = await canGenerateAi(session.user.id, session.user.role ?? "free");
    if (!allowed) {
      return Response.json(
        {
          error: "rate_limited",
          message: `You've used your ${FREE_DAILY_LIMIT} daily AI generations. Upgrade to Pro for unlimited.`,
        },
        { status: 429 }
      );
    }
  }

  const raw: RawUserDetails = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ data: fallbackFormat(raw), source: "fallback" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Attempt 1: standard prompt
  try {
    const result = await model.generateContent(buildPrompt(raw));
    const text = result.response.text().trim();
    const parsed = parseJSON(text);
    if (parsed) {
      if (session?.user?.id) await incrementAiUsage(session.user.id);
      return Response.json({ data: parsed as PortfolioData, source: "gemini" });
    }
  } catch {
    // fall through to attempt 2
  }

  // Attempt 2: stricter prompt
  try {
    const strictPrompt = buildPrompt(raw) + "\n\nIMPORTANT: Your entire response must be a single valid JSON object. No text before or after.";
    const result = await model.generateContent(strictPrompt);
    const text = result.response.text().trim();
    const parsed = parseJSON(text);
    if (parsed) {
      if (session?.user?.id) await incrementAiUsage(session.user.id);
      return Response.json({ data: parsed as PortfolioData, source: "gemini-retry" });
    }
  } catch {
    // fall through to fallback
  }

  // Attempt 3: deterministic fallback — always succeeds
  if (session?.user?.id) await incrementAiUsage(session.user.id);
  return Response.json({ data: fallbackFormat(raw), source: "fallback" });
}

function parseJSON(text: string): unknown | null {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
