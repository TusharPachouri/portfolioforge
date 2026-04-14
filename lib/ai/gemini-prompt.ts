import { RawUserDetails } from "@/types/portfolio";

export function buildPrompt(raw: RawUserDetails): string {
  return `You are a professional technical writer helping ${raw.userType === "fresher" ? "a student or recent graduate" : "an experienced professional"} create a standout developer portfolio.

Given the raw details below, produce a polished JSON object matching EXACTLY the schema at the end. Rules:
- Never invent facts. Only use what is provided.
- Write in first person, confident tone. No filler words like "passionate", "enthusiastic", "dedicated".
- ${raw.userType === "fresher" ? "Emphasize learning velocity, tech depth, and openness to opportunities." : "Emphasize impact, ownership, and metrics where provided."}
- Keep tagline under 140 chars — punchy and specific.
- Bio: 1–3 short paragraphs, max 600 chars each.
- Highlights: max 5 short bullet phrases (no full sentences needed).
- Group skills into logical categories: Languages, Frontend, Backend, Database, DevOps, Design, Other.
- Project descriptions: max 280 chars, lead with what it does and the key technical decision.
- Experience descriptions: max 400 chars, lead with impact.
- seoTitle: max 60 chars. seoDescription: max 160 chars.
- Respond with ONLY valid JSON — no markdown, no commentary.

RAW DATA:
${JSON.stringify(raw, null, 2)}

OUTPUT SCHEMA (respond with this exact shape):
{
  "hero": {
    "name": "string",
    "tagline": "string (max 140 chars)",
    "avatarUrl": "string",
    "location": "string",
    "openToWork": boolean,
    "availability": "string",
    "ctaPrimary": { "label": "string", "href": "string" },
    "ctaSecondary": { "label": "string", "href": "string" }
  },
  "about": {
    "paragraphs": ["string"],
    "highlights": ["string"]
  },
  "skills": {
    "categories": [{ "name": "string", "items": ["string"] }]
  },
  "projects": [{
    "name": "string",
    "description": "string (max 280 chars)",
    "techStack": ["string"],
    "repoUrl": "string",
    "liveUrl": "string",
    "featured": boolean,
    "role": "string"
  }],
  "experience": [{
    "company": "string",
    "role": "string",
    "period": "string",
    "description": "string (max 400 chars)"
  }],
  "education": [{
    "school": "string",
    "degree": "string",
    "period": "string",
    "notes": "string"
  }],
  "contact": {
    "email": "string",
    "socials": { "platform": "url" }
  },
  "meta": {
    "seoTitle": "string (max 60 chars)",
    "seoDescription": "string (max 160 chars)",
    "keywords": ["string"]
  }
}`;
}
