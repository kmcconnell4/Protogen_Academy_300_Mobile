# Carlisle CCM App — GitHub Copilot Build Instructions

Follow these steps **in order**. Each step builds on the last. Complete and verify each one before moving to the next. Copilot prompts are shown in blockquotes — paste them directly into the Copilot Chat panel.

---

## Phase 1 — Project Scaffold

### Step 1.1 — Bootstrap the Next.js project

> "Create a new Next.js 14 App Router project with TypeScript, Tailwind CSS, and ESLint. Use the `src/` directory convention. Name it `carlisle-ccm-app`."

After generation, verify the following files exist:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `tailwind.config.ts`
- `tsconfig.json`

---

### Step 1.2 — Install all dependencies

Run the following in one command:

```bash
npm install next-intl @clerk/nextjs lucide-react nanoid
npm install -D @types/node
```

Then install Framer Motion for page transitions:

```bash
npm install framer-motion
```

---

### Step 1.3 — Configure environment variables

Create `.env.local` at the project root with:

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/en/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/en/dashboard
```

Add `.env.local` to `.gitignore` if not already present.

---

### Step 1.4 — Configure Tailwind with brand tokens

> "Update `tailwind.config.ts` to add Carlisle brand colors, the Barlow and Barlow Condensed font families, and an 8px base spacing scale. Add the following custom colors: `ccm-blue: '#003591'`, `ccm-gray: '#A0A0A0'`, `ccm-dark: '#1A1A2E'`, `ccm-surface: '#F4F5F7'`. Extend the fontFamily with `display: ['Barlow Condensed', 'Arial Narrow', 'Arial', 'sans-serif']` and `body: ['Barlow', 'Arial', 'sans-serif']`."

---

### Step 1.5 — Set up global CSS variables

> "Replace the contents of `src/app/globals.css` with a full dark-mode-first CSS custom property setup. Define the following CSS variables inside `:root[data-theme='dark']`: `--bg-base: #0D1117`, `--bg-surface: #161B22`, `--bg-surface-2: #1C2128`, `--bg-surface-3: #22272E`, `--border-subtle: rgba(255,255,255,0.08)`, `--border-default: rgba(255,255,255,0.12)`, `--border-strong: rgba(255,255,255,0.20)`, `--text-primary: #E6EDF3`, `--text-secondary: #8B949E`, `--text-muted: #484F58`, `--ccm-blue-glow: rgba(0,53,145,0.35)`. Also add a light mode override under `:root[data-theme='light']` with inverted values. Add a shimmer keyframe animation for skeleton loading screens."

---

### Step 1.6 — Load Google Fonts

> "Update `src/app/layout.tsx` to load Barlow Condensed (weights 600, 700) and Barlow (weights 400, 500, 600) from Google Fonts using a `<link>` tag in the `<head>`. Apply `font-family: var(--font-body)` to the `<body>` element. Set `data-theme='dark'` on the `<html>` element by default."

---

## Phase 2 — i18n & Routing

### Step 2.1 — Configure next-intl

> "Set up `next-intl` for Next.js App Router with support for three locales: `en`, `fr`, and `es`. Create `src/i18n.ts` with the locale config, and `src/middleware.ts` that detects the user's locale from their browser and redirects to the correct locale prefix. Default locale is `en`."

---

### Step 2.2 — Create locale message files

> "Create three JSON message files: `messages/en.json`, `messages/fr.json`, and `messages/es.json`. Populate them with placeholder keys for all major UI strings including: `nav.home`, `nav.jobs`, `nav.products`, `nav.orders`, `nav.messages`, `dashboard.greeting`, `dashboard.activeJobs`, `dashboard.pendingOrders`, `dashboard.unread`, `jobs.title`, `jobs.filterAll`, `jobs.filterInProgress`, `jobs.filterOnHold`, `jobs.filterComplete`, `products.title`, `orders.title`, `search.placeholder`, `search.voiceHint`. Add French and Spanish translations for each key."

---

### Step 2.3 — Build the locale route structure

