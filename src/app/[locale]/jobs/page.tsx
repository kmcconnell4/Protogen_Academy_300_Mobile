'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { getJobs } from '@/lib/api/jobs';
import type { Job } from '@/lib/mock/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';

type FilterOption = 'All' | 'In Progress' | 'On Hold' | 'Complete';

const FILTERS: FilterOption[] = ['All', 'In Progress', 'On Hold', 'Complete'];

export default function JobsPage() {
  const t = useTranslations('jobs');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  useEffect(() => {
    getJobs().then(data => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  const filterLabel = (f: FilterOption) => {
    if (f === 'All') return t('filterAll');
    if (f === 'In Progress') return t('filterInProgress');
    if (f === 'On Hold') return t('filterOnHold');
    return t('filterComplete');
  };

  const filtered = activeFilter === 'All' ? jobs : jobs.filter(j => j.status === activeFilter);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Page header */}
      <div
        style={{
          padding: '20px 20px 0',
          background: 'var(--bg-base)',
        }}
      >
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

      {/* Sticky filter bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--bg-base)',
          padding: '12px 20px 12px',
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
                border: active
                  ? '1px solid #003591'
                  : '1px solid var(--border-default)',
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

      {/* Job list */}
      <div style={{ padding: '4px 16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map(job => (
              <button
                key={job.id}
                onClick={() => router.push(`/${locale}/jobs/${job.id}`)}
                style={{
                  all: 'unset',
                  display: 'block',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <Card accent>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Left content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                          marginBottom: '6px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '16px',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                          }}
                        >
                          {job.name}
                        </span>
                        <Badge status={job.status} />
                      </div>

                      <p
                        style={{
                          margin: '0 0 8px',
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {job.city}, {job.state} · {job.roofSystem}
                      </p>

                      {/* Square footage stat */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '22px',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            lineHeight: 1,
                          }}
                        >
                          {job.squareFootage.toLocaleString()}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {t('roofArea')}
                        </span>
                      </div>
                    </div>

                    {/* Chevron */}
                    <ChevronRight
                      size={18}
                      strokeWidth={1.8}
                      color="var(--text-muted)"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    />
                  </div>
                </Card>
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
            No jobs match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
