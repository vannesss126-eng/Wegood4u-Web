import { cn } from "@/lib/utils";

/** Section wrapper — encodes DESIGN.md §5 (128/96/64 rhythm, 1200/1320/720 containers) and the §5 background sequence rule. */

export type SectionTone = "cream-50" | "cream-100" | "ink-950" | "green-700";
export type SectionWidth = "prose" | "default" | "wide" | "bleed";
export type SectionPad = "default" | "tight" | "none";

export interface SectionProps {
  id?: string;
  /** Background + base text colour. Default "cream-50". */
  tone?: SectionTone;
  /** Inner container width. Default "default" (1200px). */
  width?: SectionWidth;
  /** Vertical rhythm. Default "default" (64/96/128). */
  pad?: SectionPad;
  as?: "section" | "footer" | "div";
  /** Extra classes on the OUTER (tone/pad) element. */
  className?: string;
  /** Extra classes on the INNER (container) element. */
  innerClassName?: string;
  /** id of the section's heading → aria-labelledby. */
  labelledBy?: string;
  children: React.ReactNode;
}

const TONE: Record<SectionTone, string> = {
  "cream-50": "bg-cream-50 text-text-900",
  "cream-100": "bg-cream-100 text-text-900",
  "ink-950": "bg-ink-950 text-ondark-400",
  "green-700": "bg-green-700 text-cream-100",
};

const PAD: Record<SectionPad, string> = {
  default: "py-20 sm:py-28 lg:py-36", // 80 / 112 / 144 — more air between sections
  tight: "py-12 sm:py-16 lg:py-20", // 48 / 64 / 80 — strips only
  none: "",
};

const WIDTH: Record<SectionWidth, string> = {
  prose: "mx-auto w-full max-w-[720px] px-5 sm:px-6",
  default: "mx-auto w-full max-w-[1200px] px-5 sm:px-6",
  wide: "mx-auto w-full max-w-[1320px] px-5 sm:px-6",
  bleed: "w-full",
};

export default function Section({
  id,
  tone = "cream-50",
  width = "default",
  pad = "default",
  as: As = "section",
  className,
  innerClassName,
  labelledBy,
  children,
  ...rest
}: SectionProps & React.HTMLAttributes<HTMLElement>) {
  return (
    <As
      id={id}
      aria-labelledby={labelledBy}
      // Lets globals.css collapse the padding between two same-background
      // sections (a divider gap is only wanted where the colour changes).
      data-bg={tone}
      className={cn(TONE[tone], PAD[pad], className)}
      {...rest}
    >
      <div className={cn(WIDTH[width], innerClassName)}>{children}</div>
    </As>
  );
}
