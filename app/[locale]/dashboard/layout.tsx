import { cookies } from "next/headers";
import Script from "next/script";
import { Suspense } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { auth } from "@/app/(auth)/auth";
import { routing } from "@/i18n/routing";
import { vazirmatn } from "@/lib/fonts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();
  const isPersian = locale === 'fa';

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <Suspense fallback={<div className="flex h-dvh" />}>
          <NextIntlClientProvider messages={messages}>
            <div className={isPersian ? vazirmatn.variable : ''} dir={isPersian ? 'rtl' : 'ltr'} lang={locale}>
              <div className="flex flex-col min-h-screen">
                {children}
              </div>
            </div>
          </NextIntlClientProvider>
        </Suspense>
      </DataStreamProvider>
    </>
  );
}