"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import AttractButton from "@/components/ui/attract-button";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useAppDownload } from "./AppDownloadModal";
import { EASE, gsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import wordmark from "@/assets/images/wegood4u-wordmark.png";

/**
 * Information architecture mirrors the WordPress original (REVAMP-PLAN R2):
 * Home · About Us ▾ (Partnership, Membership) · Our Partners · Our Projects ·
 * News · Contact Us. "Log in" + "Get the app" replace WP's "Login"/"Get Started".
 */
type NavLink = {
  href: string;
  key: string;
  children?: { href: string; key: string }[];
};

const LINKS: NavLink[] = [
  { href: "/", key: "home" },
  {
    href: "/about",
    key: "aboutUs",
    children: [
      { href: "/partnership", key: "partnership" },
      { href: "/membership", key: "membership" },
    ],
  },
  { href: "/our-partners", key: "ourPartners" },
  { href: "/projects", key: "ourProjects" },
  { href: "/news", key: "news" },
  { href: "/contact", key: "contactUs" },
];

/** DESIGN.md §4 "Nav bar" — Geist 15px/500, Text 900, hover/active Coral 700
 *  (Coral 500 fails WCAG AA on cream at 15px; see globals.css --color-coral-700). */
const NAV_LINK = cn(
  "text-[15px] font-medium",
  "transition-colors duration-250 ease-brand hover:text-coral-700",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]",
  "focus-visible:outline-coral-500",
);

/** Mobile overlay row — coral waypoint bar + the label. */
const MOBILE_ROW = cn(
  "group relative flex items-center rounded-input py-2.5 pl-5",
  "transition-[color,transform] duration-250 ease-brand",
  "hover:text-coral-700 hover:translate-x-1 active:scale-[0.99]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]",
  "focus-visible:outline-coral-500",
  "motion-reduce:transition-none motion-reduce:transform-none",
);

/**
 * The one interactive device in the overlay: a coral bar at the row's leading
 * edge. Present for the current page, grows in on hover/focus for the others —
 * so the same mark answers "where am I" and "what am I about to tap".
 */
function Waypoint({ active, tall }: { active: boolean; tall?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute left-0 top-1/2 w-[3px] -translate-y-1/2 rounded-full bg-coral-500",
        tall ? "h-[26px]" : "h-[16px]",
        "origin-center transition-transform duration-250 ease-brand",
        active
          ? "scale-y-100"
          : "scale-y-0 group-hover:scale-y-100 group-focus-visible:scale-y-100",
        "motion-reduce:transition-none",
      )}
    />
  );
}

