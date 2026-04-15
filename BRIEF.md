# Carlisle Construction Materials — Contractor & Sales Rep Web App
## GitHub Copilot Build Brief

---

## Project Overview

A mobile-first progressive web app (PWA) for Carlisle Construction Materials, designed for contractors and sales reps who access the app in the field — often on rooftops. The app centralizes job management, product documentation, ordering, and team collaboration into a single, fast, reliable experience.

**Deploy target:** Vercel  
**Primary framework:** Next.js (App Router) with TypeScript  
**Styling:** Tailwind CSS  
**Auth:** NextAuth.js or Clerk  
**i18n:** next-intl (English, French, Spanish)

---

## Audience & Environment

- **Who:** Commercial roofing contractors and Carlisle sales representatives
- **Where:** In the field, on rooftops, in trucks — bright sunlight, gloves on, one hand free
- **Needs:** Large tap targets, high contrast, minimal loading time, offline-capable for core features, voice input support

---

## Core Principles

1. **Mobile-first, always.** Design for 375px wide screens first. Desktop is secondary.
2. **Speed over everything.** Pages should feel instant. Use skeleton loaders, optimistic UI, and aggressive caching.
3. **Offline-ready.** Use service workers to cache job data, product docs, and recently viewed content.
4. **Accessible.** WCAG 2.1 AA minimum. Large touch targets (min 48×48px). High contrast mode.
5. **Internationalized.** All UI strings must use i18n keys. Support EN, FR, ES with locale detection and a persistent toggle.

---

## Feature Modules

### 1. Dashboard (Home)
- Summary cards: active jobs count, pending orders, recent documents, unread messages
- Quick-action buttons: Search, New Quote, Scan QR code (for product lookup)
- Recent activity feed
- Weather widget for the user's current location (relevant for roofing schedules)

### 2. Job Management
- List of ongoing jobs with status indicators (In Progress, On Hold, Complete)
- Each job detail page shows:
  - Job info (address, client, start date, assigned team)
  - Associated products and quantities
  - Linked documents and installation videos
  - Order history for the job
  - Team chat thread for the job
  - Notes / photo uploads
- Filter and sort jobs by status, date, region

### 3. Product Library
- Searchable, filterable catalog of Carlisle roofing products
- Each product page includes:
  - Product specs and description
  - Downloadable documentation (data sheets, installation guides, warranties) as PDFs
  - Installation video player (hosted or YouTube embed)
  - Related products
  - "Add to Quote" and "Add to Order" buttons
- Products organized by category (TPO, EPDM, ISO insulation, adhesives, etc.)

### 4. Search (Text + Voice)
- Global search bar accessible from every screen via sticky header or floating button
- Searches across: jobs, products, documents, videos, and orders
- Voice search using the Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)
  - Show a mic button next to the search input
  - Display live transcript as the user speaks
  - Submit automatically after a pause or on tap
- Search results grouped by type (Jobs, Products, Documents)
- Recent searches stored locally

### 5. Orders
- View all orders across all jobs or filtered by job
- Order detail: line items, quantities, status, estimated delivery
- Place a new order directly from a job or product page
- Order status tracking with timeline (Submitted → Confirmed → Shipped → Delivered)
- Reorder from previous orders

### 6. Quotes
- Create a new quote linked to a job or as a standalone
- Add products by searching the catalog or scanning a QR code
- Adjust quantities, add notes per line item
- Quote summary with line-item totals
- Generate a unique shareable link (e.g. `/quotes/[quoteId]`) that renders a read-only, print-friendly quote view — no auth required to view
- The shareable view shows: quote number, date, job name, line items with quantities and unit prices, subtotal, and Carlisle branding
- "Copy link" button with a one-tap clipboard copy and confirmation toast
- Convert quote to order in one tap (authenticated users only)
- **No PDF export in v1** — shareable link is the only sharing mechanism

### 7. Collaboration & Messaging
- Per-job team chat threads
- Ability to @mention team members or @Carlisle-support
- Attach photos, documents, or product links in messages
- Push notifications for new messages (PWA notifications)
- Read receipts