> "Move `src/app/page.tsx` and `src/app/layout.tsx` into `src/app/[locale]/`. Update the root `src/app/layout.tsx` to redirect to `/en` by default. Wrap the `[locale]` layout with the `next-intl` `NextIntlClientProvider`, passing the correct messages for the active locale."

---

## Phase 3 — Authentication

### Step 3.1 — Install and configure Clerk

> "Wrap the `[locale]` layout with `ClerkProvider` from `@clerk/nextjs`. Create sign-in and sign-up pages at `src/app/[locale]/sign-in/page.tsx` and `src/app/[locale]/sign-up/page.tsx` using Clerk's `<SignIn />` and `<SignUp />` components. Style the Clerk component container to match the dark background `#0D1117`."

---

### Step 3.2 — Protect routes with middleware

> "Update `src/middleware.ts` to chain Clerk's `authMiddleware` with the next-intl locale middleware. Protect all routes under `/[locale]/dashboard`, `/[locale]/jobs`, `/[locale]/products`, `/[locale]/orders`, `/[locale]/messages`, and `/[locale]/quotes` (the builder, not the public view). The public shareable quote view at `/[locale]/quotes/[quoteId]/view` must remain unprotected."

---

### Step 3.3 — Define user roles

> "Create `src/lib/auth/roles.ts` that exports a `getUserRole` function. The function reads a `role` field from the Clerk user's `publicMetadata`. Return `'contractor'` or `'rep'` — default to `'contractor'` if not set. Export a `isRep(user)` helper that returns true if the user's role is `'rep'`."

---

## Phase 4 — Design System Components

### Step 4.1 — Build the base Button component

> "Create `src/components/ui/Button.tsx`. It should accept `variant` (`'primary' | 'secondary' | 'ghost'`), `size` (`'sm' | 'md' | 'lg'`), and standard button props. Primary: `background #003591`, white text, `border-radius 8px`, uppercase label with `letter-spacing: 0.06em`, Barlow Condensed Bold font, `active:scale-97` transition. Secondary: transparent background, `#003591` border and text. Ghost: `var(--bg-surface-3)` background, muted text. All variants must have a minimum height of 48px."

---

### Step 4.2 — Build the Card component

> "Create `src/components/ui/Card.tsx`. It should accept an optional `accent` boolean prop. Base styles: `background var(--bg-surface)`, `border: 1px solid var(--border-subtle)`, `border-radius: 12px`, `padding: 20px`. When `accent` is true, add `border-left: 3px solid #003591`. Add `hover:border-color var(--border-default)` with a `120ms ease` transition. No box-shadow."

---

### Step 4.3 — Build the Badge component

> "Create `src/components/ui/Badge.tsx`. Accept a `status` prop typed as `'In Progress' | 'On Hold' | 'Complete' | 'Bidding'`. Apply monochromatic styling: In Progress = `background rgba(0,53,145,0.15)` / `color #4D8AFF`; Complete = `background rgba(27,127,79,0.15)` / `color #3DD68C`; On Hold = `background rgba(217,119,6,0.15)` / `color #FBB040`; Bidding = `background rgba(160,160,160,0.1)` / `color #8B949E`. All badges: `border-radius: 6px`, `padding: 3px 10px`, `font-size: 11px`, `font-weight: 600`, `letter-spacing: 0.04em`, `text-transform: uppercase`."

---

### Step 4.4 — Build the Skeleton loader component

> "Create `src/components/ui/Skeleton.tsx` that renders a placeholder block with a shimmer animation. The shimmer should sweep left-to-right over `var(--bg-surface-2)` base color on a 1.5s loop. Accept `width`, `height`, and `className` props. Create `SkeletonCard` and `SkeletonJobRow` variants as named exports."

---

### Step 4.5 — Build the StatCard component

> "Create `src/components/ui/StatCard.tsx`. Accept `label: string` and `value: string | number` props. Render: a muted uppercase label at 11px / letter-spacing 0.08em above a large Barlow Condensed Bold value at 28px. Background: `var(--bg-surface-2)`. Border-radius: 10px. Padding: 14px 12px. Accept an optional `color` prop that tints the value text (default: `var(--text-primary)`, blue option: `#4D8AFF`)."

