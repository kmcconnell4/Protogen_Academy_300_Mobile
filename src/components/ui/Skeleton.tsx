import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({ width = '100%', height = '16px', className, style }: SkeletonProps) {
  return (
    <div
      className={`shimmer${className ? ` ${className}` : ''}`}
      style={{
        width,
        height,
        borderRadius: '4px',
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '20px',
      }}
      aria-hidden="true"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <Skeleton width="55%" height="18px" />
        <Skeleton width="72px" height="20px" style={{ borderRadius: '6px' }} />
      </div>
      <Skeleton width="40%" height="13px" style={{ marginBottom: '16px' }} />
      <div style={{ display: 'flex', gap: '16px' }}>
        <Skeleton width="80px" height="36px" />
        <Skeleton width="80px" height="36px" />
      </div>
    </div>
  );
}

export function SkeletonJobRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 0',
        borderBottom: '1px solid var(--border-subtle)',
      }}
      aria-hidden="true"
    >
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height="16px" style={{ marginBottom: '8px' }} />
        <Skeleton width="40%" height="13px" />
      </div>
      <Skeleton width="72px" height="20px" style={{ borderRadius: '6px' }} />
      <Skeleton width="16px" height="16px" style={{ borderRadius: '2px' }} />
    </div>
  );
}
