'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Hammer, Package, ClipboardList, MessageSquare, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NavItem {
  key: string;
  labelKey: string;
  href: string;
  Icon: LucideIcon;
}

const navItems: NavItem[] = [
  { key: 'home',     labelKey: 'home',     href: 'dashboard', Icon: Home },
  { key: 'jobs',     labelKey: 'jobs',     href: 'jobs',      Icon: Hammer },
  { key: 'products', labelKey: 'products', href: 'products',  Icon: Package },
  { key: 'orders',   labelKey: 'orders',   href: 'orders',    Icon: ClipboardList },
  { key: 'messages', labelKey: 'messages', href: 'messages',  Icon: MessageSquare },
];

export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  // Extract locale from /en/dashboard etc.
  const localePart = pathname.split('/')[1] ?? 'en';

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        paddingTop: '8px',
        zIndex: 50,
      }}
    >
      {navItems.map(({ key, labelKey, href, Icon }) => {
        const fullHref = `/${localePart}/${href}`;
        const isActive = pathname.includes(`/${href}`);
        const color = isActive ? '#4D8AFF' : 'var(--text-muted)';

        return (
          <Link
            key={key}
            href={fullHref}
            aria-label={t(labelKey as Parameters<typeof t>[0])}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              flex: 1,
              minHeight: '48px',
              textDecoration: 'none',
              color,
              transition: 'color 120ms ease',
            }}
          >
            {/* Active top-line indicator */}
            <span
              style={{
                display: 'block',
                width: '24px',
                height: '2px',
                background: '#003591',
                borderRadius: '2px',
                marginBottom: '2px',
                transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 150ms ease',
              }}
            />
            <span
              style={{
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 120ms ease',
                display: 'flex',
              }}
            >
              <Icon size={20} strokeWidth={1.8} color={color} />
            </span>
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.02em',
              }}
            >
              {t(labelKey as Parameters<typeof t>[0])}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
