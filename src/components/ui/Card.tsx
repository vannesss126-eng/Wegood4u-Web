import { cn } from "@/lib/utils";

/** Base card — DESIGN.md §4 "Cards" (white, 20px radius, warm hairline, Level 1 shadow). Padding is the consumer's call (nested-radius law). */

export interface CardProps {
  as?: "article" | "div" | "li";
  /** ONLY true when the card is (or contains) a real link. A non-clickable card must not lift. */
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Card({
  as: As = "article",
  interactive = false,
  className,
  children,
}: CardProps) {
  return (
    <As
      className={cn(
        "rounded-card border border-line-cream bg-white shadow-card",
        interactive &&
          "transition-[transform,box-shadow] duration-300 ease-brand hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:transform-none",
        className,
      )}
    >
      {children}
    </As>
  );
}
