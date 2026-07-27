import Image, { type StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { Play } from "lucide-react";

export type Highlight = {
  name: string;
  description: string;
  href: string;
  /** External → new tab (a YouTube video or project-site article). */
  external?: boolean;
  /** Show a play badge (the highlight is a video). */
  video?: boolean;
  image: string | StaticImageData;
};

/**
 * A "Project Highlight" card. Store highlights link internally to their
 * /our-partners/[id] detail page (real Supabase image); video highlights link out
 * to YouTube with a play badge.
 */
export default function HighlightCard({ h }: { h: Highlight }) {
  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-media bg-cream-100 shadow-card">
        <Image
          src={h.image}
          alt={h.name}
          fill
          sizes="(min-width:1024px) 30vw, 92vw"
          className="object-cover transition-transform duration-500 ease-brand group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {h.video ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center transition-transform duration-300 ease-brand group-hover:scale-105 motion-reduce:transition-none"
          >
            <span className="grid size-14 place-items-center rounded-full bg-coral-500/90 shadow-overlay backdrop-blur-[2px]">
              <Play className="size-5 translate-x-[1.5px] fill-white text-white" strokeWidth={1.5} />
            </span>
          </span>
        ) : null}
      </div>
      <h4 className="mt-4 font-display text-[19px] font-semibold leading-[1.25] text-text-900">
        {h.name}
      </h4>
      <p className="mt-2 text-[15px] leading-[1.6] text-pretty text-text-600">
        {h.description}
      </p>
    </>
  );

  const className =
    "group block rounded-media outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-100";

  return h.external ? (
    <a href={h.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={h.href} className={className}>
      {inner}
    </Link>
  );
}
