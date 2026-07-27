import { getTranslations } from "next-intl/server";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import StatCounter from "@/components/ui/StatCounter";

/**
 * "It's about discovery" — the cuisine breadth block from the new-member page.
 * A grid of cuisine categories with live counts, plus three proof stats. This
 * is the reminder that the reward is only half the story: membership is a reason
 * to eat somewhere new. cream-100 accent band.
 */

/* Cuisine glyphs are the same emoji the new-member landing page uses, rendered
   with the system emoji font — faithful to the reference and licence-clean (no
   proprietary emoji artwork baked into the site's own assets). */
const CUISINES = [
  { emoji: "🍜", key: "malaysian", count: "180+" },
  { emoji: "🍛", key: "thai", count: "120+" },
  { emoji: "🍣", key: "japanese", count: "65+" },
  { emoji: "🍔", key: "western", count: "55+" },
  { emoji: "🥘", key: "korean", count: "40+" },
  { emoji: "☕", key: "cafes", count: "45+" },
] as const;

export default async function MemberDiscovery() {
  const t = await getTranslations("membership.discovery");
  return (
    <Section tone="cream-100" labelledBy="discovery-title">
      <SectionHead
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="discovery-title"
        lede={t("lede")}
      />

      <ul
        data-anim="reveal-group"
        className="content-gap grid grid-cols-2 gap-4 sm:grid-cols-3"
      >
        {CUISINES.map((c) => (
          <li
            key={c.key}
            data-anim="reveal-item"
            className="group flex items-center gap-4 rounded-card border border-line-cream bg-white p-5 shadow-card transition-transform duration-300 ease-brand hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-cream-100 text-[26px] leading-none transition-transform duration-300 ease-brand group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
            >
              {c.emoji}
            </span>
            <div>
              <p className="font-display text-[17px] font-bold leading-tight text-text-900">
                {t(c.key)}
              </p>
              <p className="text-[13.5px] font-medium text-green-700">
                {t("venues", { n: c.count })}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <dl
        data-anim="reveal"
        className="content-gap grid grid-cols-3 gap-6 border-t border-line-cream pt-10"
      >
        <StatCounter tone="light" value="100" suffix="+" label={t("statVenues")} />
        <StatCounter tone="light" value="2" label={t("statMarkets")} />
        <StatCounter tone="light" value="4.6" suffix="★" label={t("statRating")} />
      </dl>
    </Section>
  );
}
