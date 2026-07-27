import type { Metadata } from "next";
import type { BreadcrumbList, CollectionPage, WithContext } from "schema-dts";
import { getTranslations } from "next-intl/server";

import PartnersExplorer from "@/components/our-partners/PartnersExplorer";
import JsonLd from "@/components/seo/JsonLd";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import { getPartnerStores } from "@/lib/partnerStores";
import { SITE_URL } from "@/data/siteMeta";
import type { Locale } from "@/i18n/routing";
import { localeAlternates, ogLocale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTh = locale === "th";
  const title = isTh ? "ร้านพันธมิตรของเรา" : "Our partners";
  const description = isTh
    ? "เลือกชมร้านพันธมิตรของ Wegood4u ทั่วประเทศไทยและมาเลเซีย — คาเฟ่ ร้านอาหาร บาร์ และบุฟเฟต์ ทุกร้านผ่านการไปเยือนและรีวิวด้วยตัวเราเอง"
    : "Browse Wegood4u's partner venues across Thailand and Malaysia — cafés, restaurants, bars and buffets, every one visited and reviewed first-hand.";
  const ogTitle = isTh ? "ร้านพันธมิตรของเรา — Wegood4u" : "Our partners — Wegood4u";
  const ogDescription = isTh
    ? "คาเฟ่ ร้านอาหาร บาร์ และบุฟเฟต์ ทั่วประเทศไทยและมาเลเซีย — ค้นหา กรอง และสำรวจ"
    : "Cafés, restaurants, bars and buffets across Thailand and Malaysia — search, filter and explore.";
  const alternates = localeAlternates("/our-partners", locale);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: alternates.canonical as string,
      locale: ogLocale(locale),
    },
    twitter: { title: ogTitle, description: ogDescription },
  };
}

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Our partners", item: `${SITE_URL}/our-partners` },
  ],
};

/**
 * /our-partners — Phase 4.2. A live directory of the `partner_stores` table
 * (Supabase, anon read, ISR-hourly via `getPartnerStores`). The server component
 * fetches; `PartnersExplorer` (client) owns search + category + country filters,
 * pagination and the card-stagger motion.
 *
 * Background arc: cream-50 hero → cream-100 directory → [green CTA → ink footer].
 */
export default async function OurPartnersPage() {
  const t = await getTranslations("ourPartners.hero");
  const stores = await getPartnerStores();
  const th = stores.filter((s) => s.country === "Thailand").length;
  const my = stores.filter((s) => s.country === "Malaysia").length;

  const collectionSchema: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Wegood4u partner venues",
    url: `${SITE_URL}/our-partners`,
    description: `Wegood4u partners with ${stores.length} F&B and tourism venues across Thailand and Malaysia.`,
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={collectionSchema} />

      <Section tone="cream-50" labelledBy="partners-hero-title">
        <div className="max-w-[62ch]">
          <div data-anim="reveal">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </div>
          <h1
            data-anim="text-reveal"
            id="partners-hero-title"
            className="mt-3 text-balance font-display text-[38px] font-bold leading-[1.05] tracking-[-0.5px] text-text-900 sm:text-[46px] lg:text-[52px]"
          >
            {t("title")}
          </h1>
          <p
            data-anim="reveal"
            className="mt-5 text-pretty text-[18px] leading-[1.65] text-text-600"
          >
            {t("leadIntro")}{" "}
            {stores.length > 0
              ? t.rich("leadCount", {
                  count: stores.length,
                  th,
                  my,
                  strong: (c) => (
                    <strong className="font-semibold text-text-900">{c}</strong>
                  ),
                })
              : t("leadFallback")}
          </p>
        </div>
      </Section>

      <Section tone="cream-100" pad="tight" labelledBy="partners-hero-title">
        <PartnersExplorer stores={stores} />
      </Section>
    </>
  );
}
