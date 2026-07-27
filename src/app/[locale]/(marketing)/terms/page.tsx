import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";

import LegalDoc from "@/components/legal/LegalDoc";
import JsonLd from "@/components/seo/JsonLd";
import { TERMS } from "@/data/legal";
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
  const title = isTh ? "ข้อกำหนดในการให้บริการ" : "Terms of Service";
  const description = isTh
    ? "ข้อกำหนดที่ควบคุมการใช้งานแอปและเว็บไซต์ Wegood4u ของคุณ — บัญชี โปรแกรมสมาชิกและรางวัล การใช้งานที่ยอมรับได้ และอื่น ๆ"
    : "The terms that govern your use of the Wegood4u app and website — accounts, the membership and rewards programme, acceptable use, and more.";
  const ogTitle = isTh ? "ข้อกำหนดในการให้บริการ — Wegood4u" : "Terms of Service — Wegood4u";
  const ogDescription = isTh
    ? "ข้อกำหนดที่ควบคุมการใช้งานแอปและเว็บไซต์ Wegood4u ของคุณ"
    : "The terms that govern your use of the Wegood4u app and website.";
  const alternates = localeAlternates("/terms", locale);
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
      name: "Terms of Service",
      item: `${SITE_URL}/terms`,
    },
  ],
};

/**
 * /terms — Terms of Service. No terms page existed on WordPress, so the content
 * in `data/legal.ts` (TERMS) is a NEW draft written for Wegood4u's model; it
 * needs the client's legal review before cutover.
 */
export default function TermsPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <LegalDoc doc={TERMS} titleId="terms-title" />
    </>
  );
}
