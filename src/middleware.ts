import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

export const config = {
  matcher: [
    // Match all pathnames except those starting with /api, /_next, /_vercel, or containing a dot (static files)
    '/((?!api|_next|_vercel|.*\\.).*)',
  ],
};