---

### Step 4.6 — Build the BottomNav component

> "Create `src/components/layout/BottomNav.tsx`. Render 5 nav items: Home, Jobs, Products, Orders, Messages — each with a Lucide React icon (20px stroke-width 1.8) and a text label below (10px). The active item shows a 2px wide × 24px tall Carlisle Blue top-line indicator above the icon, animated in with `transform: scaleX(1)` from `scaleX(0)` over 150ms. Active icon and label color: `#4D8AFF`. Inactive: `var(--text-muted)`. Apply `padding-bottom: max(8px, env(safe-area-inset-bottom))` to handle iPhone home bar. Use Next.js `usePathname()` to determine the active route."

---

### Step 4.7 — Build the root app layout

> "Update `src/app/[locale]/layout.tsx` to render the `BottomNav` at the bottom of every authenticated page. Wrap page content in a `<main>` element with `padding-bottom: 80px` to prevent content from being hidden behind the nav. Apply page enter animation using Framer Motion: `opacity: 0 → 1` and `y: 12 → 0` over 180ms on every route change."

---

## Phase 5 — Mock Data Layer

### Step 5.1 — Create the TypeScript interfaces

> "Create `src/lib/mock/types.ts` and define and export the following TypeScript interfaces: `Product` (with fields: id, sku, name, brand, category, subcategory, description, specs, unitOfMeasure, unitPrice, inStock, tags, documents, videos, relatedProductIds, languages), `ProductDocument` (id, title, type, language, url, fileSize), `ProductVideo` (id, title, language, youtubeId, duration), `Job` (id, name, client, address, city, state, zip, region, status, startDate, estimatedEndDate, squareFootage, roofSystem, assignedContractorId, assignedRepId, productLineItems, orderIds, notes, photos), `JobProduct` (productId, quantity, unit), `Order` (id, jobId, orderDate, status, estimatedDelivery, lineItems, totalAmount, trackingNumber, carrier), `OrderLineItem` (productId, quantity, unitPrice, lineTotal), and `Quote` (id, jobId, createdAt, lineItems, subtotal, shareUrl, convertedToOrderId). Use string literal union types for all status and category fields as specified in the brief."

---

### Step 5.2 — Populate product mock data

> "Create `src/lib/mock/products.ts`. Import the Product interface from `./types`. Export a `products` array with at least 30 realistic Carlisle products across all 10 categories. Include these specific products with accurate details:
> - Sure-Weld® TPO 60-mil White (SKU: SW-TPO-060-WH), Sure-Weld® TPO 45-mil Tan, Sure-Weld® SAT TPO 60-mil, Sure-Weld® TPO 80-mil
> - Sure-Seal® EPDM 60-mil Black (with FAT option), Sure-Seal® EPDM 45-mil Black, Sure-White® EPDM 60-mil, Sure-Seal® EPDM 90-mil
> - Sure-Flex™ PVC 50-mil White, Sure-Flex™ KEE HP PVC 80-mil, Sure-Flex™ PVC 60-mil Grey
> - FleeceBACK® EPDM 45-mil, FleeceBACK® TPO 60-mil, FleeceBACK® RapidLock™ EPDM 115-mil
> - SecurShield® HD Polyiso Cover Board ½-inch, HP-H™ Polyiso 2-inch, HP-H™ Polyiso 3-inch, ReadyFlash™ Polyiso Cover Board, InsulBase® HD Cover Board
> - CAV-GRIP® III 5-gallon and 55-gallon, FAST™ Adhesive, Flexible FAST™ Adhesive, One Step® Insulation Adhesive, Bonding Adhesive
> - Lap Sealant, TPO Cut Edge Sealant, Pressure-Sensitive Splice Tape 3-inch and 6-inch
> - APEEL® Protective Film, Sure-Flex™ PVC Pre-molded Pipe Flashing 3-inch, Sure-Weld® TPO Inside Corner CFA, Walkway Pads 3x6 TPO
> Give each product 2–3 mock documents (Data Sheet, Installation Guide, Warranty) with placeholder PDF URLs and at least 1 video with a real or placeholder YouTube ID."

