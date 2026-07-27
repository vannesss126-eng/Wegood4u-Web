"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

import {
  submitContact,
  type FormState,
} from "@/app/[locale]/(marketing)/contact/actions";
import {
  RECAPTCHA_ACTION,
  type ContactField,
} from "@/app/[locale]/(marketing)/contact/schema";
import { useRecaptcha } from "@/lib/useRecaptcha";
import { cn } from "@/lib/utils";
import RecaptchaNotice from "@/components/forms/RecaptchaNotice";

const INITIAL: FormState = { status: "idle" };

type Values = Record<ContactField, string>;
const EMPTY: Values = { name: "", email: "", subject: "", message: "" };

const FIELD_INPUT = cn(
  "mt-2 block w-full rounded-input border border-line-cream bg-white",
  "min-h-[48px] px-4 py-3 text-[16px] text-text-900 placeholder:text-text-600/60",
  "transition-[border-color,box-shadow] duration-250 ease-brand",
  "focus:border-coral-500 focus:outline-none focus:ring-[3px] focus:ring-coral-500/15",
  "aria-[invalid=true]:border-coral-700 aria-[invalid=true]:ring-coral-700/15",
);

function Field({
  name,
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
  autoComplete,
  textarea,
  placeholder,
}: {
  name: ContactField;
  label: string;
  value: string;
  onChange: (name: ContactField, value: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  const t = useTranslations("contact.form");
  const id = useId();
  const errorId = `${id}-error`;
  const common = {
    id,
    name,
    value,
    required,
    autoComplete,
    placeholder,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(name, e.target.value),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  } as const;

  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-semibold text-text-900">
        {label}
        {required ? (
          <span className="text-coral-700"> *</span>
        ) : (
          <span className="font-normal text-text-600"> {t("optional")}</span>
        )}
      </label>
      {textarea ? (
        <textarea {...common} rows={6} className={cn(FIELD_INPUT, "resize-y")} />
      ) : (
        <input {...common} type={type} className={FIELD_INPUT} />
      )}
      {error ? (
        <p id={errorId} className="mt-1.5 text-[13px] font-medium text-coral-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const executeRecaptcha = useRecaptcha();

  // The action is wrapped client-side so a FRESH reCAPTCHA token can be minted
  // at submit time (v3 tokens die after ~2 min) and attached before the server
  // action runs. A null token is still submitted — the server decides what that
  // means, so the client can never talk its way past the check.
  const [state, formAction, isPending] = useActionState(
    async (prev: FormState, formData: FormData) => {
      const token = await executeRecaptcha(RECAPTCHA_ACTION);
      if (token) formData.set("g-recaptcha-response", token);
      return submitContact(prev, formData);
    },
    INITIAL,
  );

  // Controlled values survive React 19's post-action form reset, so a validation
  // or send error never wipes what the person already typed.
  const [values, setValues] = useState<Values>(EMPTY);
  const onChange = (name: ContactField, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  // Timing trap: stamp the client mount time (checked server-side).
  const tsRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-card border border-line-cream bg-white p-8 shadow-card"
      >
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full bg-green-700/10 text-green-700"
        >
          <CheckCircle2 className="size-6" strokeWidth={1.75} />
        </span>
        <h2 className="mt-4 font-display text-[26px] font-semibold leading-[1.2] text-text-900">
          {t("successTitle")}
        </h2>
        <p className="mt-2 text-[16px] leading-[1.65] text-text-600">
          {t.rich("successBody", {
            link: (chunks) => (
              <a
                href="mailto:enquiry@wegood4u.com"
                className="font-semibold text-coral-700 underline underline-offset-4"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-card border border-line-cream bg-white p-6 shadow-card sm:p-8"
    >
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="mb-6 rounded-input bg-coral-100 px-4 py-3 text-[14px] font-medium text-coral-700"
        >
          {state.message}
        </p>
      ) : null}

      {/* Honeypot: off-screen (not display:none, which many bots skip), out of
          the tab order, autocomplete off. A filled value = a bot. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Company website
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      <input ref={tsRef} type="hidden" name="form_ts" defaultValue="" />

      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="name"
            label={t("nameLabel")}
            required
            autoComplete="name"
            value={values.name}
            onChange={onChange}
            error={state.errors?.name}
          />
          <Field
            name="email"
            label={t("emailLabel")}
            required
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={onChange}
            error={state.errors?.email}
          />
        </div>
        <Field
          name="subject"
          label={t("subjectLabel")}
          placeholder={t("subjectPlaceholder")}
          value={values.subject}
          onChange={onChange}
          error={state.errors?.subject}
        />
        <Field
          name="message"
          label={t("messageLabel")}
          required
          textarea
          placeholder={t("messagePlaceholder")}
          value={values.message}
          onChange={onChange}
          error={state.errors?.message}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full px-7",
          "bg-coral-500 font-sans text-[19px] font-bold tracking-[0.3px] text-white",
          "transition-[transform,background-color,box-shadow] duration-250 ease-brand",
          "hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-cta active:translate-y-0",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-coral-500",
          "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none",
          "motion-reduce:transition-none motion-reduce:transform-none sm:w-auto",
        )}
      >
        {isPending ? t("submitting") : t("submit")}
      </button>

      <p className="mt-4 text-[13px] leading-[1.5] text-text-600">
        {t.rich("emailFallback", {
          link: (chunks) => (
            <a
              href="mailto:enquiry@wegood4u.com"
              className="font-semibold text-coral-700 underline underline-offset-4"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      <RecaptchaNotice className="mt-2 text-[12px] leading-[1.5] text-text-600/80" />
    </form>
  );
}
