import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { notFound } from 'next/navigation';
import { ClerkProvider } from '@clerk/nextjs';
import BottomNav from '@/components/layout/BottomNav';
import PageTransition from '@/components/layout/PageTransition';
import SearchTrigger from '@/components/search/SearchTrigger';
import OfflineBanner from '@/components/ui/OfflineBanner';
import ServiceWorkerRegistrar from '@/components/ui/ServiceWorkerRegistrar';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();

  return (
    <ClerkProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ServiceWorkerRegistrar />
        <OfflineBanner />
        <PageTransition>
          <main style={{ paddingBottom: '80px' }}>
            {children}
          </main>
        </PageTransition>
        <BottomNav />
        <SearchTrigger />
      </NextIntlClientProvider>
    </ClerkProvider>
  );
}
