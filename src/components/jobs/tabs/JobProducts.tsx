'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight, Plus } from 'lucide-react';
import type { Job, Product } from '@/lib/mock/types';
import { getProductById } from '@/lib/api/products';
import Button from '@/components/ui/Button';

interface JobProductsProps {
  job: Job;
}

interface ResolvedProduct {
  product: Product | undefined;
  quantity: number;
  unit: string;
}

export default function JobProducts({ job }: JobProductsProps) {
  const t = useTranslations('jobs');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const [resolved, setResolved] = useState<ResolvedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      job.productLineItems.map(async item => ({
        product: await getProductById(item.productId),
        quantity: item.quantity,
        unit: item.unit,
      }))
    ).then(data => {
      setResolved(data);
      setLoading(false);
    });
  }, [job]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: '64px',
                background: 'var(--bg-surface-2)',
                borderRadius: '6px',
                marginBottom: '8px',
              }}
            />
          ))
        : resolved.map(({ product, quantity, unit }, i) => (
            <button
              key={i}
              onClick={() =>
                product && router.push(`/${locale}/products/${product.id}`)
              }
              disabled={!product}
              style={{
                all: 'unset',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 0',
                borderBottom: '1px solid var(--border-subtle)',
                cursor: product ? 'pointer' : 'default',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Product info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {product?.name ?? 'Unknown Product'}
                </p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    fontFamily: 'monospace',
                  }}
                >
                  {product?.sku ?? '—'}
                </p>
              </div>

              {/* Quantity */}
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  flexShrink: 0,
                }}
              >
                {quantity.toLocaleString()} {unit}
              </span>

              {/* Chevron */}
              {product && (
                <ChevronRight
                  size={16}
                  strokeWidth={1.8}
                  color="var(--text-muted)"
                  style={{ flexShrink: 0 }}
                />
              )}
            </button>
          ))}

      {/* Add Product button */}
      <div style={{ paddingTop: '20px' }}>
        <Button variant="primary" size="md" style={{ width: '100%' }}>
          <Plus size={16} strokeWidth={2} style={{ marginRight: '6px' }} />
          {t('addProduct')}
        </Button>
      </div>
    </div>
  );
}