### 8. Settings & Profile
- Language switcher (EN / FR / ES) — persists across sessions
- User profile (name, role, company, region)
- Notification preferences
- Offline data management (clear cache, force sync)
- Dark mode toggle (default to system preference)

---

## Mock Data Layer (PIM Placeholder)

> The production app will integrate with Carlisle's PIM system. For this demo, all product and job data is served from a local mock data module. The mock layer must be easy to swap out — all data access goes through a single `lib/api/` interface so the real PIM integration only requires updating those files.

### Step 1 — Install and configure the mock data module

Create `lib/mock/` with the following files:

```
lib/
└── mock/
    ├── products.ts       # Full product catalog mock
    ├── jobs.ts           # Sample ongoing jobs
    ├── orders.ts         # Sample orders per job
    ├── quotes.ts         # Sample quotes
    ├── users.ts          # Sample contractor and rep users
    └── index.ts          # Barrel export + helper fns (getProductById, getJobsByUser, etc.)
```

Wire up `lib/api/products.ts`, `lib/api/jobs.ts`, etc. to import from `lib/mock/` in development and from the real PIM endpoint in production, gated by an env var:

```ts
// lib/api/products.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function getProducts() {
  if (USE_MOCK) return import('../mock/products').then(m => m.products);
  return fetch('/api/pim/products').then(r => r.json());
}
```

Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local` for demo builds.

---

### Step 2 — Product catalog mock data (`lib/mock/products.ts`)

Model each product with this TypeScript interface:

```ts
export interface Product {
  id: string;               // e.g. "sure-weld-tpo-60mil"
  sku: string;              // e.g. "SW-TPO-060-WH-10"
  name: string;
  brand: string;            // "Carlisle SynTec" | "WeatherBond" | "Hunter Panels"
  category: ProductCategory;
  subcategory: string;
  description: string;
  specs: Record<string, string>;  // key-value spec sheet
  unitOfMeasure: string;    // "sq ft", "roll", "gallon", "board", etc.
  unitPrice: number;        // demo price in USD
  inStock: boolean;
  tags: string[];
  documents: ProductDocument[];
  videos: ProductVideo[];
  relatedProductIds: string[];
  languages: ('en' | 'fr' | 'es')[];
}

export type ProductCategory =
  | 'TPO Membranes'
  | 'EPDM Membranes'
  | 'PVC Membranes'
  | 'FleeceBACK Systems'
  | 'Insulation'
  | 'Adhesives & Primers'
  | 'Sealants & Tapes'
  | 'Accessories & Flashings'
  | 'Metal Roofing'
  | 'Roof Garden Systems';

export interface ProductDocument {
  id: string;
  title: string;
  type: 'Data Sheet' | 'Installation Guide' | 'Warranty' | 'Spec Sheet' | 'Safety Data Sheet';
  language: 'en' | 'fr' | 'es';
  url: string;   // mock: use placeholder PDF URL (e.g. https://www.w3.org/WAI/UR/1/acrobat/pdf1.pdf)
  fileSize: string;
}