export default function SiteNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { open: openAppModal } = useAppDownload();
  const [open, setOpen] = useState(false);
  // `rendered` outlives `open` by one exit animation — without it React would
  // unmount the overlay on the same frame the close is requested and there
  // would be nothing left to animate out.
  const [rendered, setRendered] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  /**
   * Closing has two halves: ask the overlay to leave, and eventually unmount
   * it. With motion on, the exit tween's onComplete does the unmount. With
   * reduced motion there is no tween to complete, so it happens here — in the
   * handler, never inside the effect, which would be a setState-in-effect
   * cascade (and is what react-hooks/set-state-in-effect exists to catch).
   */
  const closeMenu = useCallback(() => {
    setOpen(false);
    if (prefersReducedMotion()) setRendered(false);
  }, []);

  // Close the menu on route change. Adjusting state during render is the
  // supported pattern here — an effect would cause a cascading re-render.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    if (prefersReducedMotion()) setRendered(false);
  }

  if (open && !rendered) setRendered(true);

  // Lock body scroll while the overlay is open (a real external-system effect).
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMenu]);

  /**
   * Overlay choreography. Enter: the panel fades as the rows rise in sequence,
   * so the menu reads as arriving rather than being switched on. Exit is a
   * single fast fade — ~55% of the enter duration, because a menu you asked to
   * close should feel gone before you finish the thought (and re-staggering
   * eight rows on the way out is just delay).
   *
   * useLayoutEffect so the rows' start state is committed before paint; in a
   * plain effect the finished menu flashes for a frame first.
   */
  useLayoutEffect(() => {
    const el = overlayRef.current;
    if (!rendered || !el) return;

    // Reduced motion: no tweens at all. The overlay simply appears, and
    // closeMenu has already unmounted it on the way out. Hard requirement.
    if (prefersReducedMotion()) return;

    const rows = el.querySelectorAll<HTMLElement>("[data-nav-row]");
    const cta = el.querySelector<HTMLElement>("[data-nav-cta]");

    const tl = gsap.timeline();

    if (open) {
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: EASE.out })
        // 35ms apart, not the 100ms card stagger: this list runs to eight rows,
        // and at 100ms the last one would land nearly a second after the tap.
        // Measured end-to-end here: ~645ms, with the cascade readable
        // throughout. A menu has to feel like it is already open.
        .from(
          rows,
          { y: 22, autoAlpha: 0, duration: 0.4, ease: EASE.out, stagger: 0.035 },
          "-=0.12",
        )
        .from(cta, { y: 16, autoAlpha: 0, duration: 0.35, ease: EASE.out }, "-=0.18");
    } else {
      tl.to(el, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setRendered(false),
      });
    }

    return () => {
      tl.kill();
    };
  }, [open, rendered]);

  return (
    <>
      {/* The blurred header creates a containing block for fixed descendants,
          so the full-screen menu must live OUTSIDE it (rendered below). */}
      <header className="sticky top-0 z-50 border-b border-line-cream bg-cream-50/85 backdrop-blur-md">
        <nav
          aria-label={t("main")}
          className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 sm:px-6"
        >
          <Link
            href="/"
            aria-label={t("homeAria")}
            className="shrink-0 rounded-input focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-coral-500"
          >
            <Image src={wordmark} alt="Wegood4u" height={34} priority />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
            {LINKS.map(({ href, key, children }) => {
              const active =
                pathname === href ||
                !!children?.some((c) => c.href === pathname);

              if (!children) {
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        NAV_LINK,
                        active ? "text-coral-700" : "text-text-900",
                      )}
                    >
                      {t(key)}
                    </Link>
                  </li>
                );
              }

              /* Submenu is CSS-only: revealed on hover AND on focus-within, so it
                 works for keyboard users without client state. It is faded rather
                 than `hidden`/`invisible` on purpose — those remove the children
                 from the tab order, which would make focus-within unreachable. */
              return (
                <li key={href} className="group relative">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      NAV_LINK,
                      "inline-flex items-center gap-1",
                      active ? "text-coral-700" : "text-text-900",
                    )}
                  >
                    {t(key)}
                    <ChevronDown
                      aria-hidden="true"
                      className="size-4 transition-transform duration-250 ease-brand group-hover:rotate-180 group-focus-within:rotate-180 motion-reduce:transition-none"
                    />
                  </Link>

                  <div
                    className={cn(
                      "absolute left-0 top-full pt-3",
                      "pointer-events-none translate-y-1 opacity-0",
                      "transition-[opacity,transform] duration-250 ease-brand",
                      "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
                      "group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100",
                      "motion-reduce:transition-none motion-reduce:transform-none",
                    )}
                  >
                    <ul
                      aria-label={t(key)}
                      className="min-w-[196px] rounded-card border border-line-cream bg-white p-2 shadow-card-hover"
                    >
                      {children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={
                              pathname === child.href ? "page" : undefined
                            }
                            // Clicking a child does an SPA nav, so the link keeps
                            // focus and `group-focus-within` holds the menu open
                            // until you click away. Blur on click releases it.
                            onClick={(e) => e.currentTarget.blur()}
                            className={cn(
                              "flex min-h-[44px] items-center rounded-input px-3",
                              "text-[15px] font-medium transition-colors duration-250 ease-brand",
                              "hover:bg-cream-100 hover:text-coral-700",
                              "focus-visible:outline focus-visible:outline-2",
                              "focus-visible:outline-offset-[-2px] focus-visible:outline-coral-500",
                              pathname === child.href
                                ? "text-coral-700"
                                : "text-text-900",
                            )}
                          >
                            {t(child.key)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* The ONE nav CTA — coral, per DESIGN §4. Slightly tighter than the
              page pill so it sits inside the 72px bar. There is no "Log in":
              this marketing site never collects credentials (R10) — signing in
              happens in the app. */}
          <div className="hidden items-center gap-1.5 lg:flex">
            <LanguageSwitcher />
            {/* Compact nav variant of the primary CTA. The page CTAs are
                19px/700 on Coral 500 (that size is what lets white-on-coral
                clear WCAG AA). A nav pill that size is too heavy beside the
                wordmark — so this one drops to 15px/600 and shifts to Coral 600
                (#D93A36), which passes AA at normal text (4.56:1) where Coral
                500 would not. One shade darker, deliberately, so it can be
                small AND accessible. */}
            {/* kokonutui attract-button (adapted): particles spring to the pill
                on hover. Same coral-600/15px/600 AA pill as before + reduced-
                motion drops the particles. */}
            <AttractButton
              onClick={openAppModal}
              particleCount={14}
              scatter={26}
              className="min-h-[44px] gap-2 rounded-full bg-coral-600 px-5 py-2.5 font-sans text-[15px] font-semibold leading-none tracking-[0.3px] text-white transition-[transform,box-shadow] duration-250 ease-brand hover:-translate-y-0.5 hover:shadow-cta active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-coral-500 motion-reduce:transition-none motion-reduce:transform-none"
            >
              {t("getApp")}
            </AttractButton>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => (open ? closeMenu() : setOpen(true))}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full text-text-900",
              "transition-[background-color,color] duration-250 ease-brand",
              "hover:bg-text-900/5 hover:text-coral-700 active:bg-text-900/10",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]",
              "focus-visible:outline-coral-500 lg:hidden",
            )}
          >
            {/* Three bars that rotate into an X rather than two icons swapping.
                The swap is a state change; the morph is the same object moving,
                which is what tells you the button toggles one thing.
                Transform-only, so nothing here can reflow the 72px bar. */}
            <span aria-hidden="true" className="relative block h-[16px] w-[22px]">
              {(
                [
                  ["-translate-y-[6px]", "translate-y-0 rotate-45"],
                  ["translate-y-0", "scale-x-0 opacity-0"],
                  ["translate-y-[6px]", "translate-y-0 -rotate-45"],
                ] as const
              ).map(([closed, opened], i) => (
                <span
                  key={i}
                  className={cn(
                    "absolute left-0 top-1/2 -mt-px h-[2px] w-full rounded-full bg-current",
                    "origin-center transition-[transform,opacity] duration-300 ease-brand",
                    "motion-reduce:transition-none",
                    open ? opened : closed,
                  )}
                />
              ))}
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile overlay — sibling of the header (see note above). */}
      {rendered && (
        <div
          ref={overlayRef}
          id="mobile-menu"
          // Pointer events off the moment a close is requested, so a stray tap
          // during the 200ms exit cannot follow a link that is on its way out.
          className={cn(
            "fixed inset-0 top-[72px] z-40 flex flex-col overflow-y-auto",
            "bg-cream-50 px-6 pb-10 pt-6 lg:hidden",
            !open && "pointer-events-none",
          )}
        >
          {/* Display type steps down from DESIGN §4's 36px: the WP IA carries eight
              rows here, and 36px would push the CTAs below the fold on a 375px phone.
              Tablets have the room, so they get the specified scale. */}
          <ul className="flex flex-col gap-1">
            {LINKS.map(({ href, key, children }) => {
              const active = pathname === href;
              return (
                <li key={href} data-nav-row>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      MOBILE_ROW,
                      "font-display text-[26px] font-semibold sm:text-[32px]",
                      active ? "text-coral-700" : "text-text-900",
                    )}
                  >
                    <Waypoint active={active} tall />
                    {t(key)}
                  </Link>

                  {children ? (
                    <ul
                      aria-label={t(key)}
                      className="mb-1 ml-5 flex flex-col border-l border-line-cream pl-3"
                    >
                      {children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <li key={child.href} data-nav-row>
                            <Link
                              href={child.href}
                              aria-current={childActive ? "page" : undefined}
                              className={cn(
                                MOBILE_ROW,
                                "min-h-[44px] text-[17px] font-medium",
                                childActive ? "text-coral-700" : "text-text-600",
                              )}
                            >
                              <Waypoint active={childActive} />
                              {t(child.key)}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div data-nav-cta className="mt-auto pt-8">
            <div className="mb-3 flex justify-center">
              <LanguageSwitcher />
            </div>
            {/* Full-width mobile CTA — stays the prominent 19px/700 page size;
                only the desktop nav pill is compacted. */}
            <Button
              variant="primary"
              onClick={() => {
                closeMenu();
                openAppModal();
              }}
              className="w-full"
            >
              {t("getApp")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
