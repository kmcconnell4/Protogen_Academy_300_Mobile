import type { Quote } from './types';

export const quotes: Quote[] = [
  {
    id: 'quote-q2026-001',
    jobId: 'job-pacific-industrial',
    createdAt: '2026-03-28T14:30:00Z',
    lineItems: [
      { productId: 'fleeceback-tpo-60mil',    quantity: 56000, unitPrice: 1.30, lineTotal: 72800.00 },
      { productId: 'hp-h-polyiso-2in',        quantity:   875, unitPrice: 42.00, lineTotal: 36750.00 },
      { productId: 'fast-adhesive',           quantity:   140, unitPrice: 185.00, lineTotal: 25900.00 },
      { productId: 'tpo-cut-edge-sealant',    quantity:    80, unitPrice: 18.00, lineTotal:  1440.00 },
      { productId: 'tpo-inside-corner-cfa',   quantity:    48, unitPrice: 32.00, lineTotal:  1536.00 },
    ],
    subtotal: 138426.00,
    shareUrl: 'http://localhost:3000/en/quotes/quote-q2026-001/view',
  },
  {
    id: 'quote-q2026-002',
    jobId: 'job-sunbelt-distribution',
    createdAt: '2026-04-01T09:15:00Z',
    lineItems: [
      { productId: 'sure-weld-tpo-80mil',      quantity: 88000, unitPrice: 1.35, lineTotal: 118800.00 },
      { productId: 'hp-h-polyiso-2in',         quantity:  1375, unitPrice: 42.00, lineTotal:  57750.00 },
      { productId: 'secur-shield-hd-polyiso',  quantity:  1375, unitPrice: 28.50, lineTotal:  39187.50 },
      { productId: 'tpo-cut-edge-sealant',     quantity:   125, unitPrice: 18.00, lineTotal:   2250.00 },
      { productId: 'walkway-pads-tpo',         quantity:    80, unitPrice: 48.00, lineTotal:   3840.00 },
    ],
    subtotal: 221827.50,
    shareUrl: 'http://localhost:3000/en/quotes/quote-q2026-002/view',
  },
  {
    id: 'quote-q2026-003',
    createdAt: '2026-04-10T11:00:00Z',
    lineItems: [
      { productId: 'sure-seal-epdm-60mil-black', quantity: 12000, unitPrice: 0.72, lineTotal: 8640.00, notes: 'Phase 1 only — north quadrant' },
      { productId: 'bonding-adhesive',           quantity:   145, unitPrice: 52.00, lineTotal: 7540.00 },
      { productId: 'secur-shield-hd-polyiso',    quantity:   190, unitPrice: 28.50, lineTotal: 5415.00 },
      { productId: 'lap-sealant',                quantity:    18, unitPrice: 12.50, lineTotal:  225.00 },
    ],
    subtotal: 21820.00,
    shareUrl: 'http://localhost:3000/en/quotes/quote-q2026-003/view',
  },
  {
    id: 'quote-q2026-004',
    jobId: 'job-lakeside-warehouse',
    createdAt: '2025-08-10T08:45:00Z',
    lineItems: [
      { productId: 'sure-weld-sat-tpo-60mil', quantity: 28000, unitPrice: 1.10, lineTotal: 30800.00 },
      { productId: 'hp-h-polyiso-2in',        quantity:   438, unitPrice: 42.00, lineTotal: 18396.00 },
      { productId: 'insulbase-hd-cover-board', quantity:  438, unitPrice: 25.00, lineTotal: 10950.00 },
      { productId: 'tpo-cut-edge-sealant',    quantity:    40, unitPrice: 18.00, lineTotal:   720.00 },
      { productId: 'walkway-pads-tpo',        quantity:    18, unitPrice: 48.00, lineTotal:   864.00 },
    ],
    subtotal: 61730.00,
    shareUrl: 'http://localhost:3000/en/quotes/quote-q2026-004/view',
    convertedToOrderId: 'order-lw-001',
  },
];
