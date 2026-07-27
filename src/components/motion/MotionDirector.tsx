"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "@/i18n/navigation";
import { useEffect, useLayoutEffect } from "react";

import {
  DURATION,
  EASE,
  STAGGER,
  ScrollTrigger,
  SplitText,
  gsap,
  prefersReducedMotion,
} from "@/lib/motion";

/**
 * MotionDirector — the marketing site's one motion layer.
 *
 * Sections stay server components. They emit `data-anim` hooks and nothing
 * else; this single client component reads those hooks and wires the motion.
 * That keeps `"use client"` off every section, keeps the choreography in one
 * readable timeline instead of scattered across eight files, and means a new
 * section opts in by adding an attribute.
 *
 * Rules this file is built around (DESIGN §7/§8):
 *
 *  · **Everything is `gsap.from()`, never a CSS hidden state.** The DOM ships
 *    fully visible. No JS, a thrown error, reduced motion, or a crawler — all
 *    of them see finished content. Nothing here is load-bearing for reading
 *    the page.
 *  · **`prefers-reduced-motion: reduce` exits before a single tween is made.**
 *    Hard requirement, not a nice-to-have. Lenis is already killed upstream in
 *    SmoothScroll, so the page falls back to plain native scroll.
 *  · **Transform, opacity and stroke-dashoffset only.** No layout properties,
 *    so nothing here can contribute to CLS.
 *  · **No pinning.** DESIGN §8 forbids scroll-jacking and the arcs read better
 *    scrubbed in place; pinning also behaves worst on the phones this audience
 *    actually uses. The flight path is scrubbed, not pinned.
 *  · **One ornament, one showstopper.** The brand's dotted flight path is the
 *    only decorative device on the page, so it is the only thing that gets a
 *    scroll-linked reveal. Every other section is a quiet fade-up.
 */

/**
 * Enter-reveal defaults — DESIGN §7: 24px, 0.7s, power3.out, once.
 *
 * `clearProps: "transform"` is load-bearing, not tidiness. Many reveal targets
 * are cards that ALSO carry a CSS `transition-transform` for their hover-lift.
 * While GSAP animates `transform`, that CSS transition fights it frame by frame,
 * and the transform can settle stuck at the 24px start offset (opacity finishes,
 * the card never drops back to y:0). Clearing the transform on complete hands it
 * back to CSS cleanly, so the card ends at its natural position and the hover
 * still works.
 */
const ENTER = {
  y: 24,
  duration: DURATION.component,
  ease: EASE.out,
  clearProps: "transform",
} as const;
/**
 * Reveal trigger point. Was "top 75%" — but on long pages a section's card grid
 * sits below its head, so the head crossed 75% while the grid was still hidden,
 * leaving the section looking half-empty as you scrolled in (reads as "stuck").
 * "top 90%" fires as the element enters the lower edge, so content fills in the
 * moment a section appears instead of a beat later.
 */
const START = "top 90%";

/**
 * The flight paths are revealed by scaling their SVG clip rect from 0 → 1
 * horizontally, never by animating stroke-dashoffset.
 *
 * Dash-offset "drawing" only works on a solid stroke. These paths are dotted —
 * that is the whole motif — so offsetting the dash just slides the dots along
 * a line that is already fully visible. Swapping the dasharray to a single
 * long dash and restoring it afterwards does draw correctly, but the restore
 * is one-way: a scrubbed tween that reverses then finds the dotted pattern
 * back in place and silently stops working.
 *
 * A clip wipe has neither problem. It is pure transform (compositor-friendly),
 * it keeps the dot spacing fixed while the line arrives, and it reverses
 * perfectly, which is what `scrub` needs.
 */
const WIPE_FROM = { scaleX: 0, transformOrigin: "0% 50%" } as const;

/** Sticky nav height — an anchor target must land below it, not under it. */
const NAV_H = 72;

