/**
 * Cloudflare Turnstile server-side verification.
 *
 * ⚠️ DORMANT — nothing imports this. The active human check is reCAPTCHA v3
 * (`lib/recaptcha.ts`), wired into both form actions. Kept as the drop-in
 * alternative if we ever move off Google. Configure ONE of the two, not both.
 *
 * No package (DIRECTION-SECURITY §5 supply-chain rule: "copy code in, don't
 * install unknown packages") — just a POST to the documented siteverify
 * endpoint, server-side, so the secret never reaches the browser.
 *
 * GATED: if `TURNSTILE_SECRET_KEY` is unset, verification is SKIPPED and the
 * form still relies on the honeypot + timing trap + rate limit. §5 requires
 * "honeypot OR Turnstile", and the honeypot satisfies that on its own, so the
 * form is spec-compliant with Turnstile off. To turn it on:
 *   1. Add TURNSTILE_SECRET_KEY (server) + NEXT_PUBLIC_TURNSTILE_SITE_KEY.
 *   2. Render the widget in PartnershipForm (it reads the public key).
 *   3. Add `https://challenges.cloudflare.com` to script-src/frame-src in the
 *      CSP (next.config.ts) — the widget loads a Cloudflare script + iframe.
 */
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string | null,
  ip?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → skip (honeypot covers §5)
  if (!token) return false;

  try {
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
      // Never let a slow verify hang the request forever.
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false; // fail CLOSED — a verify that errored is not a verify that passed
  }
}
