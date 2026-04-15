'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Minus, Plus, Trash2, Link, Check } from 'lucide-react';
import { getJobs } from '@/lib/api/jobs';
import { getProducts } from '@/lib/api/products';
import { createQuote } from '@/lib/api/quotes';
import type { Job, Product, QuoteLineItem } from '@/lib/mock/types';
import Button from '@/components/ui/Button';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';

interface LineItem extends QuoteLineItem {
  productName: string;
  productSku: string;
}

export default function NewQuotePage() {
  const t = useTranslations('quotes');

  const [jobs, setJobs] = useState<Job[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [query, setQuery] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getJobs(), getProducts()]).then(([j, p]) => {
      setJobs(j);
      setProducts(p);
    });
  }, []);

  // Filter product search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [products, query]);

  const addProduct = (product: Product) => {
    setLineItems(prev => {
      const existing = prev.find(li => li.productId === product.id);
      if (existing) {
        return prev.map(li =>
          li.productId === product.id
            ? { ...li, quantity: li.quantity + 1, lineTotal: (li.quantity + 1) * li.unitPrice }
            : li
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          quantity: 1,
          unitPrice: product.unitPrice,
          lineTotal: product.unitPrice,
        },
      ];
    });
    setQuery('');
  };

  const updateQty = (productId: string, delta: number) => {
    setLineItems(prev =>
      prev
        .map(li => {
          if (li.productId !== productId) return li;
          const newQty = li.quantity + delta;
          if (newQty < 1) return li;
          return { ...li, quantity: newQty, lineTotal: newQty * li.unitPrice };
        })
    );
  };

  const removeItem = (productId: string) => {
    setLineItems(prev => prev.filter(li => li.productId !== productId));
  };

  const subtotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);

  const handleGenerate = async () => {
    if (lineItems.length === 0) return;
    setGenerating(true);
    try {
      const quote = await createQuote({
        ...(selectedJobId ? { jobId: selectedJobId } : {}),
        createdAt: new Date().toISOString(),
        lineItems: lineItems.map((li) => ({
          productId: li.productId,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          lineTotal: li.lineTotal,
          ...(li.notes ? { notes: li.notes } : {}),
        })),
        subtotal,
      });
      setShareUrl(quote.shareUrl);
      await navigator.clipboard.writeText(quote.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 16px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {t('new')}
        </h1>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Job selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            {t('selectJob')}
          </label>
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            style={{
              height: '48px',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0 12px',
              color: selectedJobId ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">— {t('selectJob')} —</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            {t('searchProducts')}
          </label>
          <GlobalSearchBar onSearch={setQuery} showVoice={false} />

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {searchResults.map(product => (
                <button
                  key={product.id}
                  onClick={() => addProduct(product)}
                  style={{
                    all: 'unset',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '12px 14px',
                    width: '100%',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background 120ms ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '14px',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {product.name}
                    </p>
                    <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {product.sku}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                      ${product.unitPrice.toFixed(2)}
                    </span>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#003591',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={14} strokeWidth={2.5} color="#fff" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Line items table */}
        {lineItems.length > 0 && (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {lineItems.map((item, i) => (
              <div
                key={item.productId}
                style={{
                  padding: '12px 14px',
                  borderBottom:
                    i < lineItems.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {/* Name + remove */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '14px',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.productName}
                    </p>
                    <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {item.productSku}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remove item"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'rgba(217,119,6,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 size={13} strokeWidth={2} color="#FBB040" />
                  </button>
                </div>

                {/* Qty stepper + line total */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Stepper */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0',
                      border: '1px solid var(--border-default)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: '40px',
                    }}
                  >
                    <button
                      onClick={() => updateQty(item.productId, -1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      style={{
                        width: '48px',
                        height: '40px',
                        border: 'none',
                        background: 'var(--bg-surface-2)',
                        color: item.quantity <= 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
                        cursor: item.quantity <= 1 ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Minus size={14} strokeWidth={2} />
                    </button>
                    <span
                      style={{
                        width: '52px',
                        textAlign: 'center',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        borderLeft: '1px solid var(--border-subtle)',
                        borderRight: '1px solid var(--border-subtle)',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.productId, 1)}
                      aria-label="Increase quantity"
                      style={{
                        width: '48px',
                        height: '40px',
                        border: 'none',
                        background: 'var(--bg-surface-2)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={14} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Line total */}
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    ${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
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
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
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
                ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        {/* Share URL confirmation */}
        {shareUrl && (
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
            <Check size={16} strokeWidth={2.5} color="#3DD68C" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#3DD68C', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {shareUrl}
            </span>
          </div>
        )}

        {/* Generate button */}
        <Button
          variant="primary"
          size="lg"
          disabled={lineItems.length === 0 || generating}
          onClick={handleGenerate}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: lineItems.length === 0 ? 0.5 : 1,
          }}
        >
          {copied ? (
            <>
              <Check size={16} strokeWidth={2.5} />
              {t('linkCopied')}
            </>
          ) : (
            <>
              <Link size={16} strokeWidth={2} />
              {generating ? '…' : t('generateLink')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
