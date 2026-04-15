import type { Quote } from '../mock/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function getQuoteById(id: string): Promise<Quote | undefined> {
  if (USE_MOCK) {
    const { quotes } = await import('../mock/quotes');
    return quotes.find(q => q.id === id);
  }
  return fetch(`/api/pim/quotes/${id}`).then(r => r.json());
}

export async function createQuote(payload: Omit<Quote, 'id' | 'shareUrl'>): Promise<Quote> {
  if (USE_MOCK) {
    const { nanoid } = await import('nanoid');
    const id = `quote-${nanoid(8)}`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const newQuote: Quote = {
      ...payload,
      id,
      shareUrl: `${baseUrl}/en/quotes/${id}/view`,
    };
    return newQuote;
  }
  return fetch('/api/pim/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json());
}

export async function convertQuoteToOrder(quoteId: string): Promise<{ orderId: string }> {
  if (USE_MOCK) {
    const { nanoid } = await import('nanoid');
    return { orderId: `order-${nanoid(8)}` };
  }
  return fetch(`/api/pim/quotes/${quoteId}/convert`, { method: 'POST' }).then(r => r.json());
}