---

### Step 5.3 — Populate jobs mock data

> "Create `src/lib/mock/jobs.ts`. Import the Job interface. Export a `jobs` array with exactly 8 sample jobs:
> 1. Riverside Commerce Center, Columbus OH, TPO 60-mil fully adhered, 42,000 sqft, In Progress
> 2. Greenfield Elementary School, Burlington VT, EPDM 60-mil with FAT, 18,500 sqft, On Hold
> 3. Desert Ridge Medical Center, Phoenix AZ, Sure-White EPDM 60-mil, 31,000 sqft, In Progress
> 4. Pacific Industrial Park, Portland OR, FleeceBACK TPO 60-mil, 56,000 sqft, Bidding
> 5. Lakeside Warehouse, Chicago IL, Sure-Weld SAT TPO, 28,000 sqft, Complete
> 6. Atlantic Office Complex, Charlotte NC, Sure-Flex PVC KEE HP 80-mil, 44,500 sqft, In Progress
> 7. Northgate Shopping Center, Montreal QC (Canada region), FleeceBACK EPDM RapidLock, 67,000 sqft, In Progress
> 8. Sunbelt Distribution Hub, Dallas TX, Sure-Weld TPO 80-mil mechanically attached, 88,000 sqft, Bidding
> Give each job 4–6 product line items referencing real product IDs from products.ts."

---

### Step 5.4 — Populate orders and quotes mock data

> "Create `src/lib/mock/orders.ts` with 2–3 orders per In Progress job, varying status across Submitted, Confirmed, Shipped, and Delivered. Calculate realistic `totalAmount` values based on product unit prices and quantities. Create `src/lib/mock/quotes.ts` with 3–4 sample quotes, some linked to jobs and some standalone."

---

### Step 5.5 — Create users mock data

> "Create `src/lib/mock/users.ts` with 4 sample users: 2 contractors (role: 'contractor') and 2 Carlisle reps (role: 'rep'). Each user should have: id, name, email, role, company, region, and assignedJobIds."

---

### Step 5.6 — Create the API abstraction layer

> "Create the following API module files, each gated by `NEXT_PUBLIC_USE_MOCK_DATA`:
> - `src/lib/api/products.ts`: export `getProducts()`, `getProductById(id)`, `getProductsByCategory(category)`
> - `src/lib/api/jobs.ts`: export `getJobs()`, `getJobById(id)`, `getJobsByUser(userId)`, `getJobsByStatus(status)`
> - `src/lib/api/orders.ts`: export `getOrders()`, `getOrderById(id)`, `getOrdersByJob(jobId)`, `createOrder(payload)`
> - `src/lib/api/quotes.ts`: export `getQuoteById(id)`, `createQuote(payload)`, `convertQuoteToOrder(quoteId)`
> Each function returns mock data when `USE_MOCK` is true, otherwise calls the appropriate `/api/pim/...` endpoint."

---

### Step 5.7 — Create the seed verification script

> "Create `scripts/seed-mock.ts` that imports all mock data arrays and logs a summary: total products, number of categories, total jobs, total orders, total quotes. Add a `seed:mock` script to `package.json` that runs this file with `tsx`."

---

## Phase 6 — Dashboard

### Step 6.1 — Build the dashboard page

> "Create `src/app/[locale]/dashboard/page.tsx`. It should be a server component that fetches the current user's jobs and orders using the API layer. Pass the data as props to a `<DashboardClient>` client component. Show a loading skeleton while data loads using React Suspense."

---

### Step 6.2 — Build dashboard stat cards

> "Create `src/components/dashboard/StatGrid.tsx`. Render a 3-column grid of `<StatCard>` components showing: Active Jobs (count of In Progress jobs, blue value color), Pending Orders (count of Submitted + Confirmed orders), and Unread Messages (hardcoded to 12 for the demo). Use `gap: 10px` and `grid-template-columns: repeat(3, 1fr)`."

---

### Step 6.3 — Build the search bar with voice input

