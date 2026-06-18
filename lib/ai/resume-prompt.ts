// Prompt that turns raw résumé text into a RawUserDetails-shaped JSON object.

export function buildResumePrompt(resumeText: string): string {
  return `You are a precise résumé parser. Read the résumé below and output ONLY a single JSON object matching the schema exactly.

RULES
- Never invent facts. Use only what is in the résumé. Leave unknown string fields as "" and unknown arrays as [].
- userType: "fresher" if the person is a student or recent graduate with little/no full-time experience, otherwise "experienced".
- openToWork: true ONLY if the résumé explicitly states they are seeking or open to opportunities; otherwise false.
- skills: a flat de-duplicated list of distinct technologies/skills.
- tagline: a short professional headline (max 120 chars) based on their title and expertise.
- bio: a 2–4 sentence professional summary written in the first person.
- For each experience and education entry, "period" is a human string like "Jan 2022 – Present" or "2019 – 2023".
- projects: include only real projects mentioned; techStack is an array of technologies.
- socials: extract full URLs when present; email is the contact email.
- Respond with ONLY the JSON object. No markdown fences, no commentary.

SCHEMA
{
  "name": "string",
  "tagline": "string",
  "location": "string",
  "userType": "experienced" | "fresher",
  "bio": "string",
  "openToWork": boolean,
  "availability": "string",
  "skills": ["string"],
  "experience": [{ "company": "string", "role": "string", "period": "string", "description": "string" }],
  "education": [{ "school": "string", "degree": "string", "period": "string", "notes": "string" }],
  "projects": [{ "name": "string", "description": "string", "techStack": ["string"], "repoUrl": "string", "liveUrl": "string", "featured": false }],
  "socials": { "github": "string", "linkedin": "string", "twitter": "string", "website": "string", "email": "string" }
}

RÉSUMÉ
${resumeText}`;
}
