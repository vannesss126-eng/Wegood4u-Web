"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Lightbox, useLightbox } from "@/components/ui/Lightbox";

/**
 * The "Our Work in Action" photo grid as a client island: twelve behind-the-
 * scenes shots, each a button that opens the shared `Lightbox`. Photos are their
 * own subject, so the viewer has **no background card** (`card` omitted) — just
 * the image on the backdrop. The `data-anim` hooks stay so MotionDirector's
 * grid-stagger reveal still runs.
 */

const PHOTOS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function WorkGallery() {
  const t = useTranslations("partnership.workGallery");
  const lb = useLightbox(PHOTOS.length);
  const alt = t("alt");
  const items = PHOTOS.map((n) => ({ src: `/work/work-${n}.webp`, alt }));

  return (
    <>
      <ul
        data-anim="work-group"
        className="content-gap grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
      >
        {PHOTOS.map((n, i) => (
          <li key={n} data-anim="work-tile">
            <button
              type="button"
              onClick={(e) => lb.open(i, e.currentTarget)}
              aria-label={t("viewPhoto", { index: i + 1, total: PHOTOS.length })}
              className="block w-full cursor-pointer overflow-hidden rounded-[16px] outline-none transition-transform duration-250 ease-brand hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              <Image
                src={`/work/work-${n}.webp`}
                alt={alt}
                width={900}
                height={675}
                sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {lb.isOpen ? (
        <Lightbox
          items={items}
          index={lb.active as number}
          onClose={lb.close}
          onStep={lb.step}
        />
      ) : null}
    </>
  );
}
