import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

import ugc1 from "@/assets/images/home/ugc-1.webp";
import ugc2 from "@/assets/images/home/ugc-2.webp";
import ugc3 from "@/assets/images/home/ugc-3.webp";
import ugc4 from "@/assets/images/home/ugc-4.webp";
import ugc5 from "@/assets/images/home/ugc-5.webp";
import ugc6 from "@/assets/images/home/ugc-6.webp";
import ugc7 from "@/assets/images/home/ugc-7.webp";
import ugc8 from "@/assets/images/home/ugc-8.webp";
import ugc9 from "@/assets/images/home/ugc-9.webp";

/**
 * UgcWall — homepage §1.8a.
 *
 * "One hero print, eight satellites." All nine assets are square, so masonry has
 * nothing to stagger. Instead: a 12-cell mosaic in a 4-column grid where the first
 * tile spans 2×2. Nine photographs fill twelve cells exactly at every breakpoint —
 * 4×3 desktop, 3×4 tablet, 2×6 mobile. No filler tiles, no mask fade, no gaps.
 *
 * Tiles are <figure>s, not controls: no hover, no lift. A photograph that reacts to
 * the pointer but does nothing on click is a lie about affordance.
 */

const HERO_SIZES = "(min-width:1024px) 50vw, (min-width:768px) 66vw, 100vw";
const TILE_SIZES = "(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw";

type Tile = {
  src: StaticImageData;
  /** Verbatim from content/image-manifest.md — never paraphrase. */
  alt: string;
  /** Only set where the manifest lists an off-centre subject. */
  objectPosition?: string;
};

/**
 * Fixed order — it is the mosaic's reading order. Food / people / place alternate
 * so no two neighbours in the first row are the same kind of frame, and the two
 * frames carrying visible face masks sit late and small (manifest flag 7).
 */
const TILES: Tile[] = [
  {
    src: ugc1,
    alt: "Creator filming a plated main at a busy Chiang Mai brunch café",
  },
  {
    src: ugc4,
    alt: "Close-up of dressed butter-lettuce salad topped with crisp minced pork",
  },
  {
    src: ugc3,
    alt: "Bartender straining a cocktail behind a blue-lit speakeasy bar",
  },
  {
    src: ugc2,
    alt: "Top-down bamboo tea tray with a pink chrysanthemum wagashi and matcha",
  },
  {
    src: ugc9,
    alt: "Guests seated in the capsule-pod booths of a futuristic Chiang Mai café",
  },
  {
    src: ugc7,
    alt: "Two hosts presenting at night outside a lit Mee Tarik noodle shop",
    objectPosition: "object-[50%_40%]",
  },
  {
    src: ugc5,
    alt: "Crew filming two guests at the counter of an open-fronted wooden garden café",
  },
  {
    src: ugc6,
    alt: "Three baristas behind a bakery pastry case with the partner card on the counter",
  },
  {
    src: ugc8,
    alt: "Crew setting up cameras around a boat table of Thai dishes in a thatched courtyard",
  },
];

export default function UgcWall() {
  const t = useTranslations("news.ugc");
  return (
    // Motion (1.11): tiles fade-up with stagger { amount: 0.6, from: "random" } —
    // hook is data-anim="ugc-tile" on each <li>. Nothing animates in this pass.
    <Section
      id="stories"
      tone="cream-50"
      width="wide"
      labelledBy="ugc-title"
      data-anim="section"
    >
      {/* The wall is the only section that breaks to the 1320 container. Its head
          stays on the 1200 rhythm (1152px content box) so the eyebrow and H2 line
          up with every other section's left edge; only the photographs go wider. */}
      <div className="mx-auto w-full max-w-[1152px]">
        <SectionHead
          layout="split"
          eyebrow={t("eyebrow")}
          title={t("title")}
          titleId="ugc-title"
          lede={t("lede")}
          action={
            <Button
              variant="ghost"
              href="https://www.instagram.com/wegoodforu/"
              external
            >
              {t("action")}
            </Button>
          }
        />
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:mt-16 lg:grid-cols-4 [&>li:first-child]:col-span-2 [&>li:first-child]:row-span-2">
        {TILES.map((tile, index) => {
          const isHero = index === 0;

          return (
            <li key={tile.src.src} data-anim="ugc-tile">
              <figure className="relative h-full overflow-hidden rounded-[16px]">
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  placeholder="blur"
                  sizes={isHero ? HERO_SIZES : TILE_SIZES}
                  className={`aspect-square h-full w-full object-cover ${
                    tile.objectPosition ?? ""
                  }`}
                />
                {isHero ? (
                  <figcaption className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-chip bg-ink-950/70 px-2.5 py-1.5 text-[13px] font-medium text-ondark-100 backdrop-blur-[2px]">
                    {t("heroCaption")}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