export interface ProductVideo {
  id: string;
  title: string;
  language: 'en' | 'fr' | 'es';
  youtubeId: string;   // use real public Carlisle SynTec YouTube video IDs where possible
  duration: string;
}
```

Populate `products` array with **at least 30 realistic products** across all categories, including:

**TPO Membranes**
- Sure-Weld® TPO 60-mil White (SKU: SW-TPO-060-WH) — 10' and 12' wide rolls, ENERGY STAR qualified
- Sure-Weld® TPO 45-mil Tan (SKU: SW-TPO-045-TN)
- Sure-Weld® SAT TPO 60-mil (Self-Adhering Technology) (SKU: SW-SAT-060-WH)
- Sure-Weld® TPO 80-mil (SKU: SW-TPO-080-WH) — high-traffic applications

**EPDM Membranes**
- Sure-Seal® EPDM 60-mil Black (SKU: SS-EPDM-060-BK) — with Factory-Applied Tape (FAT) option
- Sure-Seal® EPDM 45-mil Black (SKU: SS-EPDM-045-BK)
- Sure-White® EPDM 60-mil (SKU: SS-EPDM-060-WH) — ENERGY STAR qualified, only white EPDM on market
- Sure-Seal® EPDM 90-mil Black (SKU: SS-EPDM-090-BK) — heavy-duty

**PVC Membranes**
- Sure-Flex™ PVC 50-mil White (SKU: SF-PVC-050-WH) — ENERGY STAR, CRRC-rated
- Sure-Flex™ KEE HP PVC 80-mil (SKU: SF-KEE-080-WH) — Elvaloy-enhanced, chemical resistant
- Sure-Flex™ PVC 60-mil Grey (SKU: SF-PVC-060-GY)

**FleeceBACK Systems**
- FleeceBACK® EPDM 45-mil + 55-mil fleece (SKU: FB-EPDM-045) — superior puncture resistance
- FleeceBACK® TPO 60-mil + 55-mil fleece (SKU: FB-TPO-060)
- FleeceBACK® RapidLock™ EPDM 115-mil (SKU: FB-RL-EPDM-115) — VELCRO® installation, 80% labor savings

**Insulation**
- SecurShield® HD Polyiso Cover Board ½" (SKU: ISO-SS-HD-0.5) — 5× R-value of gypsum
- HP-H™ Polyiso Roof Insulation 2" (SKU: ISO-HPH-2.0) — tapered design available
- HP-H™ Polyiso Roof Insulation 3" (SKU: ISO-HPH-3.0)
- ReadyFlash™ Polyiso Cover Board (SKU: ISO-RF-0.5) — dual-sided flash-off control
- InsulBase® HD Cover Board (SKU: ISO-IB-HD) — GRF-faced, re-roofing and new construction

**Adhesives & Primers**
- CAV-GRIP® III Low-VOC Adhesive (SKU: ADH-CAVIII-5G) — spray-applied, fast flash-off, 5-gallon pail
- CAV-GRIP® III Low-VOC Adhesive (SKU: ADH-CAVIII-55G) — 55-gallon drum
- FAST™ Adhesive (SKU: ADH-FAST-2C) — two-component polyurethane, for FleeceBACK systems
- Flexible FAST™ Adhesive (SKU: ADH-FFAST-2C) — low-rise, VOC-free, all temperatures
- One Step® Insulation Adhesive (SKU: ADH-ONESTEP-2C) — bonds insulation to substrate
- Bonding Adhesive (SKU: ADH-BOND-5G) — solvent-based, for EPDM fully adhered systems

**Sealants & Tapes**
- Lap Sealant (SKU: SEAL-LAP-10OZ) — weatherproofing cut edges, 10 oz cartridge
- TPO Cut Edge Sealant 16 oz (SKU: SEAL-CES-16OZ)
- Pressure-Sensitive Splice Tape 3" (SKU: TAPE-PST-3IN-50FT)
- Pressure-Sensitive Splice Tape 6" (SKU: TAPE-PST-6IN-50FT)

**Accessories & Flashings**
- APEEL® Protective Film (SKU: ACC-APEEL-ROLL) — guards TPO during installation
- Sure-Flex™ PVC Pre-molded Pipe Flashing (SKU: ACC-PF-PVC-3IN) — 3" pipe
- Sure-Weld® TPO Certified Fabricated Accessory — Inside Corner (SKU: ACC-CFA-IC-TPO)
- Walkway Pads 3'×6' TPO (SKU: ACC-WP-TPO-3X6) — high-traffic protection

Each product should have 2–3 mock documents (Data Sheet, Installation Guide, Warranty) and at least 1 video. For YouTube IDs, use real Carlisle SynTec Systems channel videos where they exist; otherwise use a placeholder like `dQw4w9WgXcQ`.

---

### Step 3 — Jobs mock data (`lib/mock/jobs.ts`)

```ts
export interface Job {
  id: string;
  name: string;
  client: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  region: 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'West' | 'Canada';
  status: 'In Progress' | 'On Hold' | 'Complete' | 'Bidding';
  startDate: string;       // ISO date string
  estimatedEndDate: string;
  squareFootage: number;
  roofSystem: string;      // e.g. "Sure-Weld® TPO 60-mil Fully Adhered"
  assignedContractorId: string;
  assignedRepId: string;
  productLineItems: JobProduct[];
  orderIds: string[];
  notes: string;
  photos: string[];        // mock: array of placeholder image URLs
}

