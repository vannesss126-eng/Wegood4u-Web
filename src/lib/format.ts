/**
 * Pure formatting helpers, safe to import from client components (no data or
 * server-only imports). Kept out of `lib/stories.ts` so a card can format a date
 * without dragging the whole story dataset into the client bundle.
 */

/** "18 Nov 2024" — the compact date style used across the site. */
export function formatStoryDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
