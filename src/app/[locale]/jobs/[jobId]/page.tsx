'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { getJobById } from '@/lib/api/jobs';
import type { Job } from '@/lib/mock/types';
import Badge from '@/components/ui/Badge';
import JobOverview from '@/components/jobs/tabs/JobOverview';
import JobProducts from '@/components/jobs/tabs/JobProducts';
import JobOrders from '@/components/jobs/tabs/JobOrders';
import JobMessages from '@/components/jobs/tabs/JobMessages';

type Tab = 'overview' | 'products' | 'orders' | 'messages';

export default function JobDetailPage() {
  const t = useTranslations('jobs');
  const { locale, jobId } = useParams<{ locale: string; jobId: string }>();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    getJobById(jobId).then(data => {
      setJob(data ?? null);
      setLoading(false);
    });
  }, [jobId]);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview', label: t('overview') },
    { key: 'products', label: t('products') },
    { key: 'orders', label: t('orders') },
    { key: 'messages', label: t('messages') },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '20px' }}>
        <div
          style={{
            height: '24px',
            width: '160px',
            background: 'var(--bg-surface-3)',
            borderRadius: '6px',
            marginBottom: '12px',
          }}
        />
        <div
          style={{
            height: '16px',
            width: '80px',
            background: 'var(--bg-surface-3)',
            borderRadius: '6px',
          }}
        />
      </div>
    );
  }

  if (!job) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-base)',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}
      >
        Job not found.
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sticky header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'var(--bg-base)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Back row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px 8px',
            gap: '10px',
          }}
        >
          <button
            onClick={() => router.push(`/${locale}/jobs`)}
            aria-label="Back to jobs"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--bg-surface-2)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={18} strokeWidth={1.8} color="var(--text-secondary)" />
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {job.name}
            </h1>
          </div>

          <Badge status={job.status} />
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            padding: '0 16px',
            gap: '0',
          }}
        >
          {TABS.map(tab => {
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flexShrink: 0,
                  height: '42px',
                  padding: '0 16px',
                  border: 'none',
                  borderBottom: active ? '2px solid #003591' : '2px solid transparent',
                  background: 'transparent',
                  color: active ? '#4D8AFF' : 'var(--text-secondary)',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: '16px' }}>
        {activeTab === 'overview' && <JobOverview job={job} />}
        {activeTab === 'products' && <JobProducts job={job} />}
        {activeTab === 'orders' && <JobOrders job={job} />}
        {activeTab === 'messages' && <JobMessages job={job} />}
      </div>
    </div>
  );
}
