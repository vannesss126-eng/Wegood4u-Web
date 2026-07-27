import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";
import { Play } from "lucide-react";

import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import videoTigerKingdom from "@/assets/images/home/video-tiger-kingdom.webp";
import videoKruAChan from "@/assets/images/home/video-kru-a-chan-sai-yut.webp";
import videoFoongLian from "@/assets/images/home/video-foong-lian-claypot.webp";
import videoBangsar from "@/assets/images/home/video-enjoy-in-bangsar.webp";

/**
 * "Featured in Our Video" — the WP About video wall. The four real episodes we
 * have YouTube IDs + local thumbnails for (shared with ExplorePartners); each
 * tile links out to the video. Thumbnails are served locally — the CSP is
 * `img-src 'self'`, so never hotlink `i.ytimg.com`. No iframe embed (that would
 * need `frame-src youtube`); a plain outbound link keeps the CSP tight.
 *
 * Runs on ink-950 so the thumbnails pop and the page gets a dark beat.
 */

type Video = { id: string; title: string; image: StaticImageData };

const VIDEOS: Video[] = [
  { id: "jRAi6G_gA7M", title: "Tiger Kingdom & Continental Bar", image: videoTigerKingdom },
  { id: "HvfQO6uSKBw", title: "Chiang Mai — Kru A Chan Sai Yut", image: videoKruAChan },
  { id: "D8YZEd_q7Vs", title: "Foong Lian Claypot — 30 years on", image: videoFoongLian },
  { id: "LzGPgkS9LQA", title: "Enjoy in Bangsar", image: videoBangsar },
];

export default async function FeaturedVideos() {
  const t = await getTranslations("about.videos");
  return (
    <Section tone="ink-950" width="wide" labelledBy="videos-title">
      <div className="mx-auto max-w-[62ch] text-center">
        <Eyebrow tone="dark" className="text-ondark-100">
          {t("eyebrow")}
        </Eyebrow>
        <h2
          id="videos-title"
          className="mt-3 font-display text-[28px] font-semibold leading-[1.2] text-balance text-ondark-100 sm:text-[32px] lg:text-[36px]"
        >
          {t("title")}
        </h2>
      </div>

      <ul className="content-gap grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VIDEOS.map((v) => (
          <li key={v.id}>
            <a
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-[16px] outline-none ring-line-ink focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={v.image}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 92vw"
                  className="h-full w-full object-cover transition-transform duration-300 ease-brand group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center bg-ink-950/25 transition-colors duration-300 group-hover:bg-ink-950/10"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-white/90 text-ink-950 shadow-card transition-transform duration-300 ease-brand group-hover:scale-110">
                    <Play className="size-5 translate-x-0.5 fill-current" strokeWidth={0} />
                  </span>
                </span>
              </div>
              <p className="mt-3 text-[15px] font-medium leading-[1.4] text-ondark-100">
                {v.title}
              </p>
            </a>
          </li>
        ))}
      </ul>

      <div className="content-gap flex justify-center">
        <Button variant="outline-dark" href="https://www.youtube.com/@Wegood4udotcom">
          {t("watchMore")}
        </Button>
      </div>
    </Section>
  );
}
