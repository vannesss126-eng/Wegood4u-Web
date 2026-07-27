import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin } from "lucide-react";

import type { StoryCardData } from "@/data/stories/types";
import { formatStoryDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Category → pill styling. Kept small + explicit so it fails a type check if a
 *  new category is added without a colour. */
const CATEGORY_PILL: Record<StoryCardData["category"], string> = {
  Food: "bg-coral-100 text-coral-700",
  Travel: "bg-green-700/10 text-green-800",
  Lifestyle: "bg-ink-900/[0.07] text-ink-900",
};

const CARD_SIZES = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw";

export default function StoryCard({
  story,
  priority = false,
}: {
  story: StoryCardData;
  priority?: boolean;
}) {
  const t = useTranslations("news.card");
  return (
    <article className="group h-full">
      <Link
        href={`/news/${story.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-[20px] border border-line-cream bg-cream-50 transition-[transform,box-shadow] duration-300 ease-brand hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(20,20,30,0.35)] focus-visible:-translate-y-1 focus-visible:shadow-[0_18px_40px_-24px_rgba(20,20,30,0.35)]"
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={story.hero}
            alt={story.heroAlt}
            fill
            sizes={CARD_SIZES}
            placeholder="blur"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.04]"
          />
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em]",
              CATEGORY_PILL[story.category],
            )}
          >
            {story.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2 text-[12.5px] text-text-600">
            <time dateTime={story.publishedAt}>{formatStoryDate(story.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3.5 text-text-600/70" />
              {story.city}
            </span>
          </div>

          <h3 className="mt-2.5 text-balance font-display text-[19px] font-bold leading-[1.25] tracking-[-0.2px] text-text-900 transition-colors duration-200 group-hover:text-coral-700">
            {story.title}
          </h3>

          <p className="mt-2.5 line-clamp-3 text-[14.5px] leading-[1.6] text-text-600">
            {story.excerpt}
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-coral-700">
            {t("readStory")}
            <span aria-hidden="true" className="transition-transform duration-200 ease-brand group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