> "Create `src/components/search/GlobalSearchBar.tsx`. Render a dark-background search input (`background: var(--bg-surface-2)`, `border-radius: 10px`, 48px tall) with a Lucide `Search` icon on the left and a mic button (blue circle, Lucide `Mic` icon) on the right. The mic button triggers the Web Speech API: on click, instantiate `SpeechRecognition`, set `interimResults: true` and the `lang` attribute from the active locale (`en-US`, `fr-FR`, `es-ES`). Show a live transcript below the input while recording. On result, populate the search input and emit an `onSearch(query)` callback. Show a pulsing ring animation around the mic button while recording."

---

### Step 6.4 — Build the recent jobs list

> "Create `src/components/dashboard/RecentJobs.tsx`. Render the 3 most recently updated jobs as `<Card accent>` components. Each card shows: job name (Barlow Condensed Bold 16px), status `<Badge>`, city/state and roof system in muted text, square footage as a large Barlow Condensed number with a `ROOF AREA` label, and estimated end date. Tapping a card navigates to `/[locale]/jobs/[jobId]`."

---

### Step 6.5 — Assemble the dashboard layout

> "Assemble `src/components/dashboard/DashboardClient.tsx`. Stack vertically with 24px gap: greeting header with user avatar initials circle, `<GlobalSearchBar>`, `<StatGrid>`, a section label 'Recent Jobs', `<RecentJobs>`, a section label 'Quick Actions', and two ghost buttons side-by-side: 'New Quote' and 'Scan QR Code'."

---

## Phase 7 — Jobs

### Step 7.1 — Build the jobs list page

> "Create `src/app/[locale]/jobs/page.tsx`. Fetch all jobs for the current user. Render a sticky filter bar at the top with 4 filter pills: All, In Progress, On Hold, Complete. Below, render a scrollable list of job cards. Each card is a `<Card accent>` showing: job name, badge, city/state, roof system, square footage stat, and a right-pointing chevron icon. Tapping navigates to the job detail page. Use `useTranslations` from next-intl for all labels."

---

### Step 7.2 — Build the job detail page shell

> "Create `src/app/[locale]/jobs/[jobId]/page.tsx`. Fetch the job by ID. Render a sticky header with a back arrow, the job name in Barlow Condensed Bold, and the status badge. Below the header, render 4 tab buttons: Overview, Products, Orders, Messages. Use `useState` to control the active tab. Render the active tab's content component below."

---

### Step 7.3 — Build the job Overview tab

> "Create `src/components/jobs/tabs/JobOverview.tsx`. Display: client name, full address, start and estimated end dates, assigned rep name, roof system, and square footage — each as a label/value row with a `1px solid var(--border-subtle)` divider between rows. At the bottom, render a 'Notes' section with a multiline text area for field notes (dark styled, 48px+ touch target) and a photo upload button."

---

### Step 7.4 — Build the job Products tab

> "Create `src/components/jobs/tabs/JobProducts.tsx`. Render the job's product line items as rows: product name, SKU, quantity and unit, and a right-pointing chevron that navigates to the product detail page. At the bottom render a primary 'Add Product' button."

---

### Step 7.5 — Build the job Orders tab

> "Create `src/components/jobs/tabs/JobOrders.tsx`. Fetch orders for this job. Render each order as a card with: order ID, date, status badge, item count, and total amount. Tapping expands the card to show a line-item breakdown. At the bottom render a 'Place New Order' primary button."

---

### Step 7.6 — Build the job Messages tab

> "Create `src/components/jobs/tabs/JobMessages.tsx`. Render a scrollable list of chat messages, each with: sender avatar (initials circle), sender name and timestamp, and message body. At the bottom, render a sticky input bar with a text field, an attachment icon button, and a send button. Support `@mention` suggestions when the user types `@`. Messages from the current user appear right-aligned in a Carlisle Blue bubble."

---

## Phase 8 — Products

### Step 8.1 — Build the product list page

> "Create `src/app/[locale]/products/page.tsx`. Fetch all products. Render a search input at the top (reuse `GlobalSearchBar` without the voice mic). Below, render a horizontal scrolling filter row of category pills (one per `ProductCategory`). Below that, render a vertically scrolling list of product rows: each row shows a blue icon box, product name (Barlow Condensed 15px bold), SKU in muted mono font, and unit price right-aligned. Tapping navigates to the product detail page. Filter the list in real-time as the user types or selects a category."

