import { cn } from "@/lib/utils";

/** Eyebrow label — DESIGN.md §3 "Eyebrow" row (Geist 13px/600, caps, +2px tracking) and the §4 Section Anatomy pattern. */

export interface EyebrowProps {
  children: React.ReactNode;
  /** "light" = on cream (Coral 500) · "dark" = on ink/green (Coral 100). Default "light". */
  tone?: "light" | "dark";
  className?: string;
  /** Motion hook read by MotionDirector. */
  "data-anim"?: string;
}

export default function Eyebrow({
  children,
  tone = "light",
  className,
  ...rest
}: EyebrowProps) {
  return (
    <p
      {...rest}
      className={cn(
        "text-[13px] font-semibold uppercase leading-[1.4] tracking-[2px]",
        // coral-700 (not 500): the eyebrow is 13px, and Coral 500 on cream
        // fails WCAG AA at that size (see globals.css --color-coral-700).
        tone === "light" ? "text-coral-700" : "text-coral-100",
        className,
      )}
    >
      {children}
    </p>
  );
}
