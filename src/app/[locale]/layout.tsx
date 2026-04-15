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

// Real Clerk publishable keys always start with pk_test_ or pk_live_
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const clerkConfigured =
  clerkPublishableKey.startsWith('pk_test_') ||
  clerkPublishableKey.startsWith('pk_live_');

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

  const content = (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ServiceWorkerRegistrar />
      <OfflineBanner />
      <PageTransition>
        <main style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
          {children}
        </main>
      </PageTransition>
      <BottomNav />
      <SearchTrigger />
    </NextIntlClientProvider>
  );

  if (clerkConfigured) {
    return <ClerkProvider publishableKey={clerkPublishableKey}>{content}</ClerkProvider>;
  }
  return content;
}
