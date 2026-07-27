"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

import { sendContact } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { contactSchema, RECAPTCHA_ACTION, type ContactField } from "./schema";

/**
 * Contact-form submission — the server action (DIRECTION-SECURITY §5), the same
 * recipe as the partnership enquiry (3.2).
 *
 * Order is deliberate: cheap silent rejects first (honeypot, timing), then
 * rate-limit, then validation, then human-check, then the expensive send. No
 * user input is reflected into any message returned to the client — every
 * message is a fixed string — so there is no reflected-XSS surface.
 */

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
};

/** A genuine person takes longer than this to fill the form; a bot doesn't. */
const MIN_FILL_MS = 2500;

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // User-facing message text is localized (next-intl resolves the locale from
  // the request the action was posted from). This changes only the strings
  // returned to the client — never the validation logic or FormState shape.
  const t = await getTranslations("contact.form.errors");

  // 1. Honeypot. Real users never see this field. If it's filled, act as if we
  //    accepted the submission (don't reveal the trap) but send nothing.
  const honey = (formData.get("company_website") as string | null)?.trim();
  if (honey) return { status: "success" };

  // 2. Timing trap. Submitted implausibly fast → a script, not a person.
  const started = Number(formData.get("form_ts"));
  if (Number.isFinite(started) && Date.now() - started < MIN_FILL_MS) {
    return { status: "success" }; // silent drop
  }

  // 3. Rate limit, per client IP (best-effort — see lib/rateLimit.ts).
  const h = await headers();
  const ip =
    (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(`contact:${ip}`, 5, 60_000)) {
    return {
      status: "error",
      message: t("rateLimit"),
    };
  }

  // 4. Validate on the server (authoritative).
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const errors: NonNullable<FormState["errors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField | undefined;
      // issue.message is a stable message key defined in schema.ts.
      if (key && !errors[key]) errors[key] = t(issue.message);
    }
    return {
      status: "error",
      errors,
      message: t("checkFields"),
    };
  }

  // 5. Human check — reCAPTCHA v3, score-based (skipped unless
  //    RECAPTCHA_SECRET_KEY is configured). The action name must match the one
  //    the client passed to `execute()`, or the token is treated as replayed.
  const human = await verifyRecaptcha(
    formData.get("g-recaptcha-response") as string | null,
    RECAPTCHA_ACTION,
    ip,
  );
  if (!human) {
    return {
      status: "error",
      message: t("recaptcha"),
    };
  }

  // 6. Send.
  const sent = await sendContact(parsed.data);
  if (!sent.ok) {
    return {
      status: "error",
      message: t("sendFailed"),
    };
  }

  return { status: "success" };
}
