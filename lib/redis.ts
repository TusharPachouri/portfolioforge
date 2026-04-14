import { Redis } from "@upstash/redis";

const FREE_DAILY_LIMIT = 5;

// Lazy singleton — null when not configured
function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const redis = createRedis();

export async function getAiUsageToday(userId: string): Promise<number> {
  if (!redis) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const count = await redis.get<number>(`ai_usage:${userId}:${today}`);
  return count ?? 0;
}

export async function incrementAiUsage(userId: string): Promise<number> {
  if (!redis) return 1;
  const today = new Date().toISOString().slice(0, 10);
  const key = `ai_usage:${userId}:${today}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 48 * 60 * 60); // 48h TTL
  }
  return count;
}

export async function canGenerateAi(userId: string, userRole: string): Promise<boolean> {
  if (userRole === "pro" || userRole === "admin") return true;
  if (!redis) return true; // No Redis = no rate limiting (dev mode)
  const usage = await getAiUsageToday(userId);
  return usage < FREE_DAILY_LIMIT;
}

export { FREE_DAILY_LIMIT };
