import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ChevronDown } from "lucide-react";

import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { localizeFaqs, MEMBER_FAQS_TEASER } from "@/data/faq";
import { cn } from "@/lib/utils";

/**
 * FAQ teaser.
 *
 * Native `<details>` / `<summary>` — accessible, keyboard-operable and animatable
 * with zero JavaScript, so it works before hydration and under reduced motion.
 * Content is the real member Q&A from `data/faq.ts`; the same four questions are
 * mirrored into FAQPage JSON-LD on the page, and only these four (a schema that
 * lists questions the reader can't see is a violation).
 *
 * "See all FAQs" points at `/faq`, which ships in Phase 6 — it is on the smoke
 * suite's known-pending list until then.
 */
export default async function FaqTeaser() {
  const t = await getTranslations("howItWorksPage.faqTeaser");
  const locale = await getLocale();
  const faqs = localizeFaqs(MEMBER_FAQS_TEASER, locale);
  return (
    <Section tone="cream-100" id="faq-teaser" labelledBy="faq-teaser-title">
      <SectionHead
        layout="split"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="faq-teaser-title"
        lede={t("lede")}
        action={
          <Button variant="ghost" href="/faq">
            {t("seeAll")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        }
      />

      <div data-anim="reveal-group" className="content-gap max-w-[760px]">
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
              <span className="font-display text-[20px] font-semibold leading-[1.35] text-text-900">
                {q}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 text-coral-500 transition-transform duration-250 ease-brand group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <p className="max-w-[62ch] pb-6 pr-6 text-[16px] leading-[1.65] text-pretty text-text-600">
              {a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
