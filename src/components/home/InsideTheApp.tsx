import Image from "next/image";
import { getTranslations } from "next-intl/server";

import PhoneFrame from "@/components/ui/PhoneFrame";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import appTasks from "@/assets/images/app-tasks.webp";

/**
 * Inside the app — the real Submit form, beside the fields it actually contains.
 *
 * This is the page's one "product truth" moment. Everything else describes the
 * app; this shows it, and the four rows are transcribed from the screenshot
 * rather than written for it. That is also why the section is ink: the
 * screenshot has to be the brightest thing on the page here, and depth on ink
 * comes from hairlines, never shadow (DESIGN §6).
 *
 * It settles the receipt-vs-photo question the FAQ and the old membership page
 * disagreed on: the app asks for BOTH a receipt and a selfie.
 *
 * Field labels are verbatim from the app UI (`public/r/app-tasks.jpg`). If the
 * Submit flow changes, reshoot the screenshot and re-read the labels off it —
 * do not paraphrase them here.
 */

const FIELDS = [
  { key: "date" },
  { key: "store" },
  { key: "receipt" },
  { key: "selfie" },
] as const;

export default async function InsideTheApp() {
  const t = await getTranslations("home.insideApp");
  return (
    // Motion (1.11): section fade-up 24px / 0.7s / power3.out, trigger 75%, once.
    <Section
      id="inside-the-app"
      tone="ink-950"
      labelledBy="inside-the-app-title"
      className="overflow-hidden"
      data-anim="section"
    >
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        {/* Screenshot leads on desktop — the claim is "look at the real thing". */}
        <div className="flex justify-center lg:col-span-5">
          <PhoneFrame data-anim="phone" className="w-[min(78%,300px)]">
            <Image
              src={appTasks}
              alt={t("phoneAlt")}
              placeholder="blur"
              sizes="(min-width: 1024px) 300px, 78vw"
              className="w-full"
            />
          </PhoneFrame>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHead
            tone="dark"
            eyebrow={t("eyebrow")}
            title={t("title")}
            titleId="inside-the-app-title"
            lede={t("lede")}
          />

          <ol className="mt-12">
            {FIELDS.map((field, i) => (
              <li
                key={field.key}
                data-anim="field-row"
                className="flex items-start gap-4 border-t border-line-ink py-5 last:border-b"
              >
                {/* Green numerals mirror the app's own numbered task cards. */}
                <span
                  aria-hidden="true"
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-green-700 font-mono text-[14px] font-semibold text-white"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-[17px] font-semibold leading-[1.4] text-ondark-100">
                    {t(`${field.key}Label`)}
                  </p>
                  <p className="mt-0.5 text-[15px] leading-[1.55] text-ondark-400">
                    {t(`${field.key}Note`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
