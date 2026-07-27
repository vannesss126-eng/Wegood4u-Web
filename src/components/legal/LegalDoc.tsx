import { getTranslations } from "next-intl/server";

import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import StoryProse from "@/components/stories/StoryProse";
import type { LegalDoc as LegalDocData } from "@/data/legal";

/**
 * Legal document layout — shared by /privacy and /terms.
 *
 * A single prose column (720px): eyebrow → title → "last updated" → intro, then
 * the markdown body through the same safe <StoryProse> renderer as /news
 * (react-markdown, no raw HTML). Quiet and readable; legal pages want clarity,
 * not decoration.
 */
export default async function LegalDoc({
  doc,
  titleId,
}: {
  doc: LegalDocData;
  titleId: string;
}) {
  const t = await getTranslations("legal");
  return (
    <Section tone="cream-50" width="prose" labelledBy={titleId}>
      <header data-anim="reveal" className="border-b border-line-cream pb-8">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1
          id={titleId}
          className="mt-3 text-balance font-display text-[36px] font-bold leading-[1.1] tracking-[-0.5px] text-text-900 sm:text-[44px]"
        >
          {doc.title}
        </h1>
        <p className="mt-3 text-[14px] font-medium text-text-600">
          {t("lastUpdated", { date: doc.updated })}
        </p>
        <p className="mt-5 text-[17px] leading-[1.7] text-pretty text-text-600">
          {doc.intro}
        </p>
      </header>

      <div data-anim="reveal">
        <StoryProse content={doc.body} />
      </div>
    </Section>
  );
}
