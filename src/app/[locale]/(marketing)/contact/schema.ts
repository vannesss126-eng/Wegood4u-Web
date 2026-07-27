import { z } from "zod";

/**
 * The contact-form schema — the SERVER's authoritative validation
 * (DIRECTION-SECURITY §5), mirroring the partnership recipe. Single-line fields
 * are newline-stripped in the email layer (`lib/email.ts`), so no validated
 * value can carry a line break into a header regardless of what passes here.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "nameRequired")
    .max(120, "nameTooLong"),
  email: z
    .string()
    .trim()
    .min(1, "emailRequired")
    .email("emailInvalid")
    .max(200, "emailTooLong"),
  subject: z
    .string()
    .trim()
    .max(150, "subjectTooLong")
    .optional(),
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
export const RECAPTCHA_ACTION = "contact";

export type Contact = z.infer<typeof contactSchema>;

/** Field keys, for typing the per-field error map. */
export type ContactField = keyof Contact;
