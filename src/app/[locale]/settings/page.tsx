'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useUser } from '@clerk/nextjs';
import type { UserResource } from '@clerk/types';
import { ChevronRight, Trash2, RefreshCw } from 'lucide-react';

const clerkEnabled = (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '').startsWith('pk_');

// ─── Types ─────────────────────────────────────────────────────────────────

type Theme = 'dark' | 'light';
type LocaleCode = 'en' | 'fr' | 'es';

// ─── Helpers ───────────────────────────────────────────────────────────────

function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ccm_theme', theme);
}

function getFieldMode(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem('ccm_field_mode') === 'true';
}

function applyFieldMode(on: boolean) {
  localStorage.setItem('ccm_field_mode', String(on));
  if (on) {
    document.body.style.fontSize = '17px';
    document.documentElement.style.setProperty('--border-subtle', 'rgba(255,255,255,0.20)');
    document.documentElement.style.setProperty('--border-default', 'rgba(255,255,255,0.30)');
  } else {
    document.body.style.fontSize = '';
    document.documentElement.style.removeProperty('--border-subtle');
    document.documentElement.style.removeProperty('--border-default');
  }
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ padding: '20px 16px 6px' }}>
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
    </div>
  );
}

function SettingsRow({
  label,
  value,
  ctrl,
}: {
  label: string;
  value?: string;
  ctrl?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        minHeight: '48px',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '15px', color: 'var(--text-primary)', flex: 1 }}>{label}</span>
      {value && (
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', flexShrink: 0 }}>
          {value}
        </span>
      )}
      {ctrl}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: '48px',
        height: '28px',
        borderRadius: '14px',
        border: 'none',
        background: on ? '#003591' : 'var(--bg-surface-3)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 200ms ease',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: on ? '23px' : '3px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 200ms ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden',
        margin: '0 16px',
      }}
    >
      {children}
    </div>
  );
}

function ActionButton({
  label,
  icon,
  danger,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 16px',
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontSize: '15px',
        color: danger ? '#FBB040' : 'var(--text-primary)',
        borderBottom: '1px solid var(--border-subtle)',
        minHeight: '48px',
        transition: 'background 120ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {icon}
      {label}
      <ChevronRight size={16} strokeWidth={1.8} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
    </button>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

function SettingsContent({ clerkUser, isLoaded }: { clerkUser: UserResource | null; isLoaded: boolean }) {
  const t = useTranslations('settings');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const user = clerkUser;

  const [theme, setTheme] = useState<Theme>('dark');
  const [fieldMode, setFieldMode] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Read persisted settings on mount
  useEffect(() => {
    setTheme(getTheme());
    setFieldMode(getFieldMode());
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleFieldMode = (on: boolean) => {
    setFieldMode(on);
    applyFieldMode(on);
  };

  const handleLocaleChange = (newLocale: LocaleCode) => {
    if (newLocale === locale) return;
    // Replace the locale segment in the current path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const handleClearCache = () => {
    if (typeof caches !== 'undefined') {
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
    }
    localStorage.removeItem('ccm_recent_searches');
    setSyncMessage('Cache cleared');
    setTimeout(() => setSyncMessage(''), 2500);
  };

  const handleForceSync = () => {
    setSyncMessage('Syncing…');
    setTimeout(() => setSyncMessage('Synced'), 1500);
    setTimeout(() => setSyncMessage(''), 3500);
  };

  const profileRole = isLoaded
    ? ((user?.publicMetadata?.role as string) ?? 'contractor')
    : '—';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 8px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {t('title')}
        </h1>
      </div>

      {/* ── Profile ── */}
      <SectionHeader label={t('profile')} />
      <Card>
        <SettingsRow label={t('name')} value={isLoaded ? (user?.fullName ?? '—') : '—'} />
        <SettingsRow label={t('email')} value={isLoaded ? (user?.primaryEmailAddress?.emailAddress ?? '—') : '—'} />
        <SettingsRow
          label={t('company')}
          value={isLoaded ? ((user?.publicMetadata?.company as string) ?? '—') : '—'}
        />
        <SettingsRow
          label={t('role')}
          value={profileRole.charAt(0).toUpperCase() + profileRole.slice(1)}
        />
      </Card>

      {/* ── Language ── */}
      <SectionHeader label={t('language')} />
      <Card>
        <div style={{ padding: '12px 16px' }}>
          <div
            style={{
              display: 'flex',
              gap: '0',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              overflow: 'hidden',
              height: '40px',
            }}
          >
            {(['en', 'fr', 'es'] as LocaleCode[]).map((code, i, arr) => {
              const active = code === locale;
              return (
                <button
                  key={code}
                  onClick={() => handleLocaleChange(code)}
                  style={{
                    flex: 1,
                    border: 'none',
                    borderRight: i < arr.length - 1 ? '1px solid var(--border-default)' : 'none',
                    background: active ? '#003591' : 'var(--bg-surface-2)',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: active ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ── Appearance ── */}
      <SectionHeader label={t('appearance')} />
      <Card>
        <SettingsRow
          label={t('darkMode')}
          ctrl={
            <Toggle
              on={theme === 'dark'}
              onChange={v => handleThemeChange(v ? 'dark' : 'light')}
            />
          }
        />
        <SettingsRow
          label={t('fieldMode')}
          ctrl={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {t('fieldModeHint')}
              </span>
              <Toggle on={fieldMode} onChange={handleFieldMode} />
            </div>
          }
        />
      </Card>

      {/* ── Notifications ── */}
      <SectionHeader label={t('notifications')} />
      <Card>
        <SettingsRow
          label={t('pushNotifications')}
          ctrl={<Toggle on={pushEnabled} onChange={setPushEnabled} />}
        />
      </Card>

      {/* ── Offline Data ── */}
      <SectionHeader label={t('offlineData')} />
      <Card>
        <ActionButton
          label={t('clearCache')}
          icon={<Trash2 size={16} strokeWidth={1.8} color="#FBB040" />}
          danger
          onClick={handleClearCache}
        />
        <ActionButton
          label={t('forceSync')}
          icon={<RefreshCw size={16} strokeWidth={1.8} color="var(--text-secondary)" />}
          onClick={handleForceSync}
        />
      </Card>

      {/* Feedback message */}
      {syncMessage && (
        <p
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#3DD68C',
            padding: '12px 16px 0',
          }}
        >
          {syncMessage}
        </p>
      )}
    </div>
  );
}

function SettingsWithAuth() {
  const { user, isLoaded } = useUser();
  return <SettingsContent clerkUser={user ?? null} isLoaded={isLoaded} />;
}

export default function SettingsPage() {
  if (clerkEnabled) return <SettingsWithAuth />;
  return <SettingsContent clerkUser={null} isLoaded={true} />;
}
