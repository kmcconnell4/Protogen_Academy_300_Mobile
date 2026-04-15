import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/:locale/dashboard(.*)',
  '/:locale/jobs(.*)',
  '/:locale/products(.*)',
  '/:locale/orders(.*)',
  '/:locale/messages(.*)',
  '/:locale/quotes/new(.*)',
]);

// Public routes — no auth needed
const isPublicRoute = createRouteMatcher([
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
  '/:locale/quotes/:quoteId/view(.*)',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    const authObject = await auth();
    authObject.protect();
  }
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Match all pathnames except those starting with /api, /_next, /_vercel, or containing a dot (static files)
    '/((?!api|_next|_vercel|.*\\.).*)',
  ],
};
