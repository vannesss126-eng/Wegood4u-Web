import { z } from "zod";

/**
 * The partnership enquiry schema — the SERVER's authoritative validation
 * (DIRECTION-SECURITY §5). The client may mirror it for UX, but this is the
 * boundary that actually holds. Newline stripping for single-line fields is
 * done in the email layer (`lib/email.ts`), so header values can never carry a
 * line break regardless of what validated here.
 *
 * Messages are i18n KEYS (not sentences): the server action resolves them with
 * `getTranslations("partnership.form.errors")` so validation errors are shown in
 * the visitor's locale. Every constraint carries a key so `t(issue.message)`
 * never receives a raw zod default.
 */
export const enquirySchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, "businessNameRequired")
    .max(120, "tooLong"),
  contactName: z
    .string()
    .trim()
    .min(1, "contactNameRequired")
    .max(120, "tooLong"),
  email: z
    .string()
    .trim()
    .min(1, "emailRequired")
    .email("emailInvalid")
    .max(200, "emailTooLong"),
  phone: z.string().trim().max(40, "phoneInvalid").optional(),
  location: z.string().trim().max(120, "locationTooLong").optional(),
  message: z
    .string()
    .trim()
    .min(10, "messageTooShort")
    .max(2000, "messageTooLong"),
});

/**
 * reCAPTCHA v3 action name. Lives here (not in `actions.ts`, whose "use server"
 * directive forbids non-async exports) so the client island and the server
 * action import the SAME string — they must match or the token is rejected.
 */
export const RECAPTCHA_ACTION = "partnership";

export type Enquiry = z.infer<typeof enquirySchema>;

/** Field keys, for typing the per-field error map. */
export type EnquiryField = keyof Enquiry;
