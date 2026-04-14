import { redis } from "./redis";
import { NextRequest, NextResponse } from "next/server";

interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
  key: string;
}

export async function rateLimit({ key, limit, windowSeconds }: RateLimitOptions): Promise<{
  allowed: boolean;
  remaining: number;
  reset: number;
}> {
  if (!redis) {
    // No Redis = no rate limiting (dev mode)
    return { allowed: true, remaining: limit, reset: 0 };
  }

  const now = Math.floor(Date.now() / 1000);
  const window = Math.floor(now / windowSeconds);
  const redisKey = `rl:${key}:${window}`;

  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.expire(redisKey, windowSeconds * 2);
  }

  const remaining = Math.max(0, limit - count);
  const reset = (window + 1) * windowSeconds;

  return { allowed: count <= limit, remaining, reset };
}

export async function rateLimitRequest(
  req: NextRequest,
  userId?: string,
): Promise<NextResponse | null> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = userId ? `user:${userId}` : `ip:${ip}`;
  const limit = userId ? 120 : 30;

  const result = await rateLimit({ key, limit, windowSeconds: 60 });

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(result.reset),
          "Retry-After": String(result.reset - Math.floor(Date.now() / 1000)),
        },
      }
    );
  }

  return null;
}