export interface JobProduct {
  productId: string;
  quantity: number;
  unit: string;
}
```

Create **8 sample jobs** across different statuses, regions, and roof systems. Give each job 4–6 products drawn from the product catalog above. Examples:

- Riverside Commerce Center, Columbus OH — TPO 60-mil fully adhered, 42,000 sq ft, In Progress
- Greenfield Elementary School, Burlington VT — EPDM 60-mil with FAT, 18,500 sq ft, On Hold
- Desert Ridge Medical, Phoenix AZ — Sure-White EPDM 60-mil, 31,000 sq ft, In Progress
- Pacific Industrial Park, Portland OR — FleeceBACK TPO 60-mil with FAST Adhesive, 56,000 sq ft, Bidding
- Lakeside Warehouse, Chicago IL — Sure-Weld SAT TPO, 28,000 sq ft, Complete
- Atlantic Office Complex, Charlotte NC — Sure-Flex PVC KEE HP 80-mil, 44,500 sq ft, In Progress
- Northgate Shopping Center, Montreal QC (Canada region) — FleeceBACK EPDM RapidLock, 67,000 sq ft, In Progress
- Sunbelt Distribution Hub, Dallas TX — Sure-Weld TPO 80-mil mechanically attached, 88,000 sq ft, Bidding

---

### Step 4 — Orders mock data (`lib/mock/orders.ts`)

```ts
export interface Order {
  id: string;
  jobId: string;
  orderDate: string;
  status: 'Submitted' | 'Confirmed' | 'Shipped' | 'Delivered';
  estimatedDelivery: string;
  lineItems: OrderLineItem[];
  totalAmount: number;
  trackingNumber?: string;
  carrier?: string;
}

export interface OrderLineItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
```

Create 2–3 orders per in-progress job. Vary statuses across the pipeline.

---

### Step 5 — Seed script

Create `scripts/seed-mock.ts` that logs a summary of all mock data to the console so developers can verify the dataset on startup:

```ts
// scripts/seed-mock.ts
import { products } from '../lib/mock/products';
import { jobs } from '../lib/mock/jobs';
import { orders } from '../lib/mock/orders';

console.log(`✅ Mock data ready:`);
console.log(`   ${products.length} products across ${[...new Set(products.map(p => p.category))].length} categories`);
console.log(`   ${jobs.length} jobs`);
console.log(`   ${orders.length} orders`);
```

Add to `package.json`:
```json
"scripts": {
  "seed:mock": "tsx scripts/seed-mock.ts"
}
```

---



```
/
├── app/                        # Next.js App Router
│   ├── [locale]/               # i18n routing (en, fr, es)
│   │   ├── dashboard/
│   │   ├── jobs/
│   │   │   └── [jobId]/
│   │   ├── products/
│   │   │   └── [productId]/
│   │   ├── orders/
│   │   ├── quotes/
│   │   ├── messages/
│   │   └── settings/
├── components/
│   ├── ui/                     # Reusable primitives (Button, Card, Input, etc.)
│   ├── layout/                 # BottomNav, Header, Sidebar
│   ├── jobs/
│   ├── products/
│   ├── orders/
│   ├── quotes/
│   └── search/                 # GlobalSearch, VoiceSearch
├── lib/
│   ├── api/                    # API client wrappers (swap mock ↔ PIM here)
│   ├── mock/                   # Mock data layer (see Mock Data section)
│   ├── i18n/                   # next-intl config and message files
│   └── utils/
├── scripts/
│   └── seed-mock.ts            # Mock data verification script
├── messages/                   # i18n JSON files
│   ├── en.json
│   ├── fr.json
│   └── es.json
├── public/
│   └── sw.js                   # Service worker for offline support
└── middleware.ts                # Locale detection and auth guards
```

---

## Navigation

Use a **bottom navigation bar** on mobile (the primary navigation pattern) with 5 items:

| Icon | Label | Route |
|------|-------|-------|
| 🏠 | Home | /dashboard |
| 🔨 | Jobs | /jobs |
| 📦 | Products | /products |
| 📋 | Orders | /orders |
| 💬 | Messages | /messages |

On desktop (≥1024px), switch to a collapsible left sidebar.

A **floating search button** (bottom-right, above nav) opens the global search overlay with voice input.

---

## UI & Design Guidelines

> Color and typography values below are sourced directly from the **Carlisle SynTec Systems Brand Identity Standards** document. Use these exact values throughout the app to ensure brand compliance.

### Color Palette

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| **Primary** | Carlisle Blue (PMS 661 C) | `#003591` | `0, 53, 145` | Primary buttons, nav bar active state, links, key UI chrome |
| **Secondary** | Carlisle Gray (PMS 423 C) | `#A0A0A0` | `160, 162, 164` | Secondary text, borders, dividers, inactive nav items |
| **White** | White | `#FFFFFF` | `255, 255, 255` | Backgrounds, text on dark surfaces, logo field |
| **Dark** | Near-black | `#1A1A2E` | — | Body text, headings on light backgrounds |
| **Surface** | Light gray | `#F4F5F7` | — | Page background, card backgrounds |
| **Success** | Green | `#1B7F4F` | — | Order confirmed, job complete, success toasts |
| **Warning** | Amber | `#D97706` | — | On Hold status, low stock alerts |
| **Danger** | Red | `#DC2626` | — | Error states, destructive actions |

