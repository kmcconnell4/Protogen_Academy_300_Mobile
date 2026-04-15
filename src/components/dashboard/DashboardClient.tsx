'use client';

import { useUser } from '@clerk/nextjs';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import StatGrid from './StatGrid';
import RecentJobs from './RecentJobs';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';
import Button from '@/components/ui/Button';
import type { Job, Order } from '@/lib/mock/types';

interface DashboardClientProps {
  jobs: Job[];
  orders: Order[];
}

export default function DashboardClient({ jobs, orders }: DashboardClientProps) {
  const { user } = useUser();
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const router = useRouter();

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.firstName?.[0]?.toUpperCase() ?? '?';

  const firstName = user?.firstName ?? '';

  return (
    <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Greeting header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {t('greeting', { name: firstName })}
        </h1>

        {/* Avatar initials */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#003591',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '15px',
            color: '#fff',
            flexShrink: 0,
          }}
          aria-label={`User avatar: ${initials}`}
        >
          {initials}
        </div>
      </div>

      {/* Search bar */}
      <GlobalSearchBar
        showVoice
        onSearch={query => {
          if (query.trim().length > 1) {
            router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
          }
        }}
      />

      {/* Stat cards */}
      <StatGrid jobs={jobs} orders={orders} />

      {/* Recent Jobs */}
      <section>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            margin: '0 0 12px',
          }}
        >
          {t('recentJobs')}
        </h2>
        <RecentJobs jobs={jobs.filter(j => j.status === 'In Progress')} />
      </section>

      {/* Quick Actions */}
      <section>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            margin: '0 0 12px',
          }}
        >
          {t('quickActions')}
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="ghost"
            size="sm"
            style={{ flex: 1 }}
            onClick={() => router.push(`/${locale}/quotes/new`)}
          >
            {t('newQuote')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            style={{ flex: 1 }}
            onClick={() => alert('QR scanner coming in next phase')}
          >
            {t('scanQR')}
          </Button>
        </div>
      </section>
    </div>
  );
}