export default function MotionDirector() {
  // This component lives in the persistent (marketing) layout, so it does NOT
  // remount on client-side navigation. Without re-keying on the path, the setup
  // effect (deps were `[]`) ran once and never wired the NEXT page's data-anim
  // hooks — so section-head reveals silently stopped animating after any in-app
  // nav (e.g. → /membership). Re-running per pathname fixes that; the effect's
  // ctx.revert() cleanup tears down the previous page's triggers first.
  const pathname = usePathname();

  // Lenis owns the scroll position, so ScrollTrigger has to read it from Lenis
  // rather than from native scroll events — otherwise triggers fire a frame or
  // two late and the scrubbed arc visibly lags the page. Returns undefined
  // under reduced motion (SmoothScroll renders no provider); that is fine.
  const lenis = useLenis(() => ScrollTrigger.update());

  /**
   * Same-page anchor links (`/#get`, `#how-it-works`).
   *
   * Lenis does not intercept these, and it must: while Lenis is driving, a
   * native hash jump teleports the page and leaves Lenis's internal position
   * out of sync with the real scroll, so the next wheel event snaps back.
   *
   * Delegated from the document rather than bound per-link, because the CTAs
   * live in three different server components and the mobile overlay mounts and
   * unmounts. Duration 1.2s is DESIGN §7's anchor spec.
   */
  useEffect(() => {
    if (!lenis) return; // reduced motion → no provider → native behaviour is correct

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;

      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Accept "#id" and "/#id"; ignore links to other pages or origins.
      const hash = href.startsWith("#")
        ? href
        : href.startsWith("/#") && window.location.pathname === "/"
          ? href.slice(1)
          : null;
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return; // let the browser 404 the anchor rather than swallow it

      e.preventDefault();
      // Scroll to an explicit pixel position rather than passing the element
      // plus an `offset`: measured, the element form landed the section flush
      // at y=0, i.e. tucked under the 72px sticky nav. Computing the number
      // here is unambiguous and immune to how Lenis interprets `offset`.
      const top =
        target.getBoundingClientRect().top + window.scrollY - NAV_H;
      lenis.scrollTo(top, { duration: 1.2 });
      // Keep the URL honest so the link is copyable and the back button works.
      window.history.pushState(null, "", hash);
    };

    // CAPTURE phase, not bubble. These CTAs render as `next/link`, and React
    // attaches its synthetic handlers at the app root — which is *below*
    // document — so a bubble-phase listener here runs AFTER Next has already
    // performed its own instant hash jump. Measured: the page teleported to the
    // anchor and `preventDefault()` arrived too late to stop it. Capturing on
    // document gets us in front of Next's handler.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [lenis]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const splits: SplitText[] = [];

    // useLayoutEffect so every `from()` start state is set before the browser
    // paints. In a plain useEffect the finished content paints first and then
    // snaps back to hidden — a visible flash on every load.
    const ctx = gsap.context(() => {
      const q = <T extends Element>(sel: string) =>
        gsap.utils.toArray<T>(sel);

      /* ───────────────────────────── /membership ────────────────────────────
         One clean entrance per element: a single fade-up, all at once. No
         stagger, no word-rise, no chained timeline, no count-up — the client
         asked for the motion to happen ONE time, together, not as a run of
         delayed pop-ups. Each element animates once (once: true).

         The hero is above the fold, so it fades up on LOAD (not scroll-tied) —
         that also keeps the only in-view content from sitting visible then
         jumping. Everything else is pre-hidden by gsap.from until its section
         enters. Reduced motion returned above; the DOM still ships visible. */
      if (pathname === "/membership") {
        // Hero — everything in it fades up together, on load.
        const hero = document.querySelector<HTMLElement>("[data-mhero]");
        if (hero) {
          const heroEls = gsap.utils.toArray<HTMLElement>(
            '[data-anim="reveal"], [data-anim="text-reveal"]',
            hero,
          );
          if (heroEls.length) gsap.from(heroEls, { ...ENTER, opacity: 0 });
        }

        // Below the fold — each section head, standalone block and card grid
        // fades up as a single block the moment it enters. Card grids animate
        // by their container, so the whole grid moves as one (no per-card
        // stagger) and the cards keep their own hover transforms untouched.
        const targets = [
          ...q<HTMLElement>('[data-anim="head"]'),
          ...q<HTMLElement>('[data-anim="reveal"]').filter(
            (el) => !el.closest("[data-mhero]"),
          ),
          ...q<HTMLElement>('[data-anim="reveal-group"]'),
        ];
        targets.forEach((el) => {
          gsap.from(el, {
            ...ENTER,
            opacity: 0,
            scrollTrigger: { trigger: el, start: START, once: true },
          });
        });

        return;
      }

      /* ─────────────────────────── hero, on load ───────────────────────────
         One orchestrated entrance, not six scattered effects. Order follows
         reading order: label → headline → supporting lines, with the product
         rising alongside so the page never looks like text-then-image. */
      const heroTitle = document.querySelector<HTMLElement>(
        '[data-anim="hero-title"]',
      );

      const tl = gsap.timeline({
        defaults: { ease: EASE.out, duration: DURATION.component },
      });

      tl.from('[data-anim="hero-eyebrow"]', { opacity: 0, y: 12 });

      if (heroTitle) {
        // Words, not chars: a 40-character headline split per letter is 40
        // extra DOM nodes for screen readers to stumble over, and word-rise is
        // what DESIGN §7 actually specifies.
        //
        // ⚠ THIS ANIMATION IS THE PAGE'S LCP. Lighthouse identifies the <h1> as
        // the Largest Contentful Paint element, and LCP does not count an
        // element while it is at opacity 0 — so the headline's reveal time IS
        // the LCP number. At the original 1.3s duration / 0.06s stagger,
        // starting 0.35s in, the last word landed ~2.1s after hydration and
        // mobile LCP measured 2.9s against a <2.5s goal.
        //
        // Tightened to 0.85s / 0.04s and started at the very top of the
        // timeline. The cascade is still legible — it is the same motion, just
        // less dwell — and it buys roughly a second of LCP. Do not lengthen
        // these without re-running the mobile Lighthouse; this is a
        // Core-Web-Vitals budget, not a taste setting.
        try {
          const split = new SplitText(heroTitle, {
            type: "words",
            wordsClass: "inline-block",
          });
          splits.push(split);
          tl.from(
            split.words,
            {
              opacity: 0,
              yPercent: 110,
              duration: 0.85,
              stagger: 0.04,
            },
            0,
          );
        } catch {
          // SplitText unavailable → the headline still arrives, just whole.
          tl.from(heroTitle, { opacity: 0, y: 24 }, 0);
        }
      }

      tl.from(
        '[data-anim="hero-line"]',
        { opacity: 0, y: 20, stagger: 0.08 },
        "-=0.8",
      )
        .from(
          '[data-anim="hero-visual"]',
          { opacity: 0, y: 40, scale: 0.96, duration: DURATION.hero },
          "-=1.1",
        )
        // The credit pill is the payoff of the whole hero, so it lands last
        // and slightly overshoots — the only bounce on the page.
        .from(
          '[data-anim="hero-credit"]',
          { opacity: 0, scale: 0.7, duration: 0.5, ease: "back.out(2)" },
          "-=0.4",
        );

      // The flight path draws alongside the headline, starting early so it
      // reads as the page arriving rather than as a separate effect.
      tl.from(
        '[data-anim="hero-wipe"]',
        { ...WIPE_FROM, duration: 1.6, ease: EASE.out },
        0.2,
      );

      /* ───────────────────── section heads + stagger groups ─────────────────
         Every section head reveals identically. Uniform rhythm is the point:
         the page should feel like one system, and variety here would compete
         with the flight path, which is the only thing meant to be noticed. */
      q<HTMLElement>('[data-anim="head"]').forEach((head) => {
        gsap.from(head, {
          ...ENTER,
          opacity: 0,
          scrollTrigger: { trigger: head, start: START, once: true },
        });
      });

      // Generic block reveal — any element that should fade-up on enter (e.g. the
      // /projects intro columns and CTA). Same rhythm as a head.
      q<HTMLElement>('[data-anim="reveal"]').forEach((el) => {
        gsap.from(el, {
          ...ENTER,
          opacity: 0,
          scrollTrigger: { trigger: el, start: START, once: true },
        });
      });

      // Staggered reveal group — the container triggers; its [data-anim=
      // "reveal-item"] children fade-up in sequence (e.g. project highlight cards).
      q<HTMLElement>('[data-anim="reveal-group"]').forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>(
          '[data-anim="reveal-item"]',
          group,
        );
        if (!items.length) return;
        gsap.from(items, {
          ...ENTER,
          opacity: 0,
          stagger: STAGGER.cards,
          scrollTrigger: { trigger: group, start: START, once: true },
        });
      });

      // Word-rise headline reveal — the same SplitText motion as the hero, but
      // scroll-triggered for any heading below the fold. Falls back to a plain
      // fade-up if SplitText is unavailable, and (like all of this) is skipped
      // entirely under reduced motion.
      q<HTMLElement>('[data-anim="text-reveal"]').forEach((el) => {
        try {
          const split = new SplitText(el, {
            type: "words",
            wordsClass: "inline-block",
          });
          splits.push(split);
          gsap.from(split.words, {
            opacity: 0,
            yPercent: 110,
            duration: 0.8,
            ease: EASE.out,
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: START, once: true },
          });
        } catch {
          gsap.from(el, {
            ...ENTER,
            opacity: 0,
            scrollTrigger: { trigger: el, start: START, once: true },
          });
        }
      });

      // Grouped children stagger within their own container so the delay
      // restarts per section instead of accumulating down the page.
      const GROUPS = [
        { sel: '[data-anim="step"]', stagger: STAGGER.cards },
        { sel: '[data-anim="benefit-row"]', stagger: STAGGER.cards },
        { sel: '[data-anim="field-row"]', stagger: 0.08 },
        { sel: '[data-anim="country-block"]', stagger: 0.12 },
      ];

      GROUPS.forEach(({ sel, stagger }) => {
        const items = q<HTMLElement>(sel);
        if (!items.length) return;
        gsap.from(items, {
          ...ENTER,
          opacity: 0,
          stagger,
          scrollTrigger: { trigger: items[0], start: START, once: true },
        });
      });

      /* ──────────────── /partnership work grid: photo stagger ───────────────
         The 12-photo "work in action" grid sweeps in on scroll — a grid-aware
         stagger over a fixed ~0.6s total, not per-item (which would crawl).
         Triggers on the group wrapper, once. (The trusted-partner logos are a
         CSS marquee now, not a grid — they animate themselves.) */
      (() => {
        const items = q<HTMLElement>('[data-anim="work-tile"]');
        const trig = document.querySelector('[data-anim="work-group"]');
        if (!items.length || !trig) return;
        gsap.from(items, {
          opacity: 0,
          y: 20,
          duration: DURATION.component,
          ease: EASE.out,
          stagger: { amount: 0.6, from: "start", grid: "auto" },
          scrollTrigger: { trigger: trig, start: START, once: true },
        });
      })();

      /* ──────────────── /about collage: shapes-first + float loop ────────────
         The coral accent shapes pop in FIRST, then the photos and text follow a
         beat later. After the entrance, shapes and photos drift up/down forever
         on offset phases so the collage feels alive. Entrance animates only
         opacity+scale, the float animates only y — so the two never fight over
         the transform. (Reduced motion skips everything: this whole effect
         returns early above, leaving the collage static and visible.) */
      q<HTMLElement>('[data-anim="collage"]').forEach((group) => {
        const orbs = gsap.utils.toArray<HTMLElement>('[data-anim="orb"]', group);
        const imgs = gsap.utils.toArray<HTMLElement>('[data-anim="float-img"]', group);
        const rises = gsap.utils.toArray<HTMLElement>('[data-anim="rise"]', group);

        const tl = gsap.timeline({
          scrollTrigger: { trigger: group, start: START, once: true },
        });
        if (orbs.length)
          tl.from(orbs, { opacity: 0, scale: 0.4, duration: 0.6, ease: EASE.out, stagger: 0.12 });
        // The shapes land first, then a beat, then photos (0.36s) and text (0.52s).
        if (imgs.length)
          tl.from(imgs, { opacity: 0, scale: 0.94, duration: 0.7, ease: EASE.out, stagger: 0.14 }, 0.36);
        if (rises.length)
          tl.from(rises, { opacity: 0, y: 22, duration: DURATION.component, ease: EASE.out, stagger: 0.1 }, 0.52);

        // Continuous float — starts after the entrance reads (delay), offset
        // speeds/phases so the layers never bob in lockstep.
        orbs.forEach((el, i) =>
          gsap.to(el, { y: -14, duration: 2.6 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.8 + i * 0.2 }),
        );
        imgs.forEach((el, i) =>
          gsap.to(el, { y: -10, duration: 3.6 + i * 0.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.2 + i * 0.25 }),
        );
      });

      /* ──────────────────────── the flight path, scrubbed ───────────────────
         The showstopper. The dashed arc through the three step markers draws
         itself as the section crosses the viewport — scrubbed, so it is tied
         to the scrollbar and the user stays in control. Scrubbed, never
         pinned: DESIGN §8 forbids scroll-jacking. */
      const stepWipe = document.querySelector<SVGRectElement>(
        '#how-it-works [data-anim="route-wipe"]',
      );
      if (stepWipe) {
        gsap.from(stepWipe, {
          ...WIPE_FROM,
          ease: EASE.scrub,
          scrollTrigger: {
            trigger: "#how-it-works",
            start: "top 70%",
            end: "center center",
            scrub: 0.8,
          },
        });
      }

      /* ─────────────────────────── inside the app ──────────────────────────
         The phone drifts a little slower than the copy beside it. Small
         parallax, one element, no pin — enough to give the ink section depth
         without anyone noticing why. */
      const insidePhone = document.querySelector<HTMLElement>(
        '#inside-the-app [data-anim="phone"]',
      );
      if (insidePhone) {
        gsap.from(insidePhone, {
          opacity: 0,
          y: 48,
          duration: DURATION.hero,
          ease: EASE.out,
          scrollTrigger: { trigger: insidePhone, start: START, once: true },
        });
        gsap.to(insidePhone, {
          yPercent: -8,
          ease: EASE.scrub,
          scrollTrigger: {
            trigger: "#inside-the-app",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      /* ───────────────────────── the route lands ───────────────────────────
         The CTA heading rises word by word and the short dashed arc draws
         toward the store buttons — the flight path opened in the hero,
         arriving. Last motion on the page, then nothing. */
      const ctaHeading = document.querySelector<HTMLElement>(
        '[data-anim="cta-heading"]',
      );
      if (ctaHeading) {
        try {
          const split = new SplitText(ctaHeading, {
            type: "words",
            wordsClass: "inline-block",
          });
          splits.push(split);
          gsap.from(split.words, {
            opacity: 0,
            yPercent: 110,
            duration: DURATION.component,
            ease: EASE.out,
            stagger: STAGGER.words,
            scrollTrigger: { trigger: ctaHeading, start: START, once: true },
          });
        } catch {
          gsap.from(ctaHeading, {
            ...ENTER,
            opacity: 0,
            scrollTrigger: { trigger: ctaHeading, start: START, once: true },
          });
        }
      }

      const ctaWipe = document.querySelector<SVGRectElement>(
        '[data-anim="cta-wipe"]',
      );
      if (ctaWipe) {
        gsap.from(ctaWipe, {
          ...WIPE_FROM,
          duration: 1.1,
          ease: EASE.out,
          scrollTrigger: {
            trigger: ctaWipe.ownerSVGElement ?? ctaWipe,
            start: "top 85%",
            once: true,
          },
        });
      }
    });

    // Trigger start points move after this effect runs: web fonts swap line
    // boxes, images decode, and — critically — the browser restores scroll on
    // reload/back AFTER `load` fires. Refresh on each so a page that opens
    // already-scrolled still evaluates its in-view reveals; without the load /
    // rAF pass, those reveals can sit stuck at opacity 0 until the next scroll.
    let live = true;
    const refresh = () => {
      if (live) ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(refresh);
    if (document.readyState === "complete") requestAnimationFrame(refresh);
    else window.addEventListener("load", refresh, { once: true });

    return () => {
      live = false;
      window.removeEventListener("load", refresh);
      // Order matters: kill the tweens first, then hand the split headlines
      // back to the DOM as single text nodes for assistive tech.
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
    // Re-run on navigation: the (marketing) layout persists, so a bare [] would
    // only ever wire the first page's hooks.
  }, [pathname]);

  return null;
}
