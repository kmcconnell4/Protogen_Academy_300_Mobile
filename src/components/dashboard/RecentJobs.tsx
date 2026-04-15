import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ChevronRight } from 'lucide-react';
import type { Job } from '@/lib/mock/types';

interface RecentJobsProps {
  jobs: Job[];
}

export default function RecentJobs({ jobs }: RecentJobsProps) {
  const t = useTranslations('jobs');
  const locale = useLocale();
  const recent = jobs.slice(0, 3);

  if (recent.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 24px',
          color: 'var(--text-muted)',
          fontSize: '15px',
        }}
      >
        No active jobs
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {recent.map(job => (
        <Link
          key={job.id}
          href={`/${locale}/jobs/${job.id}`}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <Card accent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  flex: 1,
                  marginRight: '8px',
                }}
              >
                {job.name}
              </span>
              <Badge status={job.status} />
            </div>

            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: '0 0 12px',
              }}
            >
              {job.city}, {job.state} · {job.roofSystem}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    margin: '0 0 2px',
                  }}
                >
                  {t('roofArea')}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '28px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  {job.squareFootage.toLocaleString()} SF
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {t('endDate')}: {new Date(job.estimatedEndDate).toLocaleDateString()}
                </span>
                <ChevronRight size={16} strokeWidth={1.8} color="var(--text-muted)" />
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
