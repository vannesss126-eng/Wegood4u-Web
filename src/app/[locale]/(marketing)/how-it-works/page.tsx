import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, WithContext } from "schema-dts";

import HowItWorksHero from "@/components/how-it-works/HowItWorksHero";
import JourneySteps from "@/components/how-it-works/JourneySteps";
import RewardLoop from "@/components/how-it-works/RewardLoop";
import FaqTeaser from "@/components/how-it-works/FaqTeaser";
import JsonLd from "@/components/seo/JsonLd";
import { MEMBER_FAQS_TEASER } from "@/data/faq";
import { SITE_NAME, SITE_URL } from "@/data/siteMeta";
import type { Locale } from "@/i18n/routing";
import { localeAlternates, ogLocale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTh = locale === "th";
  // Plain string → root layout template appends "— Wegood4u".
  const title = isTh ? "วิธีการทำงาน" : "How it works";
  const description = isTh
    ? "ดูวิธีการทำงานของ Wegood4u ทีละขั้นตอน: ไปที่ร้านพันธมิตร แบ่งปันประสบการณ์ และสะสมแต้มเพื่อแลกที่พักฟรี วอเชอร์ และรางวัล VIP สมัครฟรี"
    : "See how Wegood4u works, step by step: visit a partner venue, share your experience, and collect points towards free stays, vouchers and VIP rewards. Free to join.";
  const ogTitle = isTh ? `${SITE_NAME} ทำงานอย่างไร` : `How ${SITE_NAME} works`;
  const ogDescription = isTh
    ? "ไปที่ร้านพันธมิตร แบ่งปันประสบการณ์ สะสมแต้มเพื่อรับรางวัล ครบสิบครั้งปลดล็อกรางวัลพิเศษ"
    : "Visit a partner venue, share the experience, earn points towards rewards. Ten visits unlocks an exclusive reward.";
  const alternates = localeAlternates("/how-it-works", locale);
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
  };
}

/**
 * FAQPage carries ONLY the four questions the teaser actually renders — the
 * schema and the visible copy come from the same `MEMBER_FAQS_TEASER` export, so
 * they cannot drift and the markup never claims a Q&A the reader can't see.
 */
const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MEMBER_FAQS_TEASER.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "How it works",
      item: `${SITE_URL}/how-it-works`,
    },
  ],
};

/**
 * /how-it-works — the member-journey explainer (Phase 2.1).
 *
 * Fully static: no data fetching, so no `loading.tsx` / `error.tsx` boundary is
 * warranted (those exist to cover async segments). The shared CTA band + footer
 * come from the (marketing) layout, so the page closes green → ink on its own.
 *
 * Background arc: cream-100 hero → cream-50 steps → ink reward peak → cream-100
 * FAQ → [green CTA band → ink footer]. No two identical neighbours (DESIGN §5).
 */
export default function HowItWorksPage() {
  return (
    <>
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <HowItWorksHero />
      <JourneySteps />
      <RewardLoop />
      <FaqTeaser />
    </>
  );
}
