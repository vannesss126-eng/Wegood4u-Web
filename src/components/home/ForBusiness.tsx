import Image from "next/image";
import { Handshake, Store, TrendingUp, Video } from "lucide-react";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import forBusinessPhoto from "@/assets/images/home/for-business.webp";

/**
 * WP `/partnership/` "Our Process" — copy verbatim from wp-archive (REVAMP-PLAN R1).
 * "will gets" is the client's original wording, kept pending a copy ruling.
 */
const STEPS = [
  {
    icon: Handshake,
    title: "Become Partner",
    body: "Sign up and list your business on Wegood4u, sharing what makes your venue unique.",
  },
  {
    icon: Video,
    title: "Feature In Our Video",
    body: "Our creators visit your location and showcase your brand through engaging video content, reviews, and blogs.",
  },
  {
    icon: TrendingUp,
    title: "Enjoy Our Campaign Benefit",
    body: "Your business will gets featured on multiple platforms, driving traffic, and customer interest.",
  },
  {
    icon: Store,
    title: "Grow Your Business",
    body: "Watch your brand reach new audiences and attract more customers.",
  },
];

/**
 * ForBusiness — Phase 1.7, static pass.
 *
 * "The door left ajar." The quietest section on the page, achieved by subtraction:
 * no cards, no shadow, no chips, no stats. Eyebrow, heading, two sentences, one
 * coral pill, one ghost link, one photograph — and nothing else.
 *
 * The composition is an asymmetric 5 / 6 split with column 6 left as air; that empty
 * column IS the design (a 6/6 split reads as a generic feature block). The one move:
 * the photo hangs 40px below the copy's baseline (lg:translate-y-10) so it slides
 * toward the next section like a door standing ajar. `translate` never touches
 * layout, so there is no reflow and no CLS.
 *
 * CTA is coral, not green — DESIGN §2: coral is the action colour in every context,
 * including business ones. The roles never swap.
 */
export default function ForBusiness() {
  return (
    // Motion (1.11): section fade-up 24px / 0.7s / power3.out, trigger 75%, once.
    <Section
      id="for-business"
      tone="cream-100"
      labelledBy="for-business-title"
      data-anim="section"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Eyebrow>For businesses</Eyebrow>

          <h2
            id="for-business-title"
            className="mt-3 font-display text-[28px] font-semibold leading-[1.2] text-balance text-text-900 sm:text-[32px] lg:text-[36px]"
          >
            Get found by people who actually turn up
          </h2>

          <p className="mt-4 max-w-[52ch] text-[18px] leading-[1.65] text-pretty text-text-600">
            Tap into a network of members who visit your venue, eat your food and
            write about it — real user-generated content, not scripted ads.
          </p>
          <p className="mt-4 max-w-[52ch] text-[18px] leading-[1.65] text-pretty text-text-600">
            You get organic promotion, genuine customer engagement and
            international exposure, without the cost of traditional advertising.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button variant="primary" href="/partnership">
              Partner with us
            </Button>
          </div>
        </div>

        {/* Motion (1.14, optional): image reveal clipPath
            inset(0 100% 0 0 round 28px) → inset(0 0 0 0 round 28px),
            0.8s power3.out, on enter only. No hover, no zoom — ever. */}
        <figure
          className="overflow-hidden rounded-media lg:col-span-6 lg:col-start-7 lg:translate-y-10"
          data-anim="business-image"
        >
          <Image
            src={forBusinessPhoto}
            alt="Three café staff behind their counter holding the Wegood4u partner card, QR standee beside the till"
            placeholder="blur"
            sizes="(min-width:1024px) 50vw, 92vw"
            className="aspect-[3/2] w-full object-cover object-[50%_40%]"
          />
        </figure>
      </div>

      {/* ───────────────── Our process — WP /partnership/ parity (R1) ─────────────
          This block deliberately breaks 1.7's original "calm band" brief: it is now
          the page's loudest colour moment. Cards are Coral 600, not Coral 500 —
          white body copy on Coral 500 is 3.66:1 and fails AA; Coral 600 is 4.56:1. */}
      <div className="mt-24 lg:mt-32">
        {/* Centred, per the WP /partnership/ reference (R7). This is the one
            centred block on the page — it earns it by being a symmetrical
            four-beat sequence rather than an asymmetric editorial split. */}
        <div className="mx-auto max-w-[62ch] text-center">
          <Eyebrow>Our process</Eyebrow>
          <h3
            id="partnership-process-title"
            className="mt-3 font-display text-[26px] font-semibold leading-[1.2] text-balance text-text-900 sm:text-[30px] lg:text-[34px]"
          >
            How our partnership works
          </h3>
          <p className="mt-4 text-[18px] leading-[1.65] text-pretty text-text-600">
            At Wegood4u, we connect F&amp;B and tourism businesses with passionate
            content creators and explorers who will promote your brand.
          </p>
        </div>

        {/* Motion (1.11): stagger the steps up 24px, 0.08s apart, on enter. */}
        <ol
          aria-labelledby="partnership-process-title"
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
          data-anim="process-steps"
        >
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="flex flex-col">
              {/* Numbered disc + the dashed connector that threads them together.
                  The rule is drawn behind the disc and overhangs half the 24px grid
                  gap on each side, so neighbouring cells meet edge to edge. */}
              <div className="relative flex justify-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1/2 hidden border-t-2 border-dashed border-coral-500/35 lg:block",
                    i === 0
                      ? "left-1/2 right-[-0.75rem]"
                      : i === STEPS.length - 1
                        ? "left-[-0.75rem] right-1/2"
                        : "inset-x-[-0.75rem]",
                  )}
                />
                <span
                  aria-hidden="true"
                  className="relative grid size-14 place-items-center rounded-full bg-coral-500 font-display text-[22px] font-bold leading-none text-white"
                >
                  {i + 1}.
                </span>
              </div>

              <div className="mt-6 flex h-full flex-col items-center rounded-card bg-coral-600 px-6 py-8 text-center text-white">
                <Icon
                  aria-hidden="true"
                  className="size-9 shrink-0"
                  strokeWidth={1.75}
                />
                <h4 className="mt-5 font-display text-[20px] font-semibold leading-[1.3]">
                  <span className="sr-only">{`Step ${i + 1}: `}</span>
                  {title}
                </h4>
                <p className="mt-2.5 text-pretty text-[15px] leading-[1.6] text-white">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
