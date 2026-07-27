import Image, { type StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import HighlightCard, { type Highlight } from "@/components/projects/HighlightCard";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import IconChip from "@/components/ui/IconChip";
import Section, { type SectionTone } from "@/components/ui/Section";

export type Project = {
  id: string;
  name: string;
  location: string;
  flag: string;
  href: string;
  domain: string;
  logo: StaticImageData;
  description: string;
  whatWeDo: { icon: LucideIcon; title: string; body: string }[];
  highlights: Highlight[];
};

/**
 * One regional project (ThaiGood4U / MSIAGood4U) on /projects: brand lockup +
 * location + description on the left, the "What we do" three-point list on the
 * right, then a "Project highlights" card grid. Content follows the WP
 * /our-projects/ page. Highlights link to partner detail pages or YouTube.
 */
export default async function ProjectSection({
  project,
  tone,
}: {
  project: Project;
  tone: SectionTone;
}) {
  const t = await getTranslations("projects.section");
  return (
    <Section tone={tone} labelledBy={`${project.id}-title`}>
      <h2 id={`${project.id}-title`} className="sr-only">
        {project.name} — {project.location}
      </h2>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Brand + intro */}
        <div data-anim="reveal" className="lg:col-span-6">
          <Image
            src={project.logo}
            alt={project.name}
            sizes="(min-width:1024px) 380px, 280px"
            className="h-auto w-full max-w-[260px] lg:max-w-[360px]"
          />
          <div className="mt-6">
            <Eyebrow>
              {project.flag} {project.location}
            </Eyebrow>
          </div>
          <p className="mt-4 max-w-[52ch] text-pretty text-[18px] leading-[1.7] text-text-600">
            {project.description}
          </p>
          <div className="mt-8">
            <Button variant="outline" href={project.href}>
              {t("visit", { domain: project.domain })}
            </Button>
          </div>
        </div>

        {/* What we do */}
        <div data-anim="reveal" className="lg:col-span-6">
          <Eyebrow>{t("whatWeDo")}</Eyebrow>
          <ul className="mt-6 space-y-6">
            {project.whatWeDo.map((w) => (
              <li key={w.title} className="flex gap-4">
                <IconChip icon={w.icon} tone="coral" size={48} />
                <div>
                  <h3 className="font-display text-[18px] font-semibold leading-[1.3] text-text-900">
                    {w.title}
                  </h3>
                  <p className="mt-1 text-[16px] leading-[1.6] text-text-600 text-pretty">
                    {w.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Project highlights */}
      <div className="content-gap">
        <Eyebrow>{t("highlights")}</Eyebrow>
        <ul
          data-anim="reveal-group"
          className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {project.highlights.map((h) => (
            <li key={h.name} data-anim="reveal-item">
              <HighlightCard h={h} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
