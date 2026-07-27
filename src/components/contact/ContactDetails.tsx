import { getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";

import { SOCIAL_URLS } from "@/data/siteMeta";

/**
 * Contact details — the "red icon-chips" pattern from the WP contact page,
 * rebuilt in our tokens: direct email/phone, the two real offices (Malaysia HQ +
 * Thailand), and the social links. Server component; the phone/email are the same
 * pair the whole site uses. Content from wp-archive/contact-us.html.
 */

const PHONE_DISPLAY = "+60 13-668 3939";
const PHONE_HREF = "tel:+60136683939";

const OFFICES = [
  {
    key: "malaysia",
    org: "Say Sheji Group Sdn Bhd",
    lines: ["No 11, Jln 3/148A", "Tmn Sg Besi Industrial Park", "Kuala Lumpur, Malaysia"],
    email: "kaseyfong@saysheji.com",
  },
  {
    key: "thailand",
    org: "Fifth Avenue",
    lines: ["555/69 M. 2, T. Nong Chom", "A. Mueang, Chiang Mai 50000"],
    email: "enquiry@wegood4u.com",
  },
] as const;

const SOCIAL_LABELS = ["Facebook", "Instagram", "TikTok", "YouTube"] as const;

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-11 shrink-0 place-items-center rounded-full bg-coral-100 text-coral-700"
    >
      {children}
    </span>
  );
}

export default async function ContactDetails() {
  const t = await getTranslations("contact.details");
  return (
    <div className="space-y-8">
      {/* Direct contact */}
      <div className="space-y-4">
        <a
          href="mailto:enquiry@wegood4u.com"
          className="group flex items-center gap-4 outline-none"
        >
          <Chip>
            <Mail className="size-5" strokeWidth={1.75} />
          </Chip>
          <span>
            <span className="block text-[13px] font-semibold uppercase tracking-[0.06em] text-text-600">
              {t("emailLabel")}
            </span>
            <span className="text-[17px] font-semibold text-text-900 transition-colors duration-200 group-hover:text-coral-700 group-focus-visible:text-coral-700">
              enquiry@wegood4u.com
            </span>
          </span>
        </a>

        <a href={PHONE_HREF} className="group flex items-center gap-4 outline-none">
          <Chip>
            <Phone className="size-5" strokeWidth={1.75} />
          </Chip>
          <span>
            <span className="block text-[13px] font-semibold uppercase tracking-[0.06em] text-text-600">
              {t("callLabel")}
            </span>
            <span className="text-[17px] font-semibold text-text-900 transition-colors duration-200 group-hover:text-coral-700 group-focus-visible:text-coral-700">
              {PHONE_DISPLAY}
            </span>
          </span>
        </a>
      </div>

      {/* Offices */}
      <div className="grid gap-5 sm:grid-cols-2">
        {OFFICES.map((o) => (
          <div
            key={o.key}
            className="rounded-card border border-line-cream bg-white p-5 shadow-card"
          >
            <div className="flex items-center gap-3">
              <Chip>
                <MapPin className="size-5" strokeWidth={1.75} />
              </Chip>
              <div>
                <p className="font-display text-[18px] font-bold leading-tight text-text-900">
                  {t(o.key)}
                </p>
                <p className="text-[13px] font-medium text-text-600">{o.org}</p>
              </div>
            </div>
            <address className="mt-4 not-italic text-[14.5px] leading-[1.6] text-text-600">
              {o.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a
                href={`mailto:${o.email}`}
                className="mt-2 inline-block font-medium text-coral-700 underline underline-offset-2 transition-colors duration-200 hover:text-coral-600"
              >
                {o.email}
              </a>
            </address>
          </div>
        ))}
      </div>

      {/* Socials */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-text-600">
          {t("followLabel")}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2.5">
          {SOCIAL_URLS.map((url, i) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-full border border-line-cream bg-white px-4 text-[14px] font-semibold text-text-900 outline-none transition-colors duration-200 ease-brand hover:border-coral-500/40 hover:text-coral-700 focus-visible:ring-2 focus-visible:ring-coral-500"
              >
                {SOCIAL_LABELS[i]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
