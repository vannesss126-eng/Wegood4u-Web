import type { Metadata } from "next";
import type { AboutPage, BreadcrumbList, WithContext } from "schema-dts";

import PlatformIntro from "@/components/about/PlatformIntro";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import FeaturedVideos from "@/components/about/FeaturedVideos";
import Team from "@/components/about/Team";
import JsonLd from "@/components/seo/JsonLd";
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
  // Plain string → root layout template appends "— Wegood4u".
  const title = isTh ? "เกี่ยวกับเรา" : "About us";
  const description = isTh
    ? "Wegood4u เชื่อมธุรกิจอาหารและการท่องเที่ยวเข้ากับครีเอเตอร์ — การโปรโมตที่จริงใจสำหรับร้านค้า และรางวัลจริงสำหรับสมาชิกที่แบ่งปันประสบการณ์"
    : "Wegood4u connects F&B and tourism businesses with creators — authentic exposure for venues, and real rewards for members who share their experiences.";
  const ogTitle = isTh ? "เกี่ยวกับ Wegood4u" : "About Wegood4u";
  const ogDescription = isTh
    ? "แพลตฟอร์มสำหรับธุรกิจและนักสำรวจ — คอนเทนต์จริง การมีส่วนร่วมจริง ความไว้วางใจจริง"
    : "A platform for businesses and explorers — real content, real engagement, real trust.";
  const alternates = localeAlternates("/about", locale);
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

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "About us", item: `${SITE_URL}/about` },
  ],
};

const aboutSchema: WithContext<AboutPage> = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Wegood4u",
  url: `${SITE_URL}/about`,
  description:
    "Wegood4u connects F&B and tourism businesses with passionate creators — authentic exposure for venues, real rewards for members.",
};

/**
 * /about — Phase 4.1, rebuilt to follow the WP /about-us/ layout in our system:
 * the "A Platform for Businesses & Explorers" collage + checklist → "Why Choose
 * Us" (no scripted ads) with the real proof counters + a shoot photo → "Featured
 * in Our Video" gallery → the team.
 *
 * The WP "Latest Blog & Article" block is omitted: /news is the Phase-5 blog
 * and linking to it now would be a dead link.
 *
 * Background arc (DESIGN §5): cream-50 → cream-100 → ink-950 → cream-50 → [green
 * CTA band → ink footer, from the layout].
 */
export default function AboutPageRoute() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={aboutSchema} />
      <PlatformIntro />
      <WhyChooseUs />
      <FeaturedVideos />
      <Team />
    </>
  );
}
