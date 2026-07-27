import { getTranslations } from "next-intl/server";
import { BedDouble, Home, Palmtree } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "Get a free stay worth RM 300–800" — the reward catalogue, from the
 * new-member page. Three accommodation types as cards led by a soft gradient
 * header (no stock photos to fake), a value band, and what's included. cream-50
 * so it collapses against the how-it-works section above into one bright run.
 */

const REWARDS: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  key: string;
  range: string;
  featureKeys: [string, string, string];
  grad: string;
  featured?: boolean;
}[] = [
  {
    icon: BedDouble,
    key: "hotels",
    range: "RM 200–500",
    featureKeys: ["hotelsFeat1", "hotelsFeat2", "hotelsFeat3"],
    grad: "from-coral-500 to-coral-600",
  },
  {
    icon: Palmtree,
    key: "resort",
    range: "RM 400–800",
    featureKeys: ["resortFeat1", "resortFeat2", "resortFeat3"],
    grad: "from-green-700 to-green-800",
    featured: true,
  },
  {
    icon: Home,
    key: "homestay",
    range: "RM 150–400",
    featureKeys: ["homestayFeat1", "homestayFeat2", "homestayFeat3"],
    grad: "from-ink-900 to-ink-950",
  },
];

export default async function MemberRewards() {
  const t = await getTranslations("membership.rewards");
  return (
    <Section tone="cream-50" labelledBy="rewards-title">
      <SectionHead
        align="center"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="rewards-title"
        lede={t("lede")}
      />

      <ul
        data-anim="reveal-group"
        className="content-gap grid gap-6 md:grid-cols-3"
      >
        {REWARDS.map((r) => (
          <li
            key={r.key}
            data-anim="reveal-item"
            className="group flex h-full flex-col overflow-hidden rounded-card border border-line-cream bg-white shadow-card transition-transform duration-300 ease-brand hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <div
              className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${r.grad}`}
            >
              <r.icon
                aria-hidden="true"
                className="size-12 text-white/95 transition-transform duration-300 ease-brand group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
                strokeWidth={1.5}
              />
              <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 font-display text-[14px] font-bold text-text-900">
                {r.range}
              </span>
              {r.featured ? (
                <span className="absolute left-3 top-3 rounded-full bg-cream-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-green-800">
                  {t("mostClaimed")}
                </span>
              ) : null}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-[21px] font-bold text-text-900">
                {t(`${r.key}Name`)}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-text-600 text-pretty">
                {t(`${r.key}Body`)}
              </p>
              <ul className="mt-4 space-y-2 border-t border-line-cream pt-4 text-[14px] text-text-600">
                {r.featureKeys.map((fk) => (
                  <li key={fk} className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-green-700"
                    />
                    {t(fk)}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
