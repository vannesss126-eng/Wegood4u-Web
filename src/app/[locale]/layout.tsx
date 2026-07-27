import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import SetHtmlLang from "@/components/i18n/SetHtmlLang";
import { routing } from "@/i18n/routing";

/**
 * Locale layout — wraps every localized (marketing) route. It does NOT render
 * <html>/<body> (the single root layout owns those, so /r + /reset-password keep
 * theirs untouched); it validates the locale, enables static rendering
 * (setRequestLocale), and provides messages to client components.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SetHtmlLang locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
