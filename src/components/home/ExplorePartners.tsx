import Image, { type StaticImageData } from "next/image";
import { MapPin, Play } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

import brandThai from "@/assets/images/home/brand-thaigood4u.png";
import brandMsia from "@/assets/images/home/brand-msiagood4u.png";
import videoTigerKingdom from "@/assets/images/home/video-tiger-kingdom.webp";
import videoKruAChan from "@/assets/images/home/video-kru-a-chan-sai-yut.webp";
import videoFoongLian from "@/assets/images/home/video-foong-lian-claypot.webp";
import videoBangsar from "@/assets/images/home/video-enjoy-in-bangsar.webp";
// video-white-rabbit.webp and video-penang-curry-mee.webp stay prepped on disk
// (scripts/prep-video-thumbs.mjs) in case a third tile per project comes back.

/**
 * Project Showcase — Phase 1.5, rebuilt again in R11 to actually match the
 * WordPress section instead of paraphrasing it.
 *
 * The point of the WP block is the VIDEO WALL: three big 16:9 thumbnails, the
 * client's own bold YouTube artwork, doing all the visual work beside a quiet
 * text column. The previous pass replaced that with a stack of small white
 * venue cards, which read as a blog sidebar and killed the section. Gone.
 *
 * Thumbnails are the real ones, served locally (scripts/prep-video-thumbs.mjs)
 * because the CSP allows img-src 'self' only. Tiles link to the real videos —
 * IDs lifted from wp-archive/home.html in embed order.
 */

interface VideoTile {
  id: string;
  title: string;
  image: StaticImageData;
}

interface Project {
  id: string;
  /** Screen-reader heading; the logo carries the name visually. */
  name: string;
  location: string;
  /** The sub-brand's own site — outbound, per REVAMP-PLAN Task D default. */
  href: string;
  domain: string;
  logo: StaticImageData;
  description: React.ReactNode;
  coverage: string[];
  videos: VideoTile[];
  /** Mirrors the layout so the two blocks don't read as a repeat. */
  flip?: boolean;
}

const PROJECTS: Project[] = [
  {
    id: "project-thaigood4u",
    name: "ThaiGood4U",
    location: "Chiang Mai, Thailand",
    href: "https://thaigood4u.com",
    domain: "thaigood4u.com",
    logo: brandThai,
    description: (
      <>
        Chiang Mai is known for its{" "}
        <strong className="font-semibold text-text-900">
          rich culture, amazing street food and breathtaking landscapes
        </strong>
        . Through <strong className="font-semibold text-text-900">ThaiGood4U</strong>,
        we connect members with top restaurants, cafés and must-visit destinations.
      </>
    ),
    coverage: [
      "Tiger Kingdom: encounter with majestic tigers",
      "Kiti Panit: a culinary Thailand journey",
      "Khrua Achan Saiyut: authentic Thai cuisine",
      "Nalanla Bar: Chiang Mai nightlife bliss",
    ],
    videos: [
      {
        id: "jRAi6G_gA7M",
        title: "Tiger Kingdom / Continental Bar",
        image: videoTigerKingdom,
      },
      {
        id: "HvfQO6uSKBw",
        title: "Chiang Mai: Kru A Chan Sai Yut",
        image: videoKruAChan,
      },
    ],
  },
  {
    id: "project-msiagood4u",
    name: "MSIAGood4U",
    location: "Kuala Lumpur, Malaysia",
    href: "https://msiagood4u.com",
    domain: "msiagood4u.com",
    logo: brandMsia,
    description: (
      <>
        Kuala Lumpur is a{" "}
        <strong className="font-semibold text-text-900">
          vibrant mix of modern city life and deep-rooted culinary traditions
        </strong>
        . With <strong className="font-semibold text-text-900">MSIAGood4U</strong>, we
        help businesses gain exposure while offering members exclusive experiences.
      </>
    ),
    coverage: [
      "Sunsan Bake Cafe: Kuala Lumpur desserts",
      "Foong Lian Claypot: Malaysian claypot cuisine",
      "Come True Cafe: flavourful cafe",
      "Zhang Lala Mee Tarik: noodle restoran",
    ],
    videos: [
      {
        id: "D8YZEd_q7Vs",
        title: "Over 30 years: Foong Lian Claypot",
        image: videoFoongLian,
      },
      { id: "LzGPgkS9LQA", title: "Enjoy in Bangsar", image: videoBangsar },
    ],
    flip: true,
  },
];

