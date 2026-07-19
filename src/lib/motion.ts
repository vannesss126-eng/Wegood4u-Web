"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Motion conventions — DESIGN.md §7. Use these, not ad-hoc values. */
export const EASE = {
  out: "power3.out",
  scrub: "none",
  idle: "sine.inOut",
} as const;

export const DURATION = {
  micro: 0.25,
  component: 0.7,
  hero: 1.3,
} as const;

export const STAGGER = { words: 0.06, cards: 0.1 } as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * gsap.context with React-safe cleanup. Skips `fn` entirely under reduced
 * motion unless a `reducedFn` fallback (simple fades only) is provided.
 */
export function useGsap(
  fn: (ctx: gsap.Context) => void,
  deps: unknown[] = [],
  reducedFn?: (ctx: gsap.Context) => void,
) {
  useEffect(() => {
    const run = prefersReducedMotion() ? reducedFn : fn;
    if (!run) return;
    const ctx = gsap.context(run);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { gsap, ScrollTrigger, SplitText };
