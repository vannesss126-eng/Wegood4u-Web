import { Link } from "@/i18n/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Button / link primitive — DESIGN.md §4 "Buttons" (pill, 15px/600 Geist, coral=action, green=reward) with §7 easing and reduced-motion fallbacks. */

/**
 * Type size is an ACCESSIBILITY constraint here, not a style preference.
 *
 * White on Coral 500 measures 3.66:1 — below WCAG AA's 4.5:1 for normal text.
 * WCAG grants a 3:1 threshold to "large scale" text, defined as ≥18.66px (14pt)
 * AND bold (≥700). At the previous 15px/600 the primary CTA — the site's main
 * conversion control — failed AA outright (Lighthouse: `color-contrast`).
 *
 * 19px/700 clears the large-text bar with margin, so the coral stays exactly as
 * DESIGN.md §2 specifies. Supervisor ruling: keep the colours, enlarge the type.
 * This supersedes DESIGN.md §3's "Button — Geist 15px/600" row; write it back.
 *
 * ⚠ Do not drop this below 19px or to font-semibold without re-running the
 * contrast audit — either change silently reintroduces the AA failure.
 */
const PILL = [
  "inline-flex items-center justify-center gap-2 rounded-full",
  "px-7 py-3.5 min-h-[48px]",
  "font-sans text-[19px] font-bold leading-none tracking-[0.3px]",
  "transition-[transform,background-color,border-color,box-shadow,color]",
  "duration-250 ease-brand",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]",
  "motion-reduce:transition-none motion-reduce:transform-none",
].join(" ");

export const buttonVariants = cva("", {
  variants: {
    variant: {
      primary: cn(
        PILL,
        "bg-coral-500 text-white",
        "hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-cta",
        "active:translate-y-0 active:shadow-none",
        "focus-visible:outline-coral-500",
      ),
      secondary: cn(
        PILL,
        "bg-green-700 text-white",
        "hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-card-hover",
        "active:translate-y-0 active:shadow-none",
        "focus-visible:outline-green-700",
      ),
      outline: cn(
        PILL,
        "border-[1.5px] border-text-900 text-text-900",
        "hover:bg-text-900/8",
        "focus-visible:outline-coral-500",
      ),
      "outline-dark": cn(
        PILL,
        "border-[1.5px] border-ondark-100/80 text-ondark-100",
        "hover:bg-ondark-100/10",
        "focus-visible:outline-coral-100",
      ),
      ghost: cn(
        // Same large-text rule as PILL: ghost is Coral 500 ON cream, which
        // measures 3.45:1 — worse than the button's white-on-coral. It needs
        // ≥18.66px bold to sit under WCAG's 3:1 large-text threshold.
        "group relative inline-flex items-center gap-1.5 font-sans text-[19px] font-bold",
        "tracking-[0.3px] text-coral-500 min-h-[44px]",
        "after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left",
        "after:scale-x-0 after:bg-coral-500 after:transition-transform after:duration-250",
        "after:ease-brand hover:after:scale-x-100",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]",
        "focus-visible:outline-coral-500 motion-reduce:after:transition-none",
      ),
    },
  },
  defaultVariants: { variant: "primary" },
});

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;

export interface ButtonProps {
  /** Default "primary". */
  variant?: ButtonVariant;
  /** "/path" → next/link · "http…" → <a> · omitted → <button>. */
  href?: string;
  /** Forces target="_blank" rel="noopener noreferrer". Implied for http(s) hrefs. */
  external?: boolean;
  /** Only used when href is absent. Default "button". */
  type?: "button" | "submit";
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  /** Click handler — only meaningful on the <button> form (href omitted). */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Motion hook for 1.14 magnetic CTA. No behaviour in this pass. */
  "data-magnetic"?: boolean;
  "data-anim"?: string;
}

export default function Button({
  variant = "primary",
  href,
  external,
  type = "button",
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant }), className);
  const isHttp = !!href && /^https?:\/\//.test(href);
  const isExternal = external ?? isHttp;
  // Same-page anchors (#enquire, /#get) must stay plain <a>: the locale-aware
  // Link would rewrite the pathname, and the Lenis anchor-scroll handler keys
  // off an href that starts with "#".
  const isHash = !!href && href.startsWith("#");

  if (href && (isHttp || external)) {
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  if (href && isHash) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
