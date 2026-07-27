import { getTranslations } from "next-intl/server";
import { Gift, Globe, Languages, Rocket, Share2, TrendingUp } from "lucide-react";

import Card from "@/components/ui/Card";
import IconChip from "@/components/ui/IconChip";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "What service we offer" — the WP /partnership/ "Our Benefits" list, restored
 * to the client's own six benefits (titles + specifics kept: multi-language
 * video, double rebates, 200 partner brands, Web 2.0→3.0). Only clear grammar
 * errors are fixed ("we growth" → "we grow", "we able to" → "we help"); the
 * wording is otherwise the client's.
 *
 * Coral icon chips: the business/action side of the site (green is the
 * member-reward colour, DESIGN §2).
 */

const BENEFITS = [
  { icon: Languages, key: "multilang" },
  { icon: TrendingUp, key: "traffic" },
  { icon: Gift, key: "direct" },
  { icon: Share2, key: "cross" },
  { icon: Globe, key: "international" },
  { icon: Rocket, key: "transform" },
] as const;

export default async function BusinessBenefits() {
  const t = await getTranslations("partnership.benefits");
  return (
    <Section tone="cream-100" id="benefits" labelledBy="benefits-title">
      <SectionHead
        layout="split"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="benefits-title"
        lede={t("lede")}
      />

      <ul data-anim="reveal-group" className="content-gap grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <li key={b.key} data-anim="reveal-item">
            <Card as="div" className="flex h-full flex-col p-7">
              <IconChip icon={b.icon} tone="coral" size={48} />
              <h3 className="mt-5 font-display text-[22px] font-semibold leading-[1.3] text-text-900">
                {t(`${b.key}Title`)}
              </h3>
              <p className="mt-2 text-[16px] leading-[1.65] text-text-600 text-pretty">
                {t(`${b.key}Body`)}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
