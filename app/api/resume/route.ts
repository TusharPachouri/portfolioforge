import { NextRequest } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import { aiNativeChat, isAiNativeConfigured } from "@/lib/ai/ainative";
import { buildResumePrompt } from "@/lib/ai/resume-prompt";
import { rateLimit } from "@/lib/rate-limit";
import { RawUserDetails, RawExperience, RawEducation, RawProject } from "@/types/portfolio";

export const maxDuration = 60; // PDF extraction + LLM can take a while

const MAX_PDF = 8 * 1024 * 1024; // 8MB
const MAX_TEXT = 16000; // cap résumé text to keep token usage sane

export async function POST(req: NextRequest) {
  // Throttle per IP (no-ops in dev without Redis)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await rateLimit({ key: `resume:${ip}`, limit: 8, windowSeconds: 600 });
  if (!rl.allowed) {
    return Response.json({ error: "Too many résumé uploads. Please try again in a few minutes." }, { status: 429 });
  }

  if (!isAiNativeConfigured()) {
    return Response.json({ error: "Résumé import is not configured." }, { status: 503 });
  }

  // ── Read résumé text (PDF upload or pasted text) ──
  let resumeText = "";
  const contentType = req.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const body = await req.json();
      resumeText = String(body?.text ?? "").trim();
    } else {
      const form = await req.formData();
      const file = form.get("file");
      const pasted = String(form.get("text") ?? "").trim();
      if (file instanceof Blob && file.size > 0) {
        if (file.size > MAX_PDF) return Response.json({ error: "PDF must be under 8MB." }, { status: 400 });
        if (file.type && file.type !== "application/pdf") {
          return Response.json({ error: "Please upload a PDF résumé (or paste the text)." }, { status: 400 });
        }
        const buf = new Uint8Array(await file.arrayBuffer());
        const pdf = await getDocumentProxy(buf);
        const { text } = await extractText(pdf, { mergePages: true });
        resumeText = (Array.isArray(text) ? text.join("\n") : text ?? "").trim();
      } else if (pasted) {
        resumeText = pasted;
      }
    }
  } catch {
    return Response.json({ error: "Couldn't read that file. Try a different PDF or paste the text." }, { status: 400 });
  }

  if (resumeText.length < 30) {
    return Response.json(
      { error: "Couldn't find readable text — if your résumé is a scanned image, paste the text instead." },
      { status: 422 },
    );
  }
  resumeText = resumeText.slice(0, MAX_TEXT);

  // ── Extract structured data via the AI gateway ──
  let content: string;
  try {
    content = await aiNativeChat(
      [{ role: "user", content: buildResumePrompt(resumeText) }],
      { maxTokens: 3000, temperature: 0.1 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    console.error("[resume] AINative error:", msg);
    const friendly =
      msg.includes("402") || msg.includes("insufficient_credits")
        ? "The AI plan doesn't include this yet (insufficient credits). Upgrade the AINative key."
        : "The AI couldn't process your résumé right now. Please try again.";
    return Response.json({ error: friendly }, { status: 502 });
  }

  const parsed = parseRawDetails(content);
  if (!parsed) {
    return Response.json({ error: "Couldn't structure the résumé. Try again or fill the form manually." }, { status: 502 });
  }

  return Response.json({ data: parsed });
}

// ── Parse + normalize the LLM JSON into a full RawUserDetails ──

function parseRawDetails(raw: string): RawUserDetails | null {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let obj: Record<string, unknown> | null = null;
  try {
    obj = JSON.parse(cleaned);
  } catch {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      obj = JSON.parse(m[0]);
    } catch {
      return null;
    }
  }
  if (!obj || typeof obj !== "object") return null;

  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
  const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
  const rec = (v: unknown): Record<string, unknown> => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});

  const socials = rec(obj.socials);

  return {
    name: str(obj.name),
    tagline: str(obj.tagline),
    location: str(obj.location),
    avatarUrl: "",
    userType: obj.userType === "fresher" ? "fresher" : "experienced",
    bio: str(obj.bio),
    openToWork: obj.openToWork === true,
    availability: str(obj.availability),
    skills: list(obj.skills).map(str).filter(Boolean),
    experience: list(obj.experience).map((e): RawExperience => {
      const r = rec(e);
      return { company: str(r.company), role: str(r.role), period: str(r.period), description: str(r.description) };
    }),
    education: list(obj.education).map((e): RawEducation => {
      const r = rec(e);
      return { school: str(r.school), degree: str(r.degree), period: str(r.period), notes: str(r.notes) };
    }),
    projects: list(obj.projects).map((p): RawProject => {
      const r = rec(p);
      return {
        name: str(r.name),
        description: str(r.description),
        techStack: list(r.techStack).map(str).filter(Boolean),
        repoUrl: str(r.repoUrl),
        liveUrl: str(r.liveUrl),
        featured: r.featured === true,
        imageUrl: "",
      };
    }),
    gallery: [],
    socials: {
      github: str(socials.github),
      linkedin: str(socials.linkedin),
      twitter: str(socials.twitter),
      website: str(socials.website),
      email: str(socials.email),
    },
  };
}
