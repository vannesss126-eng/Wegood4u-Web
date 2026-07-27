import { getTranslations } from "next-intl/server";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "Meet the team" — the WP About "Meet With Professional Team" block. Two named
 * people, their real roles. No stock photos: since no team portraits are in the
 * asset set, each card uses a branded initials avatar rather than an invented
 * face. Swap in real photos here when they exist.
 */

/** name + initials are proper nouns (stay literal); roleKey resolves under `about.team`. */
const TEAM = [
  { name: "Kasey Fong", roleKey: "ceo", initials: "KF" },
  { name: "Jonnathan Edbert Halim", roleKey: "techLead", initials: "JH" },
] as const;

export default async function Team() {
  const t = await getTranslations("about.team");
  return (
    <Section tone="cream-50" labelledBy="team-title">
      <SectionHead
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="team-title"
        lede={t("lede")}
      />

      <ul className="content-gap grid max-w-[760px] gap-6 sm:grid-cols-2">
        {TEAM.map((m) => (
          <li key={m.name}>
            <Card as="div" className="flex items-center gap-5 p-6">
              <span
                aria-hidden="true"
                className="grid size-16 shrink-0 place-items-center rounded-full bg-coral-100 font-display text-[22px] font-bold text-coral-700"
              >
                {m.initials}
              </span>
              <div>
                <h3 className="font-display text-[20px] font-semibold leading-[1.2] text-text-900">
                  {m.name}
                </h3>
                <p className="mt-1 text-[15px] font-medium text-coral-700">
                  {t(m.roleKey)}
                </p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
