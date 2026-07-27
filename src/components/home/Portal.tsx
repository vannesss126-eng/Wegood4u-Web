import Image, { type StaticImageData } from "next/image";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import portalScene from "@/assets/images/home/portal-scene.webp";

/**
 * Portal — the dark "aperture" set piece: one line of type and one circle,
 * nothing else. The aperture sits right and bleeds 6% past the container on
 * desktop, so it reads as a porthole larger than the page. Depth on ink comes
 * from hairlines and surface only — DESIGN §6 forbids shadow on Ink 950, §8
 * bans gradients-as-decoration, and this is exactly where those temptations
 * live.
 *
 * Parameterised (props all optional, defaults = the original homepage copy) so
 * the same composition serves `/membership` too. It is composed at the FINAL
 * state of the future 1.13 clip-path scrub on purpose — the mask already exists
 * as `circle(50%)`, so that later timeline only animates a property already
 * present rather than introducing one mid-flight.
 */
interface PortalProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subline?: string;
  cta?: { label: string; href: string };
  image?: StaticImageData;
  imageAlt?: string;
  /** Tailwind object-position utility, e.g. "object-[55%_60%]". */
  objectPosition?: string;
  chip?: string;
}

export default function Portal({
  id = "portal",
  eyebrow = "The Wegood4u world",
  title = "Step into the good life.",
  subline = "Chiang Mai to Kuala Lumpur, one membership, one dashboard, and a reward waiting on the tenth visit.",
  cta = { label: "Step inside", href: "/membership" },
  image = portalScene,
  imageAlt = "Creator being filmed over a full northern Thai spread in a warm-lit Chiang Mai shophouse dining room",
  objectPosition = "object-[55%_60%]",
  chip = "Chiang Mai · northern Thai table",
}: PortalProps = {}) {
  return (
    <Section
      id={id}
      tone="ink-950"
      labelledBy="portal-title"
      className="relative overflow-hidden"
      data-anim="section"
    >
      <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* Copy */}
        <div data-anim="reveal" className="lg:col-span-5">
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          <h2
            id="portal-title"
            className="mt-3 max-w-[16ch] text-balance font-display text-[36px] font-bold leading-[1.1] tracking-[-0.5px] text-ondark-100 sm:text-[44px] lg:text-[56px]"
          >
            {title}
          </h2>
          <p className="mt-5 max-w-[42ch] text-pretty text-[18px] leading-[1.65] text-ondark-400">
            {subline}
          </p>
          <div className="mt-8">
            <Button variant="outline-dark" href={cta.href}>
              {cta.label}
            </Button>
          </div>
        </div>

        {/* The aperture */}
        <div
          data-anim="reveal"
          className="lg:col-span-7 lg:translate-x-[6%] lg:justify-self-end"
        >
          <div className="relative mx-auto aspect-square w-[min(78vw,420px)] lg:w-[min(44vw,600px)]">
            {/* outer hairline, 12px outside the mask */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-3 rounded-full border border-line-ink"
            />
            {/* Motion (1.13): clip-path circle(8%) → circle(150%), pinned scrub. */}
            <div
              data-anim="portal-circle"
              className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-line-ink [clip-path:circle(50%)]"
            >
              {/* Motion (1.13): counter-scale 1.25 → 1 so the subject doesn't balloon. */}
              <Image
                src={image}
                alt={imageAlt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 600px, 78vw"
                className={cn("object-cover", objectPosition)}
                data-anim="portal-image"
              />
            </div>
            {/* index mark at 12 o'clock — turns the ring into an instrument */}
            <span
              aria-hidden
              className="absolute left-1/2 top-[-22px] h-4 w-px -translate-x-1/2 bg-coral-500"
            />
            <p className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-chip border border-line-ink bg-ink-900/80 px-3 py-1.5 text-[13px] font-medium text-ondark-400 backdrop-blur-[2px]">
              {chip}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
