import { ALL_STORIES } from "@/data/stories";
import type {
  Story,
  StoryCardData,
  StoryCategory,
  StoryCountry,
} from "@/data/stories/types";

export type { Story, StoryCardData, StoryCategory, StoryCountry };
export { formatStoryDate } from "@/lib/format";

/**
 * Data layer for /news. The 27 posts are static TS modules today
 * (`src/data/stories/*`), migrated from the WP archive. This module is the only
 * seam consumers touch, so a later Supabase swap replaces the source here and
 * nothing downstream changes (DESIGN §5.1: "a Supabase swap is a data-layer
 * change only").
 */

const byNewest = (a: Story, b: Story) => b.publishedAt.localeCompare(a.publishedAt);

/** All posts, newest first. */
export function getStories(): Story[] {
  return [...ALL_STORIES].sort(byNewest);
}

export function getStory(slug: string): Story | undefined {
  return ALL_STORIES.find((s) => s.slug === slug);
}

/** For generateStaticParams — every post is prerendered. */
export function getStorySlugs(): string[] {
  return ALL_STORIES.map((s) => s.slug);
}

/** Distinct categories present, in a stable display order. */
export function getStoryCategories(): StoryCategory[] {
  const order: StoryCategory[] = ["Food", "Travel", "Lifestyle"];
  const present = new Set(ALL_STORIES.map((s) => s.category));
  return order.filter((c) => present.has(c));
}

/** ~200 wpm; floored at 1 minute. */
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Related posts: same category weighs most, then same country, then recency.
 * Excludes the current post. Used for the "Keep reading" strip.
 */
export function getRelatedStories(slug: string, limit = 3): Story[] {
  const current = getStory(slug);
  if (!current) return [];
  return getStories()
    .filter((s) => s.slug !== slug)
    .map((s) => ({
      s,
      score:
        (s.category === current.category ? 2 : 0) +
        (s.country === current.country ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || byNewest(a.s, b.s))
    .slice(0, limit)
    .map((x) => x.s);
}

/** Narrow a Story to the card subset — keeps `content` out of client props. */
export function toCard(s: Story): StoryCardData {
  return {
    slug: s.slug,
    title: s.title,
    excerpt: s.excerpt,
    category: s.category,
    country: s.country,
    city: s.city,
    publishedAt: s.publishedAt,
    hero: s.hero,
    heroAlt: s.heroAlt,
  };
}
