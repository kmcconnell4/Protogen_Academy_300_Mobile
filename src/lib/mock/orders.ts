import type { Order } from './types';

export const orders: Order[] = [
  // ─── Riverside Commerce Center ─────────────────────────────────────
  {
    id: 'order-rcc-001',
    jobId: 'job-riverside-commerce',
    orderDate: '2026-02-14',
    status: 'Delivered',
    estimatedDelivery: '2026-02-21',
    lineItems: [
      { productId: 'hp-h-polyiso-2in',        quantity: 330, unitPrice: 42.00, lineTotal: 13860.00 },
      { productId: 'secur-shield-hd-polyiso',  quantity: 330, unitPrice: 28.50, lineTotal:  9405.00 },
      { productId: 'one-step-adhesive',        quantity:  40, unitPrice: 145.00, lineTotal:  5800.00 },
    ],
    totalAmount: 29065.00,
    trackingNumber: 'CARL-20260214-001',
    carrier: 'XPO Logistics',
  },
  {
    id: 'order-rcc-002',
    jobId: 'job-riverside-commerce',
    orderDate: '2026-03-18',
    status: 'Shipped',
    estimatedDelivery: '2026-03-26',
    lineItems: [
      { productId: 'sure-weld-tpo-60mil-white', quantity: 42000, unitPrice: 0.85, lineTotal: 35700.00 },
      { productId: 'cav-grip-iii-55g',          quantity:     7, unitPrice: 680.00, lineTotal:  4760.00 },
      { productId: 'lap-sealant',               quantity:    60, unitPrice: 12.50,  lineTotal:   750.00 },
      { productId: 'tpo-inside-corner-cfa',     quantity:    24, unitPrice: 32.00,  lineTotal:   768.00 },
    ],
    totalAmount: 41978.00,
    trackingNumber: 'CARL-20260318-002',
    carrier: 'Estes Express',
  },

  // ─── Desert Ridge Medical Center ───────────────────────────────────
  {
    id: 'order-drm-001',
    jobId: 'job-desert-ridge-medical',
    orderDate: '2026-01-20',
    status: 'Delivered',
    estimatedDelivery: '2026-01-28',
    lineItems: [
      { productId: 'hp-h-polyiso-3in',         quantity: 242, unitPrice: 58.00, lineTotal: 14036.00 },
      { productId: 'secur-shield-hd-polyiso',  quantity: 242, unitPrice: 28.50, lineTotal:  6897.00 },
      { productId: 'one-step-adhesive',        quantity:  28, unitPrice: 145.00, lineTotal:  4060.00 },
    ],
    totalAmount: 24993.00,
    trackingNumber: 'CARL-20260120-001',
    carrier: 'Old Dominion Freight',
  },
  {
    id: 'order-drm-002',
    jobId: 'job-desert-ridge-medical',
    orderDate: '2026-02-22',
    status: 'Delivered',
    estimatedDelivery: '2026-03-02',
    lineItems: [
      { productId: 'sure-white-epdm-60mil', quantity: 15500, unitPrice: 1.05, lineTotal: 16275.00 },
      { productId: 'bonding-adhesive',      quantity:   185, unitPrice: 52.00, lineTotal:  9620.00 },
    ],
    totalAmount: 25895.00,
    trackingNumber: 'CARL-20260222-001',
    carrier: 'Estes Express',
  },
  {
    id: 'order-drm-003',
    jobId: 'job-desert-ridge-medical',
    orderDate: '2026-03-28',
    status: 'Confirmed',
    estimatedDelivery: '2026-04-08',
    lineItems: [
      { productId: 'sure-white-epdm-60mil', quantity: 15500, unitPrice: 1.05, lineTotal: 16275.00 },
      { productId: 'bonding-adhesive',      quantity:   185, unitPrice: 52.00, lineTotal:  9620.00 },
      { productId: 'walkway-pads-tpo',      quantity:    32, unitPrice: 48.00, lineTotal:  1536.00 },
      { productId: 'lap-sealant',           quantity:    45, unitPrice: 12.50, lineTotal:   562.50 },
    ],
    totalAmount: 27993.50,
  },

  // ─── Atlantic Office Complex ────────────────────────────────────────
  {
    id: 'order-aoc-001',
    jobId: 'job-atlantic-office',
    orderDate: '2026-03-12',
    status: 'Delivered',
    estimatedDelivery: '2026-03-20',
    lineItems: [
      { productId: 'hp-h-polyiso-3in',         quantity: 348, unitPrice: 58.00, lineTotal: 20184.00 },
      { productId: 'secur-shield-hd-polyiso',  quantity: 348, unitPrice: 28.50, lineTotal:  9918.00 },
      { productId: 'one-step-adhesive',        quantity:  40, unitPrice: 145.00, lineTotal:  5800.00 },
    ],
    totalAmount: 35902.00,
    trackingNumber: 'CARL-20260312-001',
    carrier: 'XPO Logistics',
  },
  {
    id: 'order-aoc-002',
    jobId: 'job-atlantic-office',
    orderDate: '2026-04-02',
    status: 'Submitted',
    estimatedDelivery: '2026-04-14',
    lineItems: [
      { productId: 'sure-flex-kee-pvc-80mil',  quantity: 44500, unitPrice: 1.65, lineTotal: 73425.00 },
      { productId: 'cav-grip-iii-55g',         quantity:     9, unitPrice: 680.00, lineTotal:  6120.00 },
      { productId: 'sure-flex-pvc-pipe-flashing', quantity: 36, unitPrice: 24.00, lineTotal:   864.00 },
      { productId: 'lap-sealant',              quantity:    65, unitPrice: 12.50,  lineTotal:   812.50 },
    ],
    totalAmount: 81221.50,
  },

  // ─── Northgate Shopping Center ─────────────────────────────────────
  {
    id: 'order-nsc-001',
    jobId: 'job-northgate-shopping',
    orderDate: '2026-03-22',
    status: 'Delivered',
    estimatedDelivery: '2026-03-31',
    lineItems: [
      { productId: 'hp-h-polyiso-2in',         quantity: 524, unitPrice: 42.00, lineTotal: 22008.00 },
      { productId: 'insulbase-hd-cover-board', quantity: 524, unitPrice: 25.00, lineTotal: 13100.00 },
    ],
    totalAmount: 35108.00,
    trackingNumber: 'CARL-20260322-001',
    carrier: 'Dicom Transportation',
  },
  {
    id: 'order-nsc-002',
    jobId: 'job-northgate-shopping',
    orderDate: '2026-04-03',
    status: 'Shipped',
    estimatedDelivery: '2026-04-12',
    lineItems: [
      { productId: 'fleeceback-rapidlock-epdm', quantity: 33500, unitPrice: 2.10, lineTotal: 70350.00 },
      { productId: 'lap-sealant',               quantity:    48, unitPrice: 12.50, lineTotal:   600.00 },
      { productId: 'pressure-sensitive-tape-6in', quantity:  60, unitPrice: 62.00, lineTotal:  3720.00 },
    ],
    totalAmount: 74670.00,
    trackingNumber: 'CARL-20260403-001',
    carrier: 'Dicom Transportation',
  },
  {
    id: 'order-nsc-003',
    jobId: 'job-northgate-shopping',
    orderDate: '2026-04-14',
    status: 'Submitted',
    estimatedDelivery: '2026-04-24',
    lineItems: [
      { productId: 'fleeceback-rapidlock-epdm', quantity: 33500, unitPrice: 2.10, lineTotal: 70350.00 },
      { productId: 'pressure-sensitive-tape-6in', quantity:  60, unitPrice: 62.00, lineTotal:  3720.00 },
      { productId: 'walkway-pads-tpo',           quantity:  60, unitPrice: 48.00,  lineTotal:  2880.00 },
    ],
    totalAmount: 76950.00,
  },

  // ─── Lakeside Warehouse (Complete) ─────────────────────────────────
  {
    id: 'order-lw-001',
    jobId: 'job-lakeside-warehouse',
    orderDate: '2025-08-18',
    status: 'Delivered',
    estimatedDelivery: '2025-08-28',
    lineItems: [
      { productId: 'hp-h-polyiso-2in',         quantity: 219, unitPrice: 42.00, lineTotal:  9198.00 },
      { productId: 'insulbase-hd-cover-board', quantity: 219, unitPrice: 25.00, lineTotal:  5475.00 },
      { productId: 'one-step-adhesive',        quantity:  25, unitPrice: 145.00, lineTotal:  3625.00 },
    ],
    totalAmount: 18298.00,
    trackingNumber: 'CARL-20250818-001',
    carrier: 'Estes Express',
  },
  {
    id: 'order-lw-002',
    jobId: 'job-lakeside-warehouse',
    orderDate: '2025-09-15',
    status: 'Delivered',
    estimatedDelivery: '2025-09-24',
    lineItems: [
      { productId: 'sure-weld-sat-tpo-60mil', quantity: 28000, unitPrice: 1.10, lineTotal: 30800.00 },
      { productId: 'tpo-cut-edge-sealant',    quantity:    40, unitPrice: 18.00, lineTotal:   720.00 },
      { productId: 'walkway-pads-tpo',        quantity:    18, unitPrice: 48.00, lineTotal:   864.00 },
    ],
    totalAmount: 32384.00,
    trackingNumber: 'CARL-20250915-001',
    carrier: 'XPO Logistics',
  },

  // ─── Greenfield Elementary ─────────────────────────────────────────
  {
    id: 'order-gef-001',
    jobId: 'job-greenfield-elementary',
    orderDate: '2026-03-05',
    status: 'Confirmed',
    estimatedDelivery: '2026-06-15',
    lineItems: [
      { productId: 'sure-seal-epdm-60mil-black', quantity: 18500, unitPrice: 0.72, lineTotal: 13320.00 },
      { productId: 'hp-h-polyiso-2in',           quantity:   145, unitPrice: 42.00, lineTotal:  6090.00 },
      { productId: 'insulbase-hd-cover-board',   quantity:   145, unitPrice: 25.00, lineTotal:  3625.00 },
      { productId: 'bonding-adhesive',           quantity:   110, unitPrice: 52.00, lineTotal:  5720.00 },
    ],
    totalAmount: 28755.00,
  },
];
