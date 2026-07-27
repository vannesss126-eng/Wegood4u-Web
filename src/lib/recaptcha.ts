/**
 * Google reCAPTCHA v3 server-side verification — the human check for the
 * contact + partnership forms (DIRECTION-SECURITY §5).
 *
 * No package (§5 supply-chain rule: "copy code in, don't install unknown
 * packages") — just a POST to the documented siteverify endpoint, server-side,
 * so `RECAPTCHA_SECRET_KEY` never reaches the browser.
 *
 * v3 is INVISIBLE and SCORE-BASED: there is no puzzle to solve. Google returns
 * a 0.0–1.0 score (1.0 = almost certainly human) and we reject below a
 * threshold. That means it degrades quietly rather than blocking hard, which is
 * why the honeypot + timing trap + rate limit in the server actions stay in
 * place — this is defence in depth, not a replacement for them.
 *
 * GATED: if `RECAPTCHA_SECRET_KEY` is unset, verification is SKIPPED (dev / an
 * unconfigured preview) and the form still relies on the other three checks.
 * §5 requires "honeypot OR Turnstile"; the honeypot satisfies that on its own.
 *
 * `lib/turnstile.ts` is the dormant Cloudflare alternative — nothing imports it.
 * Configure ONE of the two, not both.
 */
const SITEVERIFY = "https://www.google.com/recaptcha/api/siteverify";

/**
 * Google's own recommended default. Lower = more permissive. Raise toward 0.7
 * only if spam gets through; every 0.1 up also turns away more real people, and
 * a rejected human has no way to appeal (v3 has no fallback challenge).
 */
const MIN_SCORE = 0.5;

/** A verify that hangs must not hang the form submission behind it. */
const TIMEOUT_MS = 8000;

type SiteverifyResponse = {
  success?: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  challenge_ts?: string;
  "error-codes"?: string[];
};

/**
 * @param token          the `g-recaptcha-response` value minted by the browser
 * @param expectedAction the action name the client used (e.g. "contact")
 * @param ip             best-effort client IP, forwarded to Google as a signal
 */
export async function verifyRecaptcha(
  token: string | null,
  expectedAction: string,
  ip?: string,
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // not configured → skip (honeypot covers §5)

  if (!token) {
    // Either a bot that never ran our JS, or a real person whose browser
    // blocked google.com. Logged distinctly so a misconfigured deploy (secret
    // set server-side but NEXT_PUBLIC_RECAPTCHA_SITE_KEY missing client-side)
    // is obvious in the logs instead of looking like a wave of spam.
    console.warn(
      `[recaptcha] no token for action "${expectedAction}" — bot, blocked script, or a missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY.`,
    );
    return false;
  }

  try {
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const data = (await res.json()) as SiteverifyResponse;

    if (!data.success) {
      console.warn("[recaptcha] verify failed:", data["error-codes"]);
      return false;
    }

    // The action binds a token to THIS form. Without this check a token minted
    // anywhere else on the site would be replayable against the form — the
    // single most-skipped step of a v3 integration.
    if (data.action !== expectedAction) {
      console.warn(
        `[recaptcha] action mismatch — got "${data.action}", expected "${expectedAction}".`,
      );
      return false;
    }

    const score = data.score ?? 0;
    if (score < MIN_SCORE) {
      console.warn(`[recaptcha] score ${score} < ${MIN_SCORE} — rejected.`);
      return false;
    }

    return true;
  } catch (err) {
    // Fail CLOSED — a verify that errored is not a verify that passed. The
    // trade-off is deliberate: if Google is unreachable, the form stops
    // accepting submissions and shows its mailto fallback rather than opening
    // an unguarded pipe to the enquiry inbox.
    console.error("[recaptcha] verify threw:", err);
    return false;
  }
}
