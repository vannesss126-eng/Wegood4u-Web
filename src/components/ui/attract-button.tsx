"use client";

/**
 * Attract Button — adapted from @kokonutui (@dorianbaffier, MIT,
 * https://kokonutui.com). Kept the signature mechanic: decorative particles
 * scattered around the control that spring to its centre on hover/touch.
 *
 * Adapted for this site:
 * - self-contained (dropped the shadcn `Button` dependency; renders an `<a>` when
 *   `href` is given so the nav's Lenis anchor-scroll to `/#get` still fires, else
 *   a `<button>`),
 * - brand-agnostic via `className` + `particleClassName` (the nav passes coral),
 * - particles are `aria-hidden` decoration and are dropped entirely under
 *   `prefers-reduced-motion`.
 */

import { Link } from "@/i18n/navigation";
import { motion, useAnimation } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AttractButtonProps = {
  children: React.ReactNode;
  /** Render as a link (keeps anchor-scroll) instead of a button. */
  href?: string;
  className?: string;
  particleClassName?: string;
  particleCount?: number;
  /** Max px the particles scatter from centre at rest. */
  scatter?: number;
} & React.HTMLAttributes<HTMLElement>;

type Particle = { id: number; x: number; y: number };

export default function AttractButton({
  children,
  href,
  className,
  particleClassName,
  particleCount = 10,
  scatter = 48,
  ...props
}: AttractButtonProps) {
  const [isAttracting, setIsAttracting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [reduced, setReduced] = useState(false);
  const controls = useAnimation();

  useEffect(() => setReduced(prefersReducedMotion()), []);

  useEffect(() => {
    setParticles(
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * scatter * 2 - scatter,
        y: Math.random() * scatter * 2 - scatter,
      })),
    );
  }, [particleCount, scatter]);

  const attract = useCallback(async () => {
    if (reduced) return;
    setIsAttracting(true);
    await controls.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 10 },
    });
  }, [controls, reduced]);

  const release = useCallback(async () => {
    if (reduced) return;
    setIsAttracting(false);
    await controls.start((i) => ({
      x: particles[i].x,
      y: particles[i].y,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    }));
  }, [controls, particles, reduced]);

  const inner = (
    <>
      {!reduced &&
        particles.map((_, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            custom={i}
            animate={controls}
            initial={{ x: particles[i].x, y: particles[i].y }}
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 size-1.5 rounded-full bg-white transition-opacity duration-300",
              isAttracting ? "opacity-100" : "opacity-50",
              particleClassName,
            )}
          />
        ))}
      <span className="relative z-10">{children}</span>
    </>
  );

  const shared = {
    className: cn(
      "relative inline-flex items-center justify-center overflow-visible touch-none",
      className,
    ),
    onMouseEnter: attract,
    onMouseLeave: release,
    onTouchStart: attract,
    onTouchEnd: release,
    ...props,
  };

  if (!href) {
    return (
      <button type="button" {...shared}>
        {inner}
      </button>
    );
  }

  // Internal path → next/link (SPA nav from other pages + keeps the delegated
  // Lenis anchor-scroll for /#get); external/hash-only → plain anchor.
  return href.startsWith("/") ? (
    <Link href={href} {...shared}>
      {inner}
    </Link>
  ) : (
    <a href={href} {...shared}>
      {inner}
    </a>
  );
}