Define these as CSS custom properties in `globals.css`:

```css
:root {
  --color-primary:     #003591;
  --color-primary-dark:#002570;   /* hover/pressed state — darken 15% */
  --color-primary-light:#1A52B0;  /* focus rings, subtle fills */
  --color-secondary:   #A0A0A0;
  --color-white:       #FFFFFF;
  --color-dark:        #1A1A2E;
  --color-surface:     #F4F5F7;
  --color-surface-2:   #E8EAED;   /* slightly darker surface for nested cards */
  --color-success:     #1B7F4F;
  --color-warning:     #D97706;
  --color-danger:      #DC2626;
  --color-text-primary:   #1A1A2E;
  --color-text-secondary: #5A5C6B;
  --color-text-muted:     #A0A0A0;
  --color-border:      #DDE1E7;
}
```

Also configure these in `tailwind.config.ts` under `theme.extend.colors` so all Tailwind utilities are available:

```ts
colors: {
  'ccm-blue':  '#003591',
  'ccm-gray':  '#A0A0A0',
  'ccm-dark':  '#1A1A2E',
  'ccm-surface': '#F4F5F7',
}
```

### Dark Mode

Use `prefers-color-scheme` media query plus a manual toggle. In dark mode:
- Background: `#0D1117` (near-black)
- Surface: `#161B22`
- Primary remains `#003591` but use `--color-primary-light` (`#1A52B0`) for interactive states to ensure contrast on dark backgrounds
- All text colors invert to light equivalents

### Typography

Carlisle's official brand fonts are the **Helvetica Neue Condensed** family for external communications. Since Helvetica Neue is a licensed font, use the following web-safe stack:

```css
/* Headlines & UI labels — closest web-safe match to Helvetica Neue Bold Condensed */
--font-display: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;

/* Body copy — closest match to Helvetica Neue Condensed */
--font-body: 'Barlow', Arial, sans-serif;
```

Load from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
```

Apply in Tailwind:
```ts
fontFamily: {
  display: ['Barlow Condensed', 'Arial Narrow', 'Arial', 'sans-serif'],
  body:    ['Barlow', 'Arial', 'sans-serif'],
}
```

**Type scale for mobile-first UI:**
- Page titles: `font-display font-bold text-2xl` (Barlow Condensed 700, 24px)
- Section headers: `font-display font-semibold text-lg` (Barlow Condensed 600, 18px)
- Body / card labels: `font-body text-base` (Barlow 400, 16px)
- Supporting info: `font-body text-sm text-ccm-gray` (Barlow 400, 14px)
- Minimum body text size: **16px** — never go below this on mobile

### Visual Tone — Sleek & Premium

The app should feel like a **premium industrial tool** — the visual equivalent of a high-end piece of roofing equipment. Think dark surfaces, precise edges, confident typography, and purposeful motion. Not a generic SaaS dashboard. Not a construction app that looks like a safety brochure. Something a contractor is proud to pull out on a job site.

Four principles drive every decision:

**1. Dark-first.** Default the app to dark mode. Dark backgrounds (`#0D1117`) make Carlisle Blue pop and give the UI a premium, high-contrast feel that performs well in direct sunlight. Light mode is available as a toggle but is not the default.

