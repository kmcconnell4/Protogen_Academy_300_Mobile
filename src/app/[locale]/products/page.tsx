'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Package } from 'lucide-react';
import { getProducts } from '@/lib/api/products';
import type { Product, ProductCategory } from '@/lib/mock/types';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';

const ALL_CATEGORIES: ProductCategory[] = [
  'TPO Membranes',
  'EPDM Membranes',
  'PVC Membranes',
  'FleeceBACK Systems',
  'Insulation',
  'Adhesives & Primers',
  'Sealants & Tapes',
  'Accessories & Flashings',
  'Metal Roofing',
  'Roof Garden Systems',
];

export default function ProductsPage() {
  const t = useTranslations('products');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCategory = !activeCategory || p.category === activeCategory;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.includes(q));
      return matchCategory && matchQuery;
    });
  }, [products, query, activeCategory]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Page header */}
      <div style={{ padding: '20px 16px 12px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 12px',
          }}
        >
          {t('title')}
        </h1>

        {/* Search — voice disabled per step 8.1 spec */}
        <GlobalSearchBar onSearch={setQuery} showVoice={false} />
      </div>

      {/* Horizontal category filter */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          padding: '4px 16px 12px',
        }}
      >
        {/* "All" pill */}
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            flexShrink: 0,
            height: '32px',
            padding: '0 14px',
            borderRadius: '16px',
            border: !activeCategory
              ? '1px solid #003591'
              : '1px solid var(--border-default)',
            background: !activeCategory ? 'rgba(0,53,145,0.18)' : 'var(--bg-surface-2)',
            color: !activeCategory ? '#4D8AFF' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: !activeCategory ? 600 : 400,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            transition: 'all 120ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          All
        </button>

        {ALL_CATEGORIES.map(cat => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(active ? null : cat)}
              style={{
                flexShrink: 0,
                height: '32px',
                padding: '0 14px',
                borderRadius: '16px',
                border: active
                  ? '1px solid #003591'
                  : '1px solid var(--border-default)',
                background: active ? 'rgba(0,53,145,0.18)' : 'var(--bg-surface-2)',
                color: active ? '#4D8AFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: active ? 600 : 400,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                transition: 'all 120ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div style={{ padding: '0 16px 8px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {loading ? '…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Product list */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '60px',
                  margin: '0 16px 8px',
                  background: 'var(--bg-surface-2)',
                  borderRadius: '8px',
                }}
              />
            ))
          : filtered.map(product => (
              <button
                key={product.id}
                onClick={() => router.push(`/${locale}/products/${product.id}`)}
                style={{
                  all: 'unset',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'background 120ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Blue icon box */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(0,53,145,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Package size={18} strokeWidth={1.8} color="#4D8AFF" />
                </div>

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
                    {product.name}
                  </p>
                  <p
                    style={{
                      margin: '2px 0 0',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {product.sku}
                  </p>
                </div>

                {/* Unit price */}
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    flexShrink: 0,
                  }}
                >
                  ${product.unitPrice.toFixed(2)}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 400,
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    /{product.unitOfMeasure}
                  </span>
                </span>
              </button>
            ))}

        {!loading && filtered.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '14px',
              padding: '40px 0',
            }}
          >
            No products match your search.
          </p>
        )}
      </div>
    </div>
  );
}
