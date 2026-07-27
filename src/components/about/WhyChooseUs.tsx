import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Building2, Store, Users } from "lucide-react";

import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import filmingPhoto from "@/assets/images/home-hero.webp";

/**
 * "Where businesses and creators thrive together" — the WP "Why Choose Us" block:
 * the no-scripted-ads statement, the three proof counters (the real WP figures:
 * 96 F&B / 37 Tourism / 180 members), the two audience CTAs, and a photo of a
 * shoot in progress with a coral circle accent (the WP decoration).
 */

/** value is a proof figure (stays literal); labelKey resolves under `about.why`. */
const STATS = [
  { icon: Store, value: "96", labelKey: "fbLabel" },
  { icon: Building2, value: "37", labelKey: "tourismLabel" },
  { icon: Users, value: "180", labelKey: "membersLabel" },
] as const;

export default async function WhyChooseUs() {
  const t = await getTranslations("about.why");
  return (
    <Section tone="cream-100" labelledBy="why-title">
      <div
        data-anim="collage"
        className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16"
      >
        <div data-anim="rise" className="lg:col-span-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2
            id="why-title"
            className="mt-3 text-balance font-display text-[28px] font-semibold leading-[1.2] text-text-900 sm:text-[32px] lg:text-[36px]"
          >
            {t("title")}
          </h2>
          <p className="mt-5 max-w-[54ch] text-pretty text-[17px] leading-[1.65] text-text-600">
            {t("body1")}
          </p>
          <p className="mt-3 max-w-[54ch] text-pretty text-[17px] leading-[1.65] text-text-600">
            {t("body2")}
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-4">
            {STATS.map(({ icon: Icon, value, labelKey }) => (
              <div key={labelKey}>
                <Icon
                  aria-hidden="true"
                  className="size-7 text-coral-600"
                  strokeWidth={1.75}
                />
                <dd className="mt-3 font-mono text-[36px] font-semibold leading-none tracking-[-0.5px] tabular-nums text-text-900 lg:text-[44px]">
                  {value}
                </dd>
                <dt className="mt-1.5 text-[14px] font-medium leading-[1.35] text-text-600">
                  {t(labelKey)}
                </dt>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button variant="primary" href="/partnership">
              {t("registerCta")}
            </Button>
            <Button variant="ghost" href="/membership">
              {t("joinCta")}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative mx-auto max-w-[520px] lg:mx-0">
            <span
              data-anim="orb"
              aria-hidden="true"
              className="absolute -left-5 -top-5 size-24 rounded-full bg-coral-500/90 sm:size-28"
            />
            <figure
              data-anim="float-img"
              className="relative overflow-hidden rounded-media shadow-card"
            >
              <Image
                src={filmingPhoto}
                alt={t("filmingPhotoAlt")}
                placeholder="blur"
                sizes="(min-width:1024px) 44vw, 92vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </figure>
          </div>
        </div>
      </div>
    </Section>
  );
}
