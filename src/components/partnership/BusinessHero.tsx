import { getTranslations } from "next-intl/server";
import Image from "next/image";

import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import forBusinessPhoto from "@/assets/images/home/for-business.webp";

/**
 * /partnership hero — the page's LCP.
 *
 * This is the one part of the site talking to venue owners, not members, so the
 * primary CTA drops to the enquiry form lower on the *same* page (`#enquire`),
 * not the app. Copy is lifted from the homepage's ForBusiness section (its "door
 * left ajar" pitch), promoted to a page hero.
 *
 * Static hero (the `<h1>` is the LCP element). The photo sits beside the copy
 * on lg — a real venue-partner shot, so the page opens on the audience it
 * addresses.
 */
export default async function BusinessHero() {
  const t = await getTranslations("partnership.hero");
  return (
    <Section
      tone="cream-50"
      labelledBy="partnership-title"
      className="overflow-hidden"
    >
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <div data-anim="reveal">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </div>

          <h1
            data-anim="text-reveal"
            id="partnership-title"
            className="mt-3 text-balance font-display text-[40px] font-bold leading-[1.05] tracking-[-0.5px] text-text-900 sm:text-[48px] lg:text-[58px]"
          >
            {t("title")}
          </h1>

          <div data-anim="reveal">
            <p className="mt-5 max-w-[52ch] text-pretty text-[18px] leading-[1.65] text-text-600">
              {t("lede")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button variant="primary" href="#enquire">
                {t("ctaPrimary")}
              </Button>
              <Button variant="ghost" href="#process">
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>
        </div>

        <figure data-anim="reveal" className="overflow-hidden rounded-media lg:col-span-6">
          <Image
            src={forBusinessPhoto}
            alt={t("photoAlt")}
            placeholder="blur"
            priority
            sizes="(min-width:1024px) 50vw, 92vw"
            className="aspect-[3/2] w-full object-cover object-[50%_40%]"
          />
        </figure>
      </div>
    </Section>
  );
}
