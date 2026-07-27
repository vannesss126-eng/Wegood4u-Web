"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Lightbox, useLightbox } from "@/components/ui/Lightbox";

/**
 * A partner store's menu pages: thumbnails that open the shared Lightbox (no card
 * — the menu image is the subject) so they can be read full-size. Images are the
 * store's `menu_images` from Supabase Storage.
 */
export default function MenuGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const t = useTranslations("ourPartners.menuGallery");
  const lb = useLightbox(images.length);
  const items = images.map((src, i) => ({
    src,
    alt: t("imageAlt", { name, page: i + 1 }),
  }));

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={(e) => lb.open(i, e.currentTarget)}
              aria-label={t("viewLabel", { name, page: i + 1 })}
              className="block w-full overflow-hidden rounded-[14px] border border-line-cream bg-white outline-none transition-transform duration-300 ease-brand hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              <Image
                src={src}
                alt={items[i].alt}
                width={600}
                height={800}
                quality={85}
                sizes="(min-width:1024px) 22vw, (min-width:640px) 30vw, 46vw"
                className="aspect-[3/4] w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox loads the menu at full original resolution so it's readable. */}
      {lb.isOpen ? (
        <Lightbox
          items={items}
          index={lb.active as number}
          onClose={lb.close}
          onStep={lb.step}
          unoptimized
        />
      ) : null}
    </>
  );
}
