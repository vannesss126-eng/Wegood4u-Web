import { getTranslations } from "next-intl/server";
import { Star } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { cn } from "@/lib/utils";

/**
 * "Real members. Real rewards." — the three member testimonials from the
 * new-member page. No stock headshots to fake; identity comes from coloured
 * initials + a tier badge. Each card leads with the member's headline result so
 * the proof reads at a glance. cream-100 accent band.
 */

const STORIES = [
  {
    initials: "SC",
    name: "Sarah C.",
    tier: "Gold",
    key: "sarah",
    ring: "bg-credit-star/15 text-[#a67c00]",
  },
  {
    initials: "MJ",
    name: "Marcus J.",
    tier: "Silver",
    key: "marcus",
    ring: "bg-[#c3ccd8]/25 text-[#5c6675]",
  },
  {
    initials: "PP",
    name: "Priya P.",
    tier: "Diamond",
    key: "priya",
    ring: "bg-green-500/15 text-green-700",
  },
] as const;

export default async function MemberStories() {
  const t = await getTranslations("membership.stories");
  return (
    <Section tone="cream-100" labelledBy="stories-title">
      <SectionHead
        align="center"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="stories-title"
        lede={t("lede")}
      />

      <ul
        data-anim="reveal-group"
        className="content-gap grid gap-6 md:grid-cols-3"
      >
        {STORIES.map((s) => (
          <li
            key={s.name}
            data-anim="reveal-item"
            className="flex h-full flex-col rounded-card border border-line-cream bg-white p-7 shadow-card"
          >
            <div className="flex items-center gap-1" aria-label={t("ratedAria")}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className="size-4 fill-credit-star text-credit-star"
                />
              ))}
            </div>
            <p className="mt-4 font-display text-[19px] font-bold leading-[1.35] text-green-700">
              {t(`${s.key}Result`)}
            </p>
            <blockquote className="mt-3 flex-1 text-[15.5px] leading-[1.6] text-text-600 text-pretty">
              “{t(`${s.key}Quote`)}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-line-cream pt-5">
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-full font-display text-[15px] font-bold",
                  s.ring,
                )}
                aria-hidden="true"
              >
                {s.initials}
              </span>
              <div>
                <p className="font-display text-[15px] font-bold text-text-900">
                  {s.name}
                </p>
                <p className="text-[13px] font-medium text-text-600">
                  {t("memberOf", { tier: s.tier })}
                </p>
              </div>
            </figcaption>
          </li>
        ))}
      </ul>
    </Section>
  );
}
