import type { Graph } from "schema-dts";

import MotionDirector from "@/components/motion/MotionDirector";
import SmoothScroll from "@/components/motion/SmoothScroll";
import JsonLd from "@/components/seo/JsonLd";
import { AppDownloadProvider } from "@/components/site/AppDownloadModal";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import {
  LEGAL_NAME,
  ORG_ID,
  ORG_MISSION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_URLS,
  WEBSITE_ID,
} from "@/data/siteMeta";

/**
 * Organization + WebSite, once for every marketing page.
 *
 * They live in the layout rather than per page because they describe the SITE,
 * not the document — emitting them on each route would just repeat the same two
 * entities. Page-specific entities (the app on `/`, LocalBusiness on
 * `/venue/[slug]` in Phase 5) are added by the page and reference `ORG_ID`,
 * so the graph stays connected instead of becoming islands.
 */
const siteGraph: Graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      legalName: LEGAL_NAME,
      description: ORG_MISSION,
      url: SITE_URL,
      sameAs: [...SOCIAL_URLS],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
  ],
};

// Marketing pages share smooth scroll + nav + the pre-footer CTA band and
// footer. Auth/QR routes stay outside this group on purpose — they must not
// grow marketing JS.
//
// SiteFooter sits BELOW <main>: it is sitewide chrome, not page content, and
// its own <footer> element is the page's contentinfo landmark. It renders the
// green-700 CTA band first, so every marketing page closes green → ink and the
// DESIGN §5 sequence rule holds regardless of the last section's tone.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <JsonLd schema={siteGraph} />
      {/* Renders nothing. It reads the `data-anim` hooks the (server) sections
          emit and owns all of their motion, so no section needs "use client".
          Inside SmoothScroll so it can read the Lenis instance and drive
          ScrollTrigger from it. */}
      <MotionDirector />
      <AppDownloadProvider>
        <SiteNav />
        <main className="bg-cream-50">{children}</main>
        <SiteFooter />
      </AppDownloadProvider>
    </SmoothScroll>
  );
}
