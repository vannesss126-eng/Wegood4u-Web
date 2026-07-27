import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";

import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { cn } from "@/lib/utils";

/**
 * "See how we present your business" — the video-production showcase from the F&B
 * partnership landing page, replacing the old behind-the-scenes photo grid in the
 * "Our work in action" slot. Reach stats + the real YouTube features.
 *
 * Videos are link-out facades (thumbnail + play → YouTube in a new tab): the
 * thumbnail is optimised by next/image from i.ytimg.com (already an allowed
 * remotePattern), so no iframe or third-party script loads here.
 */

const CHANNEL_URL = "https://www.youtube.com/@Wegood4udotcom";

const STATS = [
  { value: "115K+", key: "statSubscribers" },
  { value: "84+", key: "statVideos" },
  { value: "133K", key: "statViews" },
  { value: "16.5K+", key: "statLikes" },
] as const;

const FEATURED = { id: "bnp_Hld6_7Q", key: "featured" };

const CLIPS = [
  { id: "jRAi6G_gA7M", key: "tiger" },
  { id: "D8YZEd_q7Vs", key: "claypot" },
];

async function VideoCard({
  id,
  title,
  meta,
  large = false,
}: {
  id: string;
  title: string;
  meta: string;
  large?: boolean;
}) {
  const t = await getTranslations("partnership.videos");
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return (
    <figure>
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("watchAria", { title })}
        className="group relative block overflow-hidden rounded-[18px] bg-ink-950 outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
      >
        <div className="relative aspect-video">
          <Image
            src={thumb}
            alt={t("thumbAlt", { title })}
            fill
            sizes={large ? "(min-width:1024px) 760px, 100vw" : "(min-width:1024px) 380px, 100vw"}
            className="object-cover opacity-90 transition-[transform,opacity] duration-500 ease-brand group-hover:scale-[1.03] group-hover:opacity-100"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-coral-600 text-white shadow-[0_10px_30px_-8px_rgba(192,52,47,0.7)] transition-transform duration-300 ease-brand group-hover:scale-110",
              large ? "size-16 sm:size-[72px]" : "size-12",
            )}
          >
            <Play className={cn("ml-0.5 fill-current", large ? "size-7" : "size-5")} strokeWidth={0} />
          </span>
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-ink-950/70 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-ondark-100 backdrop-blur-sm">
            YouTube
            <ArrowUpRight aria-hidden="true" className="size-3" />
          </span>
        </div>
      </a>
      <figcaption className="mt-3">
        <p className={cn("font-display font-bold text-text-900", large ? "text-[19px]" : "text-[16px]")}>
          {title}
        </p>
        <p className="mt-1 text-[13.5px] leading-[1.5] text-text-600">{meta}</p>
      </figcaption>
    </figure>
  );
}

export default async function PartnershipVideos() {
  const t = await getTranslations("partnership.videos");
  return (
    <Section tone="cream-50" labelledBy="videos-title" data-anim="section">
      <SectionHead
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="videos-title"
        lede={t.rich("lede", {
          strong: (chunks) => (
            <strong className="font-semibold text-text-900">{chunks}</strong>
          ),
        })}
      />

      {/* Reach stats */}
      <dl
        data-anim="reveal-group"
        className="content-gap grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {STATS.map(({ value, key }) => (
          <div
            key={key}
            data-anim="reveal-item"
            className="rounded-card border border-line-cream bg-white p-5 text-center shadow-card"
          >
            <dt className="sr-only">{t(key)}</dt>
            <dd>
              <span className="block font-display text-[30px] font-bold leading-none text-coral-700 sm:text-[34px]">
                {value}
              </span>
              <span className="mt-2 block text-[13px] font-medium text-text-600">{t(key)}</span>
            </dd>
          </div>
        ))}
      </dl>

      {/* Featured + supporting clips */}
      <div data-anim="reveal" className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
        <VideoCard
          id={FEATURED.id}
          title={t(`${FEATURED.key}Title`)}
          meta={t(`${FEATURED.key}Meta`)}
          large
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {CLIPS.map((c) => (
            <VideoCard
              key={c.id}
              id={c.id}
              title={t(`${c.key}Title`)}
              meta={t(`${c.key}Meta`)}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="text-[15px] text-text-600">{t("reachNote")}</p>
        <Button href={CHANNEL_URL} variant="secondary">
          <Play aria-hidden="true" className="size-4 fill-current" strokeWidth={0} />
          {t("watchCta")}
        </Button>
      </div>
    </Section>
  );
}
