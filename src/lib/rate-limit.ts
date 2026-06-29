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
const SWEEP_INTERVAL_MS = 60_000;
let lastSweep = 0;

// Drop every expired bucket. Throttled to at most once per window so the map
// can't grow unbounded with one-off IPs that never return, without scanning on
// every request.
const sweepExpired = (now: number): void => {
  if (now - lastSweep < SWEEP_INTERVAL_MS) {
    return;
  }
  lastSweep = now;
  for (const [key, entry] of buckets) {
    if (entry.resetAt < now) {
      buckets.delete(key);
    }
  }
};

export const checkRateLimit = (
  identifier: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult => {
  const now = Date.now();
  sweepExpired(now);
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