---

### Step 8.2 — Build the product detail page

> "Create `src/app/[locale]/products/[productId]/page.tsx`. Fetch the product by ID. Render: a sticky header with back arrow and product name. Below the header, a summary section showing category badge, product name large (Barlow Condensed Bold 20px), SKU, unit price (Barlow Condensed Bold 22px in blue), and an in-stock badge. Below, a spec sheet section rendering each `specs` key-value pair as a divider-separated row. Below that, a Documents & Videos section as a card list with download/play icons. At the bottom, two full-width buttons: 'Add to Quote' (primary) and 'Add to Order' (ghost)."

---

## Phase 9 — Orders

### Step 9.1 — Build the orders list page

> "Create `src/app/[locale]/orders/page.tsx`. Fetch all orders for the current user. Render a filter row: All, Submitted, Confirmed, Shipped, Delivered. Below, render order cards: order number, job name, order date, status badge, and total amount. Tapping a card expands it to show line items."

---

### Step 9.2 — Build the order status timeline

> "Create `src/components/orders/OrderTimeline.tsx`. Accept an `Order` prop. Render a 4-step vertical timeline: Submitted → Confirmed → Shipped → Delivered. Completed steps show a filled blue circle with a Lucide `Check` icon. The current step shows a pulsing blue circle. Future steps show a muted empty circle. Connect steps with a vertical line — filled blue for completed segments, muted for future."

---

## Phase 10 — Quotes

### Step 10.1 — Build the quote builder page

> "Create `src/app/[locale]/quotes/new/page.tsx`. Render: a job selector dropdown at the top (optional — quotes can be standalone). Below, a product search input that filters the product catalog in real time. Each search result shows product name, SKU, and unit price with an 'Add' button. Added products appear in a line-item table below the search with quantity steppers (−/+ buttons, min 1, 48px tall), editable per-item notes, and a remove button. At the bottom, show a subtotal. A primary 'Generate Quote Link' button calls `createQuote()`, generates a `nanoid` quote ID, and copies the share URL to the clipboard, showing a confirmation toast."

---

### Step 10.2 — Build the public quote view

> "Create `src/app/[locale]/quotes/[quoteId]/view/page.tsx`. This route must be publicly accessible — no auth required. Fetch the quote by ID. Render: Carlisle SynTec logo (text-based, Barlow Condensed Bold in `#003591`), quote number and date, job name (if linked), a line-item table with product name, quantity, unit price, and line total, a subtotal row, and a footer with Carlisle contact info. At the top, render a 'Copy Link' button that copies `window.location.href` to the clipboard and shows a toast. Render a 'Convert to Order' button only if the viewer is an authenticated user."

---

## Phase 11 — Search

### Step 11.1 — Build the global search overlay

> "Create `src/components/search/SearchOverlay.tsx`. When triggered (via the floating search button or nav), render a full-screen overlay: dark backdrop fades in at 200ms, a search input slides down 8px → 0 at 180ms. The input uses `GlobalSearchBar` with voice enabled. Results appear below grouped into sections: Jobs, Products, Documents — each with a section label and up to 3 result rows. Each row shows an icon, name, and a detail (e.g. status for jobs, category for products). Tapping a result navigates to the relevant page and closes the overlay. Show 'Recent Searches' (from localStorage) when the input is empty."

---

## Phase 12 — Settings & Profile

### Step 12.1 — Build the settings page

> "Create `src/app/[locale]/settings/page.tsx`. Render a vertically stacked settings list with sections: Profile (name, email, company, role — read from Clerk user), Language (EN / FR / ES segmented control — changing it navigates to the same route under the new locale prefix), Appearance (dark/light mode toggle — writes `data-theme` to the `<html>` element and saves to localStorage), Field Mode (high-contrast toggle — when on, sets body font-size to 17px, all borders to 2px, icon stroke to 2px), Notifications (push notification toggle), Offline Data (a 'Clear cache' button and a 'Force sync' button)."

