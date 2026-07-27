import { getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { PARTNER_LOCATIONS } from "@/data/partnerStores";

/**
 * Partner network — where you can actually earn.
 *
 * Real venues from `partnerStores.ts`, grouped by country. This is the section
 * that would normally be a fake "as seen in" logo band; a list of the places
 * that genuinely carry a QR code says more, and it cannot go stale in a way
 * nobody notices — it is the same list `/r/<code>` labels its chips from.
 *
 * The counts are printed from `venues.length`, never typed by hand, so adding a
 * store to the data file updates the heading too.
 */

export default async function PartnerNetwork() {
  const t = await getTranslations("home.partners");
  return (
    // Motion (1.11): section fade-up 24px / 0.7s / power3.out, trigger 75%, once.
    <Section
      id="partner-stores"
      tone="cream-50"
      labelledBy="partner-stores-title"
      data-anim="section"
    >
      <SectionHead
        layout="split"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="partner-stores-title"
        lede={t("lede")}
      />

      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16 lg:mt-16">
        {PARTNER_LOCATIONS.map((group) => (
          <div key={group.country} data-anim="country-block">
            <div className="flex items-baseline gap-3 border-t border-line-cream pt-6">
              <h3 className="font-display text-[26px] font-semibold leading-[1.3] text-text-900">
                {t(`country${group.country}`)}
              </h3>
              <p className="font-mono text-[14px] font-semibold text-text-600">
                {t("locations", { count: group.venues.length })}
              </p>
            </div>

            {/* Chips, not cards: these are labels for places, not links to
                them — nothing here is clickable yet, so nothing lifts. */}
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {group.venues.map((venue, i) => (
                <li
                  // Names repeat (e.g. four stores in "Nimman"), so the label
                  // alone isn't a unique key — pair it with its stable index.
                  key={`${venue}-${i}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line-cream bg-white px-4 py-2.5 text-[15px] font-medium text-text-900"
                >
                  <MapPin
                    className="size-[15px] shrink-0 text-green-700"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {venue}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-12 max-w-[52ch] text-[16px] leading-[1.65] text-text-600 text-pretty">
        {t("footnote")}
      </p>
    </Section>
  );
}
