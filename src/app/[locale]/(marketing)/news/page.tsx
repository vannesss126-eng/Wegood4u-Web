import type { Metadata } from "next";
import type { BreadcrumbList, CollectionPage, WithContext } from "schema-dts";
import { getTranslations } from "next-intl/server";

import StoriesGrid from "@/components/stories/StoriesGrid";
import UgcWall from "@/components/home/UgcWall";
import JsonLd from "@/components/seo/JsonLd";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import { getStories, getStoryCategories, toCard } from "@/lib/stories";
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
  const title = isTh ? "ข่าวสาร" : "News";
  const description = isTh
    ? "เรื่องราวอาหารและการท่องเที่ยวจาก Wegood4u — ทุกคาเฟ่ ร้านอาหาร และสถานที่ท่องเที่ยว ที่เราไปเยือน ถ่ายทำ และเขียนถึงด้วยตัวเองทั่วมาเลเซียและประเทศไทย"
    : "Food and travel stories from Wegood4u — every café, restaurant and attraction visited, filmed and written up first-hand across Malaysia and Thailand.";
  const ogTitle = isTh ? "ข่าวสาร — Wegood4u" : "News — Wegood4u";
  const ogDescription = isTh
    ? "เรื่องราวอาหารและการท่องเที่ยวจากประสบการณ์จริงในการไปเยือนทั่วมาเลเซียและประเทศไทย"
    : "First-hand food and travel stories from our visits across Malaysia and Thailand.";
  const alternates = localeAlternates("/news", locale);
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
    { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/news` },
  ],
};

/**
 * /news — Phase 5, the News/blog index (nav "News"). Lists every migrated WP
 * post; the editorial layer that links out to the /our-partners/[id] venue pages.
 * Category chips filter client-side (StoriesGrid); the hero + schema are server.
 *
 * Background arc (DESIGN §5): cream-50 hero → cream-100 grid → cream-50 UgcWall
 * → [green CTA band → ink footer, from the layout].
 */
export default async function StoriesIndexPage() {
  const t = await getTranslations("news");
  const stories = getStories();
  const cards = stories.map(toCard);
  const categories = getStoryCategories();
  const th = stories.filter((s) => s.country === "Thailand").length;
  const my = stories.filter((s) => s.country === "Malaysia").length;

  const collectionSchema: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Wegood4u News",
    url: `${SITE_URL}/news`,
    description:
      "First-hand food and travel stories from Wegood4u's visits across Malaysia and Thailand.",
    hasPart: stories.map((s) => ({
      "@type": "Article",
      headline: s.title,
      url: `${SITE_URL}/news/${s.slug}`,
      datePublished: s.publishedAt,
    })),
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={collectionSchema} />

      <Section tone="cream-50" labelledBy="stories-hero-title">
        <div className="max-w-[64ch]">
          <div data-anim="reveal">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          </div>
          <h1
            data-anim="text-reveal"
            id="stories-hero-title"
            className="mt-3 text-balance font-display text-[38px] font-bold leading-[1.05] tracking-[-0.5px] text-text-900 sm:text-[46px] lg:text-[52px]"
          >
            {t("hero.title")}
          </h1>
          <p
            data-anim="reveal"
            className="mt-5 text-pretty text-[18px] leading-[1.65] text-text-600"
          >
            {t.rich("hero.lede", {
              count: stories.length,
              my,
              th,
              strong: (chunks) => (
                <strong className="font-semibold text-text-900">{chunks}</strong>
              ),
            })}
          </p>
        </div>
      </Section>

      <Section tone="cream-100" labelledBy="stories-hero-title">
        <StoriesGrid cards={cards} categories={categories} />
      </Section>

      <UgcWall />
    </>
  );
}
