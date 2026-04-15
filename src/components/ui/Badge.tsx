import React from 'react';

type BadgeStatus = 'In Progress' | 'On Hold' | 'Complete' | 'Bidding';

interface BadgeProps {
  status: BadgeStatus;
}

const statusStyles: Record<BadgeStatus, React.CSSProperties> = {
  'In Progress': {
    background: 'rgba(0, 53, 145, 0.15)',
    color: '#4D8AFF',
  },
  'Complete': {
    background: 'rgba(27, 127, 79, 0.15)',
    color: '#3DD68C',
  },
  'On Hold': {
    background: 'rgba(217, 119, 6, 0.15)',
    color: '#FBB040',
  },
  'Bidding': {
    background: 'rgba(160, 160, 160, 0.1)',
    color: '#8B949E',
  },
};

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      aria-label={`Status: ${status}`}
      style={{
        display: 'inline-block',
        borderRadius: '6px',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        ...statusStyles[status],
      }}
    >
      {status}
    </span>
  );
}
