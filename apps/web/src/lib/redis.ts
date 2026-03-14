import Redis from "ioredis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.REDIS_URL;
  if (!url) return null;

  try {
    redis = new Redis(url, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => (times > 2 ? null : Math.min(times * 200, 1000)),
      lazyConnect: true,
    });

    redis.on("error", () => {
      // Silently handle Redis errors — app works without cache
    });

    return redis;
  } catch {
    return null;
  }
}

/**
 * Get a cached value, or compute and cache it.
 * Falls through to the compute function if Redis is unavailable.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  compute: () => Promise<T>
): Promise<T> {
  const client = getRedis();
  if (!client) return compute();

  try {
    const hit = await client.get(key);
    if (hit) return JSON.parse(hit) as T;
  } catch {
    // Cache miss or Redis error — compute fresh
  }

  const value = await compute();

  try {
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    // Failed to cache — that's fine
  }

  return value;
}

/**
 * Invalidate a cache key or pattern.
 */
export async function invalidateCache(pattern: string): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    if (pattern.includes("*")) {
      const keys = await client.keys(pattern);
      if (keys.length > 0) await client.del(...keys);
    } else {
      await client.del(pattern);
    }
  } catch {
    // Ignore cache invalidation errors
  }
}

export { getRedis };