/** Big 16:9 tile — the thumbnail is the design; chrome stays out of its way. */
function VideoCard({ video }: { video: VideoTile }) {
  return (
    <li>
      {/* Motion (1.11): fade-up 24px, stagger 0.08s per block, once at 75%. */}
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        data-anim="video-card"
        className="group block rounded-media focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-coral-500"
      >
        <span className="sr-only">{`Watch on YouTube: ${video.title}`}</span>
        <div className="relative overflow-hidden rounded-media shadow-card transition-shadow duration-300 ease-brand group-hover:shadow-card-hover">
          <Image
            src={video.image}
            alt=""
            aria-hidden
            sizes="(min-width:1024px) 620px, 92vw"
            className="aspect-video w-full object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.03] motion-reduce:transform-none"
          />
          {/* Play badge — coral, the action colour. */}
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 grid place-items-center",
              "transition-transform duration-300 ease-brand group-hover:scale-105",
              "motion-reduce:transform-none",
            )}
          >
            <span className="grid size-12 place-items-center rounded-full bg-coral-500/90 shadow-overlay backdrop-blur-[2px] sm:size-14">
              <Play className="size-5 translate-x-[1.5px] fill-white text-white" strokeWidth={1.5} />
            </span>
          </span>
        </div>
      </a>
    </li>
  );
}

export default function ExplorePartners() {
  return (
    // Motion (1.11): section fade-up 24px / 0.7s / power3.out, trigger 75%, once.
    <Section
      id="explore"
      tone="cream-100"
      labelledBy="explore-title"
      data-anim="section"
    >
      <SectionHead
        layout="split"
        eyebrow="Our growing community"
        title="Project showcase"
        titleId="explore-title"
        lede="Two regional projects, one membership. This is what our creators have been filming across Chiang Mai and Kuala Lumpur."
        action={
          <Button variant="ghost" href="/our-partners">
            See all venues
          </Button>
        }
      />

      <div className="mt-14 space-y-20 lg:mt-20 lg:space-y-28">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12"
          >
            {/* ── Text column — deliberately quiet; the video wall is the volume ── */}
            <div
              className={cn(
                "lg:col-span-6",
                project.flip ? "lg:order-2 lg:col-start-7" : "lg:col-start-1",
              )}
            >
              {/* The logo IS the title — it already reads "THAIGOOD4U.COM", so a
                  matching text heading beside it was pure redundancy (R11). The
                  real heading is kept for screen readers and `aria-labelledby`. */}
              <h3 id={`${project.id}-title`} className="sr-only">
                {`${project.name} — ${project.location}`}
              </h3>

              {/* Sized against the WP reference, where the logo fills roughly
                  80% of the text column. Width-based, not height-based, so both
                  sub-brand lockups land at the same optical weight. */}
              <Image
                src={project.logo}
                alt={project.name}
                sizes="(min-width:1024px) 440px, 320px"
                className="h-auto w-full max-w-[320px] lg:max-w-[440px]"
              />

              <div className="mt-8">
                <Eyebrow>{project.location}</Eyebrow>
              </div>

              <p className="mt-5 max-w-[52ch] text-[18px] leading-[1.7] text-pretty text-text-600">
                {project.description}
              </p>

              {/* Coverage list — plain text, not links: these venues have no
                  pages until Phase 5, and dead links are worse than none. */}
              <ul className="mt-7 space-y-3.5">
                {project.coverage.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[17px] leading-[1.55] text-text-900"
                  >
                    <MapPin
                      aria-hidden
                      className="mt-0.5 size-[18px] shrink-0 text-coral-500"
                      strokeWidth={2}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-9">
                <Button variant="outline" href={project.href}>
                  Visit {project.domain}
                </Button>
              </div>
            </div>

            {/* ── The video wall ─────────────────────────────────────────── */}
            <ul
              aria-labelledby={`${project.id}-title`}
              className={cn(
                // 5 of 12 columns, matching the WP reference's proportion: all
                // three tiles must read in one viewport beside the text column.
                "flex flex-col gap-5 lg:col-span-5",
                project.flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8",
              )}
            >
              {project.videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
