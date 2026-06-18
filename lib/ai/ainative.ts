// AINative AI gateway client (OpenAI-compatible /chat/completions).
// Model + key are env-driven so you can swap to Claude once that key is on a
// paid plan — set AINATIVE_MODEL=claude-3-sonnet-0517 and the upgraded key.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiNativeOptions {
  maxTokens?: number;
  temperature?: number;
}

export function isAiNativeConfigured(): boolean {
  return !!process.env.AINATIVE_API_KEY;
}

export async function aiNativeChat(
  messages: ChatMessage[],
  opts: AiNativeOptions = {},
): Promise<string> {
  const apiKey = process.env.AINATIVE_API_KEY;
  const baseUrl = process.env.AINATIVE_BASE_URL || "https://api.ainative.studio/api/v1";
  const model = process.env.AINATIVE_MODEL || "llama-4-maverick-17b";
  if (!apiKey) throw new Error("AINATIVE_API_KEY is not configured");

  const payload = JSON.stringify({
    model,
    messages,
    max_tokens: opts.maxTokens ?? 2048,
    temperature: opts.temperature ?? 0.2,
  });

  // The gateway / network occasionally drops the first connection ("fetch
  // failed"). Retry with backoff so the attempts span the transient window —
  // this is why a manual second try worked. Never retry 4xx (auth/credits).
  const MAX_ATTEMPTS = 4;
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  let lastErr: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: payload,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = new Error(`AINative ${res.status}: ${text.slice(0, 400)}`);
        if (res.status >= 400 && res.status < 500) throw err; // client error — won't self-heal
        lastErr = err;
      } else {
        const json = await res.json();
        const content = json?.choices?.[0]?.message?.content;
        if (typeof content !== "string") throw new Error("AINative returned no content");
        return content;
      }
    } catch (e) {
      if (e instanceof Error && /AINative 4\d\d/.test(e.message)) throw e; // don't retry 4xx
      lastErr = e;
    }

    if (attempt < MAX_ATTEMPTS) await sleep(800 * attempt); // 0.8s, 1.6s, 2.4s
  }

  throw lastErr instanceof Error ? lastErr : new Error("AINative request failed");
}
