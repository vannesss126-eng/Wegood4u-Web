import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";

import LegalDoc from "@/components/legal/LegalDoc";
import JsonLd from "@/components/seo/JsonLd";
import { PRIVACY } from "@/data/legal";
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
  const title = isTh ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy";
  const description = isTh
    ? "วิธีที่ Wegood4u เก็บรวบรวม ใช้ แบ่งปัน และปกป้องข้อมูลของคุณทั้งในแอปและเว็บไซต์ — พร้อมทางเลือกและการควบคุมที่คุณมี"
    : "How Wegood4u collects, uses, shares and protects your information across the app and website — and the choices and controls you have.";
  const ogTitle = isTh ? "นโยบายความเป็นส่วนตัว — Wegood4u" : "Privacy Policy — Wegood4u";
  const ogDescription = isTh
    ? "เราเก็บข้อมูลอะไร ใช้อย่างไร แบ่งปันกับใคร และทางเลือกของคุณ"
    : "What we collect, how we use it, who we share it with, and your choices.";
  const alternates = localeAlternates("/privacy", locale);
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
      name: "Privacy Policy",
      item: `${SITE_URL}/privacy`,
    },
  ],
};

/**
 * /privacy — the company's own privacy policy, ported from the live WordPress
 * page (wegood4u.com/privacy-policy). WP `/privacy-policy/` 301s here
 * (next.config.ts). Content lives in `data/legal.ts`.
 */
export default function PrivacyPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <LegalDoc doc={PRIVACY} titleId="privacy-title" />
    </>
  );
}
