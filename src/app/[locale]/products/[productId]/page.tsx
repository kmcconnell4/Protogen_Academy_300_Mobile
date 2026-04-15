'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, FileText, Play, Download, ShoppingCart, FileCheck } from 'lucide-react';
import { getProductById } from '@/lib/api/products';
import type { Product } from '@/lib/mock/types';
import Button from '@/components/ui/Button';

export default function ProductDetailPage() {
  const t = useTranslations('products');
  const { locale, productId } = useParams<{ locale: string; productId: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(productId).then(data => {
      setProduct(data ?? null);
      setLoading(false);
    });
  }, [productId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '20px 16px' }}>
        <div
          style={{
            height: '24px',
            width: '200px',
            background: 'var(--bg-surface-3)',
            borderRadius: '6px',
            marginBottom: '16px',
          }}
        />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: '14px',
              width: `${80 - i * 10}%`,
              background: 'var(--bg-surface-3)',
              borderRadius: '4px',
              marginBottom: '10px',
            }}
          />
        ))}
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-base)',
          padding: '40px 16px',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}
      >
        Product not found.
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: '24px' }}>
      {/* Sticky header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'var(--bg-base)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
        }}
      >
        <button
          onClick={() => router.push(`/${locale}/products`)}
          aria-label="Back to products"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: 'var(--bg-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} strokeWidth={1.8} color="var(--text-secondary)" />
        </button>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            flex: 1,
            minWidth: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.name}
        </h1>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        {/* Summary section */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '18px',
            marginBottom: '16px',
          }}
        >
          {/* Category badge */}
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: '6px',
              background: 'rgba(0,53,145,0.15)',
              color: '#4D8AFF',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            {product.category}
          </span>

          {/* Product name */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 6px',
            }}
          >
            {product.name}
          </h2>

          {/* SKU */}
          <p
            style={{
              margin: '0 0 10px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'monospace',
            }}
          >
            {t('sku')}: {product.sku}
          </p>

          {/* Price + stock row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 700,
                color: '#4D8AFF',
              }}
            >
              ${product.unitPrice.toFixed(2)}
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'var(--text-secondary)',
                  marginLeft: '4px',
                }}
              >
                / {product.unitOfMeasure}
              </span>
            </span>

            <span
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                background: product.inStock ? 'rgba(27,127,79,0.15)' : 'rgba(217,119,6,0.15)',
                color: product.inStock ? '#3DD68C' : '#FBB040',
              }}
            >
              {product.inStock ? t('inStock') : t('outOfStock')}
            </span>
          </div>
        </div>

        {/* Spec sheet */}
        {Object.keys(product.specs).length > 0 && (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                Specifications
              </span>
            </div>
            {Object.entries(product.specs).map(([key, value], i, arr) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  padding: '10px 16px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    flexShrink: 0,
                  }}
                >
                  {key}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    textAlign: 'right',
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Documents & Videos */}
        {(product.documents.length > 0 || product.videos.length > 0) && (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                {t('documents')}
              </span>
            </div>

            {/* Documents */}
            {product.documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                  transition: 'background 120ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <FileText size={18} strokeWidth={1.8} color="#4D8AFF" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {doc.title}
                  </p>
                  <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {doc.type} · {doc.fileSize} · {doc.language.toUpperCase()}
                  </p>
                </div>
                <Download size={16} strokeWidth={1.8} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              </a>
            ))}

            {/* Videos */}
            {product.videos.map(video => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                  transition: 'background 120ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Play size={14} strokeWidth={2} color="#FF4444" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {video.title}
                  </p>
                  <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {video.duration} · {video.language.toUpperCase()}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button variant="primary" size="lg" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={16} strokeWidth={2} />
            {t('addToQuote')}
          </Button>
          <Button variant="ghost" size="lg" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={16} strokeWidth={2} />
            {t('addToOrder')}
          </Button>
        </div>
      </div>
    </div>
  );
}
