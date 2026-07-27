import { getTranslations } from "next-intl/server";

import StoryCard from "@/components/stories/StoryCard";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { getStories, toCard } from "@/lib/stories";

/**
 * Homepage "Our latest news" — the three newest /news posts, so the blog has a
 * pull from the highest-traffic page. Server component: it reads the data layer
 * and renders StoryCards inline (the full article bodies never reach the client).
 *
 * Sits after PartnerNetwork (cream-50) and before the green CTA band, so it takes
 * cream-100 — the same light-card-on-cream-100 pairing the /news grid uses, and a
 * distinct-but-adjacent neighbour to PartnerNetwork (DESIGN §5).
 */
export default async function LatestNews() {
  const t = await getTranslations("home.news");
  const latest = getStories().slice(0, 3).map(toCard);
  if (latest.length === 0) return null;

  return (
    <Section tone="cream-100" labelledBy="latest-news-title" data-anim="section">
      <SectionHead
        layout="split"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="latest-news-title"
        lede={t("lede")}
        action={
          <Button variant="ghost" href="/news">
            {t("action")}
          </Button>
        }
      />

      <ul
        data-anim="reveal-group"
        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {latest.map((c) => (
          <li key={c.slug} data-anim="reveal-item">
            <StoryCard story={c} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
