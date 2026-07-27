import type { Metadata } from "next";
import type { Article, BreadcrumbList, WithContext } from "schema-dts";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin } from "lucide-react";

import StoryProse from "@/components/stories/StoryProse";
import StoryVideo from "@/components/stories/StoryVideo";
import VenueCallout from "@/components/stories/VenueCallout";
import RelatedStories from "@/components/stories/RelatedStories";
import JsonLd from "@/components/seo/JsonLd";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { getPartnerStoreDetail } from "@/lib/partnerStores";
import {
  formatStoryDate,
  getRelatedStories,
  getStory,
  getStorySlugs,
  readingMinutes,
  toCard,
  type Story,
} from "@/lib/stories";
import { ORG_ID, SITE_NAME, SITE_URL } from "@/data/siteMeta";
import { localeAlternates, ogLocale } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ locale: Locale; slug: string }> };

const CATEGORY_PILL: Record<Story["category"], string> = {
  Food: "bg-coral-100 text-coral-700",
  Travel: "bg-green-700/10 text-green-800",
  Lifestyle: "bg-ink-900/[0.07] text-ink-900",
};

export function generateStaticParams() {
  return getStorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const story = getStory(slug);
  if (!story) return { title: "Story not found" };
  const alternates = localeAlternates(`/news/${slug}`, locale);
  return {
    title: story.metaTitle,
    description: story.metaDescription,
    alternates,
    openGraph: {
      type: "article",
      title: story.metaTitle,
      description: story.metaDescription,
      url: alternates.canonical as string,
      locale: ogLocale(locale),
      publishedTime: story.publishedAt,
      images: [{ url: story.hero.src }],
    },
  };
}

/**
 * /news/[slug] — Phase 5 blog post. The 27 WP articles migrated to markdown
 * (src/data/stories), rendered in a 720px prose column with Article + Breadcrumb
 * JSON-LD. Each post links to its /our-partners/[id] venue (VenueCallout) and,
 * when it has one, autoplays its feature video under the hero (StoryVideo). All 27
 * are prerendered (generateStaticParams); the old flat WP URLs 301 here.
 */
export default async function StoryPage({ params }: Params) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const t = await getTranslations("news");
  const related = getRelatedStories(slug).map(toCard);
  const venue = story.venueId
    ? await getPartnerStoreDetail(story.venueId)
    : null;
  const minutes = readingMinutes(story.content);

  const articleSchema: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.metaDescription,
    image: `${SITE_URL}${story.hero.src}`,
    datePublished: story.publishedAt,
    articleSection: story.category,
    inLanguage: "en",
    mainEntityOfPage: `${SITE_URL}/news/${slug}`,
    author: { "@type": "Organization", name: SITE_NAME, "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };

  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/news` },
      {
        "@type": "ListItem",
        position: 3,
        name: story.title,
        item: `${SITE_URL}/news/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd schema={articleSchema} />
      <JsonLd schema={breadcrumbSchema} />

      {/* Article surface */}
      <Section tone="cream-50" labelledBy="story-title">
        {/* Header */}
        <div className="mx-auto max-w-[760px]">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-text-600 outline-none transition-colors duration-200 hover:text-coral-700 focus-visible:text-coral-700"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {t("article.back")}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13.5px] text-text-600">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em]",
                CATEGORY_PILL[story.category],
              )}
            >
              {story.category}
            </span>
            <time dateTime={story.publishedAt}>{formatStoryDate(story.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="size-3.5" />
              {t("article.minRead", { minutes })}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3.5 text-coral-600" />
              {story.city}, {story.country}
            </span>
          </div>

          <h1
            data-anim="text-reveal"
            id="story-title"
            className="mt-4 text-balance font-display text-[32px] font-bold leading-[1.08] tracking-[-0.5px] text-text-900 sm:text-[40px] lg:text-[44px]"
          >
            {story.title}
          </h1>
          <p
            data-anim="reveal"
            className="mt-4 text-pretty text-[19px] leading-[1.6] text-text-600 sm:text-[20px]"
          >
            {story.excerpt}
          </p>
        </div>

        {/* Hero */}
        <div data-anim="reveal" className="mx-auto mt-8 max-w-[960px]">
          <Image
            src={story.hero}
            alt={story.heroAlt}
            sizes="(min-width:960px) 960px, 100vw"
            placeholder="blur"
            priority
            className="w-full rounded-[24px] object-cover"
          />
        </div>

        {/* Feature video — directly under the hero, autoplays (muted) */}
        {story.youtubeId ? (
          <div className="mx-auto mt-6 max-w-[720px]">
            <StoryVideo youtubeId={story.youtubeId} title={story.title} />
          </div>
        ) : null}

        {/* Body */}
        <div className="mx-auto mt-10 max-w-[720px]">
          <StoryProse content={story.content} />

          {venue ? <VenueCallout store={venue} /> : null}

          {/* Author / E-E-A-T */}
          <div className="mt-12 flex items-center gap-4 rounded-[20px] border border-line-cream bg-cream-100 p-5">
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-coral-600 font-display text-[18px] font-bold text-white"
            >
              W
            </span>
            <div>
              <p className="font-display text-[16px] font-bold text-text-900">
                {t("article.authorName", { name: SITE_NAME })}
              </p>
              <p className="mt-0.5 text-[14px] leading-[1.55] text-text-600">
                {t("article.authorBio")}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Keep reading */}
      {related.length > 0 ? (
        <Section tone="cream-100" labelledBy="related-title">
          <SectionHead titleId="related-title" eyebrow={t("related.eyebrow")} title={t("related.title")} />
          <div className="mt-8">
            <RelatedStories stories={related} />
          </div>
        </Section>
      ) : null}
    </>
  );
}