**2. Precision over decoration.** No gradients, no drop shadows, no glassy effects. Sleek comes from sharp edges, tight spacing, and perfect alignment — not visual noise. Every pixel should feel intentional.

**3. Motion that earns its place.** Micro-animations on state changes (page transitions, button presses, status updates) make the app feel alive and responsive. But animations must be instant to initiate — never make the user wait for an animation to see their result.

**4. Typography does the heavy lifting.** Large, confident type — especially for numbers (job square footage, order totals, product counts) — is the single biggest differentiator between a generic app and a premium one.

---

### Dark Mode (Default)

```css
:root[data-theme="dark"] {
  --bg-base:       #0D1117;   /* page background */
  --bg-surface:    #161B22;   /* cards, panels */
  --bg-surface-2:  #1C2128;   /* nested cards, inputs */
  --bg-surface-3:  #22272E;   /* hover states, subtle fills */
  --border-subtle: rgba(255,255,255,0.08);
  --border-default:rgba(255,255,255,0.12);
  --border-strong: rgba(255,255,255,0.20);
  --text-primary:  #E6EDF3;
  --text-secondary:#8B949E;
  --text-muted:    #484F58;
  --ccm-blue-glow: rgba(0,53,145,0.35);  /* for focus rings and active states */
}
```

In dark mode, Carlisle Blue (`#003591`) becomes a true accent — use it on CTAs, active nav states, and key data points only. Overusing it dilutes the impact.

---

### Spacing & Layout

Use an **8px base grid** strictly. All spacing values must be multiples of 8: `8 / 16 / 24 / 32 / 48 / 64px`. This is what makes layouts feel "tight" vs. arbitrary.

```ts
spacing: {
  '1': '8px',
  '2': '16px',
  '3': '24px',
  '4': '32px',
  '6': '48px',
  '8': '64px',
}
```

- **Page padding (mobile):** `16px` horizontal — content fills the screen confidently
- **Card padding:** `20px` — generous enough to breathe, tight enough to feel dense
- **Between cards:** `12px` gap — close enough to feel like a cohesive group
- **Section spacing:** `32px` — clear breaks between major content groups

---

### Cards & Surfaces

Cards should feel like **machined panels**, not paper. Key rules:

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 20px;
}

