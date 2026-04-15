import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function StatCard({ label, value, color = 'var(--text-primary)' }: StatCardProps) {
  return (
    <div
      style={{
        background: 'var(--bg-surface-2)',
        borderRadius: '10px',
        padding: '14px 12px',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
