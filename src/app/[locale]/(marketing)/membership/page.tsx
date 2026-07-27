import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, WithContext } from "schema-dts";

import MembershipHero from "@/components/membership/MembershipHero";
import WhyMissingOut from "@/components/membership/WhyMissingOut";
import MemberJourney from "@/components/membership/MemberJourney";
import MemberRewards from "@/components/membership/MemberRewards";
import MemberTiers from "@/components/membership/MemberTiers";
import ReferralProgram from "@/components/membership/ReferralProgram";
import MemberDiscovery from "@/components/membership/MemberDiscovery";
import MemberAppFeatures from "@/components/membership/MemberAppFeatures";
import MemberCommunity from "@/components/membership/MemberCommunity";
import MemberStories from "@/components/membership/MemberStories";
import MembershipFaq from "@/components/membership/MembershipFaq";
import JsonLd from "@/components/seo/JsonLd";
import { MEMBERSHIP_PROGRAM_FAQS } from "@/data/faq";
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
  const title = isTh ? "สมาชิก" : "Membership";
  const description = isTh
    ? "กินที่ร้านอาหารพันธมิตร 10 ร้าน แล้วปลดล็อกที่พักโรงแรมฟรีมูลค่า RM 300–800 ถ่ายเซลฟี่ ให้ AI ยืนยันการเยี่ยม ไต่ระดับและแนะนำเพื่อน สมัครฟรี ไม่ต้องใช้บัตรเครดิต"
    : "Eat at 10 partner restaurants and unlock a free hotel stay worth RM 300–800. Snap a selfie, let AI verify the visit, climb the tiers and refer friends. Free to join, no credit card.";
  const ogTitle = isTh
    ? "กินที่ร้าน 10 ร้าน รับที่พักโรงแรมฟรี"
    : "Eat at 10 restaurants. Get a free hotel stay.";
  const ogDescription = isTh
    ? "เปลี่ยนมื้ออาหารที่คุณกินอยู่แล้วให้เป็นที่พักฟรีมูลค่า RM 300–800 สมัครฟรี — รับรางวัลได้ตั้งแต่วันแรก"
    : "Turn dinners you'd have had anyway into free stays worth RM 300–800. Free to join — earn from day one.";
  const alternates = localeAlternates("/membership", locale);
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
    {
      "@type": "ListItem",
      position: 2,
      name: "Membership",
      item: `${SITE_URL}/membership`,
    },
  ],
};

/** FAQPage — only the questions actually rendered by <MembershipFaq> (a schema
 *  listing unseen Q&As is a structured-data violation). */
const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MEMBERSHIP_PROGRAM_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/**
 * /membership — the member value + enrollment page.
 *
 * Rebuilt to fold in the full new-member landing content
 * (wegood4u.saysheji.my/new-member) the supervisor asked for, told in our own
 * design language: the concrete "10 restaurants → free stay" promise, the
 * 10-credit task cycle, the reward catalogue, the four-tier ladder, the
 * three-tier referral system (with an interactive calculator), cuisine
 * discovery, the app features, the community proof, member stories and the
 * programme FAQ. Earlier this page deliberately avoided invented tiers/points;
 * those are now real, client-supplied content, so they're in.
 *
 * Only two islands are client components — the ReferralProgram calculator and
 * (via MotionDirector) the scroll reveals; everything else is a Server
 * Component. The page emits BreadcrumbList + FAQPage JSON-LD.
 *
 * Background rhythm follows the divider rule (globals.css collapses padding
 * between same-tone neighbours): cream-50 hero → cream-100 why → cream-50
 * journey+rewards (one bright run) → ink-950 tiers → cream-50 referral →
 * cream-100 discovery → cream-50 app+community (one run) → cream-100 stories →
 * cream-50 FAQ → [footer green CTA]. The page's own close was dropped — the
 * footer's download band already served that job right below it.
 */
export default function MembershipPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={faqSchema} />

      <MembershipHero />
      <WhyMissingOut />
      <MemberJourney />
      <MemberRewards />
      <MemberTiers />
      <ReferralProgram />
      <MemberDiscovery />
      <MemberAppFeatures />
      <MemberCommunity />
      <MemberStories />
      <MembershipFaq />
    </>
  );
}
