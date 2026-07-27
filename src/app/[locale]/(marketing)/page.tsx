import type { Metadata } from "next";
import type { WithContext, MobileApplication } from "schema-dts";

import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Rewards from "@/components/home/Rewards";
import InsideTheApp from "@/components/home/InsideTheApp";
import PartnerNetwork from "@/components/home/PartnerNetwork";
import LatestNews from "@/components/home/LatestNews";
import JsonLd from "@/components/seo/JsonLd";
import { appStoreUrl, playStoreUrl } from "@/data/storeLinks";
import { ORG_ID, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/data/siteMeta";
import type { Locale } from "@/i18n/routing";
import { localeAlternates, ogLocale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTh = locale === "th";
  // Absolute title (not the "%s — Wegood4u" template) so the homepage doesn't
  // read "Wegood4u — Eat. Snap. Earn. — Wegood4u".
  const title = isTh
    ? `${SITE_NAME} — กิน ถ่าย รับรางวัล`
    : `${SITE_NAME} — Eat. Snap. Earn.`;
  const description = isTh
    ? "ไปร้านอาหารพันธมิตรในมาเลเซียและไทย ถ่ายรูปเซลฟี่กับอาหาร สะสมเครดิต แล้วปลดล็อกที่พักฟรี — ดาวน์โหลดฟรี สมัครในไม่กี่วินาที รับรางวัลได้ตั้งแต่วันแรก"
    : SITE_DESCRIPTION;
  const alternates = localeAlternates("/", locale);
  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical as string,
      locale: ogLocale(locale),
    },
    twitter: { title, description },
  };
}

/**
 * The homepage's own entity: the thing the page is actually about.
 *
 * `MobileApplication` rather than `SoftwareApplication` because that is what it
 * is, and `installUrl` carries both stores so the entity is not tied to one
 * platform. No `aggregateRating` — we have no verifiable review count, and an
 * invented one is exactly the kind of thing that earns a structured-data
 * penalty rather than a rich result.
 */
const appSchema: WithContext<MobileApplication> = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "@id": `${SITE_URL}/#app`,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "iOS, Android",
  url: SITE_URL,
  installUrl: [appStoreUrl(), playStoreUrl()],
  offers: { "@type": "Offer", price: "0", priceCurrency: "MYR" },
  publisher: { "@id": ORG_ID },
};

/**
 * Homepage — the app-install page.
 *
 * Content comes from wegood4u.saysheji.my (this repo on `main`): the app
 * landing at `src/app/r/[code]/page.tsx`, the real partner network in
 * `src/data/partnerStores.ts`, and the two product screenshots from
 * `public/r/`. The WordPress narrative it replaced — venue cards, member UGC,
 * the creator-first story — belongs to wegood4u.com and moves to its own
 * routes: Portal, ExplorePartners, ForBusiness and UgcWall are untouched and
 * still waiting for /our-partners and /news (the business pitch now lives on
 * /partnership).
 *
 * The background sequence IS the composition (DESIGN §5: never two identical
 * neighbours, never zebra). Read top to bottom, the value arc is:
 *
 *   Hero            ink-950   the product itself, lit
 *   HowItWorks      cream-50  three steps, on the flight path
 *   Rewards         cream-100 what you get back
 *   InsideTheApp    ink-950   the real Submit screen        ← the proof
 *   PartnerNetwork  cream-50  where you can earn
 *   LatestNews      cream-100 three newest /news posts
 *   SiteFooter      green-700 CTA band → ink-950 footer (in the layout)
 *
 * Dark punctuation lands every two sections, so brightness reads as a narrative
 * rather than a checkerboard. SiteFooter is sitewide chrome and lives in
 * (marketing)/layout.tsx, which guarantees the closing green → ink.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd schema={appSchema} />
      <Hero />
      <HowItWorks />
      <Rewards />
      <InsideTheApp />
      <PartnerNetwork />
      <LatestNews />
    </>
  );
}
