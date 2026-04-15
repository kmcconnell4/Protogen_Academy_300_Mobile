'use client';

import { useTranslations } from 'next-intl';
import { Camera } from 'lucide-react';
import type { Job } from '@/lib/mock/types';

interface JobOverviewProps {
  job: Job;
}

// Map rep IDs to display names (from mock users)
const REP_NAMES: Record<string, string> = {
  'user-rep-1': 'Derek Fontaine',
  'user-rep-2': 'Priya Nair',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        padding: '12px 0',
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
        {label}
      </span>
      <span style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

export default function JobOverview({ job }: JobOverviewProps) {
  const t = useTranslations('jobs');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Detail rows */}
      <Row label={t('client')} value={job.client} />
      <Row label={t('address')} value={`${job.address}, ${job.city}, ${job.state} ${job.zip}`} />
      <Row label={t('startDate')} value={new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
      <Row label={t('endDate')} value={new Date(job.estimatedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
      <Row label={t('assignedRep')} value={REP_NAMES[job.assignedRepId] ?? job.assignedRepId} />
      <Row label={t('roofSystem')} value={job.roofSystem} />
      <Row label={t('roofArea')} value={`${job.squareFootage.toLocaleString()} sq ft`} />

      {/* Notes section */}
      <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {t('notes')}
        </span>

        <textarea
          defaultValue={job.notes}
          rows={4}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '12px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            lineHeight: 1.5,
            resize: 'vertical',
            minHeight: '100px',
            outline: 'none',
            transition: 'border-color 120ms ease',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#003591')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        />

        {/* Photo upload button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '48px',
            borderRadius: '8px',
            border: '1px dashed var(--border-default)',
            background: 'var(--bg-surface-2)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'border-color 120ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#003591')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        >
          <Camera size={16} strokeWidth={1.8} />
          {t('uploadPhoto')}
        </button>
      </div>
    </div>
  );
}
