import { Resend } from "resend";

import type { Enquiry } from "@/app/[locale]/(marketing)/partnership/schema";
import type { Contact } from "@/app/[locale]/(marketing)/contact/schema";

/**
 * Partnership-enquiry email transport (Resend).
 *
 * GATED on `RESEND_API_KEY`. If it's unset (dev / an unconfigured preview), the
 * enquiry is LOGGED and `{ ok: false }` is returned — the form then shows its
 * mailto fallback rather than a false "sent". It never silently swallows a real
 * enquiry.
 *
 * SECURITY:
 *  · Sent as PLAIN TEXT — no user input is interpolated into HTML, so there is
 *    no markup-injection surface in the delivered mail.
 *  · Single-line fields are newline-stripped here, so nothing user-controlled
 *    can inject a line break into the subject or reply-to. (Resend's HTTP API
 *    is JSON, not raw SMTP, so header injection isn't reachable anyway — this is
 *    belt-and-braces.)
 *  · reply-to is the submitter's (validated) email, so a reply reaches them
 *    without exposing the enquiry inbox address in the body.
 */

const TO = "enquiry@wegood4u.com";

// A verified sender on the Resend account's domain. Until wegood4u.com is
// verified in Resend, delivery is limited to the account owner — set
// PARTNERSHIP_FROM to a verified address once the domain is set up.
const FROM = process.env.PARTNERSHIP_FROM ?? "Wegood4u <onboarding@resend.dev>";

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function sendEnquiry(e: Enquiry): Promise<{ ok: boolean }> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.warn(
      "[partnership] RESEND_API_KEY unset — enquiry NOT sent. Payload logged so it isn't lost:",
      {
        businessName: oneLine(e.businessName),
        contactName: oneLine(e.contactName),
        email: e.email,
        phone: e.phone,
        location: e.location,
        message: e.message.slice(0, 300),
      },
    );
    return { ok: false };
  }

  const text = [
    `Business: ${oneLine(e.businessName)}`,
    `Contact:  ${oneLine(e.contactName)}`,
    `Email:    ${e.email}`,
    e.phone ? `Phone:    ${oneLine(e.phone)}` : null,
    e.location ? `Location: ${oneLine(e.location)}` : null,
    "",
    "Message:",
    e.message,
  ]
    .filter((l): l is string => l !== null)
    .join("\n");

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: e.email,
      subject: `Partnership enquiry — ${oneLine(e.businessName).slice(0, 100)}`,
      text,
    });
    if (error) {
      console.error("[partnership] Resend returned an error:", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[partnership] send threw:", err);
    return { ok: false };
  }
}

/**
 * Contact-form email transport. Same security posture as `sendEnquiry`: plain
 * text (no HTML interpolation), single-line fields newline-stripped, reply-to
 * set to the submitter, gated on RESEND_API_KEY (logs + returns { ok: false }
 * so the form shows its mailto fallback rather than a false "sent").
 */
export async function sendContact(c: Contact): Promise<{ ok: boolean }> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.warn(
      "[contact] RESEND_API_KEY unset — message NOT sent. Payload logged so it isn't lost:",
      {
        name: oneLine(c.name),
        email: c.email,
        subject: c.subject ? oneLine(c.subject) : undefined,
        message: c.message.slice(0, 300),
      },
    );
    return { ok: false };
  }

  const text = [
    `Name:    ${oneLine(c.name)}`,
    `Email:   ${c.email}`,
    c.subject ? `Subject: ${oneLine(c.subject)}` : null,
    "",
    "Message:",
    c.message,
  ]
    .filter((l): l is string => l !== null)
    .join("\n");

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: c.email,
      subject: `Contact form — ${oneLine(c.subject || c.name).slice(0, 100)}`,
      text,
    });
    if (error) {
      console.error("[contact] Resend returned an error:", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] send threw:", err);
    return { ok: false };
  }
}
