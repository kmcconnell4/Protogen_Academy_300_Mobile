'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import type { Job, Order } from '@/lib/mock/types';
import { getOrdersByJob } from '@/lib/api/orders';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface JobOrdersProps {
  job: Job;
}

export default function JobOrders({ job }: JobOrdersProps) {
  const t = useTranslations('orders');
  const tJobs = useTranslations('jobs');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getOrdersByJob(job.id).then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, [job.id]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Map Order status to Badge status type
  const statusMap: Record<Order['status'], 'In Progress' | 'On Hold' | 'Complete' | 'Bidding'> = {
    Submitted: 'Bidding',
    Confirmed: 'In Progress',
    Shipped: 'In Progress',
    Delivered: 'Complete',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: '88px',
                background: 'var(--bg-surface-2)',
                borderRadius: '12px',
              }}
            />
          ))
        : orders.map(order => {
            const expanded = expandedIds.has(order.id);
            return (
              <div
                key={order.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'border-color 120ms ease',
                }}
              >
                {/* Order header row */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  style={{
                    all: 'unset',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 16px',
                    width: '100%',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '15px',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {t('orderNumber')} {order.id}
                      </span>
                      <Badge status={statusMap[order.status]} />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span>
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>·</span>
                      <span>
                        {order.lineItems.length} {t('lineItems')}
                      </span>
                      <span>·</span>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                        }}
                      >
                        ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {expanded ? (
                    <ChevronUp size={16} strokeWidth={1.8} color="var(--text-muted)" />
                  ) : (
                    <ChevronDown size={16} strokeWidth={1.8} color="var(--text-muted)" />
                  )}
                </button>

                {/* Expanded line items */}
                {expanded && (
                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      padding: '12px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {order.lineItems.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span style={{ flex: 1, marginRight: '8px' }}>
                          {item.productId}
                        </span>
                        <span style={{ flexShrink: 0 }}>
                          {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </span>
                        <span
                          style={{
                            flexShrink: 0,
                            marginLeft: '12px',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                          }}
                        >
                          ${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

      {!loading && orders.length === 0 && (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '14px',
            padding: '32px 0',
          }}
        >
          No orders for this job yet.
        </p>
      )}

      {/* Place New Order button */}
      <div style={{ paddingTop: '8px' }}>
        <Button variant="primary" size="md" style={{ width: '100%' }}>
          <Plus size={16} strokeWidth={2} style={{ marginRight: '6px' }} />
          {tJobs('placeOrder')}
        </Button>
      </div>
    </div>
  );
}
