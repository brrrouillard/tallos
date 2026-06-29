// Simple in-memory rate limiter. Per-instance and resets on restart — fine for
// the MVP's single long-lived server. Swap for a shared store (Redis) if this
// ever runs multi-instance or serverless.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();

export const checkRateLimit = (
  identifier: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult => {
  const now = Date.now();
  const entry = buckets.get(identifier);

  if (!entry || entry.resetAt < now) {
    buckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
};
