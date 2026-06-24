/**
 * Layered rate limiting for the public strategy endpoint.
 *
 * Uses Upstash Redis when configured (durable + distributed across all
 * serverless instances and regions). Falls back to an in-memory limiter,
 * which is effective on a warm Fluid Compute instance but per-instance.
 *
 * To enable the durable backend, provision Upstash Redis (Vercel Marketplace)
 * and set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or the KV_* names).
 */

type Window = { name: string; limit: number; windowMs: number; tokens: string };

// Most restrictive window wins. Tuned for a lead-capture hook.
const WINDOWS: Window[] = [
  { name: 'burst', limit: 5, windowMs: 60_000, tokens: '60 s' },
  { name: 'hour', limit: 25, windowMs: 60 * 60_000, tokens: '1 h' },
  { name: 'day', limit: 60, windowMs: 24 * 60 * 60_000, tokens: '24 h' },
];

export type RateResult = {
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number; // epoch ms
  retryAfter?: number; // seconds
};

/* ----------------------------- in-memory ----------------------------- */

type Bucket = { count: number; reset: number };
const store = new Map<string, Bucket>();
const MAX_KEYS = 50_000;

function memHit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  let b = store.get(key);
  if (!b || b.reset <= now) {
    b = { count: 0, reset: now + windowMs };
    store.set(key, b);
  }
  b.count += 1;

  if (store.size > MAX_KEYS) {
    for (const [k, v] of store) {
      if (v.reset <= now) store.delete(k);
      if (store.size <= MAX_KEYS) break;
    }
  }
  return { allowed: b.count <= limit, remaining: Math.max(0, limit - b.count), reset: b.reset };
}

/* ------------------------------ upstash ------------------------------ */

type UpstashLimiters = Record<string, { limit: (id: string) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }> }>;
let upstash: UpstashLimiters | null = null;
let upstashTried = false;

async function getUpstash(): Promise<UpstashLimiters | null> {
  if (upstashTried) return upstash;
  upstashTried = true;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const { Ratelimit } = await import('@upstash/ratelimit');
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({ url, token });
    upstash = {};
    for (const w of WINDOWS) {
      upstash[w.name] = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(w.limit, w.tokens as `${number} ${'s' | 'm' | 'h' | 'd'}`),
        prefix: `selerim:strategy:${w.name}`,
        analytics: false,
      });
    }
  } catch (error) {
    console.error('[rate-limit] Upstash init failed, using in-memory:', error);
    upstash = null;
  }
  return upstash;
}

/* ------------------------------- api -------------------------------- */

export async function rateLimit(identifier: string): Promise<RateResult> {
  const id = identifier || 'unknown';
  const up = await getUpstash();

  if (up) {
    for (const w of WINDOWS) {
      const r = await up[w.name].limit(id);
      if (!r.success) {
        return {
          success: false,
          limit: r.limit,
          remaining: r.remaining,
          reset: r.reset,
          retryAfter: Math.max(1, Math.ceil((r.reset - Date.now()) / 1000)),
        };
      }
    }
    return { success: true };
  }

  for (const w of WINDOWS) {
    const r = memHit(`${w.name}:${id}`, w.limit, w.windowMs);
    if (!r.allowed) {
      return {
        success: false,
        limit: w.limit,
        remaining: 0,
        reset: r.reset,
        retryAfter: Math.max(1, Math.ceil((r.reset - Date.now()) / 1000)),
      };
    }
  }
  return { success: true };
}

/** Best-effort client IP from trusted proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const ip = xff.split(',')[0].trim();
    if (ip) return ip;
  }
  return req.headers.get('x-real-ip') || 'unknown';
}
