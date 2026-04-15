import type { Product, ProductCategory } from '../mock/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function getProducts(): Promise<Product[]> {
  if (USE_MOCK) return import('../mock/products').then(m => m.products);
  return fetch('/api/pim/products').then(r => r.json());
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (USE_MOCK) {
    const { products } = await import('../mock/products');
    return products.find(p => p.id === id);
  }
  return fetch(`/api/pim/products/${id}`).then(r => r.json());
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  if (USE_MOCK) {
    const { products } = await import('../mock/products');
    return products.filter(p => p.category === category);
  }
  return fetch(`/api/pim/products?category=${encodeURIComponent(category)}`).then(r => r.json());
}
