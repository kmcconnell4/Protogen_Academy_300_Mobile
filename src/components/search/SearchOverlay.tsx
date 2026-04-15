'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X, Briefcase, Package, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getJobs } from '@/lib/api/jobs';
import { getProducts } from '@/lib/api/products';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';
import type { Job, Product } from '@/lib/mock/types';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const RECENT_KEY = 'ccm_recent_searches';
const MAX_RECENT = 6;

function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  const existing = getRecent().filter(q => q !== query);
  const next = [query, ...existing].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const t = useTranslations('search');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data once on mount
  useEffect(() => {
    if (dataLoaded) return;
    Promise.all([getJobs(), getProducts()]).then(([j, p]) => {
      setJobs(j);
      setProducts(p);
      setDataLoaded(true);
    });
  }, [dataLoaded]);

  // Load recent searches when overlay opens
  useEffect(() => {
    if (open) setRecentSearches(getRecent());
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSearch = useCallback((q: string) => setQuery(q), []);

  const jobResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return jobs
      .filter(j => j.name.toLowerCase().includes(q) || j.city.toLowerCase().includes(q) || j.roofSystem.toLowerCase().includes(q))
      .slice(0, 3);
  }, [jobs, query]);

  const productResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 3);
  }, [products, query]);

  const navigate = (path: string) => {
    if (query.trim()) saveRecent(query.trim());
    onClose();
    setQuery('');
    router.push(`/${locale}${path}`);
  };

  const applyRecent = (q: string) => {
    setQuery(q);
  };

  const hasResults = jobResults.length > 0 || productResults.length > 0;
  const showEmpty = query.trim() && !hasResults;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              zIndex: 49,
            }}
          />

          {/* Panel */}
          <motion.div
            key="overlay-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              background: 'var(--bg-base)',
              borderBottom: '1px solid var(--border-default)',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              maxHeight: '82vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Search bar row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 16px',
              }}
            >
              <div style={{ flex: 1 }}>
                <GlobalSearchBar onSearch={handleSearch} showVoice />
              </div>
              <button
                onClick={onClose}
                aria-label="Close search"
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
                <X size={16} strokeWidth={2} color="var(--text-secondary)" />
              </button>
            </div>

            {/* Scrollable results */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '0 0 16px' }}>

              {/* Recent searches — shown when input is empty */}
              {!query.trim() && recentSearches.length > 0 && (
                <section style={{ marginBottom: '8px' }}>
                  <SectionLabel label={t('recentSearches')} />
                  {recentSearches.map(recent => (
                    <ResultRow
                      key={recent}
                      icon={<Clock size={16} strokeWidth={1.8} color="var(--text-muted)" />}
                      primary={recent}
                      onClick={() => applyRecent(recent)}
                    />
                  ))}
                </section>
              )}

              {/* Jobs results */}
              {jobResults.length > 0 && (
                <section style={{ marginBottom: '8px' }}>
                  <SectionLabel label={t('resultsJobs')} />
                  {jobResults.map(job => (
                    <ResultRow
                      key={job.id}
                      icon={<Briefcase size={16} strokeWidth={1.8} color="#4D8AFF" />}
                      primary={job.name}
                      secondary={`${job.status} · ${job.city}, ${job.state}`}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    />
                  ))}
                </section>
              )}

              {/* Products results */}
              {productResults.length > 0 && (
                <section style={{ marginBottom: '8px' }}>
                  <SectionLabel label={t('resultsProducts')} />
                  {productResults.map(product => (
                    <ResultRow
                      key={product.id}
                      icon={<Package size={16} strokeWidth={1.8} color="#4D8AFF" />}
                      primary={product.name}
                      secondary={`${product.category} · ${product.sku}`}
                      onClick={() => navigate(`/products/${product.id}`)}
                    />
                  ))}
                </section>
              )}

              {/* No results */}
              {showEmpty && (
                <p
                  style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    padding: '32px 0',
                  }}
                >
                  {t('noResults')}
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ padding: '6px 16px 4px' }}>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function ResultRow({
  icon,
  primary,
  secondary,
  onClick,
}: {
  icon: React.ReactNode;
  primary: string;
  secondary?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'background 120ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ flexShrink: 0 }}>{icon}</span>
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
          {primary}
        </p>
        {secondary && (
          <p
            style={{
              margin: '1px 0 0',
              fontSize: '12px',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {secondary}
          </p>
        )}
      </div>
    </button>
  );
}
