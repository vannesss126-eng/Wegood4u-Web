/**
 * Best-effort in-memory rate limiter.
 *
 * ⚠ On Vercel serverless this is PER-INSTANCE and resets on cold start — so it
 * is defense-in-depth, NOT a hard guarantee. It does blunt a burst hitting one
 * warm instance, which is worth having. The PRIMARY bot defenses on the
 * partnership form are the honeypot + timing trap + (optional) Turnstile.
 *
 * For a durable limit (shared across instances, survives cold starts), wire
 * Vercel KV / Upstash and swap the Map for a store — tracked in REDEVELOP-PLAN.
 */

const hits = new Map<string, number[]>();

/**
 * @returns true if the request is allowed, false if the limit is exceeded.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the Map can't grow unbounded on a long-lived
  // instance. Crude but sufficient for a low-traffic contact form.
  if (hits.size > 5000) hits.clear();

  return true;
}
