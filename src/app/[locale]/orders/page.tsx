'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getOrders } from '@/lib/api/orders';
import { getJobs } from '@/lib/api/jobs';
import type { Order, Job } from '@/lib/mock/types';
import OrderTimeline from '@/components/orders/OrderTimeline';

type FilterOption = 'All' | Order['status'];

const FILTERS: FilterOption[] = ['All', 'Submitted', 'Confirmed', 'Shipped', 'Delivered'];

const STATUS_COLORS: Record<Order['status'], { bg: string; text: string }> = {
  Submitted: { bg: 'rgba(160,160,160,0.1)', text: '#8B949E' },
  Confirmed: { bg: 'rgba(0,53,145,0.15)', text: '#4D8AFF' },
  Shipped:   { bg: 'rgba(217,119,6,0.15)', text: '#FBB040' },
  Delivered: { bg: 'rgba(27,127,79,0.15)', text: '#3DD68C' },
};

export default function OrdersPage() {
  const t = useTranslations('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [jobMap, setJobMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([getOrders(), getJobs()]).then(([ordersData, jobsData]) => {
      setOrders(ordersData);
      const map: Record<string, string> = {};
      jobsData.forEach((j: Job) => { map[j.id] = j.name; });
      setJobMap(map);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return orders;
    return orders.filter(o => o.status === activeFilter);
  }, [orders, activeFilter]);

  const toggleExpand = (id: string) =>
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filterLabel = (f: FilterOption) => {
    if (f === 'All') return t('filterAll');
    if (f === 'Submitted') return t('filterSubmitted');
    if (f === 'Confirmed') return t('filterConfirmed');
    if (f === 'Shipped') return t('filterShipped');
    return t('filterDelivered');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Page header */}
      <div style={{ padding: '20px 16px 0' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {t('title')}
        </h1>
      </div>

      {/* Sticky filter row */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--bg-base)',
          padding: '12px 16px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {FILTERS.map(f => {
          const active = f === activeFilter;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                flexShrink: 0,
                height: '34px',
                padding: '0 14px',
                borderRadius: '17px',
                border: active ? '1px solid #003591' : '1px solid var(--border-default)',
                background: active ? 'rgba(0,53,145,0.18)' : 'var(--bg-surface-2)',
                color: active ? '#4D8AFF' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                transition: 'all 120ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {filterLabel(f)}
            </button>
          );
        })}
      </div>

      {/* Order cards */}
      <div style={{ padding: '4px 16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '92px',
                  background: 'var(--bg-surface)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            ))
          : filtered.map(order => {
              const expanded = expandedIds.has(order.id);
              const colors = STATUS_COLORS[order.status];

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
                  {/* Card header — tap to expand */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    style={{
                      all: 'unset',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '14px 16px',
                      width: '100%',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Order ID + status */}
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
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            background: colors.bg,
                            color: colors.text,
                          }}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Job name */}
                      <p
                        style={{
                          margin: '0 0 4px',
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {jobMap[order.jobId] ?? order.jobId}
                      </p>

                      {/* Date + total */}
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span>
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>·</span>
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                          }}
                        >
                          ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {expanded
                      ? <ChevronUp size={16} strokeWidth={1.8} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      : <ChevronDown size={16} strokeWidth={1.8} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    }
                  </button>

                  {/* Expanded content */}
                  {expanded && (
                    <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      {/* Timeline */}
                      <div style={{ padding: '16px 16px 8px' }}>
                        <OrderTimeline order={order} />
                      </div>

                      {/* Line items */}
                      <div style={{ padding: '0 16px 16px' }}>
                        <p
                          style={{
                            margin: '0 0 8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {t('lineItems')}
                        </p>
                        {order.lineItems.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              padding: '7px 0',
                              borderBottom: i < order.lineItems.length - 1
                                ? '1px solid var(--border-subtle)'
                                : 'none',
                              gap: '8px',
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'monospace',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.productId}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>
                              {item.quantity} × ${item.unitPrice.toFixed(2)}
                            </span>
                            <span
                              style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                flexShrink: 0,
                              }}
                            >
                              ${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}

                        {/* Total row */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '10px 0 0',
                            borderTop: '1px solid var(--border-default)',
                            marginTop: '4px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {t('totalAmount')}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '16px',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                            }}
                          >
                            ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

        {!loading && filtered.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '14px',
              padding: '40px 0',
            }}
          >
            No orders match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
