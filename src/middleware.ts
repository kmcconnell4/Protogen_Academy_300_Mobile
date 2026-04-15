import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

// Detect whether real Clerk keys have been configured.
// Placeholder values from .env.local start with "your_" — treat those as unconfigured.
const clerkKey = process.env.CLERK_SECRET_KEY ?? '';
const clerkConfigured =
  clerkKey.startsWith('sk_live_') || clerkKey.startsWith('sk_test_');

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

// Full auth middleware (used when real Clerk keys are present)
const authMiddleware = clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    const authObject = await auth();
    authObject.protect();
  }
  return intlMiddleware(req);
});

// Demo middleware — i18n only, no auth (used when Clerk keys are placeholders)
function demoMiddleware(req: NextRequest): NextResponse {
  return intlMiddleware(req) as NextResponse;
}

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (clerkConfigured) {
    return authMiddleware(req, event);
  }
  return demoMiddleware(req);
}

export const config = {
  matcher: [
    // Match all pathnames except those starting with /api, /_next, /_vercel, or containing a dot (static files)
    '/((?!api|_next|_vercel|.*\\.).*)',
  ],
};
