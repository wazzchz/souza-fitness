/**
 * In-memory sliding-window IP rate limiter for Next.js Route Handlers.
 * Senior-grade equivalent of `express-rate-limit` (max 5 req/min on quote endpoints).
 * For multi-instance production, swap Map with Redis (Upstash) — same interface.
 */

interface Bucket {
  hits: number[];
}

const store = new Map<string, Bucket>();

function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAfterMs: number;
}

/** Allow `max` requests per `windowMs` per IP. */
export function rateLimit(req: Request, max = 5, windowMs = 60_000): RateLimitResult {
  const ip = getIp(req);
  const now = Date.now();
  const bucket = store.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= max) {
    const oldest = bucket.hits[0];
    return { allowed: false, remaining: 0, resetAfterMs: windowMs - (now - oldest) };
  }

  bucket.hits.push(now);
  store.set(ip, bucket);
  return { allowed: true, remaining: max - bucket.hits.length, resetAfterMs: windowMs };
}

/** Periodic cleanup to avoid unbounded memory growth. */
if (typeof setInterval !== "undefined") {
  try {
    const timer = setInterval(() => {
      const now = Date.now();
      store.forEach((b: Bucket, k: string) => {
        b.hits = b.hits.filter((t: number) => now - t < 60_000);
        if (b.hits.length === 0) store.delete(k);
      });
    }, 60_000);
    const maybeUnref = timer as unknown as { unref?: () => void };
    if (typeof maybeUnref.unref === "function") maybeUnref.unref();
  } catch {
    /* noop */
  }
}