.card:hover {
  border-color: var(--border-default);
  background: var(--bg-surface-2);
  transition: all 120ms ease;
}
```

- **No `box-shadow`.** Border color shift on hover is the only depth cue needed.
- **No white cards on dark backgrounds.** Cards should be slightly lighter than the page background — never bright white.
- **Rounded corners: 12px for cards, 8px for buttons, 6px for badges, 4px for inputs.** Consistent radii are a hallmark of polished UI.
- Use a `1px` left border accent in Carlisle Blue on cards with a status indicator (jobs, orders) — it's more refined than a colored badge alone.

---

### Buttons

```css
/* Primary — Carlisle Blue */
.btn-primary {
  background: #003591;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  transition: background 100ms ease, transform 80ms ease;
}
.btn-primary:active { transform: scale(0.97); background: #002570; }

/* Secondary — outlined */
.btn-secondary {
  background: transparent;
  color: #003591;
  border: 1px solid #003591;
  /* same sizing as primary */
}

/* Ghost — for destructive or low-emphasis actions */
.btn-ghost {
  background: var(--bg-surface-3);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}
```

- **All primary button labels in UPPERCASE with letter-spacing.** This is how Carlisle's brand guide uses condensed type — it reads as confident and professional, not shouty.
- **Active state scale(0.97)** gives satisfying physical feedback on mobile taps.
- **Touch target: minimum 48px tall on mobile.** Pad vertically if needed.
- **Icon + label buttons:** Icon left, 8px gap, label right. Never icon-only for primary actions.

---

### Typography in Practice

Headlines and key numbers should be treated as **display elements**, not just labels:

```css
/* Job square footage, order total, product count */
.stat-value {
  font-family: var(--font-display);   /* Barlow Condensed */
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  line-height: 1;
}

/* Supporting label above the stat */
.stat-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 4px;
}
```

Example — on a job card, the square footage `42,000 SF` should render at 36px Barlow Condensed Bold with a tiny `ROOF AREA` label above it. This is the difference between a utility app and a premium tool.

**Type scale:**

| Role | Font | Size | Weight | Treatment |
|------|------|------|--------|-----------|
| Page title | Barlow Condensed | 28px | 700 | Uppercase, tracking +0.02em |
| Section header | Barlow Condensed | 20px | 600 | Title case |
| Card title | Barlow Condensed | 17px | 600 | Title case |
| Stat / big number | Barlow Condensed | 36px | 700 | Tracking −0.02em |
| Body | Barlow | 15px | 400 | Normal |
| Label / caption | Barlow | 11px | 500 | Uppercase, tracking +0.08em |
| Min mobile size | — | 15px | — | Never below this |

---

### Motion & Micro-interactions

Use CSS transitions for all state changes. Keep durations short — this is a work app, not a marketing site.

```css
/* Standard transition — apply to cards, buttons, inputs */
transition: all 120ms ease;

/* Page-level transitions (use Framer Motion or CSS View Transitions API) */
/* Slide up on enter, fade out on exit */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-enter { animation: slideUp 180ms ease forwards; }
```

Specific micro-interactions to implement:

- **Bottom nav active state:** Active tab icon scales up to 1.1× with a `120ms ease` transition and the Carlisle Blue underline slides in using a `transform: scaleX()` animation
- **Card tap (mobile):** `scale(0.985)` at `touchstart`, restored at `touchend` — 80ms, gives physical feedback through gloves
- **Status badge update:** When a job status changes, the badge cross-fades with a 150ms opacity transition — never a hard swap
- **Skeleton → content:** Fade in loaded content at `opacity: 0 → 1` over `200ms` — skeleton disappears simultaneously, not sequentially
- **Search overlay open:** Backdrop fades in at `200ms`, search input slides down `8px → 0` at `180ms` — feels like it's dropping into place
- **Voice mic active state:** Pulse ring expands from the mic button at 1× → 1.4× in a `1s ease-in-out` loop while recording

No `transition: all` on elements with many properties — be specific (`background`, `border-color`, `transform`) to avoid jank.

---

### Navigation

```css
/* Bottom nav — dark surface, blue active indicator */
.bottom-nav {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
}

.nav-item.active {
  color: #003591;
}

.nav-item.active::before {
  content: '';
  display: block;
  width: 24px;
  height: 2px;
  background: #003591;
  border-radius: 2px;
  margin: 0 auto 4px;
  transform: scaleX(1);
  transition: transform 150ms ease;
}

.nav-item:not(.active)::before {
  transform: scaleX(0);
}
```

- **Always show icon + label** — icon-only nav fails in direct sunlight and with gloves
- **Active indicator is a 2px top line** above the icon, not a filled pill — more refined, less toylike
- Respect `safe-area-inset-bottom` for iPhone home bar clearance

---

### Status Badges

Badges use a **monochromatic treatment** — colored text on a low-opacity tinted background, not bright filled pills:

```css
.badge { border-radius: 6px; padding: 3px 10px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }

