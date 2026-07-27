import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SquareCheckBig } from "lucide-react";

import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import staffPhoto from "@/assets/images/home/for-business.webp";
import memberPhoto from "@/assets/images/home/ugc-1.webp";

/**
 * /about opening — the WP "A Platform for Businesses & Explorers" block, kept close
 * to the original: an overlapping two-photo collage with a coral accent block on
 * the left, and on the right the welcome copy, the "Why we created Wegood4u"
 * sub-section, and the three-point checklist. This carries the page `<h1>`.
 */

/** i18n key stems under `about.intro`. */
const CHECKS = ["check1", "check2", "check3"] as const;

export default async function PlatformIntro() {
  const t = await getTranslations("about.intro");
  return (
    <Section
      tone="cream-50"
      labelledBy="platform-title"
      className="overflow-hidden"
    >
      <div
        data-anim="collage"
        className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16"
      >
        {/* Collage: coral block behind a main photo, with a second photo
            overlapping the bottom-right corner (the WP layout). */}
        <div className="lg:col-span-6">
          <div className="relative mx-auto max-w-[460px] lg:mx-0">
            <span
              data-anim="orb"
              aria-hidden="true"
              className="absolute -left-4 -top-4 size-28 rounded-[24px] bg-coral-500 sm:size-36"
            />
            <div
              data-anim="float-img"
              className="relative overflow-hidden rounded-media shadow-card"
            >
              <Image
                src={staffPhoto}
                alt={t("staffPhotoAlt")}
                placeholder="blur"
                priority
                sizes="(min-width:1024px) 40vw, 88vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div
              data-anim="float-img"
              className="absolute -bottom-6 -right-3 w-[52%] overflow-hidden rounded-[20px] shadow-card-hover ring-[6px] ring-cream-50 sm:-right-6"
            >
              <Image
                src={memberPhoto}
                alt={t("memberPhotoAlt")}
                placeholder="blur"
                sizes="(min-width:1024px) 22vw, 46vw"
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div data-anim="rise" className="lg:col-span-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1
            id="platform-title"
            className="mt-3 text-balance font-display text-[34px] font-bold leading-[1.1] tracking-[-0.5px] text-text-900 sm:text-[42px] lg:text-[46px]"
          >
            {t("title")}
          </h1>
          <p className="mt-5 max-w-[54ch] text-pretty text-[17px] leading-[1.65] text-text-600">
            {t("lede")}
          </p>

          <h2 className="mt-8 font-display text-[20px] font-semibold text-text-900">
            {t("whyTitle")}
          </h2>
          <p className="mt-2 max-w-[54ch] text-pretty text-[17px] leading-[1.65] text-text-600">
            {t("whyBody")}
          </p>

          <ul className="mt-5 space-y-3">
            {CHECKS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <SquareCheckBig
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-coral-600"
                  strokeWidth={2}
                />
                <span className="text-[16px] leading-[1.6] text-text-600">
                  {t(item)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button variant="ghost" href="/how-it-works">
              {t("cta")}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
