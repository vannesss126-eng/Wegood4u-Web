import type { StaticImageData } from "next/image";

/**
 * The content model for /news (Phase 5, the News/blog engine).
 *
 * Designed so a future Supabase swap is a *data-layer* change only: the shape
 * below maps cleanly onto a `stories` table (one row per post, `content` as a
 * markdown text column, `hero` as a storage URL). Today the 27 posts are static
 * TS modules migrated from the WP archive — `src/lib/stories.ts` is the only
 * seam any consumer touches, so switching the source never reaches a component.
 *
 * `content` is trusted, first-party markdown (migrated by us, not user input).
 * It is rendered with react-markdown — no raw HTML, no `dangerouslySetInnerHTML`.
 */
export type StoryCategory = "Food" | "Travel" | "Lifestyle";
export type StoryCountry = "Malaysia" | "Thailand";

export interface Story {
  /** URL slug — the post lives at /news/[slug] and 301s from /[slug]. */
  slug: string;
  /** Display headline (H1). */
  title: string;
  /** <title> text — Next appends the site name via the template. */
  metaTitle: string;
  /** Meta description, kept ≤ ~155 chars for SERP. */
  metaDescription: string;
  /** Short card + social summary. */
  excerpt: string;
  category: StoryCategory;
  country: StoryCountry;
  city: string;
  /** ISO date (yyyy-mm-dd). */
  publishedAt: string;
  /** Local static import — gives next/image its blur placeholder + dimensions. */
  hero: StaticImageData;
  heroAlt: string;
  /** YouTube video id, when the post has a feature video. */
  youtubeId?: string;
  /** The venue's /our-partners/[id], when it exists in the directory. */
  venueId?: string;
  /** Markdown body (first-party, trusted). */
  content: string;
}

/**
 * The subset a card needs. The index filter is a client component, so cards are
 * passed this shape (never the full `Story`) — the heavy `content` strings stay
 * server-side and out of the client bundle.
 */
export type StoryCardData = Pick<
  Story,
  | "slug"
  | "title"
  | "excerpt"
  | "category"
  | "country"
  | "city"
  | "publishedAt"
  | "hero"
  | "heroAlt"
>;
