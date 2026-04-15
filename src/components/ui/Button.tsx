import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '10px 16px', fontSize: '12px' },
  md: { padding: '12px 24px', fontSize: '14px' },
  lg: { padding: '14px 32px', fontSize: '15px' },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#003591',
    color: '#FFFFFF',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: '#003591',
    border: '1px solid #003591',
  },
  ghost: {
    background: 'var(--bg-surface-3)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-subtle)',
  },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        minHeight: '48px',
        borderRadius: '8px',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'background 100ms ease, transform 80ms ease, border-color 120ms ease',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
        if (variant === 'primary') {
          (e.currentTarget as HTMLButtonElement).style.background = '#002570';
        }
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        if (variant === 'primary') {
          (e.currentTarget as HTMLButtonElement).style.background = '#003591';
        }
      }}
      onTouchStart={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
        if (variant === 'primary') {
          (e.currentTarget as HTMLButtonElement).style.background = '#002570';
        }
      }}
      onTouchEnd={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        if (variant === 'primary') {
          (e.currentTarget as HTMLButtonElement).style.background = '#003591';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
