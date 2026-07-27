import { cn } from "@/lib/utils";
import Eyebrow from "./Eyebrow";

/** Section head — DESIGN.md §4 "Section Anatomy" (eyebrow → H2 → lede) at the §3 H2 scale. Consumers own the 48px head→content gap. */

export interface SectionHeadProps {
  eyebrow?: string;
  title: React.ReactNode;
  /** Required — feed the same id to <Section labelledBy>. */
  titleId: string;
  lede?: React.ReactNode;
  /** Optional trailing node (e.g. a ghost Button). Right column in "split". */
  action?: React.ReactNode;
  /** Default "left". Nothing on the homepage is centred. */
  align?: "left" | "center";
  /** "light" = on cream · "dark" = on ink/green. Default "light". */
  tone?: "light" | "dark";
  /** "split" = 6/5 twelve-column head on lg, stacked below. Default "stacked". */
  layout?: "stacked" | "split";
  as?: "h2" | "h3";
  className?: string;
}

export default function SectionHead({
  eyebrow,
  title,
  titleId,
  lede,
  action,
  align = "left",
  tone = "light",
  layout = "stacked",
  as: Heading = "h2",
  className,
}: SectionHeadProps) {
  const centred = align === "center";

  const headingBlock = (
    <div className={cn(centred && "text-center")}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <Heading
        id={titleId}
        className={cn(
          "font-display text-[28px] font-semibold leading-[1.2] tracking-normal text-balance sm:text-[32px] lg:text-[36px]",
          eyebrow && "mt-3",
          tone === "light" ? "text-text-900" : "text-ondark-100",
        )}
      >
        {title}
      </Heading>
    </div>
  );

  const ledeBlock =
    lede || action ? (
      <div className={cn(centred && "text-center")}>
        {lede ? (
          <p
            className={cn(
              "max-w-[62ch] text-[18px] leading-[1.65] text-pretty",
              layout === "stacked" && "mt-4",
              centred && "mx-auto",
              tone === "light" ? "text-text-600" : "text-ondark-400",
            )}
          >
            {lede}
          </p>
        ) : null}
        {action ? (
          <div
            className={cn(
              "flex flex-wrap items-center gap-4",
              lede ? "mt-6" : layout === "stacked" ? "mt-6" : "",
              centred && "justify-center",
            )}
          >
            {action}
          </div>
        ) : null}
      </div>
    ) : null;

  // data-anim="head" is the motion hook MotionDirector reveals on enter. Every
  // section head gets it for free, so no page has to remember to add it.
  if (layout === "split") {
    return (
      <div
        data-anim="head"
        className={cn("lg:grid lg:grid-cols-12 lg:items-end lg:gap-8", className)}
      >
        <div className="lg:col-span-6">{headingBlock}</div>
        {ledeBlock ? (
          <div className="mt-4 lg:col-span-5 lg:col-start-8 lg:mt-0">{ledeBlock}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div data-anim="head" className={className}>
      {headingBlock}
      {ledeBlock}
    </div>
  );
}
