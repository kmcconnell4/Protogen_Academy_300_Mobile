import type { Order } from '../mock/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function getOrders(): Promise<Order[]> {
  if (USE_MOCK) return import('../mock/orders').then(m => m.orders);
  return fetch('/api/pim/orders').then(r => r.json());
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  if (USE_MOCK) {
    const { orders } = await import('../mock/orders');
    return orders.find(o => o.id === id);
  }
  return fetch(`/api/pim/orders/${id}`).then(r => r.json());
}

export async function getOrdersByJob(jobId: string): Promise<Order[]> {
  if (USE_MOCK) {
    const { orders } = await import('../mock/orders');
    return orders.filter(o => o.jobId === jobId);
  }
  return fetch(`/api/pim/orders?jobId=${jobId}`).then(r => r.json());
}

export async function createOrder(payload: Omit<Order, 'id'>): Promise<Order> {
  if (USE_MOCK) {
    const { nanoid } = await import('nanoid');
    const newOrder: Order = { ...payload, id: `order-${nanoid(8)}` };
    return newOrder;
  }
  return fetch('/api/pim/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json());
}
