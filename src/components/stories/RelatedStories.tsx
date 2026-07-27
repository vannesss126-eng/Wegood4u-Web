import StoryCard from "@/components/stories/StoryCard";
import type { StoryCardData } from "@/data/stories/types";

/** "Keep reading" strip at the foot of a post. Server-rendered. */
export default function RelatedStories({ stories }: { stories: StoryCardData[] }) {
  if (stories.length === 0) return null;
  return (
    <ul
      data-anim="reveal-group"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {stories.map((s) => (
        <li key={s.slug} data-anim="reveal-item">
          <StoryCard story={s} />
        </li>
      ))}
    </ul>
  );
}
