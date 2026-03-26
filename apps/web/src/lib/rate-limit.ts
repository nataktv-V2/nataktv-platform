/**
 * Redis-backed rate limiter using sliding window.
 * Falls back to in-memory if Redis is unavailable.
 */

import { getRedis } from "./redis";

const memoryStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired memory entries every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (entry.resetAt < now) memoryStore.delete(key);
  }
}, 60_000);

export async function rateLimitAsync(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): Promise<{ success: boolean; remaining: number }> {
  const redis = getRedis();
  if (redis) {
    try {
      const redisKey = `rl:${key}`;
      const windowSec = Math.ceil(windowMs / 1000);
      const count = await redis.incr(redisKey);
      if (count === 1) await redis.expire(redisKey, windowSec);
      if (count > limit) return { success: false, remaining: 0 };
      return { success: true, remaining: limit - count };
    } catch {
      // Redis failed, fall through to memory
    }
  }
  return rateLimit(key, { limit, windowMs });
}

/**
 * Synchronous in-memory rate limiter (fallback).
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

/**
 * Get client IP from request headers (works behind proxies).
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
