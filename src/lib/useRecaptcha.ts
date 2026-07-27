"use client";

import { useCallback, useEffect } from "react";

/**
 * Client half of the reCAPTCHA v3 check (server half: `lib/recaptcha.ts`).
 *
 * Loads Google's script on mount and returns an `execute(action)` that mints a
 * fresh token at SUBMIT time. Freshness matters: v3 tokens expire after ~2
 * minutes, so a token minted on mount would be dead by the time someone
 * finishes typing a message. Minting per submission is the documented pattern.
 *
 * The script is only pulled in by the two form islands, so the badge and the
 * ~130KB of Google JS never load on the other 40-odd pages of the site.
 *
 * Every failure path returns `null` rather than throwing — a form must never
 * break because a third-party script didn't load. The server decides what a
 * missing token means (it rejects, once the secret is configured).
 */

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const SRC_PREFIX = "https://www.google.com/recaptcha/api.js";

type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

/** Poll for the script to finish loading (someone can submit before it does). */
async function waitForGrecaptcha(timeoutMs = 10_000): Promise<Grecaptcha | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (typeof window.grecaptcha?.execute === "function") return window.grecaptcha;
    await new Promise((r) => setTimeout(r, 100));
  }
  return null;
}

export function useRecaptcha() {
  useEffect(() => {
    if (!SITE_KEY) return;
    // Both forms can't co-exist on one page today, but guard anyway — loading
    // api.js twice re-registers the badge and throws in the console.
    if (document.querySelector(`script[src^="${SRC_PREFIX}"]`)) return;

    const script = document.createElement("script");
    script.src = `${SRC_PREFIX}?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    // Deliberately NOT removed on unmount: grecaptcha registers global state and
    // tearing the script out mid-session leaves it unusable on a re-mount.
  }, []);

  return useCallback(async (action: string): Promise<string | null> => {
    if (!SITE_KEY) return null;

    const grecaptcha = await waitForGrecaptcha();
    if (!grecaptcha) {
      console.warn("[recaptcha] script never loaded — submitting without a token.");
      return null;
    }

    try {
      await new Promise<void>((resolve) => grecaptcha.ready(resolve));
      return await grecaptcha.execute(SITE_KEY, { action });
    } catch (err) {
      console.warn("[recaptcha] execute failed:", err);
      return null;
    }
  }, []);
}