---

## Phase 13 — PWA & Offline

### Step 13.1 — Create the web app manifest

> "Create `public/manifest.json` with: `name: 'Carlisle CCM'`, `short_name: 'CCM'`, `theme_color: '#003591'` (Carlisle Blue), `background_color: '#0D1117'`, `display: 'standalone'`, `start_url: '/en/dashboard'`, `orientation: 'portrait'`. Add placeholder icon entries for 192px and 512px. Add a `<link rel='manifest'>` tag to the root layout."

---

### Step 13.2 — Register a service worker

> "Create `public/sw.js`. Implement a service worker that: (1) on install, caches the app shell (HTML, CSS, JS bundles); (2) on fetch, uses a cache-first strategy for static assets and a network-first strategy for API calls; (3) queues failed POST requests (orders, messages) in IndexedDB and replays them on the next `sync` event. In `src/app/[locale]/layout.tsx`, register the service worker on component mount using a `useEffect`."

---

### Step 13.3 — Add the offline banner

> "Create `src/components/ui/OfflineBanner.tsx`. Use a `useEffect` with `window.addEventListener('online' / 'offline')` to track network status. When offline, render a fixed banner at the top of the screen: dark amber background (`rgba(217,119,6,0.9)`), Lucide `WifiOff` icon, and the text 'You're offline — changes will sync when reconnected'. Animate in with a slide-down from -48px. Include this banner in the root layout."

---

## Phase 14 — Final Polish & Verification

### Step 14.1 — Accessibility audit

> "Review all interactive components and confirm: every button and link has a visible focus ring (`box-shadow: 0 0 0 3px var(--ccm-blue-glow)`), all images have `alt` text, all form inputs have associated `<label>` elements, the bottom nav has `role='navigation'` and `aria-label='Main navigation'`, status badges have `aria-label` text that includes the status value, and the voice search button has `aria-label='Start voice search'`."

---

### Step 14.2 — i18n completeness check

> "Scan all components for hardcoded English strings. Replace each one with a `useTranslations` call and the appropriate message key. Ensure all three message files (`en.json`, `fr.json`, `es.json`) have entries for every key used in the codebase."

---

### Step 14.3 — Mobile viewport and safe area check

> "Add `<meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover'>` to the root layout `<head>`. Verify all fixed/sticky elements (bottom nav, offline banner, search overlay) use `env(safe-area-inset-bottom)` and `env(safe-area-inset-top)` padding. Test at 375px viewport width."

---

### Step 14.4 — Deploy to Vercel

> "Create a `vercel.json` at the project root. Add environment variables to the Vercel project dashboard matching `.env.local` (except `NEXT_PUBLIC_APP_URL` which should be your production URL). Push to GitHub and connect the repository to Vercel. Confirm the build passes and the app loads at the production URL."

---

## Appendix — Quick Reference

### Key file locations
| What | Where |
|------|-------|
| Mock data | `src/lib/mock/` |
| API layer | `src/lib/api/` |
| UI primitives | `src/components/ui/` |
| Layout components | `src/components/layout/` |
| i18n messages | `messages/` |
| Service worker | `public/sw.js` |
| PWA manifest | `public/manifest.json` |

### Brand tokens at a glance
| Token | Value |
|-------|-------|
| Carlisle Blue | `#003591` |
| Blue (dark mode active) | `#4D8AFF` |
| Page background (dark) | `#0D1117` |
| Card surface (dark) | `#161B22` |
| Text primary (dark) | `#E6EDF3` |
| Text muted (dark) | `#484F58` |
| Display font | Barlow Condensed |
| Body font | Barlow |
| Base grid unit | 8px |
| Card border radius | 12px |
| Button border radius | 8px |
| Standard transition | `120ms ease` |

### Environment variables
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` for demo, `false` for production PIM |
| `NEXT_PUBLIC_APP_URL` | Base URL for shareable quote links |
| `CLERK_SECRET_KEY` | Clerk auth (server-side) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (client-side) |

---

*Instructions version 1.0 — Paired with brief version 1.3*
