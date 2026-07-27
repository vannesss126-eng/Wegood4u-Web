"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { PARTNERS } from "@/data/partners";

/**
 * The Trusted-Partners wall as a client island: the five-row CSS marquee (see
 * `.logo-marquee` in globals.css) plus a click-to-zoom lightbox.
 *
 * Each logo is a real `<button>` (keyboard reachable; focus pauses its row via
 * `:focus-within`). The marquee duplicates every row for its seamless loop, so
 * the clone copy is `aria-hidden` + `tabIndex -1` — 40 buttons in the a11y tree,
 * not 80. Clicking one opens the shared `Lightbox` at that partner (grey viewer
 * card, since logos are transparent); ← / → walk the full list.
 */

const ROW_COUNT = 5;
const PER_ROW = Math.ceil(PARTNERS.length / ROW_COUNT); // 8

const ROWS = Array.from({ length: ROW_COUNT }, (_, r) => ({
  start: r * PER_ROW,
  items: PARTNERS.slice(r * PER_ROW, r * PER_ROW + PER_ROW),
}));

const ROW_CFG = [
  { dur: "58s", reverse: false },
  { dur: "70s", reverse: true },
  { dur: "50s", reverse: false },
  { dur: "74s", reverse: true },
  { dur: "62s", reverse: false },
] as const;

export default function PartnerWall() {
  const t = useTranslations("partnership.partnerWall");
  const lb = useLightbox(PARTNERS.length);

  const items = PARTNERS.map((p) => ({
    src: `/partners/${p.slug}.webp`,
    alt: t("logoAlt", { name: p.name }),
    label: p.name,
  }));

  return (
    <>
      <div className="mt-12 flex flex-col gap-3 sm:gap-4 lg:mt-16">
        {ROWS.map((row, i) => (
          <div key={i} className="logo-marquee">
            <div
              className="logo-marquee__track"
              data-dir={ROW_CFG[i].reverse ? "reverse" : undefined}
              style={{ "--marquee-dur": ROW_CFG[i].dur } as React.CSSProperties}
            >
              {/* Two copies → seamless -50% loop; the clones are hidden from AT. */}
              {[...row.items, ...row.items].map((p, j) => {
                const clone = j >= row.items.length;
                const idx = row.start + (j % row.items.length);
                return (
                  <button
                    key={`${p.slug}-${j}`}
                    type="button"
                    onClick={(e) => lb.open(idx, e.currentTarget)}
                    aria-label={t("viewLogo", { name: p.name })}
                    aria-hidden={clone || undefined}
                    tabIndex={clone ? -1 : 0}
                    className="mr-8 flex h-[64px] w-[132px] shrink-0 cursor-pointer items-center justify-center rounded-input border-0 bg-transparent px-2 outline-none transition-transform duration-250 ease-brand hover:scale-[1.08] focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:mr-10 sm:h-[72px] sm:w-[152px]"
                  >
                    <Image
                      src={`/partners/${p.slug}.webp`}
                      alt=""
                      width={180}
                      height={100}
                      sizes="152px"
                      className="h-[40px] w-auto object-contain sm:h-[46px]"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {lb.isOpen ? (
        <Lightbox
          items={items}
          index={lb.active as number}
          onClose={lb.close}
          onStep={lb.step}
          card={{ bg: "rgb(163,163,163)" }}
        />
      ) : null}
    </>
  );
}