.badge-progress  { background: rgba(0,53,145,0.15);  color: #4D8AFF; }  /* In Progress */
.badge-complete  { background: rgba(27,127,79,0.15); color: #3DD68C; }  /* Complete */
.badge-hold      { background: rgba(217,119,6,0.15); color: #FBB040; }  /* On Hold */
.badge-bidding   { background: rgba(160,160,160,0.1);color: #8B949E; }  /* Bidding */
```

---

### Iconography

- Use **Lucide React** throughout — consistent 1.5px stroke weight, clean geometric style matches the Barlow Condensed type aesthetic
- Size: `20px` in nav, `18px` in cards, `16px` inline with text
- Never use filled icons alongside stroked icons — pick one style and hold it
- **In dark mode, icons inherit `var(--text-secondary)` color** unless they carry semantic meaning (then use the appropriate semantic color)

---

### Other UI Standards

- **Touch targets:** Minimum 48×48px for all interactive elements
- **Inputs:** Dark background (`var(--bg-surface-2)`), `1px solid var(--border-subtle)` border, `border-radius: 4px`, 48px tall on mobile. Focus state: `border-color: #003591` + `box-shadow: 0 0 0 3px var(--ccm-blue-glow)`
- **Dividers:** `1px solid var(--border-subtle)` — never use `<hr>` with default styling
- **Loading states:** Skeleton screens with a `shimmer` animation (left-to-right highlight sweep at 1.5s) over `var(--bg-surface-2)` base — not just a static gray block
- **Error states:** Inline error text in `#FF6B6B` below the affected field — no alert boxes
- **Empty states:** Centered illustration (simple SVG, no stock art) + a single CTA button. E.g. empty jobs list: wrench icon outline + "No active jobs" + "Create a job" button
- **High-contrast field mode:** Toggle available in settings. Increases body text to 17px, border widths to 2px, and boosts icon stroke to 2px. Critical for rooftop use in direct sunlight.

---

## PWA Configuration

- Add `manifest.json` with app name, icons, theme color (`#C8102E`), and `display: standalone`
- Register a service worker that:
  - Caches the app shell (HTML, CSS, JS)
  - Caches recently viewed jobs, products, and documents
  - Queues form submissions (orders, messages) when offline and syncs when back online
- Show an "offline mode" banner when the network is unavailable
- Prompt users to install the app to their home screen

---

## Internationalization

- Use `next-intl` for all UI strings
- Locale is detected from browser settings on first visit and stored in a cookie
- A language switcher is always accessible from the header and settings page
- All date, time, currency, and number formatting must respect the active locale
- Document downloads and video content should filter to the user's language when available

---

## Authentication & Roles

- Two roles: **Contractor** and **Carlisle Rep**
- Carlisle Reps can see all jobs across their assigned region; Contractors see only their own jobs
- Reps have access to a "Support" messaging queue to respond to contractor questions
- Use JWT-based sessions; protect all routes with middleware

---

## Key Copilot Prompting Tips

When using GitHub Copilot to build this app, use prompts like:

- *"Generate a Next.js App Router page for `/jobs/[jobId]` that fetches job details and renders a tabbed layout with tabs for Overview, Products, Orders, and Messages"*
- *"Create a React component `<VoiceSearch>` using the Web Speech API that shows a mic button, displays a live transcript, and calls `onResult(transcript)` when speech ends"*
- *"Write a Tailwind CSS bottom navigation component for mobile with 5 items, active state highlighting in Carlisle red, and icons from Lucide React"*
- *"Set up next-intl with support for en, fr, and es locales including middleware for locale detection and a language switcher component"*
- *"Create a quote builder page where users can search for products, add them to a line-item list, adjust quantities, and generate a unique shareable link using a nanoid quote ID stored in a quotes table"*
- *"Create a public-facing read-only quote view at `/quotes/[quoteId]` — no auth required — that shows line items, totals, and Carlisle branding with a 'Copy link' button"*
- *"Wire up `lib/api/products.ts` to return data from `lib/mock/products.ts` when `NEXT_PUBLIC_USE_MOCK_DATA=true`, and from a PIM REST endpoint otherwise"*

---

## Success Metrics

- Page loads in under 2 seconds on a 4G connection
- Core job and product data available offline within 30 seconds of first login
- Voice search functional and accurate in all 3 languages
- All screens usable with one thumb on a 375px screen
- Zero accessibility errors at WCAG 2.1 AA level

---

*Brief version 1.3 — Ready for GitHub Copilot*
