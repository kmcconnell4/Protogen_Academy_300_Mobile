'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link2, Check, FileCheck } from 'lucide-react';
import { getQuoteById, convertQuoteToOrder } from '@/lib/api/quotes';
import { getJobById } from '@/lib/api/jobs';
import { getProductById } from '@/lib/api/products';
import { useAuth } from '@clerk/nextjs';
import type { Quote, Product, Job } from '@/lib/mock/types';
import Button from '@/components/ui/Button';

const clerkEnabled = (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '').startsWith('pk_');

interface ResolvedLineItem {
  product: Product | undefined;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  notes?: string;
}

function QuoteContent({ isSignedIn }: { isSignedIn: boolean }) {
  const t = useTranslations('quotes');
  const { quoteId } = useParams<{ quoteId: string }>();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [lineItems, setLineItems] = useState<ResolvedLineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertedOrderId, setConvertedOrderId] = useState<string | null>(null);

  useEffect(() => {
    getQuoteById(quoteId).then(async data => {
      if (!data) {
        setLoading(false);
        return;
      }
      setQuote(data);

      // Resolve job name
      if (data.jobId) {
        const jobData = await getJobById(data.jobId);
        setJob(jobData ?? null);
      }

      // Resolve product details for each line item
      const resolved = await Promise.all(
        data.lineItems.map(async item => ({
          product: await getProductById(item.productId),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          notes: item.notes,
        }))
      );
      setLineItems(resolved);
      setLoading(false);
    });
  }, [quoteId]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleConvert = async () => {
    if (!quote) return;
    setConverting(true);
    try {
      const result = await convertQuoteToOrder(quote.id);
      setConvertedOrderId(result.orderId);
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '40px 16px' }}>
        <div style={{ height: '28px', width: '180px', background: 'var(--bg-surface-3)', borderRadius: '6px', marginBottom: '20px' }} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ height: '14px', width: `${85 - i * 15}%`, background: 'var(--bg-surface-3)', borderRadius: '4px', marginBottom: '10px' }} />
        ))}
      </div>
    );
  }

  if (!quote) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Quote not found.
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: '40px' }}>
      {/* Header */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '20px 20px 16px',
        }}
      >
        {/* Carlisle SynTec wordmark */}
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '18px',
            color: '#003591',
            margin: '0 0 12px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Carlisle SynTec
        </p>

        {/* Quote meta */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 6px',
          }}
        >
          {t('quoteNumber')} {quote.id}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {t('quoteDate')}:{' '}
            {new Date(quote.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          {job && (
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {job.name} — {job.city}, {job.state}
            </span>
          )}
        </div>

        {/* Copy Link button */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
          <button
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '36px',
              padding: '0 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface-2)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 120ms ease',
            }}
          >
            {copied
              ? <><Check size={14} strokeWidth={2.5} color="#3DD68C" /> <span style={{ color: '#3DD68C' }}>{t('linkCopied')}</span></>
              : <><Link2 size={14} strokeWidth={1.8} /> {t('copyLink')}</>
            }
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        {/* Line item table */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto auto',
              gap: '8px',
              padding: '10px 14px',
              borderBottom: '1px solid var(--border-default)',
              background: 'var(--bg-surface-2)',
            }}
          >
            {['Product', t('quantity'), t('unitPrice'), t('lineTotal')].map(h => (
              <span
                key={h}
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  textAlign: h === 'Product' ? 'left' : 'right',
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {lineItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: '8px',
                padding: '12px 14px',
                borderBottom: i < lineItems.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                alignItems: 'start',
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.product?.name ?? item.lineTotal}
                </p>
                <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {item.product?.sku ?? '—'}
                </p>
                {item.notes && (
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    {item.notes}
                  </p>
                )}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>
                {item.quantity.toLocaleString()}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>
                ${item.unitPrice.toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textAlign: 'right',
                }}
              >
                ${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}

          {/* Subtotal */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px',
              borderTop: '1px solid var(--border-default)',
              background: 'var(--bg-surface-2)',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {t('subtotal')}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                color: '#4D8AFF',
              }}
            >
              ${quote.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Convert to Order — only for signed-in users */}
        {isSignedIn && !quote.convertedToOrderId && !convertedOrderId && (
          <Button
            variant="primary"
            size="lg"
            onClick={handleConvert}
            disabled={converting}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <FileCheck size={16} strokeWidth={2} />
            {converting ? '…' : t('convertToOrder')}
          </Button>
        )}

        {(quote.convertedToOrderId || convertedOrderId) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(27,127,79,0.12)',
              border: '1px solid rgba(61,214,140,0.3)',
              borderRadius: '10px',
            }}
          >
            <Check size={16} strokeWidth={2.5} color="#3DD68C" />
            <span style={{ fontSize: '13px', color: '#3DD68C' }}>
              Converted — Order {convertedOrderId ?? quote.convertedToOrderId}
            </span>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '14px',
              color: '#003591',
              margin: '0 0 4px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Carlisle SynTec Systems
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            1285 Ritner Highway, Carlisle, PA 17013
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            1-800-479-6832 · www.carlislesyntec.com
          </p>
        </div>
      </div>
    </div>
  );
}

function QuoteWithAuth() {
  const { isSignedIn } = useAuth();
  return <QuoteContent isSignedIn={isSignedIn ?? false} />;
}

export default function QuoteViewPage() {
  if (clerkEnabled) return <QuoteWithAuth />;
  return <QuoteContent isSignedIn={false} />;
}
