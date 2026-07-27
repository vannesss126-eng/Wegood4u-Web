import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "Real content. Real restaurants. Real community." — the social-proof block
 * from the new-member page: the audience and engagement already behind
 * Wegood4u, across YouTube and TikTok. Two platform panels with their real
 * numbers and a link out (new tab, per the external-link rule).
 *
 * Brand glyphs are inlined for the same reason as the footer's — lucide 1.x
 * dropped brand marks and the build adds no packages.
 */

const YT_URL = "https://www.youtube.com/@Wegood4udotcom";
const TT_URL = "https://www.tiktok.com/@wegood4u";

const YT_STATS = [
  { value: "115K+", key: "ytSubscribers" },
  { value: "84", key: "ytVideos" },
  { value: "133K", key: "ytTopViews" },
  { value: "26K", key: "ytLikes" },
] as const;

const TT_STATS = [
  { value: "16.5K+", key: "ttLikes" },
  { value: "1,776", key: "ttSaves" },
  { value: "1,024", key: "ttShares" },
  { value: "7", key: "ttFeatures" },
] as const;

const PARTNER_VIDEOS = [
  "Baan Landai",
  "Moment's Notice",
  "Seoul Hight",
  "Kiti Panit",
] as const;

const YT_PATH =
  "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z";
const TT_PATH =
  "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z";

function Glyph({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={path} />
    </svg>
  );
}

export default async function MemberCommunity() {
  const t = await getTranslations("membership.community");
  return (
    <Section tone="cream-50" labelledBy="community-title">
      <SectionHead
        align="center"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="community-title"
        lede={t("lede")}
      />

      <div data-anim="reveal-group" className="content-gap grid gap-6 lg:grid-cols-2">
        {/* YouTube */}
        <article
          data-anim="reveal-item"
          className="flex flex-col rounded-media border border-line-cream bg-white p-7 shadow-card"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-[#ff0000]/10 text-[#c4302b]">
              <Glyph path={YT_PATH} className="size-6" />
            </span>
            <div>
              <h3 className="font-display text-[20px] font-bold text-text-900">
                YouTube
              </h3>
              <p className="text-[13.5px] text-text-600">@Wegood4udotcom</p>
            </div>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4">
            {YT_STATS.map((s) => (
              <div key={s.key} className="rounded-card bg-cream-50 px-4 py-3">
                <dd className="font-display text-[24px] font-bold text-text-900">
                  {s.value}
                </dd>
                <dt className="text-[13px] text-text-600">{t(s.key)}</dt>
              </div>
            ))}
          </dl>
          <a
            href={YT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-fit items-center gap-1.5 font-sans text-[15px] font-bold text-coral-600 transition-colors duration-250 ease-brand hover:text-coral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500"
          >
            {t("watchYt")}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </article>

        {/* TikTok */}
        <article
          data-anim="reveal-item"
          className="flex flex-col rounded-media border border-line-cream bg-white p-7 shadow-card"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-ink-950/8 text-ink-950">
              <Glyph path={TT_PATH} className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-[20px] font-bold text-text-900">
                TikTok
              </h3>
              <p className="text-[13.5px] text-text-600">@wegood4u</p>
            </div>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4">
            {TT_STATS.map((s) => (
              <div key={s.key} className="rounded-card bg-cream-50 px-4 py-3">
                <dd className="font-display text-[24px] font-bold text-text-900">
                  {s.value}
                </dd>
                <dt className="text-[13px] text-text-600">{t(s.key)}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-5">
            <p className="text-[13px] font-medium text-text-600">
              {t("featuredPartners")}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {PARTNER_VIDEOS.map((v) => (
                <li
                  key={v}
                  className="rounded-full bg-cream-100 px-3 py-1 text-[13px] font-semibold text-text-900"
                >
                  {v}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={TT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-fit items-center gap-1.5 font-sans text-[15px] font-bold text-coral-600 transition-colors duration-250 ease-brand hover:text-coral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500"
          >
            {t("followTt")}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </article>
      </div>
    </Section>
  );
}
