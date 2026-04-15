import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
  children: React.ReactNode;
}

export default function Card({ accent = false, children, style, ...props }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderLeft: accent ? '3px solid #003591' : '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '20px',
        transition: 'border-color 120ms ease, background 120ms ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--border-default)';
        el.style.background = 'var(--bg-surface-2)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = accent ? '' : 'var(--border-subtle)';
        el.style.background = 'var(--bg-surface)';
        if (accent) {
          el.style.borderLeft = '3px solid #003591';
        }
      }}
      onTouchStart={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(0.985)';
      }}
      onTouchEnd={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
      }}
      {...props}
    >
      {children}
    </div>
  );
}
