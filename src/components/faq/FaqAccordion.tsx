import { useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";

import { localizeFaqs, type FaqItem } from "@/data/faq";
import { cn } from "@/lib/utils";

/**
 * A labelled accordion group — native <details>/<summary> (accessible,
 * keyboard-operable, works before hydration and under reduced motion, no JS).
 * Used by /faq to render each category. The optional heading is a real <h2> so
 * the page keeps a sensible outline.
 */
export default function FaqAccordion({
  heading,
  headingId,
  items,
}: {
  heading?: string;
  headingId?: string;
  items: FaqItem[];
}) {
  const locale = useLocale();
  const localizedItems = localizeFaqs(items, locale);
  return (
    <div>
      {heading ? (
        <h2
          id={headingId}
          className="font-display text-[22px] font-bold leading-[1.2] text-text-900 sm:text-[26px]"
        >
          {heading}
        </h2>
      ) : null}

      <div
        data-anim="reveal-group"
        className={cn(heading && "mt-5")}
      >
        {localizedItems.map(({ q, a }) => (
          <details
            key={q}
            data-anim="reveal-item"
            className="group border-b border-line-cream"
          >
            <summary
              className={cn(
                "flex cursor-pointer list-none items-center justify-between gap-4 py-5",
                "[&::-webkit-details-marker]:hidden",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
              )}
            >
              <span className="font-display text-[18px] font-semibold leading-[1.35] text-text-900 sm:text-[19px]">
                {q}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 text-coral-500 transition-transform duration-250 ease-brand group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <p className="max-w-[70ch] pb-6 pr-6 text-[16px] leading-[1.65] text-pretty text-text-600">
              {a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
