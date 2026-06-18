import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RawUserDetails, PortfolioData } from "@/types/portfolio";
import { buildPrompt } from "@/lib/ai/gemini-prompt";
import { fallbackFormat } from "@/lib/ai/fallback-formatter";

// Anonymous preview generation. Unlimited — no generation cap.
export async function POST(req: NextRequest) {
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
    const parsed = parseJSON(result.response.text().trim());
    if (parsed) {
      return Response.json({ data: parsed as PortfolioData, source: "gemini" });
    }
  } catch {
    // fall through to attempt 2
  }

  // Attempt 2: stricter prompt
  try {
    const strictPrompt = buildPrompt(raw) + "\n\nIMPORTANT: Your entire response must be a single valid JSON object. No text before or after.";
    const result = await model.generateContent(strictPrompt);
    const parsed = parseJSON(result.response.text().trim());
    if (parsed) {
      return Response.json({ data: parsed as PortfolioData, source: "gemini-retry" });
    }
  } catch {
    // fall through to fallback
  }

  // Attempt 3: deterministic fallback — always succeeds
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
