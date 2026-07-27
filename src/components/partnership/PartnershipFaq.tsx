import { getLocale, getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { localizeFaqs, PARTNER_FAQS } from "@/data/faq";
import { cn } from "@/lib/utils";

/**
 * Partnership FAQ — the partner-facing questions from `data/faq.ts`, mirrored
 * into this page's FAQPage JSON-LD (partnership/page.tsx). Native <details> /
 * <summary>: accessible, keyboard-operable, works before hydration and under
 * reduced motion — no JavaScript.
 */
export default async function PartnershipFaq() {
  const t = await getTranslations("partnership.faq");
  const locale = await getLocale();
  const faqs = localizeFaqs(PARTNER_FAQS, locale);
  return (
    <Section tone="cream-100" labelledBy="partner-faq-title" data-anim="section">
      <SectionHead
        align="center"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="partner-faq-title"
        lede={t("lede")}
      />

      <div data-anim="reveal-group" className="content-gap mx-auto max-w-[760px]">
        {faqs.map(({ q, a }) => (
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
              <span className="font-display text-[19px] font-semibold leading-[1.35] text-text-900">
                {q}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 text-coral-500 transition-transform duration-250 ease-brand group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <p className="max-w-[68ch] pb-6 pr-6 text-[16px] leading-[1.65] text-pretty text-text-600">
              {a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
