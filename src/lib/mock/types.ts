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
  url: string;
  fileSize: string;
}

export interface ProductVideo {
  id: string;
  title: string;
  language: 'en' | 'fr' | 'es';
  youtubeId: string;
  duration: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  specs: Record<string, string>;
  unitOfMeasure: string;
  unitPrice: number;
  inStock: boolean;
  tags: string[];
  documents: ProductDocument[];
  videos: ProductVideo[];
  relatedProductIds: string[];
  languages: ('en' | 'fr' | 'es')[];
}

export interface JobProduct {
  productId: string;
  quantity: number;
  unit: string;
}

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
  startDate: string;
  estimatedEndDate: string;
  squareFootage: number;
  roofSystem: string;
  assignedContractorId: string;
  assignedRepId: string;
  productLineItems: JobProduct[];
  orderIds: string[];
  notes: string;
  photos: string[];
}

export interface OrderLineItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

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

export interface QuoteLineItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  notes?: string;
}

export interface Quote {
  id: string;
  jobId?: string;
  createdAt: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  shareUrl: string;
  convertedToOrderId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'contractor' | 'rep';
  company: string;
  region: 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'West' | 'Canada';
  assignedJobIds: string[];
}
